-- =============================================================================
-- Migration: 002_new_features
-- Description: Adds schema for Payment Reminders and Recurring Invoices
-- =============================================================================

-- =============================================================================
-- FEATURE 1: AUTOMATED PAYMENT REMINDERS
-- =============================================================================

-- 1. Reminder Schedules Table
CREATE TABLE IF NOT EXISTS reminder_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  schedule_config JSONB NOT NULL, -- Stores array of reminder points
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Reminder Templates Table
CREATE TABLE IF NOT EXISTS reminder_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tone VARCHAR(50) NOT NULL, -- 'polite', 'neutral', 'firm', 'urgent'
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Reminder Logs Table
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50) NOT NULL, 
  day_offset INTEGER NOT NULL, 
  sent_at TIMESTAMP DEFAULT NOW(),
  email_subject TEXT,
  email_to VARCHAR(255),
  opened_at TIMESTAMP NULL,
  clicked_at TIMESTAMP NULL,
  status VARCHAR(50) DEFAULT 'sent', 
  error_message TEXT NULL,
  metadata JSONB
);

-- 4. Alter Invoices Table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN DEFAULT true;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_schedule_id UUID REFERENCES reminder_schedules(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS next_reminder_date DATE NULL;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMP NULL;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_paused_until DATE NULL;

-- 5. Alter Clients Table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reminder_preference VARCHAR(50) DEFAULT 'default';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reminder_schedule_id UUID REFERENCES reminder_schedules(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reminder_email VARCHAR(255) NULL;

-- 6. Alter User Preferences Table
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS default_reminder_schedule_id UUID REFERENCES reminder_schedules(id);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS reminder_from_name VARCHAR(255);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS reminder_from_email VARCHAR(255);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS reminder_cc_user BOOLEAN DEFAULT false;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS reminder_bcc_emails TEXT[]; 
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS late_fees_enabled BOOLEAN DEFAULT false;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS late_fee_type VARCHAR(20); 
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS late_fee_amount DECIMAL(10,2);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS late_fee_grace_days INTEGER DEFAULT 0;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS reminders_paused_until DATE NULL;

-- =============================================================================
-- FEATURE 2: RECURRING INVOICES / SUBSCRIPTION BILLING
-- =============================================================================

-- 1. Recurring Profiles Table
CREATE TABLE IF NOT EXISTS recurring_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Profile info
  profile_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'draft', 'active', 'paused', 'ended', 'cancelled'
  
  -- Invoice template
  line_items JSONB NOT NULL, -- Array of line items
  subtotal DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  invoice_template_id UUID REFERENCES invoice_templates(id),
  notes TEXT,
  terms TEXT,
  
  -- Billing schedule
  frequency VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'
  custom_interval_days INTEGER, 
  start_date DATE NOT NULL,
  end_date DATE NULL, 
  
  -- Due date calculation
  due_date_type VARCHAR(50) DEFAULT 'net_30', 
  due_date_days INTEGER, 
  
  -- Automation settings
  auto_send BOOLEAN DEFAULT true,
  auto_charge BOOLEAN DEFAULT false,
  send_reminders BOOLEAN DEFAULT true,
  
  -- Email customization
  email_subject VARCHAR(255),
  email_body TEXT,
  
  -- Tracking
  next_billing_date DATE NOT NULL,
  last_generated_at TIMESTAMP NULL,
  invoices_generated_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0, 
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Recurring Invoice History Table
CREATE TABLE IF NOT EXISTS recurring_invoice_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_profile_id UUID NOT NULL REFERENCES recurring_profiles(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  generated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP NULL,
  paid_at TIMESTAMP NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) -- 'generated', 'sent', 'paid', 'overdue', 'cancelled'
);

-- =============================================================================
-- FEATURE 6: ESTIMATES / QUOTES / PROPOSALS
-- =============================================================================

CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  template_id UUID REFERENCES invoice_templates(id) ON DELETE SET NULL,
  estimate_number VARCHAR(50) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, viewed, accepted, declined, invoiced
  subtotal DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  terms TEXT,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  declined_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  line_total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_estimates_user_id ON estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_estimates_client_id ON estimates(client_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate_id ON estimate_items(estimate_id);

CREATE INDEX IF NOT EXISTS idx_reminder_templates_user_tone ON reminder_templates(user_id, tone);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_invoice ON reminder_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON reminder_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_recurring_profiles_user ON recurring_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_profiles_next_billing ON recurring_profiles(next_billing_date, status);
CREATE INDEX IF NOT EXISTS idx_recurring_profiles_client ON recurring_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_recurring_history_profile ON recurring_invoice_history(recurring_profile_id);
CREATE INDEX IF NOT EXISTS idx_recurring_history_invoice ON recurring_invoice_history(invoice_id);

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

ALTER TABLE reminder_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_invoice_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminder schedules" ON reminder_schedules FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create reminder schedules" ON reminder_schedules FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reminder schedules" ON reminder_schedules FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own reminder schedules" ON reminder_schedules FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own reminder templates" ON reminder_templates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create reminder templates" ON reminder_templates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reminder templates" ON reminder_templates FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own reminder logs" ON reminder_logs FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own recurring profiles" ON recurring_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create recurring profiles" ON recurring_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own recurring profiles" ON recurring_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own recurring profiles" ON recurring_profiles FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own recurring history" ON recurring_invoice_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM recurring_profiles WHERE recurring_profiles.id = recurring_invoice_history.recurring_profile_id
    AND recurring_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own estimates" ON estimates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create estimates" ON estimates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own estimates" ON estimates FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own estimates" ON estimates FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own estimate items" ON estimate_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM estimates WHERE estimates.id = estimate_items.estimate_id
    AND estimates.user_id = auth.uid()
  )
);

-- =============================================================================
-- InvoiceFlow - Complete Supabase Backend Setup
-- =============================================================================
-- ALL-IN-ONE DEPLOYMENT SCRIPT
-- This file contains: Schema + Indexes + Functions + RLS + Seed Data
-- 
-- HOW TO USE:
-- 1. Go to Supabase Dashboard → SQL Editor → New Query
-- 2. Paste this entire file
-- 3. Click "Run" 
-- 4. Wait for completion (may take 30-60 seconds)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CREATE ALL TABLES
-- =============================================================================

-- Users Table - Must be created first (referenced by others)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  company_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United States',
  tax_id VARCHAR(50),
  website VARCHAR(255),
  bank_name VARCHAR(255),
  bank_account_number VARCHAR(255),
  bank_routing_number VARCHAR(255),
  bank_account_holder_name VARCHAR(255),
  bank_swift_code VARCHAR(11),
  bank_iban VARCHAR(34),
  currency VARCHAR(3) DEFAULT 'USD',
  default_payment_terms INTEGER DEFAULT 30,
  default_tax_rate DECIMAL(5, 2) DEFAULT 0,
  invoice_prefix VARCHAR(10) DEFAULT 'INV',
  next_invoice_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United States',
  tax_id VARCHAR(50),
  website VARCHAR(255),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Invoice Templates Table
CREATE TABLE IF NOT EXISTS invoice_templates (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  layout VARCHAR(50) DEFAULT 'modern',
  theme VARCHAR(50) DEFAULT 'light',
  primary_color VARCHAR(7) DEFAULT '#2563eb',
  secondary_color VARCHAR(7) DEFAULT '#1e40af',
  accent_color VARCHAR(7) DEFAULT '#64748b',
  font_family VARCHAR(100) DEFAULT 'Inter',
  font_size VARCHAR(20) DEFAULT 'medium',
  include_logo BOOLEAN DEFAULT TRUE,
  include_company_info BOOLEAN DEFAULT TRUE,
  include_client_info BOOLEAN DEFAULT TRUE,
  include_notes BOOLEAN DEFAULT TRUE,
  include_terms BOOLEAN DEFAULT TRUE,
  include_tax_details BOOLEAN DEFAULT TRUE,
  show_payment_qr BOOLEAN DEFAULT FALSE,
  custom_css TEXT,
  custom_header TEXT,
  custom_footer TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_system_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  template_id UUID REFERENCES invoice_templates(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) NOT NULL,
  po_number VARCHAR(100),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  subtotal DECIMAL(12, 2) DEFAULT 0,
  discount_type VARCHAR(10) DEFAULT 'none',
  discount_value DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_type VARCHAR(20) DEFAULT 'none',
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  shipping_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  balance_due DECIMAL(12, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  terms TEXT,
  footer_text TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR(20),
  recurring_interval INTEGER DEFAULT 1,
  next_recurring_date DATE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  paid_at TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_type VARCHAR(20) DEFAULT 'product',
  name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  line_total DECIMAL(12, 2) NOT NULL,
  account_code VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cash',
  status VARCHAR(20) DEFAULT 'completed',
  reference_number VARCHAR(100),
  notes TEXT,
  processing_fee DECIMAL(12, 2) DEFAULT 0,
  fee_payer VARCHAR(10) DEFAULT 'merchant',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP DEFAULT NULL
);

-- Expense Categories Table
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#64748b',
  icon VARCHAR(50) DEFAULT 'Folder',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
  vendor_name VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR(20),
  tax_deductible BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP DEFAULT NULL
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text VARCHAR(100),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(10) DEFAULT '12h',
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'USD',
  dashboard_view VARCHAR(20) DEFAULT 'standard',
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  last_active_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_company_name_idx ON users(company_name);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);

CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);
CREATE INDEX IF NOT EXISTS clients_email_idx ON clients(email);
CREATE INDEX IF NOT EXISTS clients_name_idx ON clients(name);
CREATE INDEX IF NOT EXISTS clients_is_active_idx ON clients(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS invoice_templates_user_id_idx ON invoice_templates(user_id);
CREATE INDEX IF NOT EXISTS invoice_templates_is_default_idx ON invoice_templates(is_default) WHERE is_default = TRUE;

CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_invoice_number_idx ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_issue_date_idx ON invoices(issue_date DESC);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices(due_date);
CREATE INDEX IF NOT EXISTS invoices_is_archived_idx ON invoices(is_archived) WHERE is_archived = FALSE;

CREATE INDEX IF NOT EXISTS invoice_items_user_id_idx ON invoice_items(user_id);
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS invoice_items_sort_order_idx ON invoice_items(sort_order);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS payments_client_id_idx ON payments(client_id);
CREATE INDEX IF NOT EXISTS payments_payment_date_idx ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);

CREATE INDEX IF NOT EXISTS expense_categories_user_id_idx ON expense_categories(user_id);
CREATE INDEX IF NOT EXISTS expense_categories_is_active_idx ON expense_categories(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_category_id_idx ON expenses(category_id);
CREATE INDEX IF NOT EXISTS expenses_expense_date_idx ON expenses(expense_date DESC);

CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS activity_logs_action_idx ON activity_logs(action);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_session_token_idx ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx ON user_sessions(expires_at);

-- =============================================================================
-- CREATE FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get next invoice number
CREATE OR REPLACE FUNCTION get_next_invoice_number(p_user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  next_num INTEGER;
  prefix VARCHAR(10);
  invoice_num VARCHAR(50);
BEGIN
  SELECT next_invoice_number, invoice_prefix
  INTO next_num, prefix
  FROM users
  WHERE id = p_user_id;
  
  IF next_num IS NULL THEN
    next_num := 1;
    prefix := 'INV';
  END IF;
  
  invoice_num := prefix || '-' || LPAD(next_num::TEXT, 4, '0');
  
  UPDATE users
  SET next_invoice_number = next_num + 1
  WHERE id = p_user_id;
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action VARCHAR(100),
  p_description TEXT,
  p_entity_type VARCHAR(50) DEFAULT NULL,
  p_entity_id VARCHAR(50) DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO activity_logs (
    user_id, action, description, entity_type, entity_id
  ) VALUES (
    p_user_id, p_action, p_description, p_entity_type, p_entity_id
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create user preferences after user creation
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER users_updated_at_trigger BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER clients_updated_at_trigger BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER invoices_updated_at_trigger BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER invoice_templates_updated_at_trigger BEFORE UPDATE ON invoice_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER payments_updated_at_trigger BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER users_create_preferences_trigger AFTER INSERT ON users FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- =============================================================================
-- CREATE VIEWS FOR ANALYTICS
-- =============================================================================

CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT i.id) as total_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'draft' THEN i.id END) as draft_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'sent' THEN i.id END) as sent_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'viewed' THEN i.id END) as viewed_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN i.id END) as paid_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'overdue' THEN i.id END) as overdue_invoices,
  COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount END), 0) as total_revenue,
  COALESCE(SUM(CASE WHEN i.status IN ('sent', 'viewed') THEN i.total_amount END), 0) as outstanding_amount,
  COUNT(DISTINCT c.id) as total_clients,
  COUNT(DISTINCT CASE WHEN c.is_active = TRUE THEN c.id END) as active_clients,
  COUNT(DISTINCT p.id) as total_payments,
  COALESCE(SUM(p.amount), 0) as total_payments_received,
  COALESCE(SUM(e.amount), 0) as total_expenses
FROM users u
LEFT JOIN invoices i ON u.id = i.user_id AND i.deleted_at IS NULL
LEFT JOIN clients c ON u.id = c.user_id AND c.deleted_at IS NULL
LEFT JOIN payments p ON u.id = p.user_id
LEFT JOIN expenses e ON u.id = e.user_id
GROUP BY u.id;

CREATE OR REPLACE VIEW client_performance AS
SELECT 
  c.id,
  c.user_id,
  c.name,
  c.email,
  COUNT(DISTINCT i.id) as total_invoices,
  COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount END), 0) as total_paid,
  COALESCE(SUM(CASE WHEN i.status IN ('sent', 'viewed') THEN i.total_amount END), 0) as outstanding_amount,
  AVG(CASE WHEN i.status = 'paid' THEN 
    EXTRACT(DAY FROM i.paid_at::timestamp - i.issue_date::timestamp) 
  END) as average_payment_days,
  MAX(i.created_at) as last_invoice_date,
  c.is_active
FROM clients c
LEFT JOIN invoices i ON c.id = i.client_id AND i.deleted_at IS NULL
GROUP BY c.id, c.user_id, c.name, c.email, c.is_active;

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CREATE RLS POLICIES
-- =============================================================================

-- Users Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Clients Policies
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create clients" ON clients FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (user_id = auth.uid());

-- Templates Policies
CREATE POLICY "Users can view own templates" ON invoice_templates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create templates" ON invoice_templates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own templates" ON invoice_templates FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own templates" ON invoice_templates FOR DELETE USING (user_id = auth.uid());

-- Invoices Policies
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create invoices" ON invoices FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own invoices" ON invoices FOR DELETE USING (user_id = auth.uid());

-- Invoice Items Policies
CREATE POLICY "Users can view invoice items" ON invoice_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create invoice items" ON invoice_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update invoice items" ON invoice_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  )
);

-- Payments Policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE USING (user_id = auth.uid());

-- Expense Categories Policies
CREATE POLICY "Users can view own categories" ON expense_categories FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create categories" ON expense_categories FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own categories" ON expense_categories FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own categories" ON expense_categories FOR DELETE USING (user_id = auth.uid());

-- Expenses Policies
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create expenses" ON expenses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (user_id = auth.uid());

-- Activity Logs Policies
CREATE POLICY "Users can view own activity logs" ON activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create activity logs" ON activity_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- User Preferences Policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (user_id = auth.uid());

-- User Sessions Policies
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create sessions" ON user_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own sessions" ON user_sessions FOR DELETE USING (user_id = auth.uid());

-- =============================================================================
-- INSERT SEED DATA (Demo User and Sample Data)
-- =============================================================================

-- Step 1: Create Demo User
INSERT INTO users (
  id, email, full_name, company_name, avatar_url, phone, address, city, state, 
  zip_code, country, tax_id, website, bank_name, bank_account_number, 
  bank_routing_number, bank_account_holder_name, currency, default_payment_terms, 
  next_invoice_number, invoice_prefix
) VALUES (
  gen_random_uuid(), 'demo@invoiceflow.com', 'Demo User', 'InvoiceFlow Demo Inc.',
  'https://ui-avatars.com/api/?name=Demo+User&background=2563eb&color=fff',
  '+1 (555) 123-4567', '123 Business Ave', 'New York', 'NY', '10001', 'United States',
  '12-3456789', 'https://invoiceflow.demo', 'Chase Bank', '1234567890', '021000021',
  'Demo User', 'USD', 30, 1005, 'INV'
) ON CONFLICT (email) DO NOTHING;

-- Step 2: Create System Templates (only if demo user exists)
DO $$ 
DECLARE
  demo_user_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@invoiceflow.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO invoice_templates (id, user_id, name, description, layout, theme, 
    primary_color, secondary_color, accent_color, is_default, is_system_template) VALUES 
    (gen_random_uuid(), demo_user_id, 'Modern', 'Clean design with blue accents', 
     'modern', 'light', '#2563eb', '#1e40af', '#64748b', true, true),
    (gen_random_uuid(), demo_user_id, 'Classic', 'Traditional layout', 
     'classic', 'light', '#1f2937', '#374151', '#6b7280', false, true),
    (gen_random_uuid(), demo_user_id, 'Minimal', 'Simple minimal design', 
     'minimal', 'light', '#64748b', '#475569', '#94a3b8', false, true),
    (gen_random_uuid(), demo_user_id, 'Dark Modern', 'Modern dark theme', 
     'modern', 'dark', '#3b82f6', '#60a5fa', '#93c5fd', false, true);
  END IF;
END $$;

-- Step 3: Create Demo Clients
DO $$ 
DECLARE
  demo_user_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@invoiceflow.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO clients (id, user_id, name, email, phone, address, city, state, 
    zip_code, country, tax_id, website, notes, is_active) VALUES 
    (gen_random_uuid(), demo_user_id, 'Acme Corporation', 'billing@acme.com', 
     '+1 (555) 234-5678', '456 Corporate Blvd', 'San Francisco', 'CA', '94102', 
     'United States', '98-7654321', 'https://acme.com', 'Regular client, NET 30 terms', true),
    (gen_random_uuid(), demo_user_id, 'TechStart Solutions', 'accounts@techstart.com', 
     '+1 (555) 345-6789', '789 Innovation Drive', 'Austin', 'TX', '78701', 
     'United States', '11-2233445', 'https://techstart.io', 'Startup client', true),
    (gen_random_uuid(), demo_user_id, 'Global Marketing Inc', 'finance@globalmarketing.com', 
     '+1 (555) 456-7890', '321 Madison Avenue', 'New York', 'NY', '10017', 
     'United States', '33-4455667', 'https://globalmarketing.com', 'Large enterprise', true),
    (gen_random_uuid(), demo_user_id, 'Creative Studio LLC', 'hello@creativestudio.com', 
     '+1 (555) 567-8901', '159 Art District Lane', 'Portland', 'OR', '97209', 
     'United States', '55-6677889', 'https://creativestudio.design', 'Design agency', true),
    (gen_random_uuid(), demo_user_id, 'Retail Plus Co', 'payables@retailplus.com', 
     '+1 (555) 678-9012', '753 Shopping Center Way', 'Miami', 'FL', '33101', 
     'United States', '77-8899001', 'https://retailplus.com', 'Retail chain', true);
  END IF;
END $$;

-- Step 4: Create Sample Invoices (only if demo user exists)
DO $$ 
DECLARE
  demo_user_id UUID;
  template_id_val UUID;
  acme_client_id UUID;
  techstart_client_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@invoiceflow.com' LIMIT 1;
  SELECT id INTO template_id_val FROM invoice_templates WHERE name = 'Modern' AND user_id = demo_user_id LIMIT 1;
  SELECT id INTO acme_client_id FROM clients WHERE name = 'Acme Corporation' AND user_id = demo_user_id LIMIT 1;
  SELECT id INTO techstart_client_id FROM clients WHERE name = 'TechStart Solutions' AND user_id = demo_user_id LIMIT 1;
  
  IF demo_user_id IS NOT NULL AND template_id_val IS NOT NULL THEN
    -- Paid Invoice 1
    INSERT INTO invoices (id, user_id, client_id, template_id, invoice_number, 
    issue_date, due_date, status, subtotal, tax_amount, total_amount, 
    amount_paid, balance_due, notes, terms) VALUES 
    (gen_random_uuid(), demo_user_id, acme_client_id, template_id_val, 'INV-1001',
     CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', 'paid',
     5000.00, 500.00, 5500.00, 5500.00, 0.00, 'Thank you!', 'Payment due within 30 days');
    
    -- Overdue Invoice 2
    INSERT INTO invoices (id, user_id, client_id, template_id, invoice_number, 
    issue_date, due_date, status, subtotal, tax_amount, total_amount, 
    amount_paid, balance_due) VALUES 
    (gen_random_uuid(), demo_user_id, techstart_client_id, template_id_val, 'INV-1002',
     CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'sent',
     3200.00, 320.00, 3520.00, 0.00, 3520.00);
  END IF;
END $$;

-- Step 5: Create Sample Activity Logs
DO $$ 
DECLARE
  demo_user_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@invoiceflow.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO activity_logs (id, user_id, action, description, entity_type, entity_id) VALUES 
    (gen_random_uuid(), demo_user_id, 'invoice_created', 'Created invoice INV-1003', 'invoice', 'INV-1003'),
    (gen_random_uuid(), demo_user_id, 'invoice_sent', 'Sent invoice INV-1004', 'invoice', 'INV-1004'),
    (gen_random_uuid(), demo_user_id, 'payment_received', 'Received $5,500 payment', 'payment', 'PAY-001'),
    (gen_random_uuid(), demo_user_id, 'client_added', 'Added client: Retail Plus Co', 'client', 'retail-plus');
  END IF;
END $$;

-- =============================================================================
-- VERIFICATION QUERIES (RUN AFTER DEPLOYMENT)
-- =============================================================================

-- Verify all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Count records in each table (should show numbers if seed data loaded)
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'clients', COUNT(*) FROM clients
UNION ALL SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL SELECT 'invoice_templates', COUNT(*) FROM invoice_templates
UNION ALL SELECT 'activity_logs', COUNT(*) FROM activity_logs;

-- =============================================================================
-- END OF DEPLOYMENT SCRIPT
-- =============================================================================
-- ✅ DEPLOYMENT COMPLETE!
-- 
-- Next Steps:
-- 1. Create auth user: demo@invoiceflow.com / Demo@123
-- 2. Test the API endpoints
-- 3. Run your Next.js app
-- =============================================================================
-- =============================================================================
-- InvoiceFlow - Complete Database Schema
-- =============================================================================
-- This file contains all table definitions, indexes, and constraints
-- for the InvoiceFlow SaaS application.
-- =============================================================================

-- =============================================================================
-- STEP 1: Enable Required Extensions
-- =============================================================================

-- Enable UUID extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PgCrypto extension for cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- STEP 2: Create Tables
-- =============================================================================

-- Users Table - Stores user profiles and company information
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

-- Comments for users table
COMMENT ON TABLE users IS 'Stores user profile and company information';
COMMENT ON COLUMN users.id IS 'Primary key, matches auth.users.id';
COMMENT ON COLUMN users.next_invoice_number IS 'Auto-incrementing invoice number counter';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp, NULL if active';

-- Clients Table - Stores customer/client information
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
  deleted_at TIMESTAMP DEFAULT NULL,
  CONSTRAINT unique_client_per_user UNIQUE(user_id, email)
);

-- Comments for clients table
COMMENT ON TABLE clients IS 'Stores client/customer information for each user';
COMMENT ON COLUMN clients.is_active IS 'Whether the client is active or archived';
COMMENT ON COLUMN clients.deleted_at IS 'Soft delete timestamp, NULL if active';

-- Invoice Templates Table - Stores custom invoice templates
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

-- Comments for invoice_templates table
COMMENT ON TABLE invoice_templates IS 'Stores custom invoice templates for users';
COMMENT ON COLUMN invoice_templates.is_default IS 'Mark as default template for user';
COMMENT ON COLUMN invoice_templates.is_system_template IS 'Pre-built system template';

-- Invoices Table - Stores invoice headers and totals
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
  discount_type VARCHAR(10) DEFAULT 'none', -- none, percent, fixed
  discount_value DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_type VARCHAR(20) DEFAULT 'none', -- none, vat, gst, sales_tax
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
  recurring_frequency VARCHAR(20), -- weekly, monthly, quarterly, yearly
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

-- Comments for invoices table
COMMENT ON TABLE invoices IS 'Stores invoice headers and financial totals';
COMMENT ON COLUMN invoices.status IS 'draft, sent, viewed, paid, overdue, cancelled';
COMMENT ON COLUMN invoices.discount_type IS 'Type of discount: none, percent, fixed';
COMMENT ON COLUMN invoices.tax_type IS 'Type of tax: none, vat, gst, sales_tax';
COMMENT ON COLUMN invoices.is_recurring IS 'Whether this is a recurring invoice';
COMMENT ON COLUMN invoices.recurring_frequency IS 'How often it recurs: weekly, monthly, etc';

-- Invoice Items Table - Stores line items for each invoice
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_type VARCHAR(20) DEFAULT 'product', -- product, service, discount, tax
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

-- Comments for invoice_items table
COMMENT ON TABLE invoice_items IS 'Stores line items for each invoice';
COMMENT ON COLUMN invoice_items.item_type IS 'Type of item: product, service, discount, tax';
COMMENT ON COLUMN invoice_items.sort_order IS 'Order of items in invoice display';

-- Payments Table - Tracks payments received for invoices
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
  fee_payer VARCHAR(10) DEFAULT 'merchant', -- merchant, customer
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP DEFAULT NULL
);

-- Comments for payments table
COMMENT ON TABLE payments IS 'Tracks payments received for invoices';
COMMENT ON COLUMN payments.payment_method IS 'cash, card, bank_transfer, check, online';
COMMENT ON COLUMN payments.status IS 'completed, pending, failed, cancelled, refunded';

-- Expense Categories Table - Categories for expenses
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

-- Expenses Table - Tracks business expenses
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
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP DEFAULT NULL
);

-- Activity Logs Table - Tracks user actions for audit trail
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

-- Comments for activity_logs table
COMMENT ON TABLE activity_logs IS 'Tracks user actions for audit purposes';
COMMENT ON COLUMN activity_logs.metadata IS 'Additional context in JSON format';

-- Notifications Table - Stores user notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info', -- info, success, warning, error, payment
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text VARCHAR(100),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments for notifications table
COMMENT ON TABLE notifications IS 'Stores user notifications and alerts';
COMMENT ON COLUMN notifications.action_url IS 'URL to navigate when notification is clicked';

-- User Preferences Table - Stores user settings and preferences
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

-- Comments for user_preferences table
COMMENT ON TABLE user_preferences IS 'Stores user preferences and settings';

-- User Sessions Table - Tracks active user sessions
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
-- STEP 3: Create Indexes for Performance
-- =============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_company_name_idx ON users(company_name);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);

-- Clients table indexes
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);
CREATE INDEX IF NOT EXISTS clients_email_idx ON clients(email);
CREATE INDEX IF NOT EXISTS clients_name_idx ON clients(name);
CREATE INDEX IF NOT EXISTS clients_is_active_idx ON clients(is_active) WHERE is_active = TRUE;

-- Invoice templates indexes
CREATE INDEX IF NOT EXISTS invoice_templates_user_id_idx ON invoice_templates(user_id);
CREATE INDEX IF NOT EXISTS invoice_templates_is_default_idx ON invoice_templates(is_default) WHERE is_default = TRUE;
CREATE INDEX IF NOT EXISTS invoice_templates_is_system_idx ON invoice_templates(is_system_template) WHERE is_system_template = TRUE;

-- Invoices table indexes
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_invoice_number_idx ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_issue_date_idx ON invoices(issue_date DESC);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices(due_date);
CREATE INDEX IF NOT EXISTS invoices_is_recurring_idx ON invoices(is_recurring) WHERE is_recurring = TRUE;
CREATE INDEX IF NOT EXISTS invoices_is_archived_idx ON invoices(is_archived) WHERE is_archived = FALSE;
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at DESC);

-- Invoice items indexes
CREATE INDEX IF NOT EXISTS invoice_items_user_id_idx ON invoice_items(user_id);
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS invoice_items_sort_order_idx ON invoice_items(sort_order);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS payments_client_id_idx ON payments(client_id);
CREATE INDEX IF NOT EXISTS payments_payment_date_idx ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);

-- Expense categories indexes
CREATE INDEX IF NOT EXISTS expense_categories_user_id_idx ON expense_categories(user_id);
CREATE INDEX IF NOT EXISTS expense_categories_is_active_idx ON expense_categories(is_active) WHERE is_active = TRUE;

-- Expenses indexes
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_category_id_idx ON expenses(category_id);
CREATE INDEX IF NOT EXISTS expenses_expense_date_idx ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS expenses_is_recurring_idx ON expenses(is_recurring) WHERE is_recurring = TRUE;

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS activity_logs_action_idx ON activity_logs(action);
CREATE INDEX IF NOT EXISTS activity_logs_entity_type_idx ON activity_logs(entity_type);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_expires_at_idx ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- User preferences indexes
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_session_token_idx ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS user_sessions_last_active_idx ON user_sessions(last_active_at DESC);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx ON user_sessions(expires_at);

-- =============================================================================
-- STEP 4: Create Functions and Triggers
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

-- Function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals(p_invoice_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH invoice_items AS (
    SELECT 
      SUM(line_total) as subtotal,
      SUM(discount_amount) as total_discount,
      SUM(tax_amount) as total_tax
    FROM invoice_items
    WHERE invoice_id = p_invoice_id
  )
  SELECT json_build_object(
    'subtotal', COALESCE(subtotal, 0),
    'discount', COALESCE(total_discount, 0),
    'tax', COALESCE(total_tax, 0),
    'total', COALESCE(subtotal, 0) - COALESCE(total_discount, 0) + COALESCE(total_tax, 0)
  )
  INTO result
  FROM invoice_items;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

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

-- Trigger: Update updated_at on users table
CREATE TRIGGER users_updated_at_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on clients table
CREATE TRIGGER clients_updated_at_trigger
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on invoices table
CREATE TRIGGER invoices_updated_at_trigger
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on invoice_templates table
CREATE TRIGGER invoice_templates_updated_at_trigger
  BEFORE UPDATE ON invoice_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on payments table
CREATE TRIGGER payments_updated_at_trigger
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Create user preferences after user signup
CREATE TRIGGER users_create_preferences_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_preferences();

-- =============================================================================
-- STEP 5: Create Views for Dashboard Analytics
-- =============================================================================

-- View: Dashboard stats per user
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  u.id as user_id,
  -- Invoice stats
  COUNT(DISTINCT i.id) as total_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'draft' THEN i.id END) as draft_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'sent' THEN i.id END) as sent_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'viewed' THEN i.id END) as viewed_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN i.id END) as paid_invoices,
  COUNT(DISTINCT CASE WHEN i.status = 'overdue' THEN i.id END) as overdue_invoices,
  COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount END), 0) as total_revenue,
  COALESCE(SUM(CASE WHEN i.status IN ('sent', 'viewed') THEN i.total_amount END), 0) as outstanding_amount,
  -- Client stats
  COUNT(DISTINCT c.id) as total_clients,
  COUNT(DISTINCT CASE WHEN c.is_active = TRUE THEN c.id END) as active_clients,
  -- Payment stats
  COUNT(DISTINCT p.id) as total_payments,
  COALESCE(SUM(p.amount), 0) as total_payments_received,
  -- Expense stats
  COALESCE(SUM(e.amount), 0) as total_expenses
FROM users u
LEFT JOIN invoices i ON u.id = i.user_id AND i.deleted_at IS NULL
LEFT JOIN clients c ON u.id = c.user_id AND c.deleted_at IS NULL
LEFT JOIN payments p ON u.id = p.user_id
LEFT JOIN expenses e ON u.id = e.user_id
GROUP BY u.id;

-- View: Client performance metrics
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

-- View: Invoice aging report
CREATE OR REPLACE VIEW invoice_aging AS
SELECT 
  i.id,
  i.user_id,
  i.invoice_number,
  i.client_id,
  c.name as client_name,
  i.issue_date,
  i.due_date,
  CURRENT_DATE - i.due_date as days_overdue,
  i.total_amount,
  i.amount_paid,
  i.balance_due,
  i.status,
  CASE 
    WHEN CURRENT_DATE - i.due_date <= 0 THEN 'current'
    WHEN CURRENT_DATE - i.due_date <= 30 THEN '1-30 days'
    WHEN CURRENT_DATE - i.due_date <= 60 THEN '31-60 days'
    WHEN CURRENT_DATE - i.due_date <= 90 THEN '61-90 days'
    ELSE '90+ days'
  END as aging_bucket
FROM invoices i
JOIN clients c ON i.client_id = c.id
WHERE i.status NOT IN ('paid', 'cancelled', 'draft') 
AND i.deleted_at IS NULL;

-- View: Monthly revenue report
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
  user_id,
  DATE_TRUNC('month', issue_date) as month,
  COUNT(*) as invoice_count,
  SUM(total_amount) as gross_revenue,
  SUM(amount_paid) as net_revenue,
  AVG(total_amount) as average_invoice_value,
  COUNT(DISTINCT client_id) as unique_clients
FROM invoices
WHERE status = 'paid' AND deleted_at IS NULL
GROUP BY user_id, DATE_TRUNC('month', issue_date)
ORDER BY user_id, month DESC;

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
-- Version: 1.0.0
-- Compatible with: Supabase PostgreSQL 15
-- =============================================================================
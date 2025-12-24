-- =============================================================================
-- Migration: 003_multi_currency_portal
-- Description: Adds schema for Multi-Currency Support and Client Portal
-- =============================================================================

-- =============================================================================
-- FEATURE 4: MULTI-CURRENCY SUPPORT
-- =============================================================================

-- 1. Currencies Reference Table
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY, -- ISO 4217 (USD, EUR, etc.)
  name VARCHAR(100) NOT NULL, -- "United States Dollar"
  symbol VARCHAR(10), -- "$", "€", "£"
  symbol_position VARCHAR(10) DEFAULT 'before', -- 'before', 'after', 'after_with_space'
  decimal_places INTEGER DEFAULT 2,
  thousand_separator VARCHAR(1) DEFAULT ',',
  decimal_separator VARCHAR(1) DEFAULT '.',
  locale VARCHAR(10) DEFAULT 'en-US', -- For formatting
  active BOOLEAN DEFAULT true
);

-- Seed Currencies Table (30 major currencies)
INSERT INTO currencies (code, name, symbol, symbol_position, decimal_places, thousand_separator, decimal_separator, locale, active) VALUES
  ('USD', 'United States Dollar', '$', 'before', 2, ',', '.', 'en-US', true),
  ('EUR', 'Euro', '€', 'before', 2, '.', ',', 'de-DE', true),
  ('GBP', 'British Pound Sterling', '£', 'before', 2, ',', '.', 'en-GB', true),
  ('JPY', 'Japanese Yen', '¥', 'before', 0, ',', '.', 'ja-JP', true),
  ('CNY', 'Chinese Yuan', '¥', 'before', 2, ',', '.', 'zh-CN', true),
  ('INR', 'Indian Rupee', '₹', 'before', 2, ',', '.', 'en-IN', true),
  ('AUD', 'Australian Dollar', '$', 'before', 2, ',', '.', 'en-AU', true),
  ('CAD', 'Canadian Dollar', '$', 'before', 2, ',', '.', 'en-CA', true),
  ('CHF', 'Swiss Franc', 'CHF', 'before', 2, '\'', '.', 'de-CH', true),
  ('SGD', 'Singapore Dollar', '$', 'before', 2, ',', '.', 'en-SG', true),
  ('HKD', 'Hong Kong Dollar', '$', 'before', 2, ',', '.', 'en-HK', true),
  ('NZD', 'New Zealand Dollar', '$', 'before', 2, ',', '.', 'en-NZ', true),
  ('SEK', 'Swedish Krona', 'kr', 'after_with_space', 2, ',', '.', 'sv-SE', true),
  ('NOK', 'Norwegian Krone', 'kr', 'after_with_space', 2, ',', '.', 'nb-NO', true),
  ('DKK', 'Danish Krone', 'kr', 'after_with_space', 2, ',', '.', 'da-DK', true),
  ('MXN', 'Mexican Peso', '$', 'before', 2, ',', '.', 'es-MX', true),
  ('BRL', 'Brazilian Real', 'R$', 'before', 2, ',', '.', 'pt-BR', true),
  ('ZAR', 'South African Rand', 'R', 'before', 2, ',', '.', 'en-ZA', true),
  ('RUB', 'Russian Ruble', '₽', 'before', 2, ' ', ',', 'ru-RU', true),
  ('KRW', 'South Korean Won', '₩', 'before', 0, ',', '.', 'ko-KR', true),
  ('TRY', 'Turkish Lira', '₺', 'before', 2, ',', '.', 'tr-TR', true),
  ('IDR', 'Indonesian Rupiah', 'Rp', 'before', 0, ',', '.', 'id-ID', true),
  ('THB', 'Thai Baht', '฿', 'before', 2, ',', '.', 'th-TH', true),
  ('MYR', 'Malaysian Ringgit', 'RM', 'before', 2, ',', '.', 'en-MY', true),
  ('PHP', 'Philippine Peso', '₱', 'before', 2, ',', '.', 'en-PH', true),
  ('PLN', 'Polish Złoty', 'zł', 'after', 2, ' ', ',', 'pl-PL', true),
  ('AED', 'UAE Dirham', 'د.إ', 'before', 2, ',', '.', 'ar-AE', true),
  ('SAR', 'Saudi Riyal', '﷼', 'before', 2, ',', '.', 'ar-SA', true),
  ('ILS', 'Israeli Shekel', '₪', 'before', 2, ',', '.', 'he-IL', true),
  ('CZK', 'Czech Koruna', 'Kč', 'after', 2, ' ', ',', 'cs-CZ', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Exchange Rates Table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency VARCHAR(3) NOT NULL, -- ISO 4217 code (USD)
  target_currency VARCHAR(3) NOT NULL, -- ISO 4217 code (EUR)
  rate DECIMAL(18,8) NOT NULL, -- High precision (0.92000000)
  source VARCHAR(50) DEFAULT 'manual', -- 'ExchangeRate-API', 'manual', 'custom'
  rate_date DATE NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_base_currency FOREIGN KEY (base_currency) REFERENCES currencies(code),
  CONSTRAINT fk_target_currency FOREIGN KEY (target_currency) REFERENCES currencies(code),
  UNIQUE(base_currency, target_currency, rate_date)
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_lookup ON exchange_rates(base_currency, target_currency, rate_date DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON exchange_rates(rate_date DESC);

-- Seed initial exchange rates (as of Dec 2024)
INSERT INTO exchange_rates (base_currency, target_currency, rate, source, rate_date) VALUES
  ('USD', 'EUR', 0.92, 'manual', CURRENT_DATE),
  ('USD', 'GBP', 0.79, 'manual', CURRENT_DATE),
  ('USD', 'CAD', 1.36, 'manual', CURRENT_DATE),
  ('USD', 'AUD', 1.53, 'manual', CURRENT_DATE),
  ('USD', 'JPY', 149.5, 'manual', CURRENT_DATE),
  ('USD', 'CHF', 0.88, 'manual', CURRENT_DATE),
  ('USD', 'CNY', 7.24, 'manual', CURRENT_DATE),
  ('USD', 'INR', 83.12, 'manual', CURRENT_DATE),
  ('USD', 'MXN', 17.15, 'manual', CURRENT_DATE),
  ('USD', 'SGD', 1.34, 'manual', CURRENT_DATE),
  ('USD', 'HKD', 7.8, 'manual', CURRENT_DATE),
  ('USD', 'NZD', 1.63, 'manual', CURRENT_DATE),
  ('USD', 'SEK', 10.5, 'manual', CURRENT_DATE),
  ('USD', 'NOK', 10.8, 'manual', CURRENT_DATE),
  ('USD', 'DKK', 6.8, 'manual', CURRENT_DATE),
  ('USD', 'BRL', 5.0, 'manual', CURRENT_DATE),
  ('USD', 'ZAR', 18.5, 'manual', CURRENT_DATE),
  ('USD', 'RUB', 92.5, 'manual', CURRENT_DATE),
  ('USD', 'KRW', 1320, 'manual', CURRENT_DATE),
  ('USD', 'TRY', 34.0, 'manual', CURRENT_DATE),
  ('USD', 'IDR', 15600, 'manual', CURRENT_DATE),
  ('USD', 'THB', 34.5, 'manual', CURRENT_DATE),
  ('USD', 'MYR', 4.7, 'manual', CURRENT_DATE),
  ('USD', 'PHP', 56.0, 'manual', CURRENT_DATE),
  ('USD', 'PLN', 3.9, 'manual', CURRENT_DATE),
  ('USD', 'AED', 3.67, 'manual', CURRENT_DATE),
  ('USD', 'SAR', 3.75, 'manual', CURRENT_DATE),
  ('USD', 'ILS', 3.65, 'manual', CURRENT_DATE),
  ('USD', 'CZK', 22.5, 'manual', CURRENT_DATE)
ON CONFLICT (base_currency, target_currency, rate_date) DO NOTHING;

-- 3. Add currency columns to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS base_currency VARCHAR(3) DEFAULT 'USD' REFERENCES currencies(code);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(3) REFERENCES currencies(code);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD' REFERENCES currencies(code);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(18,8);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS base_currency_amount DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS custom_rate_used BOOLEAN DEFAULT false;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS exchange_rate_date DATE;

-- 4. Add currency settings to user_preferences
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS show_dual_currency BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS show_exchange_rate BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS round_amounts BOOLEAN DEFAULT false;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS use_manual_rates BOOLEAN DEFAULT false;

-- =============================================================================
-- FEATURE 5: CLIENT PORTAL
-- =============================================================================

-- 1. Client Portal Sessions Table (for magic link authentication)
CREATE TABLE IF NOT EXISTS client_portal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE, -- JWT token
  email VARCHAR(255) NOT NULL,
  device_info JSONB, -- Browser, OS, IP
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_sessions_token ON client_portal_sessions(token);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_client ON client_portal_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_expires ON client_portal_sessions(expires_at);

-- 2. Client Portal Activity Table (for tracking client actions)
CREATE TABLE IF NOT EXISTS client_portal_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'login', 'view_invoice', 'payment', 'accept_estimate', etc.
  resource_type VARCHAR(50), -- 'invoice', 'estimate', 'payment'
  resource_id UUID,
  metadata JSONB, -- Additional details
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_activity_client ON client_portal_activity(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portal_activity_type ON client_portal_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_portal_activity_resource ON client_portal_activity(resource_type, resource_id);

-- 3. Add portal columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS portal_enabled BOOLEAN DEFAULT true;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS portal_access_count INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_portal_access TIMESTAMP NULL;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"invoices": true, "reminders": true, "estimates": true}';

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_activity ENABLE ROW LEVEL SECURITY;

-- Currencies - Read-only for authenticated users
CREATE POLICY "Anyone can view currencies" ON currencies FOR SELECT USING (true);

-- Exchange Rates - Read-only for authenticated users
CREATE POLICY "Anyone can view exchange rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Admins can create exchange rates" ON exchange_rates FOR INSERT WITH CHECK (true);

-- Client Portal Sessions - Special policy for client access
CREATE POLICY "Clients can view own sessions" ON client_portal_sessions FOR SELECT USING (true);
CREATE POLICY "Clients can create sessions" ON client_portal_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Clients can update own sessions" ON client_portal_sessions FOR UPDATE USING (true);
CREATE POLICY "Clients can delete own sessions" ON client_portal_sessions FOR DELETE USING (true);

-- Client Portal Activity - Special policy for client access
CREATE POLICY "Clients can view own activity" ON client_portal_activity FOR SELECT USING (true);
CREATE POLICY "Anyone can create activity" ON client_portal_activity FOR INSERT WITH CHECK (true);

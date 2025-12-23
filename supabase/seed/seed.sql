-- =============================================================================
-- InvoiceFlow - Seed Data
-- =============================================================================
-- This file contains demo data for development and testing
-- Includes: demo user, clients, invoices, payments, templates, expenses
-- =============================================================================

-- =============================================================================
-- STEP 1: Create Demo User (requires auth user to exist)
-- =============================================================================

-- IMPORTANT: First create an auth user with email: demo@invoiceflow.com
-- Password: Demo@123
-- Then run this seed data

INSERT INTO users (
  id,
  email,
  full_name,
  company_name,
  avatar_url,
  phone,
  address,
  city,
  state,
  zip_code,
  country,
  tax_id,
  website,
  bank_name,
  bank_account_number,
  bank_routing_number,
  bank_account_holder_name,
  currency,
  default_payment_terms,
  next_invoice_number,
  invoice_prefix
) VALUES (
  gen_random_uuid(),
  'demo@invoiceflow.com',
  'Demo User',
  'InvoiceFlow Demo Inc.',
  'https://ui-avatars.com/api/?name=Demo+User&background=2563eb&color=fff',
  '+1 (555) 123-4567',
  '123 Business Ave',
  'New York',
  'NY',
  '10001',
  'United States',
  '12-3456789',
  'https://invoiceflow.demo',
  'Chase Bank',
  '1234567890',
  '021000021',
  'Demo User',
  'USD',
  30,
  1001,
  'INV'
) ON CONFLICT (email) DO NOTHING;

-- Get the demo user ID for relationships
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@invoiceflow.com' LIMIT 1;

  IF demo_user_id IS NOT NULL THEN
    -- =============================================================================
    -- STEP 2: Insert System Invoice Templates
    -- =============================================================================

    INSERT INTO invoice_templates (
      id, user_id, name, description, layout, theme, primary_color, secondary_color, 
      accent_color, is_default, is_system_template
    ) VALUES 
    (
      gen_random_uuid(),
      demo_user_id,
      'Modern',
      'Clean, professional design with blue accents',
      'modern',
      'light',
      '#2563eb',
      '#1e40af',
      '#64748b',
      true,
      true
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'Classic',
      'Traditional invoice layout with serif fonts',
      'classic',
      'light',
      '#1f2937',
      '#374151',
      '#6b7280',
      false,
      true
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'Minimal',
      'Simple, minimal design with plenty of white space',
      'minimal',
      'light',
      '#64748b',
      '#475569',
      '#94a3b8',
      false,
      true
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'Dark Modern',
      'Modern design with dark theme',
      'modern',
      'dark',
      '#3b82f6',
      '#60a5fa',
      '#93c5fd',
      false,
      true
    )
    ON CONFLICT DO NOTHING;

    -- =============================================================================
    -- STEP 3: Insert Demo Clients
    -- =============================================================================

    INSERT INTO clients (
      id, user_id, name, email, phone, address, city, state, zip_code, country, tax_id, website, notes
    ) VALUES 
    (
      gen_random_uuid(),
      demo_user_id,
      'Acme Corporation',
      'billing@acme.com',
      '+1 (555) 234-5678',
      '456 Corporate Blvd',
      'San Francisco',
      'CA',
      '94102',
      'United States',
      '98-7654321',
      'https://acme.com',
      'Regular client, NET 30 terms'
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'TechStart Solutions',
      'accounts@techstart.com',
      '+1 (555) 345-6789',
      '789 Innovation Drive',
      'Austin',
      'TX',
      '78701',
      'United States',
      '11-2233445',
      'https://techstart.io',
      'Startup client, quick payments'
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'Global Marketing Inc',
      'finance@globalmarketing.com',
      '+1 (555) 456-7890',
      '321 Madison Avenue',
      'New York',
      'NY',
      '10017',
      'United States',
      '33-4455667',
      'https://globalmarketing.com',
      'Large enterprise, multiple departments'
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'Creative Studio LLC',
      'hello@creativestudio.com',
      '+1 (555) 567-8901',
      '159 Art District Lane',
      'Portland',
      'OR',
      '97209',
      'United States',
      '55-6677889',
      'https://creativestudio.design',
      'Design agency, project-based billing'
    ),
    (
      gen_random_uuid(),
      demo_user_id,
      'Retail Plus Co',
      'payables@retailplus.com',
      '+1 (555) 678-9012',
      '753 Shopping Center Way',
      'Miami',
      'FL',
      '33101',
      'United States',
      '77-8899001',
      'https://retailplus.com',
      'Retail chain, weekly invoices'
    )
    ON CONFLICT DO NOTHING;

    -- =============================================================================
    -- STEP 4: Insert Sample Invoices with Items
    -- =============================================================================

    -- Get template ID
    DECLARE
      template_id_var UUID;
    BEGIN
      SELECT id INTO template_id_var FROM invoice_templates WHERE name = 'Modern' AND user_id = demo_user_id LIMIT 1;

      -- Insert Sample Invoice 1 (Paid)
      INSERT INTO invoices (
        id, user_id, client_id, template_id, invoice_number, issue_date, due_date, 
        status, subtotal, tax_amount, total_amount, amount_paid, balance_due,
        notes, terms
      ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM clients WHERE name = 'Acme Corporation' AND user_id = demo_user_id),
        template_id_var,
        'INV-1001',
        CURRENT_DATE - INTERVAL '45 days',
        CURRENT_DATE - INTERVAL '15 days',
        'paid',
        5000.00,
        500.00,
        5500.00,
        5500.00,
        0.00,
        'Thank you for your business!',
        'Payment due within 30 days. Late fees apply after 30 days.'
      ) ON CONFLICT DO NOTHING;

      -- Add invoice items for Invoice 1
      INSERT INTO invoice_items (
        id, user_id, invoice_id, name, description, quantity, unit_price, line_total, item_type
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1001' AND user_id = demo_user_id),
        'Website Redesign',
        'Complete redesign of corporate website including UX, UI, and development',
        1,
        3000.00,
        3000.00,
        'service'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1001' AND user_id = demo_user_id),
        'Mobile App Consultation',
        'Strategic consultation for mobile app development project',
        20,
        100.00,
        2000.00,
        'service'
      )
      ON CONFLICT DO NOTHING;

      -- Insert Sample Invoice 2 (Sent - Overdue)
      INSERT INTO invoices (
        id, user_id, client_id, template_id, invoice_number, issue_date, due_date, 
        status, subtotal, tax_amount, total_amount, amount_paid, balance_due,
        notes
      ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM clients WHERE name = 'TechStart Solutions' AND user_id = demo_user_id),
        template_id_var,
        'INV-1002',
        CURRENT_DATE - INTERVAL '40 days',
        CURRENT_DATE - INTERVAL '10 days',
        'sent',
        3200.00,
        320.00,
        3520.00,
        0.00,
        3520.00,
        'Looking forward to continuing our partnership!'
      ) ON CONFLICT DO NOTHING;

      -- Add invoice items for Invoice 2
      INSERT INTO invoice_items (
        id, user_id, invoice_id, name, description, quantity, unit_price, line_total, item_type
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1002' AND user_id = demo_user_id),
        'Logo Design',
        'Modern logo design with brand guidelines',
        1,
        1200.00,
        1200.00,
        'service'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1002' AND user_id = demo_user_id),
        'Brand Identity Package',
        'Complete brand identity including colors, typography, and guidelines',
        1,
        2000.00,
        2000.00,
        'service'
      )
      ON CONFLICT DO NOTHING;

      -- Insert Sample Invoice 3 (Draft)
      INSERT INTO invoices (
        id, user_id, client_id, template_id, invoice_number, issue_date, due_date, 
        status, subtotal, tax_amount, total_amount, amount_paid, balance_due
      ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM clients WHERE name = 'Global Marketing Inc' AND user_id = demo_user_id),
        template_id_var,
        'INV-1003',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '30 days',
        'draft',
        7500.00,
        750.00,
        8250.00,
        0.00,
        8250.00
      ) ON CONFLICT DO NOTHING;

      -- Add invoice items for Invoice 3
      INSERT INTO invoice_items (
        id, user_id, invoice_id, name, description, quantity, unit_price, line_total, item_type
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1003' AND user_id = demo_user_id),
        'Digital Marketing Campaign',
        '3-month digital marketing campaign management',
        3,
        2000.00,
        6000.00,
        'service'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1003' AND user_id = demo_user_id),
        'SEO Audit & Strategy',
        'Comprehensive SEO audit and strategy document',
        1,
        1500.00,
        1500.00,
        'service'
      )
      ON CONFLICT DO NOTHING;

      -- Insert Sample Invoice 4 (Viewed)
      INSERT INTO invoices (
        id, user_id, client_id, template_id, invoice_number, issue_date, due_date, 
        status, subtotal, discount_amount, tax_amount, total_amount, amount_paid, balance_due,
        notes
      ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM clients WHERE name = 'Creative Studio LLC' AND user_id = demo_user_id),
        template_id_var,
        'INV-1004',
        CURRENT_DATE - INTERVAL '5 days',
        CURRENT_DATE + INTERVAL '25 days',
        'viewed',
        2500.00,
        250.00,
        225.00,
        2475.00,
        0.00,
        2475.00,
        '10% discount applied for early payment agreement'
      ) ON CONFLICT DO NOTHING;

      -- Add invoice items for Invoice 4
      INSERT INTO invoice_items (
        id, user_id, invoice_id, name, description, quantity, unit_price, line_total, item_type
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1004' AND user_id = demo_user_id),
        'Illustration Package',
        'Custom illustrations for marketing materials',
        10,
        150.00,
        1500.00,
        'service'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1004' AND user_id = demo_user_id),
        'Motion Graphics',
        '30-second animated promotional video',
        1,
        1000.00,
        1000.00,
        'service'
      )
      ON CONFLICT DO NOTHING;

      -- =============================================================================
      -- STEP 5: Insert Sample Payments
      -- =============================================================================

      -- Payment for Invoice 1 (Paid)
      INSERT INTO payments (
        id, user_id, invoice_id, client_id, amount, payment_date, payment_method, 
        status, reference_number, notes
      ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1001' AND user_id = demo_user_id),
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1001' AND user_id = demo_user_id),
        (SELECT client_id FROM invoices WHERE invoice_number = 'INV-1001' AND user_id = demo_user_id),
        5500.00,
        CURRENT_DATE - INTERVAL '20 days',
        'bank_transfer',
        'completed',
        'PAY-001-ACME',
        'Payment received via ACH transfer'
      ) ON CONFLICT DO NOTHING;

      -- Partial payment for Invoice 4 (to show mixed status)
      INSERT INTO payments (
        id, user_id, invoice_id, client_id, amount, payment_date, payment_method, 
        status, reference_number
      ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1004' AND user_id = demo_user_id),
        (SELECT id FROM invoices WHERE invoice_number = 'INV-1004' AND user_id = demo_user_id),
        (SELECT client_id FROM invoices WHERE invoice_number = 'INV-1004' AND user_id = demo_user_id),
        1000.00,
        CURRENT_DATE - INTERVAL '2 days',
        'card',
        'completed',
        'PAY-004-CREATIVE'
      ) ON CONFLICT DO NOTHING;

      -- Update invoice balance after partial payment
      UPDATE invoices 
      SET amount_paid = 1000.00, 
          balance_due = 1475.00,
          status = 'viewed'
      WHERE invoice_number = 'INV-1004' AND user_id = demo_user_id;

      -- =============================================================================
      -- STEP 6: Insert Expense Categories and Expenses
      -- =============================================================================

      INSERT INTO expense_categories (
        id, user_id, name, description, color, icon
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        'Software & Subscriptions',
        'Monthly software subscriptions and SaaS tools',
        '#3b82f6',
        'Code'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'Office Supplies',
        'Office supplies and equipment',
        '#10b981',
        'Briefcase'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'Marketing & Advertising',
        'Marketing campaigns and advertising costs',
        '#f59e0b',
        'Megaphone'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'Professional Services',
        'Legal, accounting, and consulting fees',
        '#8b5cf6',
        'UserCheck'
      )
      ON CONFLICT DO NOTHING;

      -- Insert sample expenses
      INSERT INTO expenses (
        id, user_id, category_id, vendor_name, amount, expense_date, 
        description, tax_deductible, payment_method, status
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM expense_categories WHERE name = 'Software & Subscriptions' AND user_id = demo_user_id),
        'Adobe Creative Cloud',
        52.99,
        CURRENT_DATE - INTERVAL '15 days',
        'Monthly subscription for design software',
        true,
        'card',
        'approved'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM expense_categories WHERE name = 'Marketing & Advertising' AND user_id = demo_user_id),
        'Google Ads',
        250.00,
        CURRENT_DATE - INTERVAL '10 days',
        'Google Ads campaign for Q4',
        true,
        'card',
        'approved'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM expense_categories WHERE name = 'Office Supplies' AND user_id = demo_user_id),
        'Amazon Business',
        89.50,
        CURRENT_DATE - INTERVAL '5 days',
        'Office chairs and desk accessories',
        true,
        'card',
        'pending'
      )
      ON CONFLICT DO NOTHING;

      -- =============================================================================
      -- STEP 7: Insert Activity Logs
      -- =============================================================================

      INSERT INTO activity_logs (
        id, user_id, action, description, entity_type, entity_id
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        'invoice_created',
        'Created new invoice INV-1003',
        'invoice',
        'INV-1003'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'invoice_sent',
        'Sent invoice INV-1004 to Creative Studio LLC',
        'invoice',
        'INV-1004'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'payment_received',
        'Received payment of $5,500 for invoice INV-1001',
        'payment',
        'PAY-001-ACME'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'client_added',
        'Added new client: Retail Plus Co',
        'client',
        'retail-plus-co'
      )
      ON CONFLICT DO NOTHING;

      -- =============================================================================
      -- STEP 8: Insert Notifications
      -- =============================================================================

      INSERT INTO notifications (
        id, user_id, title, message, type, action_url, action_text
      ) VALUES 
      (
        gen_random_uuid(),
        demo_user_id,
        'Invoice Overdue',
        'Invoice INV-1002 is 10 days overdue',
        'warning',
        '/dashboard/invoices',
        'View Invoice'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'Payment Received',
        'Received $1,000 payment from Creative Studio LLC',
        'success',
        '/dashboard/payments',
        'View Payment'
      ),
      (
        gen_random_uuid(),
        demo_user_id,
        'New Client Added',
        'Successfully added Retail Plus Co to your client list',
        'info',
        '/dashboard/clients',
        'View Client'
      )
      ON CONFLICT DO NOTHING;

    END;
  END IF;
END $$;

-- =============================================================================
-- STEP 9: Update User Invoice Counter
-- =============================================================================

-- Set the next invoice number based on existing invoices
DO $$
DECLARE
  demo_user_id UUID;
  max_invoice_num INTEGER;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@invoiceflow.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    SELECT COALESCE(MAX(next_invoice_number), 1005)
    INTO max_invoice_num
    FROM users
    WHERE id = demo_user_id;
    
    UPDATE users 
    SET next_invoice_number = max_invoice_num 
    WHERE id = demo_user_id;
  END IF;
END $$;

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================
-- Total Records Created:
-- - 1 Demo User
-- - 4 System Templates
-- - 5 Clients
-- - 4 Invoices (different statuses)
-- - 8 Invoice Items
-- - 2 Payments
-- - 4 Expense Categories
-- - 3 Expenses
-- - 4 Activity Logs
-- - 3 Notifications
-- =============================================================================
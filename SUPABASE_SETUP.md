# InvoiceFlow - Supabase Backend Setup Guide

## Overview
This document explains the complete Supabase setup for the InvoiceFlow application, including database schema, authentication, and API integration.

## Environment Variables

Create a `.env.local` file in the project root with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ztobyruqamentldeduul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2J5cnVxYW1lbnRsZGVkdXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTE1MTcsImV4cCI6MjA4MjA2NzUxN30.qchNSUyrncSdOs-x1pWSSInqZnFcm8hDgvaltQftlqA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2J5cnVxYW1lbnRsZGVkdXVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MTUxNywiZXhwIjoyMDgyMDY3NTE3fQ.GFmWWt5V1jj3eGUhR1KRBG7n0DxWX0DMcAaK5YuSMT8
NEXT_PUBLIC_SUPABASE_PROJECT_ID=ztobyruqamentldeduul
DATABASE_URL=postgresql://postgres:Astindon@77@db.ztobyruqamentldeduul.supabase.co:5432/postgres
```

**DO NOT commit `.env.local` to version control!**

## Database Schema

### 1. Users Table
Stores user profile and company information.

```sql
CREATE TABLE users (
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
  country VARCHAR(100),
  tax_id VARCHAR(50),
  website VARCHAR(255),
  bank_name VARCHAR(255),
  account_number VARCHAR(255),
  routing_number VARCHAR(255),
  account_holder_name VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'USD',
  default_payment_terms INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Clients Table
Stores client/customer information.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  tax_id VARCHAR(50),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX clients_user_id_idx ON clients(user_id);
```

### 3. Invoices Table
Stores invoice data.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  subtotal DECIMAL(12, 2) DEFAULT 0,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_percent DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  template_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  paid_at TIMESTAMP
);

CREATE INDEX invoices_user_id_idx ON invoices(user_id);
CREATE INDEX invoices_client_id_idx ON invoices(client_id);
CREATE INDEX invoices_status_idx ON invoices(status);
```

### 4. Invoice Items Table
Stores line items for each invoice.

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX invoice_items_invoice_id_idx ON invoice_items(invoice_id);
```

### 5. Payments Table
Tracks payments received for invoices.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed',
  reference_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_invoice_id_idx ON payments(invoice_id);
```

### 6. Invoice Templates Table
Stores custom invoice templates.

```sql
CREATE TABLE invoice_templates (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  layout VARCHAR(50),
  primary_color VARCHAR(7),
  tertiary_color VARCHAR(7),
  include_notes BOOLEAN DEFAULT TRUE,
  include_terms BOOLEAN DEFAULT TRUE,
  custom_css TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX invoice_templates_user_id_idx ON invoice_templates(user_id);
```

### 7. Activity Logs Table
Tracks user actions for audit purposes.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX activity_logs_created_at_idx ON activity_logs(created_at);
```

## Row Level Security (RLS) Policies

Enable RLS on all tables and set up policies:

### Enable RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
```

### Users Policies
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Clients Policies
```sql
-- Users can only see their own clients
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (user_id = auth.uid());

-- Users can create clients
CREATE POLICY "Users can create clients" ON clients
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update own clients
CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete own clients
CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (user_id = auth.uid());
```

### Invoices Policies
```sql
-- Users can only see their own invoices
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (user_id = auth.uid());

-- Users can create invoices
CREATE POLICY "Users can create invoices" ON invoices
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update own invoices
CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete own invoices
CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (user_id = auth.uid());
```

### Invoice Items Policies
```sql
-- Users can view items for their invoices
CREATE POLICY "Users can view invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Users can create invoice items
CREATE POLICY "Users can create invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices WHERE invoices.id = invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- Users can update invoice items
CREATE POLICY "Users can update invoice items" ON invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );
```

### Payments Policies
```sql
-- Users can view own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

-- Users can create payments
CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update own payments
CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (user_id = auth.uid());
```

### Templates Policies
```sql
-- Users can view own templates
CREATE POLICY "Users can view own templates" ON invoice_templates
  FOR SELECT USING (user_id = auth.uid());

-- Users can create templates
CREATE POLICY "Users can create templates" ON invoice_templates
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update own templates
CREATE POLICY "Users can update own templates" ON invoice_templates
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete own templates
CREATE POLICY "Users can delete own templates" ON invoice_templates
  FOR DELETE USING (user_id = auth.uid());
```

### Activity Logs Policies
```sql
-- Users can view own activity logs
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (user_id = auth.uid());

-- Users can create activity logs
CREATE POLICY "Users can create activity logs" ON activity_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

## Authentication Setup

The app uses Supabase Authentication with:

- **Email/Password**: For user registration and login
- **Email verification**: Required for account activation
- **Password reset**: Available via auth page
- **Session management**: Automatic with JWT tokens

### Auth Flow

1. User signs up at `/auth/signup`
2. Auth user is created in `auth.users`
3. User profile is created in `public.users`
4. User is redirected to `/dashboard`
5. Auth state is managed via React Context (`AuthContext`)

## Frontend Implementation

### Key Files

- `app/lib/supabase.ts` - Supabase client initialization
- `app/lib/auth.ts` - Authentication functions
- `app/lib/db-services.ts` - Database CRUD operations
- `app/contexts/AuthContext.tsx` - React auth context
- `app/components/ProtectedRoute.tsx` - Route protection

### Using the API

```typescript
// Get user profile
import { useAuth } from '@/app/contexts/AuthContext';
const { user, userProfile } = useAuth();

// Fetch invoices
import { getInvoices } from '@/app/lib/db-services';
const { data: invoices } = await getInvoices(userId);

// Create invoice
import { createInvoice } from '@/app/lib/db-services';
await createInvoice(userId, invoiceData, items);
```

## Database Migrations

All schema changes should be tracked. Use Supabase migrations:

```bash
supabase migration new <migration_name>
```

## Backup & Disaster Recovery

Supabase provides:
- Automatic daily backups
- Point-in-time recovery (up to 7 days)
- Manual backup export from dashboard

## Performance Considerations

1. **Indexes**: Created on frequently queried columns
2. **RLS**: Ensures data isolation
3. **Caching**: Consider Redis for dashboard stats
4. **Connection pooling**: Enabled in PgBouncer

## Security

- **Secrets**: Stored in environment variables
- **HTTPS**: Required for all connections
- **RLS**: Enforces row-level security
- **JWT**: Tokens expire after 1 hour (configurable)
- **CORS**: Configured for frontend domain

## Testing

### Demo Credentials

Email: demo@invoiceflow.com
Password: Demo@123

## Troubleshooting

### Common Issues

1. **"Database connection failed"**
   - Check environment variables
   - Verify Supabase project is running
   - Check network connectivity

2. **"RLS policy denies access"**
   - Verify user is authenticated
   - Check policy configuration
   - Ensure user_id matches

3. **"CORS error"**
   - Add domain to Supabase allowed origins
   - Check browser console for details

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Last Updated**: December 2024

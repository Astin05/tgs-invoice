# Supabase Backend Setup

This directory contains all SQL scripts and configurations needed to set up the complete InvoiceFlow backend on Supabase.

## Files Structure

```
supabase/
├── README.md                          # This file
├── schema/                            # Database schema
│   └── schema.sql                     # Complete schema with all tables
├── migrations/                        # Versioned migrations
│   └── 001_initial_schema.sql         # Initial migration
├── seed/                              # Seed data for development
│   └── seed.sql                       # Demo data and initial records
└── push-to-supabase.sql              # All-in-one deployment script
```

## Quick Start - Push to Supabase

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   brew install supabase/tap/supabase  # Mac
   # or
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git  # Windows
   scoop install supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-id ztobyruqamentldeduul
   ```

4. Push schema to production:
   ```bash
   supabase db push
   ```

5. Add seed data:
   ```bash
   supabase db reset  # This will reset and re-seed the database
   ```

### Option 2: Direct SQL Execution

You can run the complete setup directly in Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" → "New query"
3. Copy and paste the contents of `push-to-supabase.sql`
4. Click "Run" to execute all commands at once

### Option 3: Using psql (Advanced)

```bash
psql "postgresql://postgres:Astindon@77@db.ztobyruqamentldeduul.supabase.co:5432/postgres" -f push-to-supabase.sql
```

## Environment Variables

Make sure your `.env.local` file is configured:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ztobyruqamentldeduul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2J5cnVxYW1lbnRsZGVkdXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTE1MTcsImV4cCI6MjA4MjA2NzUxN30.qchNSUyrncSdOs-x1pWSSInqZnFcm8hDgvaltQftlqA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2J5cnVxYW1lbnRsZGVkdXVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MTUxNywiZXhwIjoyMDgyMDY3NTE3fQ.GFmWWt5V1jj3eGUhR1KRBG7n0DxWX0DMcAaK5YuSMT8
DATABASE_URL=postgresql://postgres:Astindon@77@db.ztobyruqamentldeduul.supabase.co:5432/postgres
```

## Deployment Order

The setup scripts will execute in this order:

1. **Enable Extensions**: pgcrypto, uuid-ossp
2. **Create Tables**: users, clients, invoices, invoice_items, payments, invoice_templates, activity_logs
3. **Create Indexes**: For performance optimization
4. **Enable RLS**: Row Level Security on all tables
5. **Create RLS Policies**: Security policies for data isolation
6. **Create Functions**: Helper functions for auto-incrementing invoice numbers
7. **Insert Seed Data**: Demo user, clients, invoices, templates

## Verification

After deployment, verify the setup:

1. Check all 7 tables are created in "Table Editor"
2. Verify RLS policies are enabled in "Authentication" → "Policies"
3. Test with demo credentials:
   - Email: `demo@invoiceflow.com`
   - Password: `Demo@123`

## Rollback

If you need to reset the database:

```bash
supabase db reset
```

**Warning**: This will delete all data and re-seed the database!

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema Details](../SUPABASE_SETUP.md)
- [Frontend API Integration](../SUPABASE_SETUP.md#frontend-implementation)
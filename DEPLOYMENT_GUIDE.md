# InvoiceFlow - Deployment & Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Local Development](#local-development)
5. [Deployment](#deployment)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Node.js 18+ or higher
- npm 9+ or yarn/pnpm
- Git
- Supabase account
- Vercel account (for deployment)

### System Requirements
- 2GB RAM minimum
- 500MB disk space
- Modern browser (Chrome, Firefox, Safari, Edge)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd invoiceflow
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
# or
yarn install
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ztobyruqamentldeduul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2J5cnVxYW1lbnRsZGVkdXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTE1MTcsImV4cCI6MjA4MjA2NzUxN30.qchNSUyrncSdOs-x1pWSSInqZnFcm8hDgvaltQftlqA

# Service Role Key (Server-side only - NEVER expose in frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2J5cnVxYW1lbnRsZGVkdXVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MTUxNywiZXhwIjoyMDgyMDY3NTE3fQ.GFmWWt5V1jj3eGUhR1KRBG7n0DxWX0DMcAaK5YuSMT8

# Project ID
NEXT_PUBLIC_SUPABASE_PROJECT_ID=ztobyruqamentldeduul

# Database Connection
DATABASE_URL=postgresql://postgres:Astindon@77@db.ztobyruqamentldeduul.supabase.co:5432/postgres
```

**⚠️ IMPORTANT**: Add `.env.local` to `.gitignore` - Never commit secrets!

## Database Setup

### 1. Access Supabase Console

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your account
3. Select the project "ztobyruqamentldeduul"
4. Go to SQL Editor

### 2. Create Database Schema

Run all SQL from `SUPABASE_SETUP.md` in Supabase SQL Editor:

- Users table
- Clients table
- Invoices table
- Invoice Items table
- Payments table
- Templates table
- Activity Logs table

### 3. Enable Row Level Security

Copy and run RLS policies from `SUPABASE_SETUP.md`

### 4. Create Default Templates

```sql
INSERT INTO invoice_templates (user_id, name, description, layout, primary_color, tertiary_color, include_notes, include_terms, is_default)
VALUES 
  (auth.uid(), 'Classic Professional', 'Traditional invoice layout', 'classic', '#2563EB', '#E0E7FF', true, true, true),
  (auth.uid(), 'Modern Minimalist', 'Clean minimal design', 'modern', '#000000', '#F3F4F6', true, false, false),
  (auth.uid(), 'Creative Vibrant', 'Bold colorful design', 'minimal', '#7C3AED', '#EDE9FE', true, true, false);
```

## Local Development

### 1. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 2. Access the Application

- **Login Page**: http://localhost:3000/auth/login
- **Signup Page**: http://localhost:3000/auth/signup
- **Dashboard**: http://localhost:3000/dashboard (requires authentication)

### 3. Demo Credentials

```
Email: demo@invoiceflow.com
Password: Demo@123
```

### 4. Development Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Deployment

### Option 1: Deploy to Vercel (Recommended)

#### 1. Push Code to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

#### 3. Configure Environment Variables

In Vercel Dashboard:
- Go to Project Settings > Environment Variables
- Add all variables from `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (only in Production)
  - `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
  - `DATABASE_URL` (optional, for server-side operations)

#### 4. Deploy
- Click "Deploy"
- Wait for deployment to complete
- View your live app

### Option 2: Deploy to Other Platforms

#### Deploy to Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Deploy to AWS Amplify
1. Connect GitHub repository
2. Add environment variables in Amplify console
3. Deploy

#### Deploy to Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Production Checklist

- [ ] Environment variables set in production
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Database indexes created
- [ ] RLS policies tested
- [ ] Payment processing configured (if applicable)
- [ ] Email notifications set up
- [ ] Analytics tracking added

## Monitoring

### 1. Supabase Monitoring

**Database Health:**
- Go to Project > Database > Health in Supabase console
- Monitor: CPU, Memory, Connections

**Logs:**
- Project > Logs in Supabase console
- Check for errors and warnings

### 2. Application Monitoring

**With Vercel:**
- Real-time analytics in Vercel Dashboard
- Performance metrics
- Error tracking

**With Sentry (Recommended):**
```bash
npm install @sentry/nextjs
```

Configure in `next.config.ts`:
```typescript
const withSentryConfig = require("@sentry/nextjs/withSentryConfig");

module.exports = withSentryConfig(
  {
    // Next.js config
  },
  {
    org: "your-org",
    project: "invoiceflow",
  }
);
```

### 3. Performance Monitoring

- Check Core Web Vitals in Google Search Console
- Monitor page load times
- Track database query performance

## Scaling

### Database Optimization

```sql
-- Add missing indexes
CREATE INDEX idx_invoices_user_id_created ON invoices(user_id, created_at);
CREATE INDEX idx_payments_user_id_payment_date ON payments(user_id, payment_date);
```

### Caching Strategy

- Cache dashboard stats (5 minutes)
- Cache client list (10 minutes)
- Invalidate on mutation

### Database Connection Pooling

Supabase uses PgBouncer automatically. For server-side:

```typescript
// Use connection pooling for better performance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

#### 2. Database connection failed
- Check `.env.local` variables
- Verify Supabase project is active
- Check network connectivity
- Verify database credentials

#### 3. RLS policy errors
```
Error: "rows policy on table violates row security policy"
```
- User must be authenticated
- User ID must match the record
- Check RLS policy configuration

#### 4. CORS errors
- Add domain to Supabase allowed origins
- In Supabase Dashboard: Project Settings > API
- Add your domain to CORS whitelist

#### 5. Build failures
```bash
# Clear build cache
rm -rf .next
npm run build
```

### Debug Mode

Enable debug logging:
```typescript
// In app/lib/supabase.ts
const supabase = createClient(url, key, {
  debug: true,
});
```

## Security Best Practices

1. **Never commit secrets**
   - Add `.env.local` to `.gitignore`
   - Use environment variables for all secrets

2. **Use HTTPS only**
   - Enable in production
   - Configure HSTS headers

3. **Implement rate limiting**
   - Limit API calls
   - Protect auth endpoints

4. **Regular security audits**
   - Review RLS policies
   - Check authentication logs
   - Monitor for suspicious activity

5. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

## Backup & Recovery

### Automated Backups
- Supabase creates daily backups
- 7-day retention for free tier
- 30-day retention for paid tier

### Manual Backup
```bash
# Export database
pg_dump "postgresql://..." > backup.sql

# Restore from backup
psql "postgresql://..." < backup.sql
```

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Vercel Docs](https://vercel.com/docs)

## Maintenance

### Weekly Tasks
- Monitor database performance
- Check error logs
- Review user feedback

### Monthly Tasks
- Analyze usage metrics
- Optimize slow queries
- Update dependencies

### Quarterly Tasks
- Security audit
- Capacity planning
- Performance optimization

## Version History

- **v1.0** - Initial release (December 2024)
  - Full invoice management
  - Client & payment tracking
  - Dashboard analytics
  - Invoice templates

---

**Last Updated**: December 2024
**Maintained By**: Development Team

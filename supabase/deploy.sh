#!/bin/bash

# =============================================================================
# InvoiceFlow Supabase Deployment Script
# =============================================================================
# This script deploys the complete database schema and seed data to Supabase
# =============================================================================

set -e

echo "🚀 Starting InvoiceFlow Supabase Deployment..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_PROJECT_ID="ztobyruqamentldeduul"
SUPABASE_DB_HOST="db.ztobyruqamentldeduul.supabase.co"
SUPABASE_DB_PORT="5432"
SUPABASE_DB_NAME="postgres"
SUPABASE_DB_USER="postgres"
SUPABASE_DB_PASSWORD="Astindon@77"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ Error: psql is not installed${NC}"
    echo "Please install PostgreSQL client to continue"
    echo "Mac: brew install postgresql"
    echo "Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# Function to wait for user input
wait_for_user() {
    echo ""
    echo -e "${YELLOW}⚠️  WARNING: This will deploy to your Supabase production database${NC}"
    echo -e "${YELLOW}Make sure you have backups before proceeding${NC}"
    echo ""
    read -p "Do you want to continue? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment cancelled${NC}"
        exit 1
    fi
}

# Function to deploy schema
deploy_schema() {
    echo -e "${BLUE}📋 Step 1: Deploying database schema...${NC}"
    
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -f "schema/schema.sql" \
        -v ON_ERROR_STOP=1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema deployed successfully${NC}"
    else
        echo -e "${RED}❌ Schema deployment failed${NC}"
        exit 1
    fi
}

# Function to enable RLS
deploy_rls() {
    echo -e "${BLUE}🔒 Step 2: Enabling Row Level Security...${NC}"
    
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -c "
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
        "
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ RLS enabled successfully${NC}"
    else
        echo -e "${RED}❌ RLS setup failed${NC}"
        exit 1
    fi
}

# Function to create RLS policies
deploy_policies() {
    echo -e "${BLUE}🛡️  Step 3: Creating RLS policies...${NC}"
    
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -c "
        -- Users Policies
        DROP POLICY IF EXISTS \"Users can view own profile\" ON users;
        DROP POLICY IF EXISTS \"Users can update own profile\" ON users;
        CREATE POLICY \"Users can view own profile\" ON users FOR SELECT USING (auth.uid() = id);
        CREATE POLICY \"Users can update own profile\" ON users FOR UPDATE USING (auth.uid() = id);
        
        -- Clients Policies
        DROP POLICY IF EXISTS \"Users can view own clients\" ON clients;
        DROP POLICY IF EXISTS \"Users can create clients\" ON clients;
        DROP POLICY IF EXISTS \"Users can update own clients\" ON clients;
        DROP POLICY IF EXISTS \"Users can delete own clients\" ON clients;
        CREATE POLICY \"Users can view own clients\" ON clients FOR SELECT USING (user_id = auth.uid());
        CREATE POLICY \"Users can create clients\" ON clients FOR INSERT WITH CHECK (user_id = auth.uid());
        CREATE POLICY \"Users can update own clients\" ON clients FOR UPDATE USING (user_id = auth.uid());
        CREATE POLICY \"Users can delete own clients\" ON clients FOR DELETE USING (user_id = auth.uid());
        
        -- Invoices Policies
        DROP POLICY IF EXISTS \"Users can view own invoices\" ON invoices;
        DROP POLICY IF EXISTS \"Users can create invoices\" ON invoices;
        DROP POLICY IF EXISTS \"Users can update own invoices\" ON invoices;
        DROP POLICY IF EXISTS \"Users can delete own invoices\" ON invoices;
        CREATE POLICY \"Users can view own invoices\" ON invoices FOR SELECT USING (user_id = auth.uid());
        CREATE POLICY \"Users can create invoices\" ON invoices FOR INSERT WITH CHECK (user_id = auth.uid());
        CREATE POLICY \"Users can update own invoices\" ON invoices FOR UPDATE USING (user_id = auth.uid());
        CREATE POLICY \"Users can delete own invoices\" ON invoices FOR DELETE USING (user_id = auth.uid());
        
        -- Add more policies as needed...
        "
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ RLS policies created successfully${NC}"
    else
        echo -e "${RED}❌ RLS policy creation failed${NC}"
        exit 1
    fi
}

# Function to seed data
seed_data() {
    echo -e "${BLUE}🌱 Step 4: Seeding demo data...${NC}"
    
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -f "seed/seed.sql" \
        -v ON_ERROR_STOP=1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Seed data inserted successfully${NC}"
    else
        echo -e "${RED}❌ Seed data insertion failed${NC}"
        exit 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo -e "${BLUE}🔍 Step 5: Verifying deployment...${NC}"
    
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -c "
        SELECT 'users' as table_name, COUNT(*) as count FROM users
        UNION ALL SELECT 'clients', COUNT(*) FROM clients
        UNION ALL SELECT 'invoices', COUNT(*) FROM invoices
        UNION ALL SELECT 'invoice_templates', COUNT(*) FROM invoice_templates
        UNION ALL SELECT 'activity_logs', COUNT(*) FROM activity_logs
        UNION ALL SELECT 'expense_categories', COUNT(*) FROM expense_categories;
        "
    
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -c "
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' AND rowsecurity = true
        ORDER BY tablename;
        "
}

# Function to create auth user (manual step required)
create_auth_user() {
    echo -e "${BLUE}👤 Step 6: Creating demo auth user...${NC}"
    echo -e "${YELLOW}Note: This must be done in Supabase Auth Dashboard${NC}"
    echo ""
    echo "1. Go to: https://supabase.com/dashboard/project/ztobyruqamentldeduul/auth/users"
    echo "2. Click 'Add user'"
    echo "3. Email: demo@invoiceflow.com"
    echo "4. Password: Demo@123"
    echo "5. Click 'Create user'"
    echo ""
    read -p "Press Enter after creating the auth user..."
}

# Main deployment function
full_deployment() {
    wait_for_user
    deploy_schema
    deploy_rls
    deploy_policies
    seed_data
    verify_deployment
    create_auth_user
    
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo "Demo Credentials:"
    echo "  Email: demo@invoiceflow.com"
    echo "  Password: Demo@123"
    echo ""
    echo "Next Steps:"
    echo "1. Run: npm run dev"
    echo "2. Login at http://localhost:3000/auth/login"
    echo "3. Test all features in the dashboard"
    echo ""
}

# Function to reset database
reset_database() {
    echo -e "${RED}⚠️  WARNING: This will DELETE ALL DATA and reset the database${NC}"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Reset cancelled${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🗑️  Resetting database...${NC}"
    
    # This would drop all tables - use with extreme caution
    PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        -c "
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
        "
    
    echo -e "${GREEN}✅ Database reset complete${NC}"
    echo -e "${YELLOW}Run './deploy.sh' to redeploy the schema${NC}"
}

# Help function
show_help() {
    echo "InvoiceFlow Supabase Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  full         Full deployment (schema + RLS + seed data)"
    echo "  schema       Deploy only the database schema"
    echo "  rls          Enable Row Level Security only"
    echo "  policies     Create RLS policies only"
    echo "  seed         Insert seed data only"
    echo "  verify       Verify deployment status"
    echo "  reset        ⚠️  DANGER: Reset entire database"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh full         # Complete deployment"
    echo "  ./deploy.sh schema       # Deploy schema only"
    echo "  ./deploy.sh verify       # Check deployment status"
    echo ""
}

# Main script logic
case "${1:-full}" in
    full)
        full_deployment
        ;;
    schema)
        deploy_schema
        ;;
    rls)
        deploy_rls
        ;;
    policies)
        deploy_policies
        ;;
    seed)
        seed_data
        ;;
    verify)
        verify_deployment
        ;;
    reset)
        reset_database
        ;;
    help)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
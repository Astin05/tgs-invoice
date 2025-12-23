import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize with defaults during build, will use real values at runtime
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: typeof window !== 'undefined',
    },
  }
);

// Server-side client with service role
export const supabaseServer = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
};

// Types for database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          company_name: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          tax_id?: string;
          website?: string;
          bank_name: string;
          account_number: string;
          routing_number: string;
          account_holder_name: string;
          currency: string;
          default_payment_terms: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          tax_id?: string;
          website?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Row']>;
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          invoice_number: string;
          issue_date: string;
          due_date: string;
          status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
          subtotal: number;
          discount_percent: number;
          discount_amount: number;
          tax_percent: number;
          tax_amount: number;
          total_amount: number;
          notes?: string;
          terms?: string;
          template_id: string;
          created_at: string;
          updated_at: string;
          sent_at?: string;
          paid_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['invoice_items']['Row']>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          invoice_id: string;
          amount: number;
          payment_date: string;
          payment_method: 'bank_transfer' | 'credit_card' | 'cash' | 'check' | 'other';
          status: 'completed' | 'pending' | 'failed';
          reference_number?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Row']>;
      };
      invoice_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          layout: 'classic' | 'modern' | 'minimal';
          primary_color: string;
          tertiary_color?: string;
          include_notes: boolean;
          include_terms: boolean;
          custom_css?: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoice_templates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoice_templates']['Row']>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          description: string;
          entity_type: string;
          entity_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at'>;
      };
    };
  };
}

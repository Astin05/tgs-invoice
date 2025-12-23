import { supabase } from './supabase';

// ============ CLIENTS ============

export const getClients = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createClient = async (
  userId: string,
  clientData: {
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
  }
) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        ...clientData,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateClient = async (clientId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteClient = async (clientId: string) => {
  try {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// ============ INVOICES ============

export const getInvoices = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name), invoice_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const getInvoiceById = async (invoiceId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name, email, phone, address), invoice_items(*)')
      .eq('id', invoiceId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createInvoice = async (
  userId: string,
  invoiceData: {
    client_id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    subtotal: number;
    discount_percent: number;
    discount_amount: number;
    tax_percent: number;
    tax_amount: number;
    total_amount: number;
    notes?: string;
    terms?: string;
    template_id: string;
    status?: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  },
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>
) => {
  try {
    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        ...invoiceData,
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    if (invoice && items.length > 0) {
      const itemsWithInvoiceId = items.map((item) => ({
        invoice_id: invoice.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId);

      if (itemsError) throw itemsError;
    }

    return { data: invoice, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateInvoice = async (invoiceId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteInvoice = async (invoiceId: string) => {
  try {
    // Delete invoice items first
    await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);

    // Delete invoice
    const { error } = await supabase.from('invoices').delete().eq('id', invoiceId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// ============ INVOICE ITEMS ============

export const getInvoiceItems = async (invoiceId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const updateInvoiceItem = async (itemId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('invoice_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// ============ PAYMENTS ============

export const getPayments = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*, invoices(invoice_number, total_amount, clients(name))')
      .eq('user_id', userId)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createPayment = async (
  userId: string,
  paymentData: {
    invoice_id: string;
    amount: number;
    payment_date: string;
    payment_method: 'bank_transfer' | 'credit_card' | 'cash' | 'check' | 'other';
    status: 'completed' | 'pending' | 'failed';
    reference_number?: string;
    notes?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        ...paymentData,
      })
      .select()
      .single();

    if (error) throw error;

    // Update invoice status to paid if amount covers total
    if (paymentData.status === 'completed') {
      await updateInvoiceStatus(paymentData.invoice_id);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updatePayment = async (paymentId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// ============ TEMPLATES ============

export const getTemplates = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createTemplate = async (
  userId: string,
  templateData: {
    name: string;
    description: string;
    layout: 'classic' | 'modern' | 'minimal';
    primary_color: string;
    tertiary_color?: string;
    include_notes: boolean;
    include_terms: boolean;
    custom_css?: string;
    is_default: boolean;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('invoice_templates')
      .insert({
        user_id: userId,
        ...templateData,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateTemplate = async (templateId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('invoice_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteTemplate = async (templateId: string) => {
  try {
    const { error } = await supabase.from('invoice_templates').delete().eq('id', templateId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// ============ DASHBOARD STATS ============

export const getDashboardStats = async (userId: string) => {
  try {
    // Get invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('status, total_amount, due_date')
      .eq('user_id', userId);

    // Get payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('user_id', userId);

    if (!invoices) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate stats
    const totalOutstanding = invoices
      .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

    const overdue = invoices
      .filter(
        (inv) =>
          inv.status !== 'paid' &&
          inv.due_date &&
          new Date(inv.due_date) < now
      )
      .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

    const paidThisMonth = payments
      ?.filter((p: any) => {
        const paymentDate = new Date(p.payment_date || '');
        return (
          p.status === 'completed' &&
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, p: any) => sum + (p.amount || 0), 0) || 0;

    return {
      totalOutstanding,
      overdue,
      paidThisMonth,
      invoiceCount: invoices.length,
      overdueCount: invoices.filter(
        (inv) =>
          inv.status !== 'paid' &&
          inv.due_date &&
          new Date(inv.due_date) < now
      ).length,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
};

// ============ ACTIVITY LOGS ============

export const createActivityLog = async (
  userId: string,
  activityData: {
    action: string;
    description: string;
    entity_type: string;
    entity_id: string;
  }
) => {
  try {
    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId,
      ...activityData,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getActivityLogs = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

// ============ HELPER FUNCTIONS ============

const updateInvoiceStatus = async (invoiceId: string) => {
  const { data: invoice } = await supabase
    .from('invoices')
    .select('total_amount')
    .eq('id', invoiceId)
    .single();

  if (!invoice) return;

  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('invoice_id', invoiceId)
    .eq('status', 'completed');

  const totalPaid = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  if (totalPaid >= invoice.total_amount) {
    await updateInvoice(invoiceId, { status: 'paid', paid_at: new Date().toISOString() });
  }
};

export const getNextInvoiceNumber = async (userId: string): Promise<string> => {
  try {
    const { data } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!data || data.length === 0) {
      return 'INV-0001';
    }

    const lastNumber = data[0].invoice_number;
    const match = lastNumber.match(/(\d+)$/);
    if (!match) return 'INV-0001';

    const nextNum = (parseInt(match[1], 10) + 1).toString().padStart(4, '0');
    return `INV-${nextNum}`;
  } catch (error) {
    return 'INV-0001';
  }
};

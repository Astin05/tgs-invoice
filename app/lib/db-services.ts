/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const updateClient = async (clientId: string, updates: Record<string, unknown>) => {
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
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        ...invoiceData,
      })
      .select()
      .single();
    if (invoiceError) throw invoiceError;
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

export const updateInvoice = async (invoiceId: string, updates: Record<string, unknown>) => {
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
    await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);
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

export const updateInvoiceItem = async (itemId: string, updates: Record<string, unknown>) => {
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
    if (paymentData.status === 'completed') {
      await updateInvoiceStatus(paymentData.invoice_id);
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updatePayment = async (paymentId: string, updates: Record<string, unknown>) => {
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

export const updateTemplate = async (templateId: string, updates: Record<string, unknown>) => {
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
    const { data: invoices } = await supabase
      .from('invoices')
      .select('status, total_amount, due_date')
      .eq('user_id', userId);
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status, payment_date')
      .eq('user_id', userId);
    if (!invoices) return null;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
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
      ?.filter((p) => {
        const paymentDate = new Date((p.payment_date as string) || '');
        return (
          p.status === 'completed' &&
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, p) => sum + ((p.amount as number) || 0), 0) || 0;
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

// ============ RECURRING INVOICES ============

export const getRecurringProfiles = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('recurring_profiles')
      .select('*, clients(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createRecurringProfile = async (
  userId: string,
  profileData: {
    client_id: string;
    profile_name: string;
    frequency: string;
    start_date: string;
    end_date?: string;
    line_items: Array<{
      name: string;
      description?: string;
      quantity: number;
      unit_price: number;
      line_total: number;
    }>;
    subtotal: number;
    tax_rate?: number;
    tax_amount?: number;
    total_amount: number;
    currency?: string;
    notes?: string;
    terms?: string;
    auto_send?: boolean;
    due_date_type?: string;
    due_date_days?: number;
    email_subject?: string;
    email_body?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('recurring_profiles')
      .insert({
        user_id: userId,
        ...profileData,
        next_billing_date: profileData.start_date,
        status: 'active',
      })
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateRecurringProfile = async (profileId: string, updates: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('recurring_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteRecurringProfile = async (profileId: string) => {
  try {
    const { error } = await supabase.from('recurring_profiles').delete().eq('id', profileId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// ============ ESTIMATES ============

export const getEstimates = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*, clients(name, email)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const getEstimateById = async (estimateId: string) => {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*, clients(*), estimate_items(*)')
      .eq('id', estimateId)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createEstimate = async (
  userId: string,
  estimateData: {
    client_id: string;
    estimate_number: string;
    issue_date: string;
    expiry_date: string;
    subtotal: number;
    discount_amount?: number;
    tax_amount?: number;
    total_amount: number;
    currency?: string;
    notes?: string;
    terms?: string;
    template_id?: string;
  },
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>
) => {
  try {
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .insert({
        user_id: userId,
        ...estimateData,
        status: 'draft',
      })
      .select()
      .single();
    if (estimateError) throw estimateError;
    if (estimate && items.length > 0) {
      const itemsWithEstimateId = items.map((item) => ({
        estimate_id: estimate.id,
        ...item,
      }));
      const { error: itemsError } = await supabase
        .from('estimate_items')
        .insert(itemsWithEstimateId);
      if (itemsError) throw itemsError;
    }
    return { data: estimate, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateEstimate = async (estimateId: string, updates: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .update(updates)
      .eq('id', estimateId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteEstimate = async (estimateId: string) => {
  try {
    await supabase.from('estimate_items').delete().eq('estimate_id', estimateId);
    const { error } = await supabase.from('estimates').delete().eq('id', estimateId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const convertEstimateToInvoice = async (estimateId: string, userId: string) => {
  try {
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*, estimate_items(*)')
      .eq('id', estimateId)
      .single();
    if (estimateError) throw estimateError;
    if (!estimate) throw new Error('Estimate not found');
    const invoiceNumber = await getNextInvoiceNumber(userId);
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        client_id: estimate.client_id,
        invoice_number: invoiceNumber,
        issue_date: issueDate,
        due_date: dueDateStr,
        status: 'draft',
        subtotal: estimate.subtotal,
        discount_amount: estimate.discount_amount || 0,
        tax_amount: estimate.tax_amount || 0,
        total_amount: estimate.total_amount,
        currency: estimate.currency || 'USD',
        notes: estimate.notes,
        terms: estimate.terms,
        template_id: estimate.template_id,
      })
      .select()
      .single();
    if (invoiceError) throw invoiceError;
    if (estimate.estimate_items && estimate.estimate_items.length > 0) {
      const itemsWithInvoiceId = estimate.estimate_items.map((item: Record<string, unknown>) => ({
        invoice_id: invoice.id,
        user_id: userId,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        item_type: 'service',
      }));
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId);
      if (itemsError) throw itemsError;
    }
    await supabase
      .from('estimates')
      .update({
        status: 'invoiced',
        invoice_id: invoice.id,
      })
      .eq('id', estimateId);
    return { data: invoice, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getNextEstimateNumber = async (userId: string): Promise<string> => {
  try {
    const { data } = await supabase
      .from('estimates')
      .select('estimate_number')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    if (!data || data.length === 0) {
      return 'EST-0001';
    }
    const lastNumber = data[0].estimate_number;
    const match = lastNumber.match(/(\d+)$/);
    if (!match) return 'EST-0001';
    const nextNum = (parseInt(match[1], 10) + 1).toString().padStart(4, '0');
    return `EST-${nextNum}`;
  } catch {
    return 'EST-0001';
  }
};

// ============ MULTI-CURRENCY ============

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', rate: 1.53 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
];

export const getCurrencies = () => CURRENCIES;

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = CURRENCIES.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = CURRENCIES.find((c) => c.code === toCurrency)?.rate || 1;
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
};

// ============ PUBLIC ACCESS ============

export const getPublicInvoiceById = async (invoiceId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(*), invoice_items(*), users(company_name, email, phone, address, city, state, zip_code, country, logo_url)')
      .eq('id', invoiceId)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

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
  } catch {
    return 'INV-0001';
  }
};

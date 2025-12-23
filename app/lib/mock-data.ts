export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  clientLogo?: string;
}

export interface ActivityItem {
  id: string;
  type: 'payment' | 'invoice_sent' | 'invoice_viewed' | 'reminder_sent' | 'invoice_created';
  description: string;
  amount?: number;
  clientName: string;
  timestamp: string;
  icon: string;
}

export interface DashboardStats {
  totalOutstanding: {
    amount: number;
    count: number;
    trend: { value: number; percentage: number; direction: 'up' | 'down' };
  };
  overdue: {
    amount: number;
    count: number;
    trend: { value: number; direction: 'up' | 'down' };
  };
  paidThisMonth: {
    amount: number;
    count: number;
    trend: { value: number; percentage: number; direction: 'up' | 'down' };
  };
  avgPaymentTime: {
    days: number;
    trend: { value: number; direction: 'down' | 'up' };
    industryAvg: number;
  };
}

export const mockStats: DashboardStats = {
  totalOutstanding: {
    amount: 24850.0,
    count: 12,
    trend: { value: 3200, percentage: 14.8, direction: 'up' },
  },
  overdue: {
    amount: 8450.0,
    count: 5,
    trend: { value: 2, direction: 'up' },
  },
  paidThisMonth: {
    amount: 42300.0,
    count: 18,
    trend: { value: 15, percentage: 15, direction: 'up' },
  },
  avgPaymentTime: {
    days: 18,
    trend: { value: -7, direction: 'down' },
    industryAvg: 30,
  },
};

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-0042',
    client: 'ACME Corporation',
    amount: 2500,
    status: 'sent',
    dueDate: '2024-12-25',
    createdDate: '2024-12-05',
  },
  {
    id: '2',
    number: 'INV-0041',
    client: 'Tech Innovations Ltd',
    amount: 3200,
    status: 'viewed',
    dueDate: '2024-12-20',
    createdDate: '2024-12-01',
  },
  {
    id: '3',
    number: 'INV-0040',
    client: 'Green Solutions',
    amount: 1850,
    status: 'paid',
    dueDate: '2024-12-10',
    createdDate: '2024-11-25',
  },
  {
    id: '4',
    number: 'INV-0039',
    client: 'BuildIt Contractors',
    amount: 4200,
    status: 'overdue',
    dueDate: '2024-11-28',
    createdDate: '2024-11-10',
  },
  {
    id: '5',
    number: 'INV-0038',
    client: 'Digital Marketing Pro',
    amount: 1500,
    status: 'overdue',
    dueDate: '2024-11-25',
    createdDate: '2024-11-08',
  },
  {
    id: '6',
    number: 'INV-0037',
    client: 'Cloud Systems Inc',
    amount: 5600,
    status: 'paid',
    dueDate: '2024-11-15',
    createdDate: '2024-10-28',
  },
  {
    id: '7',
    number: 'INV-0036',
    client: 'Design Studio',
    amount: 2200,
    status: 'draft',
    dueDate: '2025-01-05',
    createdDate: '2024-12-20',
  },
  {
    id: '8',
    number: 'INV-0035',
    client: 'Marketing Hub',
    amount: 3400,
    status: 'sent',
    dueDate: '2024-12-30',
    createdDate: '2024-12-10',
  },
  {
    id: '9',
    number: 'INV-0034',
    client: 'Enterprise Solutions',
    amount: 7200,
    status: 'overdue',
    dueDate: '2024-11-20',
    createdDate: '2024-10-25',
  },
  {
    id: '10',
    number: 'INV-0033',
    client: 'Local Retail Store',
    amount: 890,
    status: 'paid',
    dueDate: '2024-12-08',
    createdDate: '2024-11-20',
  },
];

export const mockActivityFeed: ActivityItem[] = [
  {
    id: '1',
    type: 'payment',
    description: 'Payment received from ACME Corporation',
    amount: 1500,
    clientName: 'ACME Corporation',
    timestamp: '2 hours ago',
    icon: '✓',
  },
  {
    id: '2',
    type: 'invoice_sent',
    description: 'Invoice #INV-0042 sent to Tech Innovations Ltd',
    amount: 2300,
    clientName: 'Tech Innovations Ltd',
    timestamp: '5 hours ago',
    icon: '✉️',
  },
  {
    id: '3',
    type: 'invoice_viewed',
    description: 'Green Solutions viewed Invoice #INV-0041',
    clientName: 'Green Solutions',
    timestamp: '1 day ago',
    icon: '👁️',
  },
  {
    id: '4',
    type: 'reminder_sent',
    description: 'Reminder sent for Invoice #INV-0038',
    clientName: 'Digital Marketing Pro',
    timestamp: '1 day ago',
    icon: '🔔',
  },
  {
    id: '5',
    type: 'invoice_created',
    description: 'New invoice #INV-0043 created',
    amount: 850,
    clientName: 'Your Business',
    timestamp: '2 days ago',
    icon: '📄',
  },
];

export const mockCashFlowData = [
  { date: 'Dec 22', expected: 5400, cumulative: 24850, historical: 1200 },
  { date: 'Dec 23', expected: 2100, cumulative: 27050, historical: 1200 },
  { date: 'Dec 24', expected: 0, cumulative: 27050, historical: 1200 },
  { date: 'Dec 25', expected: 3200, cumulative: 30250, historical: 1200 },
  { date: 'Dec 26', expected: 1800, cumulative: 32050, historical: 1200 },
  { date: 'Dec 27', expected: 4300, cumulative: 36350, historical: 1200 },
  { date: 'Dec 28', expected: 2900, cumulative: 39250, historical: 1200 },
  { date: 'Dec 29', expected: 1500, cumulative: 40750, historical: 1200 },
  { date: 'Dec 30', expected: 3700, cumulative: 44450, historical: 1200 },
];

export const mockClients = [
  { id: '1', name: 'ACME Corporation', outstanding: 5400, paid: 12500 },
  { id: '2', name: 'Tech Innovations Ltd', outstanding: 3200, paid: 8900 },
  { id: '3', name: 'Green Solutions', outstanding: 0, paid: 6200 },
  { id: '4', name: 'BuildIt Contractors', outstanding: 4200, paid: 3500 },
  { id: '5', name: 'Digital Marketing Pro', outstanding: 2450, paid: 4300 },
];

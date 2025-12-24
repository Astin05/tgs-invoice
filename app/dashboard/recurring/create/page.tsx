'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Send, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { getClients, getNextInvoiceNumber, createRecurringProfile } from '@/app/lib/db-services';
import Link from 'next/link';

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export default function CreateRecurringInvoicePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [clients, setClients] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    profileName: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    autoSend: true,
    dueDateType: 'net_30',
    dueDateDays: 30,
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
    emailSubject: 'Invoice #{invoice_number} from your company',
    emailBody: 'Please find attached invoice for the billing period.',
  });
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', name: 'Service Name', description: '', quantity: 1, unit_price: 0, line_total: 0 },
  ]);

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      const { data } = await getClients(user.id);
      if (data) {
        setClients(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, clientId: data[0].id }));
        }
      }
    };
    fetchClients();
  }, [user]);

  const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
  const taxRate = 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), name: '', description: '', quantity: 1, unit_price: 0, line_total: 0 },
    ]);
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value } as LineItem;
          if (field === 'quantity' || field === 'unit_price') {
            updated.line_total = updated.quantity * updated.unit_price;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (sendNow: boolean) => {
    if (!user || !formData.clientId || !formData.profileName) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const lineItemsForDb = lineItems.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      }));

      const { error } = await createRecurringProfile(user.id, {
        client_id: formData.clientId,
        profile_name: formData.profileName,
        frequency: formData.frequency,
        start_date: formData.startDate,
        end_date: formData.endDate || undefined,
        line_items: lineItemsForDb,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: total,
        currency: 'USD',
        notes: formData.notes,
        terms: formData.terms,
        auto_send: sendNow || formData.autoSend,
        due_date_type: formData.dueDateType,
        due_date_days: formData.dueDateDays,
        email_subject: formData.emailSubject,
        email_body: formData.emailBody,
      });

      if (error) throw error;

      router.push('/dashboard/recurring');
    } catch (error) {
      console.error('Error creating recurring profile:', error);
      alert('Failed to create recurring profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/recurring" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Recurring Invoices
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Recurring Invoice</h1>
        <p className="text-gray-600 mt-2">Set up automated billing for your long-term clients</p>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Name</label>
                <input
                  type="text"
                  value={formData.profileName}
                  onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
                  placeholder="e.g., Monthly Retainer - Client Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Billing Schedule */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Schedule</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly (every 2 weeks)</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semiannually">Every 6 months</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank for indefinite billing</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select
                  value={formData.dueDateType}
                  onChange={(e) => setFormData({ ...formData, dueDateType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_15">Net 15</option>
                  <option value="net_30">Net 30</option>
                  <option value="net_60">Net 60</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Invoice Items</h2>
              <button
                onClick={handleAddLineItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {lineItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => handleUpdateLineItem(item.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="w-20">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) => handleUpdateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="w-28 text-right">
                    <p className="text-sm font-semibold text-gray-900">${item.line_total.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => handleRemoveLineItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal & Calculations */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg border-t border-gray-200 pt-3">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes or special instructions..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add terms and conditions..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="lg:col-span-1">
          {/* Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase text-gray-600">Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Frequency</span>
                <span className="text-sm font-medium capitalize">{formData.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Start Date</span>
                <span className="text-sm font-medium">{formData.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto-send</span>
                <span className="text-sm font-medium">{formData.autoSend ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6 mb-6">
            <p className="text-sm text-blue-600 mb-2">Total Per Invoice</p>
            <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save & Generate First Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

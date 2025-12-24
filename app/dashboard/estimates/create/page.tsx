'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Send, Eye, FileText, ArrowLeft, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { getClients, getNextEstimateNumber, createEstimate, convertEstimateToInvoice } from '@/app/lib/db-services';
import Link from 'next/link';

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export default function CreateEstimatePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [clients, setClients] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    estimateNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date.toISOString().split('T')[0];
    })(),
    discount: 0,
    tax: 0,
    notes: '',
    terms: 'This estimate is valid for 30 days from the date of issue. Payment terms: 50% deposit required to start work.',
    templateId: '',
    currency: 'USD',
  });
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', name: 'Service or Product', description: '', quantity: 1, unit_price: 0, line_total: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch clients
      const { data: clientsData } = await getClients(user.id);
      if (clientsData) {
        setClients(clientsData);
        if (clientsData.length > 0) {
          setFormData(prev => ({ ...prev, clientId: clientsData[0].id }));
        }
      }
      
      // Get next estimate number
      const nextNumber = await getNextEstimateNumber(user.id);
      setFormData(prev => ({ ...prev, estimateNumber: nextNumber }));
    };
    
    fetchData();
  }, [user]);

  const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
  const discountAmount = (subtotal * formData.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * formData.tax) / 100;
  const total = taxableAmount + taxAmount;

  const selectedClient = clients.find(c => c.id === formData.clientId);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency,
    }).format(amount);
  };

  const handleSubmit = async (sendNow: boolean) => {
    if (!user || !formData.clientId) {
      alert('Please select a client');
      return;
    }

    setSaving(true);
    try {
      const itemsForDb = lineItems.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      }));

      const { error } = await createEstimate(user.id, {
        client_id: formData.clientId,
        estimate_number: formData.estimateNumber,
        issue_date: formData.issueDate,
        expiry_date: formData.expiryDate,
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total_amount: total,
        currency: formData.currency,
        notes: formData.notes,
        terms: formData.terms,
        template_id: formData.templateId || undefined,
      }, itemsForDb);

      if (error) throw error;

      router.push('/dashboard/estimates');
    } catch (error) {
      console.error('Error creating estimate:', error);
      alert('Failed to create estimate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/estimates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Estimates
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Estimate</h1>
        <p className="text-gray-600 mt-2">Create a professional quote for your client</p>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Estimate Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimate Number</label>
                <input
                  type="text"
                  value={formData.estimateNumber}
                  onChange={(e) => setFormData({ ...formData, estimateNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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

              {selectedClient && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Email: {selectedClient.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Estimate Items</h2>
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
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.line_total)}</p>
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
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-600">Discount (%):</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm font-semibold">{formatCurrency(discountAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-600">Tax (%):</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.tax}
                        onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm font-semibold">{formatCurrency(taxAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg border-t border-gray-200 pt-3">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
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

        {/* Right Column - Preview & Actions */}
        <div className="lg:col-span-1">
          {/* Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase text-gray-600">Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimate #</span>
                <span className="text-sm font-medium">{formData.estimateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Issue Date</span>
                <span className="text-sm font-medium">{formData.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expiry Date</span>
                <span className="text-sm font-medium">{formData.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Items</span>
                <span className="text-sm font-medium">{lineItems.length}</span>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="rounded-lg border-2 p-6 mb-6" style={{ borderColor: '#2563EB' }}>
            <p className="text-sm text-gray-600 mb-2">Total Amount</p>
            <p className="text-3xl font-bold" style={{ color: '#2563EB' }}>{formatCurrency(total)}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <Eye className="w-4 h-4" />
              Preview Estimate
            </button>
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
              {saving ? 'Saving...' : 'Save & Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Estimate Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-600 hover:text-gray-900">
                ✕
              </button>
            </div>
            <div className="p-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">ESTIMATE</p>
                    <p className="text-sm text-gray-600 mt-2">{formData.estimateNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date: {formData.issueDate}</p>
                    <p className="text-sm text-gray-600">Valid Until: {formData.expiryDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">From</p>
                    <p className="font-semibold text-gray-900">Your Company</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">To</p>
                    <p className="font-semibold text-gray-900">{selectedClient?.name || 'Client Name'}</p>
                    <p className="text-sm text-gray-600">{selectedClient?.email}</p>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-gray-200 py-4 mb-8">
                  {lineItems.map((item) => (
                    <div key={item.id} className="flex justify-between mb-2 text-sm">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.description && <p className="text-gray-500 text-xs">{item.description}</p>}
                      </div>
                      <span className="font-semibold">{formatCurrency(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {formData.discount > 0 && (
                      <div className="flex justify-between text-sm mb-2 text-green-600">
                        <span>Discount ({formData.discount}%):</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    {formData.tax > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tax:</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span style={{ color: '#2563EB' }}>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {formData.terms && (
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Terms & Conditions</p>
                    <p className="text-xs text-gray-600">{formData.terms}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

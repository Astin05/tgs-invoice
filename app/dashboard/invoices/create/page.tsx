'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Send,
  Eye,
  GripVertical,
} from 'lucide-react';
import { mockClients, mockInvoiceTemplates, mockCompanySettings, InvoiceLineItem } from '@/app/lib/mock-data';

export default function CreateInvoicePage() {
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Web Design Services', quantity: 1, unitPrice: 2500, total: 2500 },
  ]);
  const [formData, setFormData] = useState(() => {
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 30);
    
    return {
      invoiceNumber: 'INV-0044',
      clientId: mockClients[0].id,
      issueDate: now.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      templateId: mockInvoiceTemplates[0].id,
      notes: '',
      terms: 'Payment due within 30 days of invoice date.',
      discount: 0,
      tax: 0,
    };
  });

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const selectedClient = mockClients.find((c) => c.id === formData.clientId);
  const selectedTemplate = mockInvoiceTemplates.find((t) => t.id === formData.templateId);

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * formData.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * formData.tax) / 100;
  const total = taxableAmount + taxAmount;

  const handleAddLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropItem = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = lineItems.findIndex((item) => item.id === draggedItem);
    const targetIndex = lineItems.findIndex((item) => item.id === targetId);

    const newItems = [...lineItems];
    [newItems[draggedIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[draggedIndex]];

    setLineItems(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-gray-600 mt-2">Create and customize a new invoice</p>
      </div>

      {/* Main Layout - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Invoice Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <select
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {mockInvoiceTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Client Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bill To</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                {mockClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {selectedClient && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900">{selectedClient.name}</p>
                  <p className="text-sm text-gray-600 mt-2">Outstanding: {formatCurrency(selectedClient.outstanding)}</p>
                </div>
              )}
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

            {/* Line Items Table */}
            <div className="space-y-3 mb-6">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropItem(item.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                    draggedItem === item.id ? 'bg-blue-50 border-blue-400' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing" />

                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-32 text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                  </div>

                  <button
                    onClick={() => handleRemoveLineItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
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
          {/* Company Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase text-gray-600">From</h3>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">{mockCompanySettings.companyName}</p>
              <p className="text-sm text-gray-600">{mockCompanySettings.address}</p>
              <p className="text-sm text-gray-600">
                {mockCompanySettings.city}, {mockCompanySettings.state} {mockCompanySettings.zipCode}
              </p>
              <p className="text-sm text-gray-600 mt-3">{mockCompanySettings.email}</p>
              <p className="text-sm text-gray-600">{mockCompanySettings.phone}</p>
            </div>
          </div>

          {/* Total Summary */}
          <div
            className="rounded-lg border-2 p-6 mb-6"
            style={{ borderColor: selectedTemplate?.primaryColor || '#2563EB' }}
          >
            <p className="text-sm text-gray-600 mb-2">Total Amount Due</p>
            <p className="text-3xl font-bold" style={{ color: selectedTemplate?.primaryColor || '#2563EB' }}>
              {formatCurrency(total)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <Eye className="w-4 h-4" />
              Preview Invoice
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium">
              <Download className="w-4 h-4" />
              Save as Draft
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              <Send className="w-4 h-4" />
              Send Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-600 hover:text-gray-900">
                ✕
              </button>
            </div>
            <div className="p-8">
              <div style={{ borderLeft: `4px solid ${selectedTemplate?.primaryColor}` }} className="pl-6">
                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockCompanySettings.companyName}</p>
                    <p className="text-sm text-gray-600 mt-2">{mockCompanySettings.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold" style={{ color: selectedTemplate?.primaryColor }}>
                      {formData.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{formData.issueDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Bill To</p>
                    <p className="font-semibold text-gray-900">{selectedClient?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Due Date</p>
                    <p className="font-semibold text-gray-900">{formData.dueDate}</p>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-gray-200 py-4 mb-8">
                  {lineItems.map((item) => (
                    <div key={item.id} className="flex justify-between mb-2 text-sm">
                      <span>{item.description}</span>
                      <span className="font-semibold">{formatCurrency(item.total)}</span>
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
                        <span>Discount:</span>
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
                      <span style={{ color: selectedTemplate?.primaryColor }}>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {formData.terms && (
                  <div className="border-t border-gray-200 pt-6">
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

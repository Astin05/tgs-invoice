'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Send,
  Save,
  Upload,
  GripVertical,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { createInvoice, getNextInvoiceNumber } from '@/app/lib/db-services';
import { getCurrentUser, getUserProfile, type UserProfile } from '@/app/lib/auth';
import { getClients } from '@/app/lib/db-services';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  // State
  const [userId, setUserId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [companyLogo, setCompanyLogo] = useState<string>('');

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const [formData, setFormData] = useState(() => {
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 30);

    return {
      invoiceNumber: '',
      clientId: '',
      issueDate: now.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      currency: 'USD',
      notes: '',
      terms: 'Payment due within 30 days of invoice date.',
      discount: 0,
      tax: 0,
    };
  });

  // Load user data and clients
  useEffect(() => {
    const loadData = async () => {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);

        // Load user profile
        const profile = await getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
          setFormData((prev) => ({ ...prev, currency: profile.currency }));
        }

        // Load clients
        const { data: clientsData } = await getClients(user.id);
        if (clientsData) {
          setClients(clientsData as Client[]);
          if (clientsData.length > 0) {
            setFormData((prev) => ({ ...prev, clientId: clientsData[0].id }));
          }
        }

        // Get next invoice number
        const nextNumber = await getNextInvoiceNumber(user.id);
        setFormData((prev) => ({ ...prev, invoiceNumber: nextNumber }));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!loading && userId) {
      const draftData = {
        formData,
        lineItems,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`invoice-draft-${userId}`, JSON.stringify(draftData));
    }
  }, [formData, lineItems, userId, loading]);

  // Load draft on mount
  useEffect(() => {
    if (userId) {
      const draft = localStorage.getItem(`invoice-draft-${userId}`);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.formData && parsed.lineItems) {
            setFormData(parsed.formData);
            setLineItems(parsed.lineItems);
          }
        } catch (e) {
          console.error('Error loading draft:', e);
        }
      }
    }
  }, [userId]);

  const selectedClient = clients.find((c) => c.id === formData.clientId);

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * formData.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * formData.tax) / 100;
  const total = taxableAmount + taxAmount;

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value } as LineItem;
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
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency,
    }).format(amount);
  };

  const handleSaveDraft = async () => {
    if (!userId || !selectedClient) return;

    setSaving(true);
    try {
      const invoiceData = {
        client_id: formData.clientId,
        invoice_number: formData.invoiceNumber,
        issue_date: formData.issueDate,
        due_date: formData.dueDate,
        subtotal,
        discount_percent: formData.discount,
        discount_amount: discountAmount,
        tax_percent: formData.tax,
        tax_amount: taxAmount,
        total_amount: total,
        notes: formData.notes,
        terms: formData.terms,
        template_id: '00000000-0000-0000-0000-000000000001',
        status: 'draft' as const,
      };

      const items = lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
      }));

      const { data, error } = await createInvoice(userId, invoiceData, items);

      if (error) throw error;

      localStorage.removeItem(`invoice-draft-${userId}`);
      alert('Invoice saved as draft!');
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!userId || !selectedClient) return;

    setSaving(true);
    try {
      const invoiceData = {
        client_id: formData.clientId,
        invoice_number: formData.invoiceNumber,
        issue_date: formData.issueDate,
        due_date: formData.dueDate,
        subtotal,
        discount_percent: formData.discount,
        discount_amount: discountAmount,
        tax_percent: formData.tax,
        tax_amount: taxAmount,
        total_amount: total,
        notes: formData.notes,
        terms: formData.terms,
        template_id: '00000000-0000-0000-0000-000000000001',
        status: 'sent' as const,
      };

      const items = lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
      }));

      const { data, error } = await createInvoice(userId, invoiceData, items);

      if (error) throw error;

      localStorage.removeItem(`invoice-draft-${userId}`);
      alert('Invoice sent successfully!');
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error sending invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!invoicePreviewRef.current) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(invoicePreviewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${formData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-gray-600 mt-2">Create and customize your invoice with live preview</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Invoice Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Invoice Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="INV-0001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Company Logo Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Company Logo (Optional)
            </h2>

            <div className="flex items-center gap-4">
              {companyLogo ? (
                <div className="relative">
                  <img src={companyLogo} alt="Company Logo" className="h-20 w-20 object-contain rounded border" />
                  <button
                    onClick={() => setCompanyLogo('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload logo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Client Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Bill To <span className="text-red-500">*</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              >
                <option value="">-- Select a client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {selectedClient && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-gray-900 mb-2">{selectedClient.name}</p>
                  <p className="text-sm text-gray-600">{selectedClient.email}</p>
                  {selectedClient.phone && <p className="text-sm text-gray-600">{selectedClient.phone}</p>}
                  {selectedClient.address && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedClient.address}
                      {selectedClient.city && `, ${selectedClient.city}`}
                      {selectedClient.state && `, ${selectedClient.state}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Invoice Items
              </h2>
              <button
                onClick={handleAddLineItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-gray-400 pt-2">
                    <GripVertical className="w-5 h-5" />
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-6">
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity || ''}
                        onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        min="0"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        min="0"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-full md:w-80 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-600">Discount (%):</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.discount || ''}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm font-semibold text-green-600 w-20 text-right">
                        -{formatCurrency(discountAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-600">Tax (%):</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.tax || ''}
                        onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm font-semibold text-gray-900 w-20 text-right">{formatCurrency(taxAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl border-t-2 border-gray-200 pt-4">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Additional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add any notes or special instructions..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add terms and conditions..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export PDF
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={saving || !selectedClient}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save as Draft
              </button>

              <button
                onClick={handleSendInvoice}
                disabled={saving || !selectedClient}
                className="md:col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Create & Send Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="xl:sticky xl:top-8 xl:h-fit">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-white/80 hover:text-white transition"
              >
                {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Invoice Preview */}
            {showPreview && (
              <div ref={invoicePreviewRef} className="p-8 bg-white">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {companyLogo && <img src={companyLogo} alt="Company Logo" className="h-16 mb-4" />}
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userProfile?.company_name || 'Your Company'}
                    </h1>
                    <div className="mt-2 text-sm text-gray-600">
                      {userProfile?.address && <p>{userProfile.address}</p>}
                      {userProfile?.city && (
                        <p>
                          {userProfile.city}
                          {userProfile.state && `, ${userProfile.state}`} {userProfile.zip_code}
                        </p>
                      )}
                      {userProfile?.email && <p className="mt-2">{userProfile.email}</p>}
                      {userProfile?.phone && <p>{userProfile.phone}</p>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg mb-2">
                      <span className="text-sm font-medium">INVOICE</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.invoiceNumber}</p>
                    <p className="text-sm text-gray-600 mt-1">Date: {formData.issueDate}</p>
                    <p className="text-sm text-gray-600">Due: {formData.dueDate}</p>
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Bill To:</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedClient?.name || 'Select a client'}</p>
                  {selectedClient && (
                    <>
                      <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      {selectedClient.phone && <p className="text-sm text-gray-600">{selectedClient.phone}</p>}
                      {selectedClient.address && (
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedClient.address}
                          {selectedClient.city && `, ${selectedClient.city}`}
                          {selectedClient.state && `, ${selectedClient.state}`}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Line Items Table */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-900">
                        <th className="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                        <th className="text-center py-3 text-sm font-semibold text-gray-900 w-20">Qty</th>
                        <th className="text-right py-3 text-sm font-semibold text-gray-900 w-28">Unit Price</th>
                        <th className="text-right py-3 text-sm font-semibold text-gray-900 w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3 text-sm text-gray-700">{item.description || 'Item description'}</td>
                          <td className="py-3 text-sm text-gray-700 text-center">{item.quantity}</td>
                          <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 text-sm font-semibold text-gray-900 text-right">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>

                    {formData.discount > 0 && (
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">Discount ({formData.discount}%):</span>
                        <span className="font-semibold text-green-600">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    {formData.tax > 0 && (
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">Tax ({formData.tax}%):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(taxAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-4 text-lg border-t-2 border-gray-900 mt-2">
                      <span className="font-bold text-gray-900">Total Due:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(formData.notes || formData.terms) && (
                  <div className="border-t-2 border-gray-200 pt-6 space-y-4">
                    {formData.notes && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Notes:</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.notes}</p>
                      </div>
                    )}

                    {formData.terms && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Terms & Conditions:</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.terms}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Thank you for your business! Please make payment by the due date.
                  </p>
                  {userProfile?.website && (
                    <p className="text-xs text-gray-500 mt-1">{userProfile.website}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

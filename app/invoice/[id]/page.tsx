'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublicInvoiceById } from '@/app/lib/db-services';
import { Download, CreditCard, CheckCircle } from 'lucide-react';

export default function PublicInvoicePage() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      if (!id) return;
      const { data } = await getPublicInvoiceById(id as string);
      if (data) {
        setInvoice(data);
      }
      setLoading(false);
    }
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invoice not found</h1>
          <p className="text-gray-600 mt-2">The invoice you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Status Banner */}
        {invoice.status === 'paid' && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">This invoice has been paid. Thank you!</p>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Actions Bar */}
          <div className="bg-gray-800 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
            <h1 className="text-xl font-bold">Invoice {invoice.invoice_number}</h1>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              {invoice.status !== 'paid' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition text-sm font-semibold">
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              )}
            </div>
          </div>

          <div className="p-8 sm:p-12">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{invoice.users?.company_name}</h2>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>{invoice.users?.address}</p>
                  <p>{invoice.users?.city}, {invoice.users?.state} {invoice.users?.zip_code}</p>
                  <p>{invoice.users?.country}</p>
                  <p className="pt-2">{invoice.users?.email}</p>
                </div>
              </div>
              <div className="text-sm sm:text-right text-gray-600 space-y-1">
                <p className="text-gray-900 font-bold text-lg uppercase">Invoice</p>
                <p># {invoice.invoice_number}</p>
                <p className="pt-4 font-semibold">Date Issued</p>
                <p>{new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p className="pt-2 font-semibold">Due Date</p>
                <p>{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Billing Info */}
            <div className="mb-12">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Bill To</p>
              <h3 className="text-lg font-bold text-gray-900">{invoice.clients?.name}</h3>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>{invoice.clients?.address}</p>
                <p>{invoice.clients?.city}, {invoice.clients?.state} {invoice.clients?.zip_code}</p>
                <p>{invoice.clients?.email}</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 text-sm font-bold text-gray-900 uppercase">Description</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-900 uppercase text-center">Qty</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-900 uppercase text-right">Unit Price</th>
                    <th className="py-4 text-sm font-bold text-gray-900 uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {invoice.invoice_items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                      </td>
                      <td className="py-4 px-4 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-right">${parseFloat(item.unit_price).toFixed(2)}</td>
                      <td className="py-4 text-right font-semibold">${parseFloat(item.line_total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-12">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
                </div>
                {parseFloat(invoice.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${parseFloat(invoice.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                {parseFloat(invoice.tax_amount) > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>+${parseFloat(invoice.tax_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-gray-100 text-xl font-bold text-gray-900">
                  <span>Total Due</span>
                  <span>${parseFloat(invoice.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
              <div>
                <p className="text-sm font-bold text-gray-900 uppercase mb-2">Notes</p>
                <p className="text-sm text-gray-600">{invoice.notes || 'No notes provided.'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 uppercase mb-2">Terms & Conditions</p>
                <p className="text-sm text-gray-600">{invoice.terms || 'Please pay within terms.'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-8">
          Powered by InvoiceFlow - Professional Invoice Management
        </p>
      </div>
    </div>
  );
}

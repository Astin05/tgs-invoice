'use client';

import React, { useState } from 'react';
import { MoreVertical, ArrowRight } from 'lucide-react';
import { Invoice } from '@/app/lib/mock-data';

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const getStatusColor = (status: Invoice['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      viewed: 'bg-purple-100 text-purple-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-200 text-gray-700',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Invoice['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const recentInvoices = invoices.slice(0, 10);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <p className="text-sm text-gray-600 mt-1">Latest invoice activity</p>
        </div>
        <a href="/dashboard/invoices" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          View all invoices <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentInvoices.map((invoice, index) => (
              <tr
                key={invoice.id}
                className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                  {invoice.number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.client}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenu(openMenu === invoice.id ? null : invoice.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    {openMenu === invoice.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          View invoice
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          Send reminder
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          Mark as paid
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          Download PDF
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 border-t border-gray-200">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State Message */}
      {recentInvoices.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-600 mb-4">No invoices yet</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Create your first invoice
          </button>
        </div>
      )}
    </div>
  );
}

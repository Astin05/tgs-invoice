'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Filter } from 'lucide-react';

const mockPayments = [
  {
    id: '1',
    date: '2024-12-23',
    client: 'ACME Corporation',
    amount: 2500,
    invoiceNumber: 'INV-0042',
    method: 'Bank Transfer',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-12-22',
    client: 'Tech Innovations Ltd',
    amount: 3200,
    invoiceNumber: 'INV-0041',
    method: 'Credit Card',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-12-21',
    client: 'Green Solutions',
    amount: 1850,
    invoiceNumber: 'INV-0040',
    method: 'Bank Transfer',
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-12-20',
    client: 'Cloud Systems Inc',
    amount: 5600,
    invoiceNumber: 'INV-0037',
    method: 'Bank Transfer',
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-12-19',
    client: 'Local Retail Store',
    amount: 890,
    invoiceNumber: 'INV-0033',
    method: 'Cash',
    status: 'completed',
  },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalAmount = mockPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Track and manage all received payments</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <Plus className="w-5 h-5" />
          Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Payments (This Month)</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-gray-600 mt-2">{mockPayments.length} transactions</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Average Payment</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount / mockPayments.length)}</p>
          <p className="text-xs text-gray-600 mt-2">Per transaction</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-gray-900">$12,450</p>
          <p className="text-xs text-gray-600 mt-2">3 invoices</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['all', 'completed', 'pending', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{payment.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.client}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">{payment.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

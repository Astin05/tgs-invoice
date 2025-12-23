'use client';

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { mockClients, mockInvoices } from '@/app/lib/mock-data';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientStats = (clientName: string) => {
    const clientInvoices = mockInvoices.filter((inv) => inv.client === clientName);
    return {
      totalInvoices: clientInvoices.length,
      totalAmount: clientInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    };
  };

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Manage your clients and their payment history</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Clients</p>
          <p className="text-3xl font-bold text-gray-900">{mockClients.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Outstanding</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(mockClients.reduce((sum, c) => sum + c.outstanding, 0))}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Paid</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(mockClients.reduce((sum, c) => sum + c.paid, 0))}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => {
          const stats = getClientStats(client.name);
          return (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
            >
              {/* Client Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${['bg-blue-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600', 'bg-green-600'][idx % 5]}`}
                >
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-xs text-gray-600">{stats.totalInvoices} invoices</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className={`font-bold ${client.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(client.outstanding)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="font-bold text-gray-900">{formatCurrency(client.paid)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No clients found</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Add first client
          </button>
        </div>
      )}
    </div>
  );
}

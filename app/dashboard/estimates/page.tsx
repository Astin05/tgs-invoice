'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, FileText } from 'lucide-react';

export default function EstimatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for estimates
  const estimates = [
    { id: '1', number: 'EST-001', client: 'Acme Corp', amount: 5000, status: 'sent', date: '2024-12-20' },
    { id: '2', number: 'EST-002', client: 'TechStart', amount: 3500, status: 'accepted', date: '2024-12-21' },
    { id: '3', number: 'EST-003', client: 'Global Shop', amount: 1200, status: 'draft', date: '2024-12-22' },
    { id: '4', number: 'EST-004', client: 'Creative Studio', amount: 8000, status: 'declined', date: '2024-12-18' },
  ];

  const filteredEstimates = estimates.filter(est => {
    const matchesSearch = est.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         est.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || est.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimates & Quotes</h1>
          <p className="text-gray-600 mt-2">Create professional proposals and track their progress</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          New Estimate
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Open Estimates</p>
          <h3 className="text-2xl font-bold text-gray-900">12</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Accepted Value</p>
          <h3 className="text-2xl font-bold text-emerald-600">$45,200</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-blue-600">68%</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
          <h3 className="text-2xl font-bold text-orange-600">$18,400</h3>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search estimates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Estimate #</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Client</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEstimates.map((est) => (
              <tr key={est.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{est.number}</td>
                <td className="px-6 py-4 text-gray-600">{est.client}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">${est.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(est.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(est.status)}`}>
                    {est.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {est.status === 'accepted' && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Convert to Invoice">
                        <FileText className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Edit">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

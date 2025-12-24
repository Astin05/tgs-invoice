'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, FileText, Check, X, Eye, Trash2, Send } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { getEstimates, updateEstimate, deleteEstimate, convertEstimateToInvoice } from '@/app/lib/db-services';
import Link from 'next/link';
import { formatCurrency } from '@/app/lib/db-services';

export default function EstimatesPage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchEstimates = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await getEstimates(user.id);
    if (data) {
      setEstimates(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  const handleStatusChange = async (estimateId: string, newStatus: string) => {
    const { error } = await updateEstimate(estimateId, { status: newStatus });
    if (!error) {
      setEstimates(estimates.map(e => e.id === estimateId ? { ...e, status: newStatus } : e));
    }
  };

  const handleDeleteEstimate = async (estimateId: string) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      const { error } = await deleteEstimate(estimateId);
      if (!error) {
        setEstimates(estimates.filter(e => e.id !== estimateId));
      }
    }
  };

  const handleConvertToInvoice = async (estimateId: string) => {
    if (!user) return;
    if (window.confirm('Convert this estimate to an invoice?')) {
      const { error } = await convertEstimateToInvoice(estimateId, user.id);
      if (!error) {
        await updateEstimate(estimateId, { status: 'invoiced' });
        setEstimates(estimates.map(e => 
          e.id === estimateId ? { ...e, status: 'invoiced' } : e
        ));
        alert('Estimate converted to invoice successfully!');
      } else {
        alert('Failed to convert estimate');
      }
    }
  };

  const filteredEstimates = estimates.filter(est => {
    const matchesSearch = est.estimate_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         est.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || est.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'viewed': return 'bg-purple-100 text-purple-700';
      case 'invoiced': return 'bg-gray-100 text-gray-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    open: estimates.filter(e => ['sent', 'viewed', 'draft'].includes(e.status)).length,
    accepted: estimates.filter(e => e.status === 'accepted').length,
    totalValue: estimates.filter(e => ['sent', 'viewed', 'accepted', 'draft'].includes(e.status))
      .reduce((sum, e) => sum + (e.total_amount || 0), 0),
    pending: estimates.filter(e => ['sent', 'viewed'].includes(e.status))
      .reduce((sum, e) => sum + (e.total_amount || 0), 0),
  };

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimates & Quotes</h1>
          <p className="text-gray-600 mt-2">Create professional proposals and track their progress</p>
        </div>
        <Link 
          href="/dashboard/estimates/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Estimate
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Open Estimates</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.open}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Accepted Value</p>
          <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.accepted)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Pending Value</p>
          <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pending)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Open Value</p>
          <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalValue)}</h3>
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
              <option value="viewed">Viewed</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="invoiced">Invoiced</option>
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
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Expiry</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading estimates...</td>
              </tr>
            ) : filteredEstimates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No estimates found.</td>
              </tr>
            ) : (
              filteredEstimates.map((est) => (
                <tr key={est.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{est.estimate_number}</td>
                  <td className="px-6 py-4 text-gray-600">{est.clients?.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(est.total_amount)}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(est.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(est.expiry_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(est.status)}`}>
                      {est.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {est.status === 'accepted' && (
                        <button 
                          onClick={() => handleConvertToInvoice(est.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" 
                          title="Convert to Invoice"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      )}
                      {(est.status === 'draft' || est.status === 'sent') && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(est.id, 'sent')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                            title="Send Estimate"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                          {est.status === 'sent' && (
                            <button 
                              onClick={() => handleStatusChange(est.id, 'accepted')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" 
                              title="Mark as Accepted"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {est.status === 'sent' && (
                            <button 
                              onClick={() => handleStatusChange(est.id, 'declined')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                              title="Mark as Declined"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteEstimate(est.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

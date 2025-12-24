'use client';

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/app/contexts/PortalContext';
import { verifyPortalSession, getClientEstimates } from '@/app/lib/db-services';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/app/lib/db-services';
import {
  FileText,
  ChevronLeft,
  Calendar,
  DollarSign,
  Loader2,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function PortalEstimatesPage() {
  const { sessionToken } = usePortal();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [estimates, setEstimates] = useState<Record<string, unknown>[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadEstimates = async () => {
    if (!sessionToken) return;

    const { data: sessionData } = await verifyPortalSession(sessionToken);
    if (!sessionData) {
      router.push('/portal');
      return;
    }

    const { data } = await getClientEstimates(sessionData.client_id, statusFilter);
    setEstimates(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!sessionToken) {
      router.push('/portal');
      return;
    }
    loadEstimates();
  }, [sessionToken, statusFilter]);

  const handleAcceptEstimate = async (estimateId: string) => {
    if (!window.confirm('Are you sure you want to accept this estimate?')) return;

    const response = await fetch(`/api/portal/estimates/${estimateId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Estimate accepted successfully!');
      loadEstimates();
    } else {
      alert('Failed to accept estimate');
    }
  };

  const handleDeclineEstimate = async (estimateId: string) => {
    const reason = prompt('Please provide a reason for declining:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/portal/estimates/${estimateId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        alert('Estimate declined.');
        loadEstimates();
      } else {
        alert('Failed to decline estimate');
      }
    } catch {
      alert('An error occurred');
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/portal/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Estimates</h1>
            <p className="text-sm text-gray-600">
              Review and accept or decline estimates
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Estimates</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        {/* Estimates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : estimates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No estimates found
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all'
                ? "You don't have any estimates yet."
                : `No estimates with status "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {estimates.map((estimate) => (
              <div
                key={estimate.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {estimate.estimate_number}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created: {new Date(estimate.issue_date).toLocaleDateString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        Expires: {new Date(estimate.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(
                      estimate.status
                    )}`}
                  >
                    {getStatusIcon(estimate.status)}
                    {estimate.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {formatCurrency(estimate.total_amount || 0)}
                    </span>
                  </div>
                </div>

                {estimate.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{estimate.notes}</p>
                  </div>
                )}

                {estimate.status === 'sent' || estimate.status === 'viewed' ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptEstimate(estimate.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Accept Estimate
                    </button>
                    <button
                      onClick={() => handleDeclineEstimate(estimate.id)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Decline
                    </button>
                  </div>
                ) : estimate.status === 'accepted' ? (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ This estimate has been accepted and will be converted to an invoice.
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

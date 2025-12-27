'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePortal } from '@/app/contexts/PortalContext';
import { verifyPortalSession, getPortalDashboardData } from '@/app/lib/db-services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  DollarSign,
  TrendingUp,
  LogOut,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ClientData {
  name: string;
  email?: string;
  [key: string]: unknown;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  issue_date: string;
  total_amount: number;
  status: string;
  [key: string]: unknown;
}

interface EstimateData {
  id: string;
  estimate_number: string;
  issue_date: string;
  expiry_date: string;
  total_amount: number;
  status: string;
  [key: string]: unknown;
}

export default function PortalDashboardPage() {
  const { sessionToken, logout } = usePortal();
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!sessionToken) return;

    const { data: sessionData } = await verifyPortalSession(sessionToken);
    if (!sessionData) {
      logout();
      router.push('/portal');
      return;
    }

    setClient(sessionData.clients as ClientData);

    const { data } = await getPortalDashboardData(sessionData.client_id as string);
    setDashboardData(data);
    setLoading(false);
  }, [sessionToken, logout, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/portal');
  }, [logout, router]);

  useEffect(() => {
    if (!sessionToken) {
      router.push('/portal');
      return;
    }
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const invoices = (dashboardData?.invoices as InvoiceData[]) || [];
  const estimates = (dashboardData?.estimates as EstimateData[]) || [];
  const payments = (dashboardData?.payments as Record<string, unknown>[]) || [];

  const outstandingInvoices = invoices.filter(
    (inv) => {
      return inv.status !== 'paid' && inv.status !== 'cancelled';
    }
  );
  const overdueInvoices = invoices.filter((inv) => {
    if (inv.status === 'paid' || inv.status === 'cancelled') return false;
    return new Date(inv.issue_date) < new Date();
  });

  const totalOutstanding = outstandingInvoices.reduce(
    (sum: number, inv: InvoiceData) => sum + (inv.total_amount || 0),
    0
  );
  const totalOverdue = overdueInvoices.reduce(
    (sum: number, inv: InvoiceData) => sum + (inv.total_amount || 0),
    0
  );

  const paidThisMonth = payments
    .filter((p) => {
      const payment = p as Record<string, unknown>;
      const status = payment.status as string;
      const paymentDate = new Date(payment.payment_date as string);
      const now = new Date();
      return (
        status === 'completed' &&
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum: number, p: Record<string, unknown>) => sum + ((p.amount as number) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-sm text-gray-600">
                Welcome, {client?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${totalOutstanding.toFixed(2)}
                </h3>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid This Month</p>
                <h3 className="text-2xl font-bold text-green-600">
                  ${paidThisMonth.toFixed(2)}
                </h3>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <h3 className="text-2xl font-bold text-red-600">
                  ${totalOverdue.toFixed(2)}
                </h3>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Open Invoices</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {outstandingInvoices.length}
                </h3>
              </div>
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Invoices
              </h2>
              <Link
                href="/portal/invoices"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6">
              {invoices.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No invoices yet</p>
              ) : (
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice: InvoiceData) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(invoice.total_amount || 0).toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Estimates */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Estimates
              </h2>
              <Link
                href="/portal/estimates"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6">
              {estimates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No pending estimates
                </p>
              ) : (
                <div className="space-y-4">
                  {estimates.slice(0, 5).map((estimate: EstimateData) => (
                    <div
                      key={estimate.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {estimate.estimate_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires: {new Date(estimate.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(estimate.total_amount || 0).toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            estimate.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : estimate.status === 'declined'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {estimate.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { KPICards } from '@/app/components/dashboard/KPICards';
import { CashFlowChart } from '@/app/components/dashboard/CashFlowChart';
import { Alerts } from '@/app/components/dashboard/Alerts';
import { RecentInvoices } from '@/app/components/dashboard/RecentInvoices';
import { ActivityFeed } from '@/app/components/dashboard/ActivityFeed';
import { mockStats, mockInvoices, mockActivityFeed, mockCashFlowData } from '@/app/lib/mock-data';
import { useDashboardStore } from '@/app/lib/store';

export default function Dashboard() {
  const dateRange = useDashboardStore((state) => state.dateRange);
  const setDateRange = useDashboardStore((state) => state.setDateRange);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  const dateRangeOptions: Array<{ value: typeof dateRange; label: string }> = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
    { value: 'thisYear', label: 'This year' },
  ];

  const currentDateRangeLabel = dateRangeOptions.find((opt) => opt.value === dateRange)?.label || 'Last 30 days';

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, John! Here's your business overview.</p>
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            {currentDateRangeLabel}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDateRangeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDateRangeOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setDateRange(option.value);
                    setIsDateRangeOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${
                    dateRange === option.value
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <Alerts />

      {/* KPI Cards */}
      <section className="mb-8">
        <KPICards stats={mockStats} />
      </section>

      {/* Cash Flow Chart */}
      <section className="mb-8">
        <CashFlowChart data={mockCashFlowData} />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Invoices (2/3 width) */}
        <div className="lg:col-span-2">
          <RecentInvoices invoices={mockInvoices} />
        </div>

        {/* Right Column - Activity Feed & Stats (1/3 width) */}
        <div className="space-y-8">
          <ActivityFeed activities={mockActivityFeed} />

          {/* Quick Stats Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Due Dates</h3>
            <div className="space-y-3">
              {mockInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.client}</p>
                    <p className="text-xs text-gray-500">{invoice.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs font-medium ${invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                      {invoice.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clients</h3>
            <div className="space-y-3">
              {[
                { name: 'ACME Corporation', balance: 5400 },
                { name: 'Tech Innovations', balance: 3200 },
                { name: 'BuildIt Contractors', balance: 4200 },
                { name: 'Digital Marketing Pro', balance: 2450 },
                { name: 'Cloud Systems Inc', balance: 0 },
              ].map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${['bg-blue-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600', 'bg-green-600'][idx]}`}>
                      {client.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-900">{client.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {client.balance > 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                        ${client.balance.toLocaleString()}
                      </span>
                    )}
                    {client.balance === 0 && (
                      <span className="text-xs text-green-600 font-semibold">Paid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

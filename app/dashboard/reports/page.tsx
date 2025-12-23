'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 12500, target: 15000 },
  { month: 'Feb', revenue: 19200, target: 15000 },
  { month: 'Mar', revenue: 8900, target: 15000 },
  { month: 'Apr', revenue: 22100, target: 15000 },
  { month: 'May', revenue: 16700, target: 15000 },
  { month: 'Jun', revenue: 28400, target: 15000 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 45, fill: '#10B981' },
  { name: 'Overdue', value: 12, fill: '#EF4444' },
  { name: 'Pending', value: 28, fill: '#3B82F6' },
  { name: 'Draft', value: 15, fill: '#9CA3AF' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('revenue');

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">View detailed insights and analytics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="mb-8 flex gap-2 border-b border-gray-200">
        {['revenue', 'aging', 'tax', 'custom'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              reportType === type
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {type === 'revenue' && 'Revenue Report'}
            {type === 'aging' && 'Aging Report'}
            {type === 'tax' && 'Tax Summary'}
            {type === 'custom' && 'Custom Reports'}
          </button>
        ))}
      </div>

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-8">
          {/* Chart 1 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#2563EB" name="Actual Revenue" />
                <Bar dataKey="target" fill="#10B981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Invoice Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Total Revenue (6 months)</p>
              <p className="text-3xl font-bold text-gray-900">$107,900</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Average Monthly</p>
              <p className="text-3xl font-bold text-gray-900">$17,983</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Growth vs Last 6mo</p>
              <p className="text-3xl font-bold text-green-600">+24%</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Highest Month</p>
              <p className="text-3xl font-bold text-gray-900">$28,400</p>
            </div>
          </div>
        </div>
      )}

      {/* Aging Report */}
      {reportType === 'aging' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-sm text-red-600 font-medium mb-2">Over 90 days</p>
              <p className="text-3xl font-bold text-red-700">$2,450</p>
              <p className="text-xs text-red-600 mt-2">2 invoices</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-sm text-orange-600 font-medium mb-2">60-90 days</p>
              <p className="text-3xl font-bold text-orange-700">$4,200</p>
              <p className="text-xs text-orange-600 mt-2">1 invoice</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-sm text-yellow-600 font-medium mb-2">30-60 days</p>
              <p className="text-3xl font-bold text-yellow-700">$1,800</p>
              <p className="text-xs text-yellow-600 mt-2">3 invoices</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-green-600 font-medium mb-2">0-30 days</p>
              <p className="text-3xl font-bold text-green-700">$16,000</p>
              <p className="text-xs text-green-600 mt-2">5 invoices</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Aging Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Age Range</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Invoices</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">0-30 days</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">$16,000</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">57%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">30-60 days</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">$1,800</td>
                    <td className="px-6 py-4 text-sm text-gray-600">3</td>
                    <td className="px-6 py-4 text-sm text-gray-600">21%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">60-90 days</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">$4,200</td>
                    <td className="px-6 py-4 text-sm text-gray-600">1</td>
                    <td className="px-6 py-4 text-sm text-gray-600">15%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Over 90 days</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">$2,450</td>
                    <td className="px-6 py-4 text-sm text-gray-600">2</td>
                    <td className="px-6 py-4 text-sm text-gray-600">9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Other report types placeholder */}
      {(reportType === 'tax' || reportType === 'custom') && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">
            {reportType === 'tax' && 'Tax summary report will be available here'}
            {reportType === 'custom' && 'Create custom reports based on your specific needs'}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Expand } from 'lucide-react';

interface CashFlowData {
  date: string;
  expected: number;
  cumulative: number;
  historical: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const [period, setPeriod] = useState<'30' | '60' | '90'>('30');

  const filterData = (days: string) => {
    const numDays = parseInt(days);
    return data.slice(0, numDays);
  };

  const filteredData = filterData(period);

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cash Flow Forecast</h3>
          <p className="text-sm text-gray-600 mt-1">Expected payments next 90 days</p>
        </div>
        <div className="flex items-center gap-2">
          {(['30', '60', '90'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                period === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {days}d
            </button>
          ))}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Expand className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={filteredData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            iconType="square"
          />
          <Bar
            dataKey="expected"
            fill="#2563EB"
            name="Expected Payments"
            radius={[8, 8, 0, 0]}
            opacity={0.8}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#10B981"
            name="Cumulative Forecast"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#F59E0B"
            name="Historical Average"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <span className="font-medium">Insight:</span> Your expected payments exceed your historical average by 35%, indicating strong cash flow ahead.
        </p>
      </div>
    </div>
  );
}

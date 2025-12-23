'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardStats } from '@/app/lib/mock-data';

interface KPICardsProps {
  stats: DashboardStats;
}

export function KPICards({ stats }: KPICardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(stats.totalOutstanding.amount),
      subtext: `From ${stats.totalOutstanding.count} invoices`,
      icon: '💰',
      bgColor: 'bg-blue-50',
      trend: stats.totalOutstanding.trend,
      trendColor: 'text-green-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Overdue',
      value: formatCurrency(stats.overdue.amount),
      subtext: `${stats.overdue.count} invoices`,
      icon: '⚠️',
      bgColor: 'bg-red-50',
      trend: stats.overdue.trend,
      trendColor: 'text-red-600',
      borderColor: 'border-red-200',
      action: 'Send Reminders',
    },
    {
      title: 'Paid This Month',
      value: formatCurrency(stats.paidThisMonth.amount),
      subtext: `${stats.paidThisMonth.count} payments`,
      icon: '✓',
      bgColor: 'bg-green-50',
      trend: stats.paidThisMonth.trend,
      trendColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Avg Payment Time',
      value: `${stats.avgPaymentTime.days} days`,
      subtext: `${Math.abs(stats.avgPaymentTime.trend.value)} days faster than avg`,
      icon: '🕐',
      bgColor: 'bg-purple-50',
      trend: stats.avgPaymentTime.trend,
      trendColor: 'text-green-600',
      borderColor: 'border-purple-200',
      progress: (stats.avgPaymentTime.days / stats.avgPaymentTime.industryAvg) * 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} border ${card.borderColor} rounded-xl p-6 hover:shadow-lg transition-shadow`}
        >
          {/* Icon */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{card.icon}</span>
            {card.action && <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">Action</span>}
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>

          {/* Value */}
          <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>

          {/* Subtext */}
          <p className="text-sm text-gray-600 mb-4">{card.subtext}</p>

          {/* Trend */}
          {card.trend && (
            <div className={`flex items-center gap-1 ${card.trendColor} text-sm font-medium`}>
              {card.trend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {card.trend.direction === 'up' ? '+' : '-'}
                {Math.abs(card.trend.value)}
                {'percentage' in card.trend ? `% vs last month` : ` invoices`}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {card.progress !== undefined && (
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Compared to {stats.avgPaymentTime.industryAvg} day industry avg</p>
            </div>
          )}

          {/* Action Button */}
          {card.action && (
            <button className="mt-4 w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
              {card.action}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

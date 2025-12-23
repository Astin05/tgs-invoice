'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ActivityItem } from '@/app/lib/mock-data';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityColor = (type: ActivityItem['type']) => {
    const colors = {
      payment: 'bg-green-100 text-green-700',
      invoice_sent: 'bg-blue-100 text-blue-700',
      invoice_viewed: 'bg-purple-100 text-purple-700',
      reminder_sent: 'bg-orange-100 text-orange-700',
      invoice_created: 'bg-gray-100 text-gray-700',
    };
    return colors[type];
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const recentActivities = activities.slice(0, 8);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
        </div>
        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          View all <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Activity Items */}
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline Line */}
            {index !== recentActivities.length - 1 && (
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
                  {activity.icon}
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-200 top-10"></div>
              </div>
            )}
            {index === recentActivities.length - 1 && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${getActivityColor(activity.type)}`}>
                {activity.icon}
              </div>
            )}

            {/* Activity Content */}
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              {activity.amount && (
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {formatCurrency(activity.amount)}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">{activity.clientName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {recentActivities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No recent activity</p>
        </div>
      )}
    </div>
  );
}

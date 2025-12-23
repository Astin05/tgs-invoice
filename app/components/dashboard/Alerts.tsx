'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

interface AlertsProps {
  alerts?: Alert[];
}

export function Alerts({ alerts = [] }: AlertsProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<string[]>(
    alerts.map((a) => a.id)
  );

  if (visibleAlerts.length === 0) {
    return null;
  }

  const defaultAlerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: '5 invoices are more than 30 days overdue',
      description: 'Total of $8,450 at risk. Immediate action recommended.',
      action: { label: 'Send Reminders', onClick: () => console.log('Send reminders') },
    },
    {
      id: '2',
      type: 'warning',
      title: '3 invoices are due in the next 7 days',
      description: 'Total of $4,800 expected. Stay on top of collections.',
      action: { label: 'Review', onClick: () => console.log('Review') },
    },
  ];

  const visibleDefaultAlerts = defaultAlerts.filter((a) =>
    visibleAlerts.includes(a.id)
  );

  const allAlerts = [...visibleDefaultAlerts, ...alerts.filter((a) => visibleAlerts.includes(a.id))];

  const dismissAlert = (id: string) => {
    setVisibleAlerts(visibleAlerts.filter((aid) => aid !== id));
  };

  return (
    <div className="space-y-3 mb-6">
      {allAlerts.map((alert) => {
        const bgColor = {
          error: 'bg-red-50 border-red-200',
          warning: 'bg-yellow-50 border-yellow-200',
          info: 'bg-blue-50 border-blue-200',
        }[alert.type];

        const borderColor = {
          error: 'border-l-red-600',
          warning: 'border-l-yellow-600',
          info: 'border-l-blue-600',
        }[alert.type];

        const Icon = {
          error: AlertTriangle,
          warning: AlertCircle,
          info: Info,
        }[alert.type];

        const textColor = {
          error: 'text-red-800',
          warning: 'text-yellow-800',
          info: 'text-blue-800',
        }[alert.type];

        const buttonColor = {
          error: 'bg-red-600 hover:bg-red-700',
          warning: 'bg-yellow-600 hover:bg-yellow-700',
          info: 'bg-blue-600 hover:bg-blue-700',
        }[alert.type];

        return (
          <div
            key={alert.id}
            className={`border-l-4 ${borderColor} ${bgColor} border border-l-4 rounded-lg p-4 flex items-start gap-4 transition-all`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <Icon className={`w-5 h-5 ${textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold ${textColor}`}>{alert.title}</h4>
              <p className={`text-sm ${textColor} opacity-90 mt-1`}>{alert.description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {alert.action && (
                <button
                  onClick={alert.action.onClick}
                  className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg ${buttonColor} transition whitespace-nowrap`}
                >
                  {alert.action.label}
                </button>
              )}
              <button
                onClick={() => dismissAlert(alert.id)}
                className={`p-1 rounded-lg hover:bg-gray-300 transition ${textColor}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

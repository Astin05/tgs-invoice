'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useDashboardStore } from '@/app/lib/store';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string | null;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', href: '/dashboard' },
  { id: 'invoices', icon: FileText, label: 'Invoices', href: '/dashboard/invoices', badge: null },
  { id: 'payments', icon: DollarSign, label: 'Payments', href: '/dashboard/payments', badge: null },
  { id: 'clients', icon: Users, label: 'Clients', href: '/dashboard/clients' },
  { id: 'reports', icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const bottomItems: NavItem[] = [
  { id: 'help', icon: HelpCircle, label: 'Help & Support', href: '#' },
  { id: 'whatsnew', icon: Sparkles, label: "What's New", href: '#', badge: 'New' },
];

export function Sidebar() {
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {/* Primary Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-gray-200 px-4 py-6 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-700">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {!sidebarCollapsed && (
            <div className="mt-4 p-4 rounded-lg border border-purple-200 bg-purple-50">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  ⬆
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-900">Upgrade to Pro</p>
                  <p className="text-xs text-purple-700 mt-1">Get unlimited invoices</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 z-40">
        {navigationItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                active ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600 transition">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            +
          </div>
          <span className="text-xs font-medium">Create</span>
        </button>
      </nav>
    </>
  );
}

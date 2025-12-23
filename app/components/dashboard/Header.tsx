'use client';

import React, { useState } from 'react';
import { Menu, Search, Bell, HelpCircle, LogOut, Settings, Users, CreditCard } from 'lucide-react';
import { useDashboardStore } from '@/app/lib/store';

export function Header() {
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IF</span>
          </div>
          <span className="font-semibold text-gray-900 hidden sm:inline">InvoiceFlow</span>
        </div>

        <div className="ml-8 hidden md:block">
          <p className="text-sm text-gray-600">Dashboard</p>
        </div>
      </div>

      {/* Center Section - Global Search */}
      <div className="flex-1 max-w-xl mx-8 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Create Button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <span>+</span>
          <span>New Invoice</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg relative transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Payment received</p>
                      <p className="text-xs text-gray-500">From ACME Corp - $1,500</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>!</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Invoice overdue</p>
                      <p className="text-xs text-gray-500">INV-0039 - 5 days overdue</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center hover:bg-blue-700 transition"
          >
            JD
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
              <div className="py-2">
                <a href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Account Settings</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Billing & Plans</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Team Management</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                  <HelpCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Help & Support</span>
                </a>
              </div>
              <div className="border-t border-gray-200 p-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-red-600">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

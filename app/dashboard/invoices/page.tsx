'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { InvoicesList } from '@/app/components/dashboard/InvoicesList';
import { mockInvoices } from '@/app/lib/mock-data';

export default function InvoicesPage() {
  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage and track all your invoices</p>
        </div>
        <a href="/dashboard/invoices/create" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <Plus className="w-5 h-5" />
          Create Invoice
        </a>
      </div>

      {/* Invoices List */}
      <InvoicesList invoices={mockInvoices} />
    </div>
  );
}

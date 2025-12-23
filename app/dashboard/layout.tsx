import React from 'react';
import { Header } from '@/app/components/dashboard/Header';
import { Sidebar } from '@/app/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="pt-20 pb-20 lg:pb-8 lg:pl-60">
        {children}
      </main>
    </div>
  );
}

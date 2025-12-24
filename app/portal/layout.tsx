'use client';

import { ReactNode } from 'react';
import { PortalProvider } from '@/app/contexts/PortalContext';

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PortalProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </PortalProvider>
  );
}

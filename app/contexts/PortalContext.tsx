'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PortalClient {
  id: string;
  name: string;
  email: string;
  company_name?: string;
}

interface PortalContextType {
  client: PortalClient | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<PortalClient | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('portal_token');
    if (token) {
      setSessionToken(token);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('portal_token', token);
    setSessionToken(token);
  };

  const logout = () => {
    localStorage.removeItem('portal_token');
    setClient(null);
    setSessionToken(null);
  };

  return (
    <PortalContext.Provider
      value={{
        client,
        sessionToken,
        isAuthenticated: !!client,
        login,
        logout,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}

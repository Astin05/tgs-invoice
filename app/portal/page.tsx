'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPortalSession } from '@/app/lib/db-services';
import { usePortal } from '@/app/contexts/PortalContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

function PortalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { login } = usePortal();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');

  const handleMagicLinkLogin = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    const { data, error } = await verifyPortalSession(token);

    if (error || !data) {
      setError('Invalid or expired access link. Please request a new one.');
      setLoading(false);
      return;
    }

    login(token);
    router.push('/portal/dashboard');
  }, [token, login, router]);

  const handleRequestAccess = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/portal/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Access link sent! Check your email inbox.');
        setEmail('');
      } else {
        setError(data.error || 'Failed to send access link');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleMagicLinkLogin();
    } else {
      setLoading(false);
    }
  }, [token, handleMagicLinkLogin]);

  if (loading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              InvoiceFlow Portal
            </h1>
            <p className="text-gray-600">
              Access your invoices, estimates, and payments
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleRequestAccess}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Send Access Link
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              <p>We&apos;ll email you a secure link to access your portal.</p>
              <p className="mt-2">Link expires in 24 hours.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to InvoiceFlow
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PortalEntryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    }>
      <PortalContent />
    </Suspense>
  );
}

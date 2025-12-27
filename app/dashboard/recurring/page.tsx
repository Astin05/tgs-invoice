'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Play, Pause, Trash, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { getRecurringProfiles, updateRecurringProfile, deleteRecurringProfile } from '@/app/lib/db-services';
import Link from 'next/link';

export default function RecurringInvoicesPage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProfiles = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await getRecurringProfiles(user.id);
    if (data) {
      setProfiles(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (profileId: string, newStatus: string) => {
    const { error } = await updateRecurringProfile(profileId, { status: newStatus });
    if (!error) {
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, status: newStatus } : p));
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this recurring profile?')) {
      const { error } = await deleteRecurringProfile(profileId);
      if (!error) {
        setProfiles(profiles.filter(p => p.id !== profileId));
      }
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         profile.clients?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recurring Invoices</h1>
          <p className="text-gray-600 mt-2">Manage automated billing for your long-term clients</p>
        </div>
        <Link 
          href="/dashboard/recurring/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Recurring Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Profiles</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {profiles.filter(p => p.status === 'active').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${profiles.filter(p => p.status === 'active' && p.frequency === 'monthly').reduce((sum, p) => sum + parseFloat(p.total_amount), 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clients Billed</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {new Set(profiles.map(p => p.client_id)).size}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Run</p>
              <h3 className="text-2xl font-bold text-gray-900">Today</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by profile name or client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="ended">Ended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Profile Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Client</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Frequency</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Next Billing</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading recurring profiles...</td>
              </tr>
            ) : filteredProfiles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No recurring profiles found.</td>
              </tr>
            ) : (
              filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{profile.profile_name}</td>
                  <td className="px-6 py-4 text-gray-600">{profile.clients?.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${parseFloat(profile.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{profile.frequency}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(profile.next_billing_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      profile.status === 'active' ? 'bg-green-100 text-green-700' : 
                      profile.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {profile.status === 'active' ? (
                        <button 
                          onClick={() => handleStatusChange(profile.id, 'paused')}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" 
                          title="Pause"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(profile.id, 'active')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" 
                          title="Resume"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                        title="Delete"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

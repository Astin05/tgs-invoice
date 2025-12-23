'use client';

import React, { useState } from 'react';
import { ChevronRight, Save, Upload, Lock, Bell, Eye, Link2, LogOut } from 'lucide-react';
import { mockCompanySettings } from '@/app/lib/mock-data';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: mockCompanySettings.companyName,
    personName: mockCompanySettings.personName,
    email: mockCompanySettings.email,
    phone: mockCompanySettings.phone,
    website: mockCompanySettings.website || '',
    address: mockCompanySettings.address,
    city: mockCompanySettings.city,
    state: mockCompanySettings.state,
    zip: mockCompanySettings.zipCode,
    country: mockCompanySettings.country,
    taxId: mockCompanySettings.taxId || '',
    bankName: mockCompanySettings.bankName,
    accountNumber: mockCompanySettings.accountNumber,
    routingNumber: mockCompanySettings.routingNumber,
    accountHolderName: mockCompanySettings.accountHolderName,
    currency: mockCompanySettings.currency,
    defaultPaymentTerms: mockCompanySettings.defaultPaymentTerms,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnPayment: true,
    emailOnOverdue: true,
    emailReminders: true,
    smsNotifications: false,
    notifyOnViewed: true,
    notifyOnExpired: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const settingsSections = [
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'bank', label: 'Bank Details', icon: '🏦' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'invoice', label: 'Invoice Settings', icon: '📄' },
    { id: 'billing', label: 'Billing & Plans', icon: '💳' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account, company details, and preferences</p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0 text-left transition ${
                  activeTab === section.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </div>
                {activeTab === section.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Company Info */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Company Information</h2>

              <div className="space-y-8">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Company Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center text-3xl font-bold text-blue-600">
                      {logoPreview ? '✓' : 'IF'}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer font-medium">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-600 mt-2">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Info */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Personal Information</h2>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                      {formData.personName.charAt(0)}{formData.personName.split(' ')[1]?.charAt(0) || ''}
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer font-medium">
                      <Upload className="w-4 h-4" />
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Personal Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="personName"
                    value={formData.personName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          {activeTab === 'bank' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Bank Account Details</h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> These details will be displayed on your invoices for bank transfers. Keep sensitive information secure.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="password"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                    <input
                      type="password"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: 'emailOnPayment', label: 'Email when payment received' },
                  { key: 'emailOnOverdue', label: 'Email for overdue invoices' },
                  { key: 'emailReminders', label: 'Send payment reminders' },
                  { key: 'notifyOnViewed', label: 'Notify when invoice is viewed' },
                  { key: 'notifyOnExpired', label: 'Notify when invoice expires' },
                  { key: 'smsNotifications', label: 'SMS notifications (requires setup)' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                    />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Invoice Settings */}
          {activeTab === 'invoice' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Invoice Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Terms (days)</label>
                  <input
                    type="number"
                    name="defaultPaymentTerms"
                    value={formData.defaultPaymentTerms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-600 mt-2">How many days for invoice due date</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Automatic Invoice Features</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Auto-numbering for invoices</li>
                    <li>✓ Recurring invoices (coming soon)</li>
                    <li>✓ Payment reminders automation</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Billing & Plans</h2>

              <div className="space-y-6">
                <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">Professional Plan</h3>
                      <p className="text-sm text-blue-700 mt-1">$29/month • Billed Monthly</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">Active</span>
                  </div>
                  <div className="mt-4 text-sm text-blue-800">
                    <p>✓ Unlimited invoices</p>
                    <p>✓ Unlimited clients</p>
                    <p>✓ Payment reminders</p>
                    <p>Next billing date: January 23, 2025</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                    Change Plan
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                    Update Payment Method
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Invoice #INV-BILL-001</span>
                      <span className="text-sm font-semibold">$29.00</span>
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Invoice #INV-BILL-002</span>
                      <span className="text-sm font-semibold">$29.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Security Settings</h2>

              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add extra security to your account</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link2 className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Connected Devices</p>
                        <p className="text-sm text-gray-600">Manage your sessions</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      View
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Danger Zone</h3>
                  <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-medium flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out from All Devices
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

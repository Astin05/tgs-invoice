'use client';

import React, { useState } from 'react';
import { ChevronRight, Save, Upload, Eye, Lock, Link2, LogOut } from 'lucide-react';
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

  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    fromName: 'InvoiceFlow Support',
    fromEmail: 'billing@invoiceflow.com',
    ccUser: false,
    bccEmails: '',
    lateFeesEnabled: false,
    lateFeeType: 'percentage',
    lateFeeAmount: 2.5,
    lateFeeGraceDays: 3,
  });

  const [schedules] = useState([
    { id: '1', name: 'Default Schedule', is_default: true, reminders: [
      { offset: -3, tone: 'polite' },
      { offset: 0, tone: 'friendly' },
      { offset: 3, tone: 'firm' },
      { offset: 7, tone: 'urgent' },
    ]},
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReminderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setReminderSettings((prev) => ({ ...prev, [name]: val }));
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
    { id: 'currency', label: 'Currency Settings', icon: '💱' },
    { id: 'bank', label: 'Bank Details', icon: '🏦' },
    { id: 'reminders', label: 'Payment Reminders', icon: '⏰' },
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

          {/* Payment Reminders */}
          {activeTab === 'reminders' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Reminders</h2>
                  <p className="text-sm text-gray-600 mt-1">Automatically send follow-ups for unpaid invoices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={reminderSettings.enabled}
                    onChange={handleReminderInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className={`space-y-8 ${!reminderSettings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                    <input
                      type="text"
                      name="fromName"
                      value={reminderSettings.fromName}
                      onChange={handleReminderInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                    <input
                      type="email"
                      name="fromEmail"
                      value={reminderSettings.fromEmail}
                      onChange={handleReminderInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Email Notifications</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="ccUser"
                        checked={reminderSettings.ccUser}
                        onChange={handleReminderInputChange}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">CC me on all reminder emails</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BCC Emails (comma separated)</label>
                  <input
                    type="text"
                    name="bccEmails"
                    value={reminderSettings.bccEmails}
                    onChange={handleReminderInputChange}
                    placeholder="accountant@example.com, manager@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Reminder Schedule</h3>
                  <div className="space-y-4">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                          {schedule.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {schedule.reminders.map((r, i) => (
                            <div key={i} className="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-sm">
                              <span className="font-bold text-blue-600">
                                {r.offset === 0 ? 'On Due Date' : r.offset < 0 ? `${Math.abs(r.offset)} days before` : `${r.offset} days after`}
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span className="capitalize">{r.tone} tone</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                      + Add Custom Schedule
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Late Fee Settings</h3>
                  <div className="space-y-6">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="lateFeesEnabled"
                        checked={reminderSettings.lateFeesEnabled}
                        onChange={handleReminderInputChange}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">Enable late fees for overdue invoices</span>
                    </label>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${!reminderSettings.lateFeesEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
                        <select
                          name="lateFeeType"
                          value={reminderSettings.lateFeeType}
                          onChange={handleReminderInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <input
                          type="number"
                          name="lateFeeAmount"
                          value={reminderSettings.lateFeeAmount}
                          onChange={handleReminderInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (days)</label>
                        <input
                          type="number"
                          name="lateFeeGraceDays"
                          value={reminderSettings.lateFeeGraceDays}
                          onChange={handleReminderInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <Save className="w-4 h-4" />
                    Save Reminder Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Currency Settings */}
          {activeTab === 'currency' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Currency Settings</h2>
              <p className="text-sm text-gray-600 mb-8">
                Configure your base currency and multi-currency preferences
              </p>

              <div className="space-y-8">
                {/* Base Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Currency
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    This is your accounting currency. All reports will show amounts in this currency.
                  </p>
                  <select
                    value={formData.currency}
                    name="currency"
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CHF">CHF - Swiss Franc</option>
                    <option value="CNY">CNY - Chinese Yuan</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="MXN">MXN - Mexican Peso</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                    <option value="HKD">HKD - Hong Kong Dollar</option>
                    <option value="NZD">NZD - New Zealand Dollar</option>
                    <option value="SEK">SEK - Swedish Krona</option>
                    <option value="NOK">NOK - Norwegian Krone</option>
                    <option value="DKK">DKK - Danish Krone</option>
                    <option value="BRL">BRL - Brazilian Real</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                    <option value="RUB">RUB - Russian Ruble</option>
                    <option value="KRW">KRW - South Korean Won</option>
                    <option value="TRY">TRY - Turkish Lira</option>
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                    <option value="THB">THB - Thai Baht</option>
                    <option value="MYR">MYR - Malaysian Ringgit</option>
                    <option value="PHP">PHP - Philippine Peso</option>
                    <option value="PLN">PLN - Polish Złoty</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="ILS">ILS - Israeli Shekel</option>
                    <option value="CZK">CZK - Czech Koruna</option>
                  </select>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Warning:</strong> Changing your base currency will affect all future invoices and reports. Historical data will be recalculated at current exchange rates.
                  </p>
                </div>

                {/* Display Options */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Display Options
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-700">
                          Show both currencies on invoices
                        </span>
                        <p className="text-sm text-gray-500">
                          Example: "$1,000 USD ($1,350 CAD)"
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-700">
                          Show exchange rate on invoices
                        </span>
                        <p className="text-sm text-gray-500">
                          Example: "Exchange rate: 1 USD = 1.35 CAD"
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-700">
                          Round to nearest whole number
                        </span>
                        <p className="text-sm text-gray-500">
                          Useful for currencies with small values
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Exchange Rate Source */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Exchange Rate Source
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="rateSource"
                        value="automatic"
                        defaultChecked
                        className="w-4 h-4 accent-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-700">Automatic</span>
                        <p className="text-sm text-gray-500">
                          Updated daily at midnight UTC
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="rateSource"
                        value="manual"
                        className="w-4 h-4 accent-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-700">Manual</span>
                        <p className="text-sm text-gray-500">
                          Enter rates yourself
                        </p>
                      </div>
                    </label>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Exchange Rate Provider:</strong> ExchangeRate-API
                        <br />
                        <strong>Last Updated:</strong> Dec 24, 2024 at 12:00 AM UTC
                      </p>
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                        Refresh Rates Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  <Save className="w-4 h-4" />
                  Save Currency Settings
                </button>
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

'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Check } from 'lucide-react';
import { mockInvoiceTemplates, InvoiceTemplate } from '@/app/lib/mock-data';

const generateId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(mockInvoiceTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    layout: 'classic' | 'modern' | 'minimal';
    primaryColor: string;
    tertiaryColor: string;
    includeNotes: boolean;
    includeTerms: boolean;
  }>({
    name: '',
    description: '',
    layout: 'classic',
    primaryColor: '#2563EB',
    tertiaryColor: '#E0E7FF',
    includeNotes: true,
    includeTerms: true,
  });

  const handleCreateTemplate = () => {
    if (!formData.name) return;

    const newTemplate: InvoiceTemplate = {
      // eslint-disable-next-line react-hooks/purity
      id: generateId(),
      name: formData.name,
      description: formData.description,
      layout: formData.layout,
      primaryColor: formData.primaryColor,
      tertiaryColor: formData.tertiaryColor,
      includeNotes: formData.includeNotes,
      includeTerms: formData.includeTerms,
      isDefault: false,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setTemplates([...templates, newTemplate]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleDuplicateTemplate = (template: InvoiceTemplate) => {
    const newTemplate: InvoiceTemplate = {
      ...template,
      id: generateId(),
      name: `${template.name} (Copy)`,
      isDefault: false,
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setTemplates(
      templates.map((t) => ({
        ...t,
        isDefault: t.id === id,
      }))
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      layout: 'classic',
      primaryColor: '#2563EB',
      tertiaryColor: '#E0E7FF',
      includeNotes: true,
      includeTerms: true,
    });
  };

  const layoutDescriptions = {
    classic: 'Traditional professional layout with company header',
    modern: 'Clean and minimal design with focus on content',
    minimal: 'Bold design with accent colors and modern styling',
  };

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Templates</h1>
          <p className="text-gray-600 mt-2">Create and manage your invoice templates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
            {/* Template Preview */}
            <div
              className="h-40 p-4 flex items-center justify-center relative"
              style={{ backgroundColor: template.tertiaryColor }}
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-3"
                  style={{ backgroundColor: template.primaryColor }}
                ></div>
                <p className="text-sm font-semibold text-gray-700">{template.name}</p>
                <p className="text-xs text-gray-500 mt-1">{layoutDescriptions[template.layout]}</p>
              </div>
              {template.isDefault && (
                <div className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Default
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              {/* Features */}
              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: template.primaryColor }}
                  ></div>
                  <span>Layout: {template.layout}</span>
                </div>
                {template.includeNotes && <p>✓ Includes notes section</p>}
                {template.includeTerms && <p>✓ Includes terms section</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!template.isDefault && (
                  <button
                    onClick={() => handleSetDefault(template.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Professional Blue"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your template..."
                  rows={2}
                />
              </div>

              {/* Layout Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Layout Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['classic', 'modern', 'minimal'] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => setFormData({ ...formData, layout })}
                      className={`p-3 rounded-lg border-2 transition text-center ${
                        formData.layout === layout
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900 capitalize">{layout}</p>
                      <p className="text-xs text-gray-600 mt-1">{layoutDescriptions[layout]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tertiary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.tertiaryColor}
                      onChange={(e) => setFormData({ ...formData, tertiaryColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.tertiaryColor}
                      onChange={(e) => setFormData({ ...formData, tertiaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeNotes}
                    onChange={(e) => setFormData({ ...formData, includeNotes: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Include Notes Section</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeTerms}
                    onChange={(e) => setFormData({ ...formData, includeTerms: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Include Terms & Conditions</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

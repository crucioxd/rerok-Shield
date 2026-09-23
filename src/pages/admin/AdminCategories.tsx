import React, { useState, useEffect } from 'react';
import { Boxes, Plus, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategories: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.categories);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createCategory({ name, description });
      showToast('Category created successfully.', 'success');
      setCategories(prev => [...prev, res.category]);
      setName('');
      setDescription('');
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Category Hierarchy</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage product classifications for tempered glass, privacy protectors, and camera lens armor.
        </p>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleCreate} className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-500" />
          <span>Add New Protection Category</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Category Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Anti-Reflective Matte Glass"
              className="w-full bg-[#111827] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Anti-glare coating for mobile gamers"
              className="w-full bg-[#111827] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Create Category</span>
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat._id} className="p-5 rounded-xl bg-[#0D1321] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">{cat.name}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{cat.description || 'No description provided'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

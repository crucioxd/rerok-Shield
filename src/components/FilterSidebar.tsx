import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Category } from '../types';

interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  availableModels: string[];
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedModel,
  setSelectedModel,
  availableModels,
  inStockOnly,
  setInStockOnly,
  onReset
}) => {
  const hasActiveFilters =
    selectedBrand !== 'All' ||
    selectedCategory !== 'All' ||
    selectedModel !== '' ||
    inStockOnly;

  return (
    <div className="bg-[#0D1321] border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-blue-500" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Brand Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Mobile Brand
        </label>
        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedBrand('All');
              setSelectedModel('');
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
              selectedBrand === 'All'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>All Brands</span>
          </button>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrand(brand);
                setSelectedModel('');
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                selectedBrand === brand
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{brand}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Model Selector (if models are available) */}
      {availableModels.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Model Filter
          </label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Models for {selectedBrand}</option>
            {availableModels.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Product Type / Category */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Protection Type
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-slate-800">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

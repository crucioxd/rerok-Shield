import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CompatibilityFinderProps {
  initialBrand?: string;
  initialModel?: string;
  compact?: boolean;
}

export const CompatibilityFinder: React.FC<CompatibilityFinderProps> = ({
  initialBrand = '',
  initialModel = '',
  compact = false
}) => {
  const navigate = useNavigate();
  const [brandsAndModels, setBrandsAndModels] = useState<Record<string, string[]>>({});
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    async function loadDirectory() {
      try {
        const data = await api.getBrandsAndModels();
        setBrandsAndModels(data.brandsAndModels || {});
        if (!selectedBrand && Object.keys(data.brandsAndModels || {}).length > 0) {
          const firstBrand = Object.keys(data.brandsAndModels)[0];
          setSelectedBrand(firstBrand);
          setSelectedModel(data.brandsAndModels[firstBrand]?.[0] || '');
        }
      } catch (err) {
        console.error('Failed to load brand directory:', err);
      }
    }
    loadDirectory();
  }, []);

  // When brand changes, update the available models
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = brandsAndModels[brand] || [];
    setSelectedModel(models[0] || '');
    setHasSearched(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedModel) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.getCompatibleProducts(selectedModel);
      setMatchingProducts(res.products);
    } catch (err) {
      console.error('Failed to query compatibility:', err);
    } finally {
      setLoading(false);
    }
  };

  const brands = Object.keys(brandsAndModels);
  const models = selectedBrand ? brandsAndModels[selectedBrand] || [] : [];

  return (
    <div className={`w-full ${compact ? '' : 'p-6 sm:p-8 bg-[#0D1321] border border-slate-800 rounded-2xl'}`}>
      {!compact && (
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-400 text-xs font-semibold mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Zero-Mismatch Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Find protection made for your phone.
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Never guess whether tempered glass covers your curve or camera cutout. Select your exact mobile model to view 100% verified compatible accessories.
          </p>
        </div>
      )}

      {/* Interactive 2-Step Selector */}
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-5 bg-[#111827] border border-slate-700/60 rounded-xl shadow-xl shadow-black/20">
          {/* Step 1: Select Brand */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Step 1: Select Brand
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={e => handleBrandChange(e.target.value)}
                className="w-full bg-[#0D1321] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {brands.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Select Model */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Step 2: Select Model
            </label>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={e => {
                  setSelectedModel(e.target.value);
                  setHasSearched(false);
                }}
                className="w-full bg-[#0D1321] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {models.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading || !selectedModel}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/30 flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <span>Show Compatible</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Interactive Search Results */}
      {hasSearched && (
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Match Ready</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Compatible products for <span className="text-blue-400">{selectedModel}</span>
              </h3>
            </div>
            <button
              onClick={() => navigate(`/shop?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}`)}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View all in Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
              <span className="text-sm">Querying database for {selectedModel}...</span>
            </div>
          ) : matchingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {matchingProducts.map(p => (
                <ProductCard key={p._id} product={p} selectedModelFilter={selectedModel} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#111827] border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-300 font-medium">No protection found for this model.</p>
              <p className="mt-1 text-xs text-slate-500">
                We are continually updating stock for {selectedModel}. Try selecting another model or contact support.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

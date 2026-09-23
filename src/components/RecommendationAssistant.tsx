import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check, Plus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { AIRecommendation } from '../types';
import { useCart } from '../context/CartContext';

export const RecommendationAssistant: React.FC = () => {
  const { addToCart } = useCart();
  const [brandsAndModels, setBrandsAndModels] = useState<Record<string, string[]>>({});
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('Galaxy S24');
  const [requirement, setRequirement] = useState('Maximum protection');
  const [budget, setBudget] = useState('500');
  const [loading, setLoading] = useState(false);
  const [summaryHeadline, setSummaryHeadline] = useState('');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getBrandsAndModels();
        setBrandsAndModels(data.brandsAndModels || {});
        if (data.brandsAndModels && Object.keys(data.brandsAndModels).length > 0) {
          const defaultBrand = 'Samsung';
          setBrand(defaultBrand);
          setModel(data.brandsAndModels[defaultBrand]?.[0] || 'Galaxy S24');
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    const models = brandsAndModels[newBrand] || [];
    setModel(models[0] || '');
  };

  const handleRecommend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasRun(true);

    try {
      const res = await api.getRecommendations({
        brand,
        model,
        requirement,
        budget: budget === 'any' ? undefined : Number(budget)
      });

      setSummaryHeadline(res.summaryHeadline);
      setRecommendations(res.recommendations);
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (item: AIRecommendation) => {
    addToCart(item as any, 1, model);
    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const brands = Object.keys(brandsAndModels);
  const models = brand ? brandsAndModels[brand] || [] : [];

  return (
    <div className="bg-gradient-to-b from-[#0D1321] to-[#070B14] border border-blue-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Assisted Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Shield AI Recommendation
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Specify your smartphone, protection priority, and budget. Our recommendation algorithm calculates compatibility and scores the best shield for you.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRecommend} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Brand */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Brand</label>
          <select
            value={brand}
            onChange={e => handleBrandChange(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Exact Model</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Requirement */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Requirement</label>
          <select
            value={requirement}
            onChange={e => setRequirement(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Maximum protection">Maximum Drop & Scratch Defense</option>
            <option value="Privacy / Anti-spy">28° Privacy / Anti-Spy Filter</option>
            <option value="Gaming & smooth touch">Gaming & Matte Anti-Glare</option>
            <option value="Camera lens armor">Camera Lens & Ring Armor</option>
            <option value="Everyday clarity">High-Transparency Everyday Fit</option>
          </select>
        </div>

        {/* Budget & Action */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Max Budget</label>
          <div className="flex gap-2">
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="flex-1 bg-[#111827] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="300">Under ₹300</option>
              <option value="400">Under ₹400</option>
              <option value="500">Under ₹500</option>
              <option value="700">Under ₹700</option>
              <option value="any">Any Budget</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0 shadow-sm shadow-blue-600/30"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analyze</span>
            </button>
          </div>
        </div>
      </form>

      {/* Results View */}
      {hasRun && (
        <div className="pt-6 border-t border-slate-800">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-xs">Evaluating 9H hardness ratings and model geometry for {model}...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div>
              {/* Summary Statement */}
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-100 font-medium leading-relaxed">
                  {summaryHeadline}
                </p>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((item, idx) => (
                  <div
                    key={item._id}
                    className={`relative p-5 rounded-xl border flex flex-col justify-between transition-all ${
                      idx === 0
                        ? 'bg-[#111827] border-blue-500/50 shadow-lg shadow-blue-900/10'
                        : 'bg-[#0D1321] border-slate-800'
                    }`}
                  >
                    {idx === 0 && (
                      <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Top Pick · {item.matchScore}% Match
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold text-blue-400 uppercase tracking-wider">{item.brand}</span>
                        <span className="tabular-nums font-mono font-bold text-white text-base">₹{item.price}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1 mb-3">
                        {item.name}
                      </h4>

                      {/* AI Why Bullet Points */}
                      <div className="space-y-1.5 mb-4 text-xs text-slate-300 bg-[#070B14]/60 p-3 rounded-lg border border-slate-800/80">
                        <p className="font-semibold text-blue-400 text-[11px] mb-1">Why this recommendation?</p>
                        {item.aiReasons?.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-blue-400 shrink-0">•</span>
                            <span className="leading-tight text-slate-300">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(item)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        addedId === item._id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {addedId === item._id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart (for {model})</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#111827] border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-300">No products matched the selected criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Try raising the budget limit or selecting a broader requirement.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

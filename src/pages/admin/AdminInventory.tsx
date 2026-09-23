import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, Check, Search, Save, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminInventory: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts();
      setProducts(res.products);
      const initial: Record<string, number> = {};
      res.products.forEach(p => {
        initial[p._id] = p.stock;
      });
      setStockEdits(initial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (id: string, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setStockEdits(prev => ({ ...prev, [id]: num }));
  };

  const saveStock = async (id: string) => {
    setSavingId(id);
    try {
      const targetStock = stockEdits[id];
      await api.updateProductStock(id, targetStock);
      showToast('Inventory updated successfully.', 'success');
      setProducts(prev =>
        prev.map(p => (p._id === id ? { ...p, stock: targetStock } : p))
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = !lowStockOnly || p.stock <= 15;
    return matchesSearch && matchesLowStock;
  });

  const lowStockCount = products.filter(p => p.stock <= 15).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Inventory & Warehouse Stock
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time product quantities and perform quick adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{lowStockCount} SKUs Low Stock</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inventory items..."
            className="w-full bg-[#0D1321] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={e => setLowStockOnly(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
          />
          <span>Show Low Stock (≤ 15 units) Only</span>
        </label>
      </div>

      {/* Stock Table */}
      <div className="bg-[#0D1321] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Update Units</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(p => {
                const isChanged = stockEdits[p._id] !== p.stock;
                const isLow = p.stock <= 15 && p.stock > 0;
                const isOut = p.stock === 0;

                return (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-[11px] text-blue-400">{p.brand} · {p.compatibleModels?.[0] || 'Universal'}</p>
                    </td>
                    <td className="p-3 text-slate-400">{p.category}</td>
                    <td className="p-3">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-semibold text-[10px]">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-semibold text-[10px]">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-white tabular-nums">{p.stock} units</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        value={stockEdits[p._id] ?? p.stock}
                        onChange={e => handleStockChange(p._id, e.target.value)}
                        className="w-24 bg-[#111827] border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => saveStock(p._id)}
                        disabled={savingId === p._id || !isChanged}
                        className={`px-3 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                          isChanged
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingId === p._id ? 'Saving...' : 'Save'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

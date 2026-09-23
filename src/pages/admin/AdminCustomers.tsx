import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await api.getAllCustomers();
        setCustomers(res.customers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Directory</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View registered buyers, purchasing history, and lifetime spending.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer name, email, or phone..."
          className="w-full bg-[#0D1321] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-[#0D1321] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Role</th>
                <th className="p-3">Orders Placed</th>
                <th className="p-3">Lifetime Spend</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(c => (
                <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-white">{c.email}</p>
                    <p className="text-[11px] text-slate-400">{c.phone || 'No phone'}</p>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      c.role === 'admin'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-white">
                    {c.orderCount || 0} orders
                  </td>
                  <td className="p-3 font-mono font-bold text-white">
                    ₹{c.totalSpent || 0}
                  </td>
                  <td className="p-3 text-slate-400">
                    {c.joinedDate ? new Date(c.joinedDate).toLocaleDateString('en-IN') : '2026'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

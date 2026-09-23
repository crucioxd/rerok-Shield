import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Package, Mail, Phone, LogOut, LayoutDashboard, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';

export const Profile: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getMyOrders();
        setOrders(res.orders || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadOrders();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account credentials and mobile order preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-[#0D1321] border border-slate-800 space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950/80 border border-blue-800/60 text-blue-400 uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={logout}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border border-slate-700/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* User Details & Orders Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D1321] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Account Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Email Address</span>
                </span>
                <p className="font-semibold text-white truncate">{user.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phone Number</span>
                </span>
                <p className="font-semibold text-white">{user.phone || 'Not provided'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-purple-400" />
                  <span>Orders Placed</span>
                </span>
                <p className="font-semibold text-white font-mono">{orders.length} orders</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Security</span>
                </span>
                <p className="font-semibold text-white">Bcrypt Salted Hash</p>
              </div>
            </div>
          </div>

          {/* Quick link to recent orders */}
          <div className="p-6 rounded-2xl bg-[#0D1321] border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Order History</h4>
              <p className="text-xs text-slate-400 mt-0.5">Track your packages, download invoices, or re-order.</p>
            </div>
            <Link
              to="/orders"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  Users,
  Warehouse,
  ArrowLeft,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/categories', label: 'Categories', icon: Boxes },
  ];

  return (
    <aside className="w-64 bg-[#0A0E1A] border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Shield className="w-5 h-5 text-blue-500" />
            <span>REROK <span className="text-blue-500">Admin</span></span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Store Management Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info & exit */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <div className="px-3 py-2 bg-[#111827] rounded-lg border border-slate-800 text-xs">
          <p className="text-white font-semibold truncate">{user?.name}</p>
          <p className="text-blue-400 text-[11px] uppercase tracking-wider font-mono">Administrator</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

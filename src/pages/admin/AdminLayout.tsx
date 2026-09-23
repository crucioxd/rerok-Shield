import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { Shield, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#070B14] text-slate-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0A0E1A] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>REROK Shield</span>
            <span>/</span>
            <span className="text-white">Admin Management Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View Live Store →
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

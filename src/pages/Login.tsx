import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    showToast(`Filled credentials for ${demoEmail}`, 'info');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to REROK Shield
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Access your order history, tracked packages, and personalized protection.
          </p>
        </div>

        {/* Quick Demo Fill Box for Viva Presentation */}
        <div className="p-4 rounded-xl bg-[#0D1321] border border-blue-900/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Viva Demonstration One-Click Fill</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('user@rerok.com', 'User@123')}
              className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-slate-200 transition-colors text-left"
            >
              <div className="font-semibold text-white">Customer Account</div>
              <div className="text-slate-400 text-[10px]">user@rerok.com</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@rerok.com', 'Admin@123')}
              className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-slate-800 border border-blue-600/40 text-[11px] font-medium text-blue-300 transition-colors text-left"
            >
              <div className="font-semibold text-blue-400">Admin Account</div>
              <div className="text-slate-400 text-[10px]">admin@rerok.com</div>
            </button>
          </div>
        </div>

        {/* Sign In Card */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0D1321] border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@rerok.com"
                required
                className="w-full bg-[#111827] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#111827] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">
              Create one now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

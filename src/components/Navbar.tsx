import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Search, ShoppingBag, User as UserIcon, Menu, X, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          scrolled
            ? 'bg-[#070B14]/90 backdrop-blur-md border-slate-800/80 shadow-lg shadow-black/20'
            : 'bg-[#070B14] border-slate-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single element brand wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-blue-400 transition-colors shrink-0"
          >
            <Shield className="w-5 h-5 text-blue-500 shrink-0" />
            <span>REROK <span className="text-blue-500 font-extrabold">Shield</span></span>
          </Link>

          {/* Zone 2: Navigation Links (single-line, quiet hover underlines) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <Link
              to="/"
              className={`transition-colors hover:text-white ${
                location.pathname === '/' ? 'text-white font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`transition-colors hover:text-white ${
                location.pathname === '/shop' ? 'text-white font-semibold' : ''
              }`}
            >
              Shop
            </Link>
            <Link
              to="/finder"
              className={`transition-colors hover:text-white ${
                location.pathname === '/finder' ? 'text-white font-semibold' : ''
              }`}
            >
              Find Protection
            </Link>
            <Link
              to="/shield-ai"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                location.pathname === '/shield-ai' ? 'text-blue-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Shield AI</span>
            </Link>
          </nav>

          {/* Zone 3: Primary Actions (Search, Cart, User/Auth) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Icon with badge */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-blue-600 rounded-full tabular-nums">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile */}
            {user ? (
              <div className="relative group">
                <Link
                  to={isAdmin ? '/admin' : '/profile'}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-48 py-1.5 bg-[#0D1321] border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800/80 text-xs">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-slate-400 truncate text-[11px]">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-blue-400 hover:bg-slate-800/80 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Profile & Orders</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-slate-800/80 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-blue-500/20"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="border-t border-slate-800 bg-[#0D1321] px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search screen protectors, brands, or mobile models (e.g. iPhone 15, S24 Ultra)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0D1321] px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/70"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/70"
            >
              Shop Protection
            </Link>
            <Link
              to="/finder"
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/70"
            >
              Find Protection
            </Link>
            <Link
              to="/shield-ai"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-slate-800/70"
            >
              <Sparkles className="w-4 h-4" />
              <span>Shield AI Assistant</span>
            </Link>
            <Link
              to="/orders"
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/70"
            >
              Order History
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-slate-800/70"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

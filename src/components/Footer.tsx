import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05080F] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>REROK <span className="text-blue-500">Shield</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precision-engineered mobile protection accessories. Ensuring guaranteed fit, 9H tempered durability, and seamless touch response for all modern flagships.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>B.Tech Internship Project Edition</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Store Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Shop All Protection</Link>
              </li>
              <li>
                <Link to="/finder" className="hover:text-white transition-colors">Phone Compatibility Finder</Link>
              </li>
              <li>
                <Link to="/shield-ai" className="hover:text-white transition-colors">Shield AI Recommendations</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link>
              </li>
            </ul>
          </div>

          {/* Device Brands */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Supported Brands</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?brand=Apple" className="hover:text-white transition-colors">Apple iPhone Series</Link>
              </li>
              <li>
                <Link to="/shop?brand=Samsung" className="hover:text-white transition-colors">Samsung Galaxy Series</Link>
              </li>
              <li>
                <Link to="/shop?brand=OnePlus" className="hover:text-white transition-colors">OnePlus Flagships</Link>
              </li>
              <li>
                <Link to="/shop?brand=Google" className="hover:text-white transition-colors">Google Pixel Devices</Link>
              </li>
              <li>
                <Link to="/shop?brand=Xiaomi" className="hover:text-white transition-colors">Xiaomi & Redmi Series</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Quality Assurance</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>• 9H Surface Scratch & Shatter Defense</p>
              <p>• Laser-cut 100% Model Specific Fit</p>
              <p>• Electroplated Oleophobic Hydrophobic Layer</p>
              <p>• Free shipping on prepaid orders over ₹499</p>
              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                Demo Admin: <span className="text-blue-400 font-mono">admin@rerok.com</span> / <span className="text-blue-400 font-mono">Admin@123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 REROK Shield. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Model-Specific Protection</span>
            <span>·</span>
            <span>Easy Ordering</span>
            <span>·</span>
            <span>Reliable Quality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Smartphone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CompatibilityFinder } from '../components/CompatibilityFinder';
import { RecommendationAssistant } from '../components/RecommendationAssistant';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getProducts();
        const featured = res.products.filter(p => p.featured).slice(0, 4);
        setFeaturedProducts(featured.length > 0 ? featured : res.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Next-Generation Screen Armor</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                Protection that <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">
                  fits your phone.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Find the right screen protection for your exact mobile model. Laser-cut Japanese Asahi 9H tempered glass engineered with millimeter accuracy.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#compatibility-finder"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Find Protection</span>
                </a>

                <Link
                  to="/shop"
                  className="px-6 py-3.5 bg-[#111827] hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-all"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust statement */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Model-specific fit</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Easy ordering</span>
                </div>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Reliable 9H quality</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 bg-gradient-to-b from-[#111827] to-[#070B14] shadow-2xl group">
                <img
                  src="/src/assets/images/hero_phone_shield_1790140255700.jpg"
                  alt="REROK Shield precision tempered glass"
                  className="w-full aspect-[4/3] lg:aspect-[3/4] object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0D1321]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Flagship Series</p>
                    <p className="text-sm font-bold text-white">Japanese Asahi 9H Glass</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 rounded">
                    0.33mm Thin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PHONE COMPATIBILITY FINDER (PROMINENT) */}
      <section id="compatibility-finder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <CompatibilityFinder />
      </section>

      {/* SECTION 3 — FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Precision Engineered</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Featured Protection
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4 — SHIELD AI RECOMMENDATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecommendationAssistant />
      </section>

      {/* SECTION 5 — VALUE PROPOSITION / TRUST PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why REROK Shield?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Engineered to overcome common tempered glass issues: zero edge lift, zero rainbow effect, and zero touch delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Laser-Cut CNC Curvature</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every protector matches exact micro-radii specifications for flat and curved OLED displays, leaving zero halo edges.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Double-Tempered 9H Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Four-hour thermal ion exchange increases fracture toughness, dispersing impact energy away from the underlying display.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Bubble Applicator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Electrostatic self-absorption layer combined with our custom alignment frame ensures painless, dust-free installation in 30 seconds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

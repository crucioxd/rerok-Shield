import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Star,
  CheckCircle2,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'compatibility' | 'reviews'>('desc');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.getProductById(id);
        setProduct(res.product);
        setRelated(res.related || []);
        if (res.product?.compatibleModels?.[0]) {
          setSelectedModel(res.product.compatibleModels[0]);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading protection specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-slate-400 text-xs mb-6">The requested protective accessory does not exist or has been removed.</p>
        <Link to="/shop" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedModel);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedModel);
    navigate('/checkout');
  };

  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 truncate">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Product Image Showcase */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0E1A] border border-slate-800 relative group">
            {!imgError && product.image ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0D1321]">
                <Shield className="w-16 h-16 text-blue-500/40 mb-3" />
                <span className="text-xs text-slate-400">{product.name}</span>
              </div>
            )}

            {product.discount > 0 && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-[#0D1321] border border-slate-800 text-center">
              <Shield className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-200">9H Hardness</p>
              <p className="text-[10px] text-slate-500">Thermal Tempered</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0D1321] border border-slate-800 text-center">
              <Truck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-200">Fast Dispatch</p>
              <p className="text-[10px] text-slate-500">Free above ₹499</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0D1321] border border-slate-800 text-center">
              <RotateCcw className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-200">Easy Fit</p>
              <p className="text-[10px] text-slate-500">Alignment Tray</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-[#0D1321] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-bold text-blue-400 uppercase tracking-wider">{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold tabular-nums">{product.rating}</span>
              </div>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{product.reviews} verified customer reviews</span>
            </div>
          </div>

          {/* Pricing Module */}
          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white tabular-nums font-mono">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through tabular-nums font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Inclusive of all taxes & warranty</p>
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <span className="text-xs font-semibold text-rose-400">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-xs font-semibold text-amber-400">Low Stock ({product.stock} units)</span>
              ) : (
                <span className="text-xs font-semibold text-emerald-400">In Stock ({product.stock} available)</span>
              )}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Compatible Phone Model
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.compatibleModels?.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all truncate ${
                    selectedModel === m
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Key Specs Checklist */}
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>9H surface hardness prevents scratches from keys, coins, and pavement</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>99.9% optical transparency maintains original display brilliance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Electroplated oleophobic nano-coating repels oils and smudges</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes zero-bubble auto-alignment applicator frame</span>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#111827] border border-slate-700/80 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="bg-[#0D1321] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold mb-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'desc'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'compatibility'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Compatibility Matrix
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Reviews ({product.reviews})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'desc' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <p>
              Each REROK Shield screen protector undergoes a rigorous thermal tempering process spanning 4 hours, creating high surface tension that disperses kinetic drop energy. Precision CNC laser cutters guarantee flawless 0.33mm profile alignments matching speaker grills, proximity sensors, and dynamic island cutouts.
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl text-xs sm:text-sm">
            <dl className="divide-y divide-slate-800">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Material</dt>
                <dd className="font-semibold text-white">Japanese Asahi Aluminosilicate Glass</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Surface Hardness</dt>
                <dd className="font-semibold text-white">9H Pencil Hardness Scale</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Thickness</dt>
                <dd className="font-semibold text-white">0.33 mm Ultra-Slim Profile</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Edge Finish</dt>
                <dd className="font-semibold text-white">2.5D Micro-Curved Chamfer</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Coating</dt>
                <dd className="font-semibold text-white">Vacuum Electroplated Oleophobic</dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300">
              This accessory is guaranteed to fit the following smartphone models without edge-lift or camera obstruction:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.compatibleModels?.map(m => (
                <span
                  key={m}
                  className="px-3 py-1.5 rounded-md bg-[#111827] border border-slate-800 text-xs font-semibold text-blue-400"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Aditya V. (Verified Buyer)</span>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-300">
                "The applicator frame made installation effortless. Zero bubbles on my {product.compatibleModels?.[0] || 'device'} and the glass feels even smoother than the bare screen!"
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Kavita M. (Verified Buyer)</span>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-300">
                "Super fast delivery and the 9H hardness is genuine. Dropped my phone on gravel yesterday and the shield took the hit, screen was totally untouched."
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Related Protection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

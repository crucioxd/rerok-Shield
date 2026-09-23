import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  selectedModelFilter?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, selectedModelFilter }) => {
  const { addToCart } = useCart();
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (selectedModelFilter && product.compatibleModels?.includes(selectedModelFilter)) {
      return selectedModelFilter;
    }
    return product.compatibleModels?.[0] || 'Universal';
  });
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedModel);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-[#111827] border border-slate-800/80 rounded-xl overflow-hidden hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-950/20 transition-all duration-200">
      {/* Product Image Slot */}
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] w-full bg-[#0B0F19] overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 bg-gradient-to-b from-[#111827] to-[#0D1321]">
            <Shield className="w-12 h-12 text-blue-500/50 mb-2 stroke-[1.5]" />
            <span className="text-xs text-slate-400 font-medium">{product.category}</span>
          </div>
        )}

        {/* Subtle Discount Tag (Quiet text tag on top right) */}
        {product.discount > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-blue-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-sm tabular-nums">
            {product.discount}% OFF
          </div>
        )}
      </Link>

      {/* Content Body */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div>
          {/* Metadata Row: Unboxed clean typography */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold text-blue-400 uppercase tracking-wider">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product._id}`}
            className="block text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Model Compatibility Subtext */}
          <p className="mt-1.5 text-xs text-slate-400 truncate">
            Fits: <span className="text-slate-200 font-medium">{product.compatibleModels?.join(', ') || 'Universal'}</span>
          </p>
        </div>

        {/* Bottom Module: Price, Rating & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-white tabular-nums font-mono">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold tabular-nums">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviews})</span>
            </div>
          </div>

          {/* Model selector & Quick Add button */}
          <div className="flex items-center gap-2">
            {product.compatibleModels && product.compatibleModels.length > 1 ? (
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                onClick={e => e.stopPropagation()}
                className="flex-1 bg-[#0D1321] border border-slate-700/80 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 truncate"
              >
                {product.compatibleModels.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-slate-400 truncate flex-1">
                {isOutOfStock ? (
                  <span className="text-rose-400">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-amber-400">Only {product.stock} left</span>
                ) : (
                  <span className="text-emerald-400">In Stock</span>
                )}
              </span>
            )}

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

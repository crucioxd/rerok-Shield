import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Shield, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    totalAmount,
    itemCount
  } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center mx-auto mb-4 text-blue-400">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your shield is waiting.</h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6">
          Your shopping cart is currently empty. Explore our model-specific tempered glass protectors to shield your phone.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your selected mobile accessories and proceed to delivery.
        </p>
      </div>

      {/* Free Delivery Banner Indicator */}
      <div className="p-4 rounded-xl bg-[#0D1321] border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          {subtotal >= 499 ? (
            <span className="text-emerald-400 font-semibold">
              You qualify for Free Standard Delivery!
            </span>
          ) : (
            <span>
              Add <span className="text-blue-400 font-bold font-mono">₹{499 - subtotal}</span> more for Free Delivery
            </span>
          )}
        </div>
        <span className="text-slate-400 hidden sm:inline">Orders dispatched within 24h</span>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div
              key={`${item.product._id}-${item.selectedModel}`}
              className="p-4 sm:p-5 rounded-xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info & Thumbnail */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Link
                  to={`/product/${item.product._id}`}
                  className="w-16 h-16 rounded-lg bg-[#0A0E1A] overflow-hidden border border-slate-800 shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>Model: <strong className="text-blue-400">{item.selectedModel}</strong></span>
                    <span>·</span>
                    <span className="text-slate-400">{item.product.category}</span>
                  </div>
                  <div className="mt-1 sm:hidden flex items-baseline gap-2">
                    <span className="text-xs font-bold font-mono text-white">₹{item.product.price}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0">
                {/* Stepper */}
                <div className="flex items-center bg-[#0D1321] border border-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.selectedModel, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.selectedModel, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-bold text-white tabular-nums font-mono">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.product._id, item.selectedModel)}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Cart Summary */}
        <div className="lg:col-span-4 bg-[#0D1321] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Items Total ({itemCount})</span>
              <span className="font-mono tabular-nums text-white">₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="font-semibold text-emerald-400">FREE</span>
              ) : (
                <span className="font-mono tabular-nums text-white">₹{deliveryFee}</span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-sm">
              <span className="font-bold text-white">Total Amount</span>
              <span className="font-bold text-white font-mono tabular-nums text-base">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <Link to="/shop" className="text-xs text-blue-400 hover:underline">
              ← Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

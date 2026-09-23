import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, Banknote, CheckCircle, Loader2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Checkout: React.FC = () => {
  const { cart, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [demoPaymentModal, setDemoPaymentModal] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      showToast('Please fill in all required shipping address fields.', 'error');
      return;
    }

    if (paymentMethod === 'Online') {
      // Show simulated online payment gateway
      setDemoPaymentModal(true);
      return;
    }

    await finalizeOrder('COD');
  };

  const finalizeOrder = async (method: 'COD' | 'Online') => {
    setSubmitting(true);
    try {
      const orderPayload = {
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
          selectedModel: item.selectedModel
        })),
        shippingAddress: formData,
        paymentMethod: method
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      showToast('Order confirmed successfully!', 'success');
      navigate(`/order-success/${res.order.orderId || res.order._id}`);
    } catch (err: any) {
      showToast(err.message || 'Unable to place order', 'error');
    } finally {
      setSubmitting(false);
      setDemoPaymentModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Checkout & Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete your delivery details and choose your payment method.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Details & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Section */}
          <div className="p-6 rounded-2xl bg-[#0D1321] border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>1. Shipping Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Email Address (for order tracking) *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Street Address / Flat / Building *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="402, Skyline Residency, MG Road"
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Mumbai"
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="400001"
                  className="w-full bg-[#111827] border border-slate-700/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="p-6 rounded-2xl bg-[#0D1321] border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>2. Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'bg-blue-950/30 border-blue-500'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Cash on Delivery (COD)</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Pay with cash or QR upon delivery to your doorstep.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Online')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'Online'
                    ? 'bg-blue-950/30 border-blue-500'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Demo Online Payment</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant checkout simulation (UPI / Card / NetBanking).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Recap */}
        <div className="lg:col-span-4 bg-[#0D1321] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Order Items ({cart.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={`${item.product._id}-${item.selectedModel}`} className="flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-white truncate">{item.product.name}</p>
                  <p className="text-slate-400 text-[11px]">{item.selectedModel} × {item.quantity}</p>
                </div>
                <span className="font-mono tabular-nums text-slate-200 shrink-0">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-white">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              {deliveryFee === 0 ? (
                <span className="text-emerald-400 font-semibold">FREE</span>
              ) : (
                <span className="font-mono tabular-nums text-white">₹{deliveryFee}</span>
              )}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
              <span>Total to Pay</span>
              <span className="font-mono tabular-nums text-base">₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order · ₹{totalAmount}</span>
            )}
          </button>
        </div>
      </form>

      {/* Demo Online Payment Modal */}
      {demoPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Demo Payment Gateway</h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulated Sandbox for Viva Demonstration. Amount: <span className="text-white font-mono font-bold">₹{totalAmount}</span>
              </p>
            </div>

            <div className="p-3 bg-[#0D1321] rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Merchant:</span>
                <span className="font-semibold text-white">REROK Shield India</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="text-blue-400">Instant UPI / NetBanking</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDemoPaymentModal(false)}
                className="flex-1 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => finalizeOrder('Online')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>Simulate Success</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

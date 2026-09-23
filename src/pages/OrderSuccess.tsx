import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      try {
        const res = await api.getOrderById(orderId);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order details:', err);
      }
    }
    loadOrder();
  }, [orderId]);

  // Estimated delivery date (4 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Thank you for choosing REROK Shield. We are preparing your precision screen protection for dispatch.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-[#0D1321] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs text-slate-400">Order Reference</span>
            <p className="text-base font-mono font-bold text-blue-400">{order?.orderId || orderId}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-slate-400">Estimated Delivery</span>
            <p className="text-sm font-semibold text-emerald-400 flex items-center sm:justify-end gap-1.5">
              <Truck className="w-4 h-4" />
              <span>{formattedDeliveryDate}</span>
            </p>
          </div>
        </div>

        {/* Shipping Destination */}
        {order?.shippingAddress && (
          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white text-sm mb-1">Delivering To:</p>
            <p>{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="text-slate-400 pt-1">Payment: {order.paymentMethod === 'Online' ? 'Demo Online Paid' : 'Cash on Delivery'}</p>
          </div>
        )}

        {/* Ordered Items */}
        {order?.items && order.items.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ordered Items</h3>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-[#111827] p-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-slate-400 text-[11px]">Model: {item.selectedModel || 'Standard'} × {item.quantity}</p>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-white">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        {order?.totalAmount && (
          <div className="flex justify-between items-center pt-2 text-sm font-bold text-white">
            <span>Total Paid / Payable</span>
            <span className="text-lg font-mono text-blue-400">₹{order.totalAmount}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl text-center shadow-md transition-colors"
          >
            Track in My Orders
          </Link>
          <Link
            to="/shop"
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl text-center border border-slate-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

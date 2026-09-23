import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'Shipped':
        return <span className="text-blue-400 font-semibold flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
      case 'Packed':
        return <span className="text-purple-400 font-semibold flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Packed</span>;
      default:
        return <span className="text-amber-400 font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Processing</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Order History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track active shipments and review previous mobile protection purchases.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1321] border border-slate-800 rounded-2xl space-y-4">
          <Shield className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't ordered any screen protection yet. Browse our device catalog to protect your phone.
          </p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
          >
            Explore Protection
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="p-5 sm:p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-blue-400">{order.orderId}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Ship to: <span className="text-slate-200">{order.shippingAddress?.fullName}</span> ({order.shippingAddress?.city})
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <span className="font-mono font-bold text-white text-base">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-slate-400">({item.selectedModel || 'Universal'} × {item.quantity})</span>
                    </div>
                    <span className="font-mono text-slate-300">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800/60 flex justify-end">
                <Link
                  to={`/order-success/${order.orderId}`}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>View Tracking Receipt</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

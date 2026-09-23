import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, CheckCircle2, Truck, Package, Clock, XCircle, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAllAdminOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
      setOrders(prev =>
        prev.map(o => (o.orderId === orderId || o._id === orderId ? { ...o, orderStatus: newStatus as any } : o))
      );
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o => {
    const term = search.toLowerCase();
    const matchesSearch =
      o.orderId.toLowerCase().includes(term) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(term) ||
      o.shippingAddress?.email?.toLowerCase().includes(term) ||
      o.shippingAddress?.city?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Order Fulfillment Operations</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Process customer orders, update dispatch statuses, and monitor deliveries.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email, or city..."
            className="w-full bg-[#0D1321] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0D1321] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0D1321] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Order ID & Date</th>
                <th className="p-3">Customer Information</th>
                <th className="p-3">Items Ordered</th>
                <th className="p-3">Total & Payment</th>
                <th className="p-3">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(order => (
                <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <p className="font-mono font-bold text-blue-400">{order.orderId}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-white">{order.shippingAddress?.fullName}</p>
                    <p className="text-[11px] text-slate-400">{order.shippingAddress?.email}</p>
                    <p className="text-[11px] text-slate-400">{order.shippingAddress?.phone} · {order.shippingAddress?.city}</p>
                  </td>

                  <td className="p-3">
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-[11px]">
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-slate-400"> ({item.selectedModel || 'Universal'} × {item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="font-mono font-bold text-white text-sm">₹{order.totalAmount}</p>
                    <span className="text-[11px] text-slate-400">
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3">
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order.orderId}
                      onChange={e => handleStatusChange(order.orderId || order._id, e.target.value)}
                      className={`bg-[#111827] border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                        order.orderStatus === 'Delivered'
                          ? 'border-emerald-500/50 text-emerald-400'
                          : order.orderStatus === 'Shipped'
                          ? 'border-blue-500/50 text-blue-400'
                          : order.orderStatus === 'Packed'
                          ? 'border-purple-500/50 text-purple-400'
                          : order.orderStatus === 'Cancelled'
                          ? 'border-rose-500/50 text-rose-400'
                          : 'border-amber-500/50 text-amber-400'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  Boxes
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminStats, Order } from '../../types';
import { DashboardCardSkeleton } from '../../components/LoadingSkeleton';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, ordersData] = await Promise.all([
          api.getAdminStats(),
          api.getAllAdminOrders()
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.orders?.slice(0, 5) || []);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Store Analytics Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'All-time gross sales',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      sub: `${stats?.pendingOrders || 0} pending fulfillment`,
      icon: ShoppingCart,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Catalog Items',
      value: stats?.totalProducts || 0,
      sub: 'Active protection SKUs',
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      sub: 'Registered buyer accounts',
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Overview of sales performance, active catalog inventory, and fulfillment operations.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0D1321] border border-slate-800 flex items-start justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <p className="text-2xl font-extrabold text-white font-mono mt-1">
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{card.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Revenue Breakdown Chart Representation */}
      <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Day Revenue Velocity
            </h2>
            <p className="text-xs text-slate-400">Order volumes and gross turnover per day</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this week</span>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40">
          {stats?.salesBreakdown?.map((day, dIdx) => {
            const maxRev = Math.max(...(stats.salesBreakdown?.map(d => d.revenue) || [1]));
            const heightPercent = Math.max(15, Math.round((day.revenue / maxRev) * 100));

            return (
              <div key={dIdx} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  ₹{day.revenue}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-blue-600/80 group-hover:bg-blue-500 rounded-t-md transition-all relative"
                />
                <span className="text-[11px] text-slate-400 font-medium mt-2">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-xl bg-[#0D1321] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-400">{order.orderId}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{order.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-slate-400">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="p-3">
                    {order.items?.length || 1} protection item(s)
                  </td>
                  <td className="p-3 font-mono font-bold text-white">₹{order.totalAmount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-400">
                    {order.paymentMethod} ({order.paymentStatus})
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

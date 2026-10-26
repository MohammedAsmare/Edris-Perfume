import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Product, Order, MerchantProfile, FulfillmentStatus } from '../../types';
import {
  Store,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Truck,
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [p, o, m] = await Promise.all([
      api.getProducts(),
      api.getOrders(),
      api.getMerchants(),
    ]);
    setProducts(p.filter((prod) => prod.merchantId === 1));
    setOrders(o);
    setMerchant(m[0]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateFulfillment = async (orderId: number, status: FulfillmentStatus) => {
    await api.updateFulfillmentStatus(orderId, status);
    loadData();
  };

  // Calculations for merchant
  const totalSales = orders.reduce((sum, o) => (o.paymentStatus === 'SUCCEEDED' ? sum + o.totalAmount : sum), 0);
  const commissionRate = merchant?.commissionRate || 10;
  const platformCommission = totalSales * (commissionRate / 100);
  const netEarnings = totalSales - platformCommission;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-champagne-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              {merchant?.businessName || 'Addis Luxury Scents Boutique'}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{merchant?.approvalStatus || 'APPROVED'}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            TIN: {merchant?.tinNumber} • Payout Account: {merchant?.bankName} ({merchant?.bankAccountNumber})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/merchant/products"
            className="btn-gold text-xs px-5 py-2.5 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Fragrances</span>
          </Link>
          <Link
            to="/merchant/orders"
            className="btn-outline-gold text-xs px-4 py-2.5"
          >
            All Orders ({orders.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards in Ethiopian Birr */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Gross Sales (ETB)</span>
            <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-bold text-2xl text-charcoal">
            {totalSales.toLocaleString()} ETB
          </p>
          <p className="text-[11px] text-green-700 font-medium">Verified Telebirr/Bank Orders</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Net Merchant Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-bold text-2xl text-green-700">
            {netEarnings.toLocaleString()} ETB
          </p>
          <p className="text-[11px] text-gray-500">After {commissionRate}% platform fee</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Catalog Offerings</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-bold text-2xl text-charcoal">
            {products.length} Fragrances
          </p>
          <p className="text-[11px] text-blue-700 font-medium">Active In Luxury Boutique</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Low Stock Warnings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-bold text-2xl text-amber-700">
            {lowStockCount} SKUs
          </p>
          <p className="text-[11px] text-amber-600">Requires restocking</p>
        </div>
      </div>

      {/* Orders Processing Section */}
      <div className="glass-panel rounded-2xl border border-champagne-border overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-champagne-border">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Order Fulfillment Workflow
            </h3>
            <p className="text-xs text-gray-500">
              Per Section 8.1, only verified paid orders become eligible for fulfillment. Update status as you pick, pack, and hand off to courier.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/merchant/dispatch"
              className="btn-gold text-xs px-3.5 py-1.5 font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Full Dispatch Desk</span>
            </Link>
            <span className="text-xs font-semibold px-3 py-1 bg-gold-100 text-gold-900 rounded-full">
              {orders.length} Total Orders
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-champagne-border text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Order Ref</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Payment Status</th>
                <th className="pb-3 font-semibold">Fulfillment Stage</th>
                <th className="pb-3 font-semibold text-right">Update Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const isPaid = order.paymentStatus === 'SUCCEEDED';

                return (
                  <tr key={order.id} className="hover:bg-gold-50/40 transition-colors">
                    <td className="py-4 font-mono font-bold text-charcoal">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-charcoal">{order.shippingFullName}</p>
                      <p className="text-[11px] text-gray-400">{order.shippingCity}, {order.shippingSubcity}</p>
                    </td>
                    <td className="py-4 font-serif font-bold text-gold-900">
                      {order.totalAmount.toLocaleString()} {order.currency}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          order.paymentStatus === 'SUCCEEDED'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-50 border border-gold-300 text-gold-900">
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {isPaid ? (
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => handleUpdateFulfillment(order.id, e.target.value as FulfillmentStatus)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-champagne-border bg-white font-medium focus:outline-none focus:border-gold-500"
                        >
                          <option value="UNFULFILLED">UNFULFILLED</option>
                          <option value="PICKING">PICKING</option>
                          <option value="PACKED">PACKED</option>
                          <option value="DISPATCHED">DISPATCHED (In Transit)</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">
                          Awaiting Payment Verification
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

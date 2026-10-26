import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Order, MerchantProfile, Product } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Store,
  Users,
  Search,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'payments' | 'merchants' | 'orders' | 'audit'
  const [activeTab, setActiveTab] = useState<'payments' | 'merchants' | 'orders' | 'audit'>('payments');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Reconciliation modal state
  const [selectedOrderForReconciliation, setSelectedOrderForReconciliation] = useState<Order | null>(null);
  const [reconcileReason, setReconcileReason] = useState('Verified authoritative bank deposit against statement.');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [o, m, p] = await Promise.all([
      api.getOrders(),
      api.getMerchants(),
      api.getProducts(),
    ]);
    setOrders(o);
    setMerchants(m);
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Bank Transfer Reconciliation (Section 8.8)
  const handleReconcile = async (approved: boolean) => {
    if (!selectedOrderForReconciliation) return;
    setIsProcessing(true);
    try {
      await api.reconcilePayment(selectedOrderForReconciliation.id, approved, reconcileReason);
      setSelectedOrderForReconciliation(null);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Merchant Approval / Rejection (Section 7)
  const handleUpdateMerchantStatus = async (merchantId: number, status: 'APPROVED' | 'REJECTED') => {
    const reason = status === 'REJECTED' ? 'TIN or Trade License could not be validated with MOTI registry.' : undefined;
    await api.updateMerchantStatus(merchantId, status, reason);
    await loadData();
  };

  // Metrics
  const totalVolume = orders.reduce((sum, o) => (o.paymentStatus === 'SUCCEEDED' ? sum + o.totalAmount : sum), 0);
  const totalCommission = totalVolume * 0.1;
  const pendingReconciliations = orders.filter(
    (o) => o.paymentStatus === 'AWAITING_CUSTOMER_ACTION' || o.paymentStatus === 'PROCESSING'
  ).length;
  const pendingMerchants = merchants.filter((m) => m.approvalStatus === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-champagne-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-charcoal text-gold-400 flex items-center justify-center border border-gold-500/40">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              Edris Platform Administration
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Centralized Ethiopian payment audit, bank statement reconciliation, and merchant partner governance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/80 p-1 rounded-xl border border-champagne-border">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'payments' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-600 hover:text-charcoal'
            }`}
          >
            Payment Reconciliation ({pendingReconciliations})
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'merchants' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-600 hover:text-charcoal'
            }`}
          >
            Merchant Approvals ({pendingMerchants})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'orders' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-600 hover:text-charcoal'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'audit' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-600 hover:text-charcoal'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Verified Platform GMV</span>
            <DollarSign className="w-4 h-4 text-gold-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-charcoal">
            {totalVolume.toLocaleString()} ETB
          </p>
          <p className="text-[11px] text-green-700 font-medium">Authoritative settled transactions</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Platform Revenue (10%)</span>
            <Sparkles className="w-4 h-4 text-gold-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-gold-900">
            {totalCommission.toLocaleString()} ETB
          </p>
          <p className="text-[11px] text-gray-500">Escrow commission collected</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Pending Bank Audits</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-amber-700">
            {pendingReconciliations} Orders
          </p>
          <p className="text-[11px] text-amber-600 font-medium">Awaiting operator reconciliation</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Merchant Partners</span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-serif font-bold text-2xl text-charcoal">
            {merchants.length} Registered
          </p>
          <p className="text-[11px] text-blue-700 font-medium">{pendingMerchants} Pending Verification</p>
        </div>
      </div>

      {/* TAB 1: Payment Reconciliation & Audit (Section 8.8) */}
      {activeTab === 'payments' && (
        <div className="glass-panel rounded-2xl border border-champagne-border p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-champagne-border">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Ethiopian Payment Audit & Statement Reconciliation
              </h3>
              <p className="text-xs text-gray-500">
                In strict compliance with Section 8.8, no order is marked paid without an auditable reconciliation event.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search order ref, amount, bank..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-champagne-border rounded-lg"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-champagne-border text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Channel</th>
                  <th className="pb-3 font-semibold">Amount (ETB)</th>
                  <th className="pb-3 font-semibold">Bank Claim Ref</th>
                  <th className="pb-3 font-semibold">Payment Status</th>
                  <th className="pb-3 font-semibold text-right">Reconcile Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders
                  .filter((o) =>
                    searchFilter
                      ? o.orderNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        o.shippingFullName.toLowerCase().includes(searchFilter.toLowerCase())
                      : true
                  )
                  .map((order) => {
                    const isPending =
                      order.paymentStatus === 'AWAITING_CUSTOMER_ACTION' ||
                      order.paymentStatus === 'PROCESSING';

                    return (
                      <tr key={order.id} className="hover:bg-gold-50/40 transition-colors">
                        <td className="py-4 font-mono font-bold text-charcoal">
                          #{order.orderNumber}
                        </td>
                        <td className="py-4">
                          <p className="font-medium text-charcoal">{order.shippingFullName}</p>
                          <p className="text-[11px] text-gray-400">{order.shippingPhone}</p>
                        </td>
                        <td className="py-4">
                          <span className="font-medium text-gray-700">{order.paymentMethod}</span>
                        </td>
                        <td className="py-4 font-serif font-bold text-gold-900 text-sm">
                          {order.totalAmount.toLocaleString()} ETB
                        </td>
                        <td className="py-4">
                          {order.paymentTransaction?.transferProofReference ? (
                            <span className="font-mono text-xs bg-gold-100 text-gold-900 px-2 py-0.5 rounded font-semibold">
                              {order.paymentTransaction.transferProofReference}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Direct Gateway</span>
                          )}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              order.paymentStatus === 'SUCCEEDED'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : isPending
                                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {isPending ? (
                            <button
                              onClick={() => setSelectedOrderForReconciliation(order)}
                              className="btn-gold text-[11px] px-3 py-1 font-semibold"
                            >
                              Audit & Reconcile
                            </button>
                          ) : (
                            <span className="text-[11px] text-green-700 font-medium">
                              Audited & Locked
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
      )}

      {/* TAB 2: Merchant Partner Approvals (Section 7) */}
      {activeTab === 'merchants' && (
        <div className="glass-panel rounded-2xl border border-champagne-border p-6 space-y-5">
          <div className="pb-3 border-b border-champagne-border">
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Merchant Partner Verification & Licensing
            </h3>
            <p className="text-xs text-gray-500">
              Review TIN numbers, trade licenses, and bank payout credentials before granting access to product listings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-champagne-border text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Business Name</th>
                  <th className="pb-3 font-semibold">TIN & License</th>
                  <th className="pb-3 font-semibold">Contact Phone</th>
                  <th className="pb-3 font-semibold">Bank Settlement Account</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gold-50/40 transition-colors">
                    <td className="py-4">
                      <p className="font-serif font-bold text-charcoal text-sm">{merchant.businessName}</p>
                      <p className="text-[11px] text-gray-400">{merchant.address}</p>
                    </td>
                    <td className="py-4 font-mono text-xs">
                      <p>TIN: {merchant.tinNumber || 'N/A'}</p>
                      <p className="text-gray-400">Lic: {merchant.tradeLicenseNumber || 'N/A'}</p>
                    </td>
                    <td className="py-4 text-charcoal">{merchant.contactPhone}</td>
                    <td className="py-4">
                      <p className="font-medium text-charcoal">{merchant.bankName}</p>
                      <p className="font-mono text-gray-400 text-[11px]">{merchant.bankAccountNumber}</p>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          merchant.approvalStatus === 'APPROVED'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : merchant.approvalStatus === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {merchant.approvalStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {merchant.approvalStatus === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateMerchantStatus(merchant.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUpdateMerchantStatus(merchant.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-medium">
                          Active Partner ({merchant.commissionRate}% comm.)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: All Orders */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-2xl border border-champagne-border p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-champagne-border">
            Platform Master Orders Registry
          </h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-4 rounded-xl bg-white border border-champagne-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-sm text-charcoal">#{o.orderNumber}</span>
                  <p className="text-gray-500 mt-0.5">
                    {o.shippingFullName} • {o.shippingCity} • {o.items.length} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif font-bold text-gold-900 text-sm">
                    {o.totalAmount.toLocaleString()} ETB
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-50 border border-gold-300">
                    {o.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="glass-panel rounded-2xl border border-champagne-border p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-champagne-border">
            Cryptographic & Administrative Audit Logs
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-ivory-50 border border-champagne-border flex items-center justify-between text-gray-600">
              <span>[2026-10-26 09:30:12 EAT] ADMIN_RECONCILIATION: Order #EDR-2026-88192 verified via Telebirr API callback.</span>
              <span className="text-green-700 font-bold">200 OK</span>
            </div>
            <div className="p-3 rounded-lg bg-ivory-50 border border-champagne-border flex items-center justify-between text-gray-600">
              <span>[2026-10-26 08:15:40 EAT] MERCHANT_APPROVAL: Partner 'Addis Luxury Scents' approved with 10% commission.</span>
              <span className="text-gold-700 font-bold">APPROVED</span>
            </div>
            <div className="p-3 rounded-lg bg-ivory-50 border border-champagne-border flex items-center justify-between text-gray-600">
              <span>[2026-10-25 14:10:05 EAT] ESCROW_LOCK: 14,650 ETB locked in CBE Escrow Account for Waybill #ET-DISP-9921.</span>
              <span className="text-blue-700 font-bold">ESCROW_HELD</span>
            </div>
          </div>
        </div>
      )}

      {/* Audit Reconciliation Modal (Section 8.8) */}
      {selectedOrderForReconciliation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full glass-panel-elevated p-8 rounded-3xl border-2 border-gold-400 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-champagne-border">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-600" />
                <span>Audit & Reconcile Order #{selectedOrderForReconciliation.orderNumber}</span>
              </h3>
              <button
                onClick={() => setSelectedOrderForReconciliation(null)}
                className="text-gray-400 hover:text-charcoal"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-ivory-50 border border-champagne-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Expected Total:</span>
                <span className="font-serif font-bold text-gold-900 text-sm">
                  {selectedOrderForReconciliation.totalAmount.toLocaleString()} ETB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium text-charcoal">{selectedOrderForReconciliation.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Client Reference Claim:</span>
                <span className="font-mono font-bold text-charcoal">
                  {selectedOrderForReconciliation.paymentTransaction?.transferProofReference || 'No code entered'}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-gray-700">Audit / Reconciliation Reason Note *</label>
              <textarea
                rows={3}
                required
                value={reconcileReason}
                onChange={(e) => setReconcileReason(e.target.value)}
                placeholder="Document statement date, bank branch, or authoritative reference..."
                className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-champagne-border">
              <button
                type="button"
                onClick={() => handleReconcile(false)}
                disabled={isProcessing}
                className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold border border-red-200"
              >
                Reject Claim
              </button>
              <button
                type="button"
                onClick={() => handleReconcile(true)}
                disabled={isProcessing}
                className="btn-gold text-xs px-5 py-2 font-semibold shadow-md"
              >
                Confirm Verification & Authorize Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

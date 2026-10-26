import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Order, DeliveryPartner, DeliveryAssignment } from '../../types';
import { OrderTable } from '../../components/merchant/OrderTable';
import { OrderDetailsDrawer } from '../../components/merchant/OrderDetailsDrawer';
import { DeliveryAssignmentDialog } from '../../components/merchant/DeliveryAssignmentDialog';
import { CloseOrderConfirmationDialog } from '../../components/merchant/CloseOrderConfirmationDialog';
import {
  Store,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

export const MerchantDispatchPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals & Drawer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [closingOrder, setClosingOrder] = useState<Order | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordList, assignList, partnerList] = await Promise.all([
        api.getOrders(),
        api.getDeliveryAssignments(),
        api.getDeliveryPartners(),
      ]);
      setOrders(ordList);
      setAssignments(assignList);
      setPartners(partnerList);

      // If drawer is open, keep selected order updated
      if (selectedOrder) {
        const refreshed = ordList.find((o) => o.id === selectedOrder.id);
        if (refreshed) setSelectedOrder(refreshed);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to load merchant orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Workflow Handlers
  const handleAccept = async (orderId: number) => {
    try {
      const updated = await api.merchantAcceptOrder(orderId);
      showToast(`Order #${updated.orderNumber} accepted for preparation in boutique.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to accept order', 'error');
    }
  };

  const handleReadyPickup = async (orderId: number) => {
    try {
      const updated = await api.merchantReadyForPickup(orderId);
      showToast(`Order #${updated.orderNumber} packed and marked ready for courier pickup.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to mark ready for pickup', 'error');
    }
  };

  const handleOpenAssignDialog = (order: Order) => {
    setAssigningOrder(order);
    setIsAssignDialogOpen(true);
  };

  const handleConfirmAssign = async (orderId: number, partnerId: number, instructions?: string) => {
    try {
      const res = await api.merchantAssignDelivery(orderId, partnerId, instructions);
      showToast(`Courier ${res.assignment.partnerName} assigned. 6-digit delivery PIN generated.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to assign delivery partner', 'error');
      throw err;
    }
  };

  const handleHandover = async (orderId: number) => {
    try {
      const res = await api.merchantHandover(orderId);
      showToast(`Package handed over to courier ${res.assignment.partnerName}. Ready to start transit.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to record package handover', 'error');
    }
  };

  const handleOpenCloseDialog = (order: Order) => {
    // Enrich with assignment
    const assign = assignments.find((a) => a.orderId === order.id);
    setClosingOrder({ ...order, deliveryAssignment: assign });
    setIsCloseDialogOpen(true);
  };

  const handleConfirmClose = async (orderId: number, notes?: string) => {
    try {
      const closed = await api.merchantCloseOrder(orderId, notes);
      showToast(`Order #${closed.orderNumber} successfully verified, closed, and archived.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to close order', 'error');
      throw err;
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const reason = window.prompt('Please enter the formal reason for cancellation:');
    if (!reason || !reason.trim()) return;

    try {
      const cancelled = await api.merchantCancelOrder(orderId, reason.trim());
      showToast(`Order #${cancelled.orderNumber} cancelled and return workflow initiated.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to cancel order', 'error');
    }
  };

  const handleViewDetails = (order: Order) => {
    const assign = assignments.find((a) => a.orderId === order.id);
    setSelectedOrder({ ...order, deliveryAssignment: assign });
    setIsDrawerOpen(true);
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    // Search
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.shippingFullName.toLowerCase().includes(q) ||
      order.shippingPhone.includes(q) ||
      order.shippingAddressLine.toLowerCase().includes(q) ||
      (order.shippingSubcity && order.shippingSubcity.toLowerCase().includes(q));

    // Fulfillment Filter
    const matchesFulfillment =
      fulfillmentFilter === 'ALL' || order.fulfillmentStatus === fulfillmentFilter;

    // Order Status Filter
    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;

    return matchesSearch && matchesFulfillment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Summary Metrics
  const countUnfulfilled = orders.filter((o) => o.fulfillmentStatus === 'UNFULFILLED').length;
  const countPacked = orders.filter((o) => o.fulfillmentStatus === 'PACKED' || o.fulfillmentStatus === 'PICKED_UP').length;
  const countInTransit = orders.filter((o) => o.fulfillmentStatus === 'DISPATCHED').length;
  const countDeliveredPendingClose = orders.filter(
    (o) => o.fulfillmentStatus === 'DELIVERED' && o.orderStatus !== 'DELIVERED'
  ).length;
  const countClosed = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-12 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-md transition-all animate-in slide-in-from-top-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-400/40 shadow-emerald-900/20'
              : 'bg-rose-900/90 text-white border-rose-400/40 shadow-rose-900/20'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Boutique Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-800">
              <Store className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Merchant Order Taking & Dispatch
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Addis Luxury Scents Boutique • Bole Medhanialem Mall, 2nd Floor, Addis Ababa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/merchant/products"
            className="px-4 py-2 text-xs font-serif font-bold rounded-xl bg-white text-stone-800 border border-stone-300 hover:border-amber-400 shadow-xs transition-all"
          >
            Manage Fragrances
          </Link>
          <Link
            to="/merchant"
            className="px-4 py-2 text-xs font-serif font-bold rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-sm transition-all"
          >
            Merchant Overview
          </Link>
        </div>
      </div>

      {/* Dispatch Lifecycle KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Unfulfilled / Action Required */}
        <div
          onClick={() => {
            setFulfillmentFilter('UNFULFILLED');
            setCurrentPage(1);
          }}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            fulfillmentFilter === 'UNFULFILLED'
              ? 'bg-amber-100/70 border-amber-500 ring-2 ring-amber-300'
              : 'bg-white/80 border-stone-200/90 hover:border-amber-300 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-amber-900">
              New Orders
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900">{countUnfulfilled}</div>
          <div className="text-[10px] text-stone-400 mt-1">Review & Accept</div>
        </div>

        {/* Ready for Pickup */}
        <div
          onClick={() => {
            setFulfillmentFilter('PACKED');
            setCurrentPage(1);
          }}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            fulfillmentFilter === 'PACKED'
              ? 'bg-purple-100/70 border-purple-500 ring-2 ring-purple-300'
              : 'bg-white/80 border-stone-200/90 hover:border-purple-300 hover:bg-purple-50/30'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-purple-900">
              Ready / Handover
            </span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900">{countPacked}</div>
          <div className="text-[10px] text-stone-400 mt-1">Assign Courier</div>
        </div>

        {/* In Transit */}
        <div
          onClick={() => {
            setFulfillmentFilter('DISPATCHED');
            setCurrentPage(1);
          }}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            fulfillmentFilter === 'DISPATCHED'
              ? 'bg-blue-100/70 border-blue-500 ring-2 ring-blue-300'
              : 'bg-white/80 border-stone-200/90 hover:border-blue-300 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-blue-900">
              In Transit
            </span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900">{countInTransit}</div>
          <div className="text-[10px] text-stone-400 mt-1">Live Doorstep Delivery</div>
        </div>

        {/* Delivered (Awaiting Merchant Closure) */}
        <div
          onClick={() => {
            setFulfillmentFilter('DELIVERED');
            setCurrentPage(1);
          }}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            fulfillmentFilter === 'DELIVERED'
              ? 'bg-emerald-100/70 border-emerald-500 ring-2 ring-emerald-300'
              : 'bg-white/80 border-stone-200/90 hover:border-emerald-300 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-emerald-900">
              Pending Closure
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-900">
            {countDeliveredPendingClose}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Review Proof & Close</div>
        </div>

        {/* Closed & Archived */}
        <div
          onClick={() => {
            setStatusFilter('DELIVERED');
            setFulfillmentFilter('ALL');
            setCurrentPage(1);
          }}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            statusFilter === 'DELIVERED'
              ? 'bg-stone-200 border-stone-500 ring-2 ring-stone-400'
              : 'bg-white/80 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-stone-900">
              Closed Orders
            </span>
            <CheckCircle2 className="w-4 h-4 text-stone-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900">{countClosed}</div>
          <div className="text-[10px] text-stone-400 mt-1">Full Audit History</div>
        </div>
      </div>

      {/* Main Order Table Component */}
      <OrderTable
        orders={paginatedOrders}
        assignments={assignments}
        partners={partners}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        fulfillmentFilter={fulfillmentFilter}
        onFulfillmentFilterChange={(val) => {
          setFulfillmentFilter(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onAccept={handleAccept}
        onReadyPickup={handleReadyPickup}
        onOpenAssignDialog={handleOpenAssignDialog}
        onHandover={handleHandover}
        onOpenCloseDialog={handleOpenCloseDialog}
      />

      {/* Slide-over Drawer for Order Details and Audit Timeline */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAccept={handleAccept}
        onReadyPickup={handleReadyPickup}
        onOpenAssignDialog={handleOpenAssignDialog}
        onHandover={handleHandover}
        onOpenCloseDialog={handleOpenCloseDialog}
        onCancel={handleCancelOrder}
      />

      {/* Dialog for Assigning Authorized Delivery Courier */}
      <DeliveryAssignmentDialog
        order={assigningOrder}
        partners={partners}
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onAssign={handleConfirmAssign}
      />

      {/* Dialog for Reviewing Proof and Closing Order */}
      <CloseOrderConfirmationDialog
        order={closingOrder}
        isOpen={isCloseDialogOpen}
        onClose={() => setIsCloseDialogOpen(false)}
        onConfirmClose={handleConfirmClose}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Order, OrderStatusHistory, DeliveryAssignment } from '../../types';
import { api } from '../../services/api';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { ProofOfDeliveryPanel } from './ProofOfDeliveryPanel';
import {
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (orderId: number) => void;
  onReadyPickup: (orderId: number) => void;
  onOpenAssignDialog: (order: Order) => void;
  onHandover: (orderId: number) => void;
  onOpenCloseDialog: (order: Order) => void;
  onCancel: (orderId: number) => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onAccept,
  onReadyPickup,
  onOpenAssignDialog,
  onHandover,
  onOpenCloseDialog,
  onCancel,
}) => {
  const [timeline, setTimeline] = useState<OrderStatusHistory[]>([]);
  const [assignment, setAssignment] = useState<DeliveryAssignment | undefined>(undefined);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details');

  useEffect(() => {
    if (order && isOpen) {
      loadOrderData(order.id);
    }
  }, [order, isOpen]);

  const loadOrderData = async (orderId: number) => {
    try {
      setIsLoadingTimeline(true);
      const [hist, assigns] = await Promise.all([
        api.getOrderTimeline(orderId),
        api.getDeliveryAssignments(),
      ]);
      setTimeline(hist);
      const matchedAssign = assigns.find((a) => a.orderId === orderId);
      setAssignment(matchedAssign);
    } catch (err) {
      console.error('Failed to load order details', err);
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  if (!isOpen || !order) return null;

  const fStatus = order.fulfillmentStatus;
  const canAccept = fStatus === 'UNFULFILLED';
  const canMarkReady = fStatus === 'PICKING';
  const canAssign = fStatus === 'PACKED' && (!assignment || assignment.status === 'CANCELLED');
  const canHandover = (fStatus === 'PACKED' || fStatus === 'PICKING') && assignment && assignment.status === 'ASSIGNED';
  const canClose = fStatus === 'DELIVERED' && order.orderStatus !== 'DELIVERED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 overflow-hidden">
        {/* Header with Luxury Gold Gradient */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold tracking-wide">
                    {order.orderNumber}
                  </h3>
                  <OrderStatusBadge status={order.orderStatus} size="sm" />
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-white/10">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'details'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white/10 text-stone-300 hover:bg-white/15'
              }`}
            >
              Order & Delivery Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white/10 text-stone-300 hover:bg-white/15'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Full Audit Timeline ({timeline.length})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'timeline' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-800">
                  Comprehensive State Audit Trail
                </h4>
                <span className="text-xs text-stone-500 font-mono">Immutable Log</span>
              </div>
              <OrderTimeline timeline={timeline} isLoading={isLoadingTimeline} />
            </div>
          ) : (
            <>
              {/* Primary Dispatch Action Banner */}
              <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold mb-1">
                    Current Fulfillment Phase
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge fulfillmentStatus={order.fulfillmentStatus} size="lg" />
                  </div>
                </div>

                {/* Workflow Transitions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {canAccept && (
                    <button
                      onClick={() => onAccept(order.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-serif font-bold shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Accept Order
                    </button>
                  )}
                  {canMarkReady && (
                    <button
                      onClick={() => onReadyPickup(order.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl text-xs font-serif font-bold shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      Mark Ready for Pickup
                    </button>
                  )}
                  {canAssign && (
                    <button
                      onClick={() => onOpenAssignDialog(order)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-xs font-serif font-bold shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Assign Courier
                    </button>
                  )}
                  {canHandover && (
                    <button
                      onClick={() => onHandover(order.id)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-xs font-serif font-bold shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Record Handover
                    </button>
                  )}
                  {canClose && (
                    <button
                      onClick={() => onOpenCloseDialog(order)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-serif font-bold shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Review & Close Order
                    </button>
                  )}
                </div>
              </div>

              {/* Proof of Delivery (if delivered or assigned) */}
              {(assignment || order.deliveryOtp) && (
                <ProofOfDeliveryPanel
                  assignment={assignment}
                  deliveryOtp={order.deliveryOtp}
                />
              )}

              {/* Assigned Delivery Courier Section */}
              {assignment && (
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-900">
                        Assigned Courier Partner
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border">
                      {assignment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Courier Name:</span>
                      <span className="font-semibold text-stone-900">{assignment.partnerName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Contact:</span>
                      <span className="font-mono text-stone-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-600" />
                        {assignment.partnerPhone}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Vehicle:</span>
                      <span className="text-stone-800">{assignment.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">License Plate:</span>
                      <span className="font-mono text-stone-800">{assignment.licensePlate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer & Delivery Address Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-900 font-serif text-xs font-bold uppercase tracking-wider border-b border-stone-100 pb-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>Customer Information</span>
                  </div>
                  <div className="text-xs space-y-1.5">
                    <p className="font-semibold text-stone-900">{order.shippingFullName}</p>
                    <p className="text-stone-600 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-stone-400" />
                      {order.customerEmail || 'customer@edrisperfume.et'}
                    </p>
                    <p className="text-stone-600 flex items-center gap-1.5 font-mono">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {order.shippingPhone}
                    </p>
                  </div>
                </div>

                {/* Shipping Destination */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-900 font-serif text-xs font-bold uppercase tracking-wider border-b border-stone-100 pb-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Doorstep Address</span>
                  </div>
                  <div className="text-xs space-y-1 text-stone-700">
                    <p className="font-medium text-stone-900">{order.shippingAddressLine}</p>
                    <p>{order.shippingSubcity && `${order.shippingSubcity}, `}{order.shippingCity}, Ethiopia</p>
                    {order.shippingNotes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/50 mt-1">
                        Note: &ldquo;{order.shippingNotes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2 text-stone-900 font-serif text-xs font-bold uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Payment Information</span>
                  </div>
                  <OrderStatusBadge paymentStatus={order.paymentStatus} size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Method:</span>
                    <span className="font-medium text-stone-900">{order.paymentMethod || 'Telebirr'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Total Settled:</span>
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      {order.totalAmount.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-900">
                    Fragrance Flacons & Items ({order.items.length})
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    Subtotal: {order.subtotal.toLocaleString()} ETB
                  </span>
                </div>
                <div className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200'}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-medium text-stone-900">{item.productName}</div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            SKU: {item.sku} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-stone-900">
                          {item.subtotal.toLocaleString()} ETB
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {item.unitPrice.toLocaleString()} ETB each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-stone-50/60 border-t border-stone-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{order.subtotal.toLocaleString()} ETB</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Loyalty / Voucher Discount:</span>
                      <span className="font-mono">-{order.discountAmount.toLocaleString()} ETB</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>White Glove Courier Delivery:</span>
                    <span className="font-mono">{order.deliveryFee.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 text-sm pt-1.5 border-t border-stone-200">
                    <span>Total Amount:</span>
                    <span className="font-mono text-amber-800">{order.totalAmount.toLocaleString()} ETB</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => onCancel(order.id)}
            disabled={order.orderStatus === 'DELIVERED'}
            className="text-xs text-rose-700 hover:text-rose-900 disabled:opacity-30 transition-colors font-medium"
          >
            Cancel / Return Workflow
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl transition-all shadow-xs"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

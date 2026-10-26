import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { DeliveryTracker } from '../../components/customer/DeliveryTracker';
import { Package, Clock, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
      if (data.length > 0) {
        setExpandedOrderId(data[0].id);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
          Client Privileges
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal">
          My Fragrance Acquisitions & Delivery
        </h1>
        <p className="text-xs text-gray-500 font-light mt-1">
          Track the packaging, authoritative payment verification, and white-glove courier status of your orders.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-xs font-serif">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl border border-champagne-border text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-charcoal">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You have not placed any orders yet. Discover our rare royal extraits and artisanal blends.
          </p>
          <Link to="/shop" className="btn-gold text-xs">
            Explore The Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="glass-panel rounded-2xl border border-champagne-border overflow-hidden transition-all duration-200"
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-gold-50/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-charcoal">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} •{' '}
                      <span className="font-serif font-bold text-gold-800 text-sm">
                        {order.totalAmount.toLocaleString()} {order.currency}
                      </span>
                    </p>
                  </div>

                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        order.paymentStatus === 'SUCCEEDED'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : order.paymentStatus === 'FAILED'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}
                    >
                      Payment: {order.paymentStatus.replace(/_/g, ' ')}
                    </span>

                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gold-50 border border-gold-300 text-gold-900">
                      Fulfillment: {order.fulfillmentStatus.replace(/_/g, ' ')}
                    </span>

                    <div className="p-1 rounded-full text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-champagne-border/60 space-y-6 animate-in fade-in duration-200">
                    {/* Delivery Tracker Component */}
                    <DeliveryTracker
                      orderStatus={order.orderStatus}
                      paymentStatus={order.paymentStatus}
                      fulfillmentStatus={order.fulfillmentStatus}
                      trackingNumber={order.trackingNumber}
                      orderNumber={order.orderNumber}
                    />

                    {/* Items List */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-sm font-bold text-charcoal">
                        Purchased Fragrances
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-white/70 border border-champagne-border flex items-center gap-3"
                          >
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200'}
                              alt={item.productName}
                              className="w-12 h-14 object-cover rounded-lg border border-champagne-border"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-serif font-bold text-charcoal truncate">
                                {item.productName}
                              </p>
                              <p className="text-gray-500 text-[11px]">SKU: {item.sku}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-gray-500">Qty: {item.quantity}</span>
                                <span className="font-serif font-bold text-gold-800">
                                  {item.subtotal.toLocaleString()} ETB
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Metadata Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-ivory-50 border border-champagne-border space-y-1.5">
                        <p className="font-semibold text-gold-800">Shipping Details</p>
                        <p className="font-medium text-charcoal">{order.shippingFullName}</p>
                        <p className="text-gray-600">{order.shippingPhone}</p>
                        <p className="text-gray-600">
                          {order.shippingAddressLine}, {order.shippingSubcity && `${order.shippingSubcity}, `}{order.shippingCity}
                        </p>
                        {order.shippingNotes && (
                          <p className="text-[11px] text-gray-500 italic">"{order.shippingNotes}"</p>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-ivory-50 border border-champagne-border space-y-1.5">
                        <p className="font-semibold text-gold-800">Payment Audit Record</p>
                        <p className="text-gray-600">Channel: <span className="font-medium text-charcoal">{order.paymentMethod}</span></p>
                        {order.paymentTransaction && (
                          <>
                            <p className="text-gray-600">
                              Claim Ref: <span className="font-mono font-semibold">{order.paymentTransaction.transferProofReference || order.paymentTransaction.transactionReference}</span>
                            </p>
                            {order.paymentTransaction.adminReconciliationNotes && (
                              <p className="text-[11px] text-green-700 font-medium">
                                Audit Note: {order.paymentTransaction.adminReconciliationNotes}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

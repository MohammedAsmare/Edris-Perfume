import React from 'react';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '../../types';
import { CheckCircle2, Clock, PackageCheck, Truck, ShieldAlert, Sparkles } from 'lucide-react';

interface DeliveryTrackerProps {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  orderNumber: string;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  orderStatus,
  paymentStatus,
  fulfillmentStatus,
  trackingNumber,
  orderNumber,
}) => {
  const isPaid = paymentStatus === 'SUCCEEDED';
  const isCancelled = orderStatus === 'CANCELLED' || paymentStatus === 'CANCELLED';

  const steps = [
    {
      id: 'order_placed',
      title: 'Order Placed',
      desc: `Ref: ${orderNumber}`,
      completed: true,
      current: orderStatus === 'PENDING_PAYMENT' && !isPaid,
      icon: Clock,
    },
    {
      id: 'payment_verified',
      title: 'Payment Verified',
      desc: isPaid ? 'Telebirr/Bank verified' : 'Pending authoritative proof',
      completed: isPaid,
      current: !isPaid && paymentStatus === 'PROCESSING',
      icon: CheckCircle2,
    },
    {
      id: 'picking_packing',
      title: 'Artisan Packaging',
      desc: 'Sealed with gold wax & velvet',
      completed: fulfillmentStatus === 'PACKED' || fulfillmentStatus === 'DISPATCHED' || fulfillmentStatus === 'DELIVERED',
      current: isPaid && fulfillmentStatus === 'PICKING',
      icon: PackageCheck,
    },
    {
      id: 'dispatched',
      title: 'Dispatched & Courier',
      desc: trackingNumber ? `Waybill: ${trackingNumber}` : 'White-glove dispatch',
      completed: fulfillmentStatus === 'DISPATCHED' || fulfillmentStatus === 'DELIVERED',
      current: fulfillmentStatus === 'PACKED',
      icon: Truck,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      desc: 'Doorstep luxury handover',
      completed: fulfillmentStatus === 'DELIVERED',
      current: fulfillmentStatus === 'DISPATCHED',
      icon: Sparkles,
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-champagne-border">
      {/* Status Badges Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-champagne-border/70">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-700">
            Fulfillment & Delivery Audit
          </span>
          <h3 className="font-serif text-lg font-bold text-charcoal">
            Order #{orderNumber}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Order Status */}
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-ivory-200 border border-champagne-border text-charcoal">
            Order: {orderStatus.replace(/_/g, ' ')}
          </span>

          {/* Payment Status */}
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
              paymentStatus === 'SUCCEEDED'
                ? 'bg-green-50 border-green-200 text-green-700'
                : paymentStatus === 'FAILED'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
          >
            Payment: {paymentStatus.replace(/_/g, ' ')}
          </span>

          {/* Fulfillment Status */}
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gold-50 border border-gold-300 text-gold-900">
            Fulfillment: {fulfillmentStatus.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {isCancelled ? (
        <div className="py-8 text-center text-red-600 flex flex-col items-center gap-2">
          <ShieldAlert className="w-8 h-8" />
          <p className="font-serif font-bold text-base">This Order Has Been Cancelled</p>
          <p className="text-xs text-gray-500">Contact customer support for assistance or refunds.</p>
        </div>
      ) : (
        /* Progress Steps */
        <div className="pt-8">
          <div className="relative">
            {/* Connecting Bar */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-champagne-border -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="flex md:flex-col items-center md:text-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        step.completed
                          ? 'bg-gold-500 border-gold-500 text-white shadow-md'
                          : step.current
                          ? 'bg-white border-gold-500 text-gold-600 ring-4 ring-gold-500/20 animate-pulse'
                          : 'bg-white border-champagne-border text-gray-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 md:flex-initial">
                      <p
                        className={`text-xs font-semibold font-serif ${
                          step.completed || step.current ? 'text-charcoal' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

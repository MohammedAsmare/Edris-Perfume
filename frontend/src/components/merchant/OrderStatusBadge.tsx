import React from 'react';
import { OrderStatus, FulfillmentStatus, PaymentStatus } from '../../types';

interface OrderStatusBadgeProps {
  status?: OrderStatus;
  fulfillmentStatus?: FulfillmentStatus;
  paymentStatus?: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  fulfillmentStatus,
  paymentStatus,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  // If fulfillmentStatus is provided
  if (fulfillmentStatus) {
    const config: Record<FulfillmentStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
      UNFULFILLED: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-800',
        border: 'border-amber-300',
        dot: 'bg-amber-500',
        label: 'Unfulfilled / New',
      },
      PICKING: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-800',
        border: 'border-blue-300',
        dot: 'bg-blue-500 animate-pulse',
        label: 'Preparing & Packing',
      },
      PACKED: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-800',
        border: 'border-purple-300',
        dot: 'bg-purple-500',
        label: 'Ready for Pickup',
      },
      PICKED_UP: {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-800',
        border: 'border-indigo-300',
        dot: 'bg-indigo-500',
        label: 'Handed to Courier',
      },
      DISPATCHED: {
        bg: 'bg-amber-600/15',
        text: 'text-amber-900',
        border: 'border-amber-400',
        dot: 'bg-amber-600 animate-pulse',
        label: 'In Transit',
      },
      DELIVERED: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-800',
        border: 'border-emerald-300',
        dot: 'bg-emerald-500',
        label: 'Delivered (Verified)',
      },
      DELIVERY_FAILED: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-800',
        border: 'border-rose-300',
        dot: 'bg-rose-500',
        label: 'Delivery Failed',
      },
      RETURNED: {
        bg: 'bg-stone-500/10',
        text: 'text-stone-800',
        border: 'border-stone-300',
        dot: 'bg-stone-500',
        label: 'Returned to Boutique',
      },
    };

    const c = config[fulfillmentStatus] || config.UNFULFILLED;

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm backdrop-blur-sm ${c.bg} ${c.text} ${c.border} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span>{c.label}</span>
      </span>
    );
  }

  // If orderStatus is provided
  if (status) {
    const config: Record<OrderStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
      PENDING_PAYMENT: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-800',
        border: 'border-amber-300',
        dot: 'bg-amber-500',
        label: 'Awaiting Payment',
      },
      CONFIRMED: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-800',
        border: 'border-blue-300',
        dot: 'bg-blue-500',
        label: 'Confirmed',
      },
      PROCESSING: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-800',
        border: 'border-purple-300',
        dot: 'bg-purple-500 animate-pulse',
        label: 'Processing',
      },
      READY_FOR_DISPATCH: {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-800',
        border: 'border-indigo-300',
        dot: 'bg-indigo-500',
        label: 'Ready for Dispatch',
      },
      SHIPPED: {
        bg: 'bg-amber-600/15',
        text: 'text-amber-900',
        border: 'border-amber-400',
        dot: 'bg-amber-600 animate-pulse',
        label: 'Shipped / In Transit',
      },
      DELIVERED: {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-900',
        border: 'border-emerald-400',
        dot: 'bg-emerald-600',
        label: 'Closed / Delivered',
      },
      CANCELLED: {
        bg: 'bg-stone-500/15',
        text: 'text-stone-700',
        border: 'border-stone-300',
        dot: 'bg-stone-400',
        label: 'Cancelled',
      },
      RETURN_REQUESTED: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-800',
        border: 'border-rose-300',
        dot: 'bg-rose-500',
        label: 'Return Requested',
      },
      RETURNED: {
        bg: 'bg-rose-500/15',
        text: 'text-rose-900',
        border: 'border-rose-400',
        dot: 'bg-rose-600',
        label: 'Returned',
      },
    };

    const c = config[status] || config.CONFIRMED;

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm backdrop-blur-sm ${c.bg} ${c.text} ${c.border} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span>{c.label}</span>
      </span>
    );
  }

  // If paymentStatus is provided
  if (paymentStatus) {
    const isPaid = paymentStatus === 'SUCCEEDED';
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${
          isPaid
            ? 'bg-emerald-500/10 text-emerald-800 border-emerald-300'
            : 'bg-amber-500/10 text-amber-800 border-amber-300'
        } ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span>{paymentStatus.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  return null;
};

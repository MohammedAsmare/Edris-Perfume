import React from 'react';
import { OrderStatusHistory } from '../../types';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  AlertCircle,
  User,
  Store,
  Compass,
} from 'lucide-react';

interface OrderTimelineProps {
  timeline: OrderStatusHistory[];
  isLoading?: boolean;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500">Loading audit history...</p>
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-stone-500 bg-stone-50/50 rounded-xl border border-stone-200">
        No status history recorded for this order yet.
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'MERCHANT':
        return <Store className="w-3.5 h-3.5 text-amber-600" />;
      case 'DELIVERY_PARTNER':
        return <Truck className="w-3.5 h-3.5 text-blue-600" />;
      case 'ADMIN':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'CUSTOMER':
      default:
        return <User className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('CLOSED') || action.includes('DELIVERED')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    if (action.includes('FAILED') || action.includes('CANCEL')) {
      return <AlertCircle className="w-4 h-4 text-rose-600" />;
    }
    if (action.includes('TRANSIT') || action.includes('PICKUP') || action.includes('HANDOVER')) {
      return <Compass className="w-4 h-4 text-amber-600" />;
    }
    if (action.includes('READY') || action.includes('PACK') || action.includes('ACCEPT')) {
      return <Package className="w-4 h-4 text-blue-600" />;
    }
    return <Clock className="w-4 h-4 text-stone-500" />;
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-200 before:to-stone-200">
      {timeline.map((entry, index) => {
        const isLatest = index === timeline.length - 1;
        const formattedDate = new Date(entry.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={entry.id || index} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                isLatest
                  ? 'bg-amber-600 border-amber-200 ring-4 ring-amber-100 shadow-md text-white'
                  : 'bg-white border-stone-300 text-stone-500'
              }`}
            >
              {getActionIcon(entry.action)}
            </div>

            {/* Event Box */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-3.5 border border-stone-200 shadow-sm hover:border-amber-300 transition-colors">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs tracking-wide text-stone-900">
                    {entry.action.replace(/_/g, ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                    {getRoleIcon(entry.performedByRole)}
                    <span>{entry.performedByRole.replace('ROLE_', '')}</span>
                  </span>
                </div>
                <span className="text-[11px] text-stone-600 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-600" />
                  {formattedDate}
                </span>
              </div>

              {/* Status Transition Pills */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600 my-1 font-mono">
                {entry.fromFulfillmentStatus && (
                  <>
                    <span className="text-stone-500">{entry.fromFulfillmentStatus}</span>
                    <span className="text-amber-500 font-bold">→</span>
                  </>
                )}
                <span className="font-semibold text-stone-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                  {entry.toFulfillmentStatus || entry.toOrderStatus}
                </span>
              </div>

              {/* Actor & Notes */}
              {entry.performedByName && (
                <div className="text-xs text-stone-500 mt-1">
                  By: <span className="font-medium text-stone-700">{entry.performedByName}</span>
                </div>
              )}
              {entry.notes && (
                <p className="mt-1.5 text-xs text-stone-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/70">
                  &ldquo;{entry.notes}&rdquo;
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

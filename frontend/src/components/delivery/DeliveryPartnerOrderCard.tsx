import React from 'react';
import { DeliveryAssignment } from '../../types';
import {
  Package,
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Store,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DeliveryPartnerOrderCardProps {
  assignment: DeliveryAssignment;
  onOpenPickupModal: (assignment: DeliveryAssignment) => void;
  onStartDelivery: (assignmentId: number) => void;
  onOpenConfirmModal: (assignment: DeliveryAssignment) => void;
  onOpenFailModal: (assignment: DeliveryAssignment) => void;
}

export const DeliveryPartnerOrderCard: React.FC<DeliveryPartnerOrderCardProps> = ({
  assignment,
  onOpenPickupModal,
  onStartDelivery,
  onOpenConfirmModal,
  onOpenFailModal,
}) => {
  const isAssigned = assignment.status === 'ASSIGNED';
  const isPickedUp = assignment.status === 'PICKED_UP';
  const isInTransit = assignment.status === 'IN_TRANSIT';
  const isDelivered = assignment.status === 'DELIVERED';
  const isFailed = assignment.status === 'FAILED';

  // Navigation URL using Google Maps Universal URL format
  const encodedAddress = encodeURIComponent(assignment.deliveryAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const getStatusBadge = () => {
    switch (assignment.status) {
      case 'ASSIGNED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            Awaiting Pickup
          </span>
        );
      case 'PICKED_UP':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            Picked Up from Boutique
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-600 text-white border border-amber-500 animate-pulse">
            In Transit (Active)
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            ✓ Delivered
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            Delivery Failed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-800 border border-stone-300">
            {assignment.status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Top Bar with Reference and Status */}
      <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-300 flex items-center justify-center text-amber-800">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono font-bold text-stone-900 text-sm">
              #{assignment.orderNumber || assignment.orderId}
            </div>
            <div className="text-[11px] text-stone-500">
              {new Date(assignment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3.5 flex-1 text-xs">
        {/* Merchant Pickup Location */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Pickup From Boutique</span>
          </div>
          <div className="font-medium text-stone-900">
            {assignment.merchantName || 'Addis Luxury Scents Boutique'}
          </div>
          <div className="text-stone-600">{assignment.pickupAddress}</div>
        </div>

        {/* Customer Delivery Destination */}
        <div className="p-3 bg-amber-50/40 rounded-2xl border border-amber-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Doorstep Delivery Address</span>
            </div>
            {/* Supported Maps Navigation Link */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
            >
              <Navigation className="w-3 h-3" />
              <span>Open Maps</span>
            </a>
          </div>

          <div className="text-stone-900 font-medium">{assignment.deliveryAddress}</div>

          {/* Permitted Contact Details */}
          <div className="pt-2 border-t border-amber-200/40 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-stone-500 text-[11px] block">Customer:</span>
              <span className="font-semibold text-stone-900">{assignment.recipientName}</span>
            </div>
            {assignment.recipientPhone && (
              <a
                href={`tel:${assignment.recipientPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-white text-stone-800 text-xs font-mono font-medium transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Customer</span>
              </a>
            )}
          </div>

          {/* Handling & Special Delivery Instructions */}
          {assignment.recipientNotes && (
            <div className="text-[11px] text-amber-900 bg-white/70 p-2 rounded-xl border border-amber-200/70 italic">
              &ldquo;{assignment.recipientNotes}&rdquo;
            </div>
          )}
        </div>

        {/* Delivery Proof / History Details (if delivered or failed) */}
        {isDelivered && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Doorstep Handover Verified</span>
            </div>
            {assignment.proofCode && (
              <div className="text-[11px] font-mono text-stone-700">
                Proof Code: <span className="font-semibold">{assignment.proofCode}</span>
              </div>
            )}
            {assignment.deliveredAt && (
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                Delivered at: {new Date(assignment.deliveredAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {isFailed && (
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Delivery Failed</span>
            </div>
            <div className="text-[11px] text-rose-800">
              Reason: {assignment.failureReason}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer (Mobile-First CTA) */}
      <div className="p-4 bg-stone-50/90 border-t border-stone-200 flex flex-col gap-2">
        {isAssigned && (
          <button
            onClick={() => onOpenPickupModal(assignment)}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Confirm Boutique Pickup</span>
          </button>
        )}

        {isPickedUp && (
          <button
            onClick={() => onStartDelivery(assignment.id)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Start Delivery (In Transit)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {isInTransit && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenConfirmModal(assignment)}
              className="py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm Delivery</span>
            </button>
            <button
              onClick={() => onOpenFailModal(assignment)}
              className="py-3 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 hover:border-rose-300 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Report Failed</span>
            </button>
          </div>
        )}

        {isDelivered && (
          <div className="py-2 text-center text-[11px] font-mono text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
            Awaiting final merchant review and archiving
          </div>
        )}
      </div>
    </div>
  );
};

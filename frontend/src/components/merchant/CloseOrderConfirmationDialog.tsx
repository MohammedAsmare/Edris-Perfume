import React, { useState } from 'react';
import { Order } from '../../types';
import { ShieldCheck, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProofOfDeliveryPanel } from './ProofOfDeliveryPanel';

interface CloseOrderConfirmationDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClose: (orderId: number, notes?: string) => Promise<void>;
}

export const CloseOrderConfirmationDialog: React.FC<CloseOrderConfirmationDialogProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmClose,
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const isDelivered = order.fulfillmentStatus === 'DELIVERED';

  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDelivered) {
      setError('Business Rule Violation: An order can only be closed after successful delivery confirmation and proof.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirmClose(order.id, notes);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to close order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  Review & Close Order
                </h3>
                <p className="text-xs text-emerald-100 font-mono">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleClose} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isDelivered ? (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Delivery Incomplete
              </div>
              <p>
                This order current status is <strong>{order.fulfillmentStatus}</strong>.
                Per Edris Perfume compliance, you may only close an order after the delivery courier has submitted the verified recipient PIN and doorstep proof.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                Please verify the proof of delivery details submitted by the authorized courier before marking this order as finalized and archived:
              </p>
              <ProofOfDeliveryPanel
                assignment={order.deliveryAssignment}
                deliveryOtp={order.deliveryOtp}
              />
            </div>
          )}

          {/* Merchant Closure Audit Notes */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Merchant Closure Audit Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified customer signature & confirmed satisfactory delivery with concierge."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDelivered}
              className="px-6 py-2.5 text-xs font-serif font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-xl shadow-md hover:shadow-lg disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Closing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalize & Close Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

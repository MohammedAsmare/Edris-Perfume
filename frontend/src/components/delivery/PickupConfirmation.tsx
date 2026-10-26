import React, { useState } from 'react';
import { DeliveryAssignment } from '../../types';
import { PackageCheck, X, AlertCircle, CheckCircle, Store, Shield } from 'lucide-react';

interface PickupConfirmationProps {
  assignment: DeliveryAssignment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assignmentId: number) => Promise<void>;
}

export const PickupConfirmation: React.FC<PickupConfirmationProps> = ({
  assignment,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(assignment.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to confirm pickup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  Confirm Boutique Pickup
                </h3>
                <p className="text-xs text-amber-100 font-mono">
                  Order #{assignment.orderNumber}
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

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Store className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">Pickup Location</span>
                <span className="text-stone-600">{assignment.pickupAddress}</span>
              </div>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between font-mono text-stone-700">
              <span>Merchant:</span>
              <span className="font-semibold">{assignment.merchantName || 'Addis Luxury Scents'}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              By confirming, you acknowledge that you have physically inspected the gold-wax sealed Edris luxury perfume box, verified the order number, and taken possession of the package.
            </p>
          </div>

          {/* Action Buttons */}
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
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-serif font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Package Pickup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

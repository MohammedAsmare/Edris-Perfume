import React, { useState } from 'react';
import { DeliveryAssignment } from '../../types';
import { AlertTriangle, X, ShieldAlert, ArrowLeft } from 'lucide-react';

interface FailedDeliveryDialogProps {
  assignment: DeliveryAssignment | null;
  isOpen: boolean;
  onClose: () => void;
  onFail: (assignmentId: number, reason: string, notes?: string) => Promise<void>;
}

export const FailedDeliveryDialog: React.FC<FailedDeliveryDialogProps> = ({
  assignment,
  isOpen,
  onClose,
  onFail,
}) => {
  const [reason, setReason] = useState('CUSTOMER_UNREACHABLE');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('A mandatory reason is required to record delivery failure.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onFail(assignment.id, reason, notes);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to record delivery failure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-amber-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  Record Failed Delivery
                </h3>
                <p className="text-xs text-rose-100 font-mono">
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

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-stone-600">
            Per company protocol, failed deliveries are audited immediately. Please indicate the exact cause for non-completion:
          </p>

          {/* Mandatory Reason Dropdown */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Failure Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-rose-600 outline-none text-stone-900 bg-white"
            >
              <option value="Customer phone unreachable / switched off">
                Customer phone unreachable / switched off (3 attempts made)
              </option>
              <option value="Recipient not present at specified address">
                Recipient not present at specified address
              </option>
              <option value="Delivery address incorrect or inaccessible">
                Delivery address incorrect or inaccessible
              </option>
              <option value="Customer requested reschedule to a later date">
                Customer requested reschedule to a later date
              </option>
              <option value="Recipient refused delivery / rejected order">
                Recipient refused delivery / rejected order
              </option>
              <option value="Security / Compound gate access denied">
                Security / Compound gate access denied
              </option>
              <option value="Other non-delivery exception">Other non-delivery exception</option>
            </select>
          </div>

          {/* Details & Next Steps */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-1">
              Field Observations & Next Action
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Called customer 3 times between 2:15 PM and 2:40 PM. Guard stated customer was out of town. Package returned safely to boutique custody."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-rose-600 outline-none placeholder:text-stone-400 text-stone-900"
            />
          </div>

          {/* Security note */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600">
            This will flag the order as <strong>DELIVERY_FAILED</strong>. The order cannot be marked closed or delivered without merchant reconciliation or re-dispatch.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Go Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-serif font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Failure Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

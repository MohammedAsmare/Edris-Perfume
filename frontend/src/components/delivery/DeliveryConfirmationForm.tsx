import React, { useState } from 'react';
import { DeliveryAssignment } from '../../types';
import { KeyRound, X, ShieldCheck, AlertCircle, CheckCircle, UserCheck, Lock } from 'lucide-react';

interface DeliveryConfirmationFormProps {
  assignment: DeliveryAssignment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    assignmentId: number,
    otpCode: string,
    recipientName?: string,
    notes?: string
  ) => Promise<void>;
}

export const DeliveryConfirmationForm: React.FC<DeliveryConfirmationFormProps> = ({
  assignment,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code provided by the customer.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(assignment.id, otpCode.trim(), recipientName, notes);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Invalid verification PIN or confirmation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const attemptsLeft = (assignment.maxOtpAttempts || 5) - (assignment.otpAttempts || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  Confirm Doorstep Delivery
                </h3>
                <p className="text-xs text-emerald-100 font-mono">
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
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer & Address Reminder */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-1">
            <div className="flex justify-between font-medium text-stone-600">
              <span>Expected Recipient:</span>
              <span className="font-semibold text-stone-900">{assignment.recipientName}</span>
            </div>
            <div className="flex justify-between font-medium text-stone-600">
              <span>Delivery Address:</span>
              <span className="text-right text-stone-800 truncate max-w-[220px]">
                {assignment.deliveryAddress}
              </span>
            </div>
          </div>

          {/* 6-Digit OTP Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Recipient 6-Digit Verification PIN *</span>
              </label>
              <span className="text-[10px] font-mono text-stone-600">
                {attemptsLeft} attempts left
              </span>
            </div>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 839214"
              className="w-full text-center text-2xl font-mono font-bold tracking-[0.5em] py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-sm text-stone-900"
              autoFocus
            />
            <p className="text-[10px] text-stone-600 mt-1.5 flex items-center gap-1">
              <Lock className="w-3 h-3 text-stone-600" />
              The customer received this PIN upon order dispatch. Ask the customer for the PIN.
            </p>
          </div>

          {/* Recipient Full Name */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-1">
              Received By (Name / Relation)
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={assignment.recipientName || 'Customer or Authorized Family Member'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-600 outline-none transition-all text-stone-900"
              />
            </div>
          </div>

          {/* Handover Notes */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-1">
              Delivery Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Handed to customer at apartment entrance with gift packaging sealed."
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none transition-all placeholder:text-stone-400 text-stone-900"
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
              disabled={isSubmitting || otpCode.length !== 6}
              className="px-6 py-2.5 text-xs font-serif font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying PIN...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Handover</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

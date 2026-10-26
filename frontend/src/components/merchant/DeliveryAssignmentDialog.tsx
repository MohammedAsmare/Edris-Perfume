import React, { useState } from 'react';
import { DeliveryPartner, Order } from '../../types';
import { Truck, X, User, Phone, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface DeliveryAssignmentDialogProps {
  order: Order | null;
  partners: DeliveryPartner[];
  isOpen: boolean;
  onClose: () => void;
  onAssign: (orderId: number, partnerId: number, instructions?: string) => Promise<void>;
}

export const DeliveryAssignmentDialog: React.FC<DeliveryAssignmentDialogProps> = ({
  order,
  partners,
  isOpen,
  onClose,
  onAssign,
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | ''>(
    partners.length > 0 ? partners[0].id : ''
  );
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerId) {
      setError('Please select an authorized delivery partner.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAssign(order.id, Number(selectedPartnerId), instructions);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to assign delivery partner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePartners = partners.filter((p) => p.status !== 'INACTIVE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  Assign Delivery Partner
                </h3>
                <p className="text-xs text-amber-100/90 font-mono">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Delivery Destination Summary */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between font-medium text-stone-600">
              <span>Customer:</span>
              <span className="font-semibold text-stone-900">{order.shippingFullName}</span>
            </div>
            <div className="flex justify-between font-medium text-stone-600">
              <span>Delivery Address:</span>
              <span className="text-right text-stone-900 max-w-[260px] truncate">
                {order.shippingAddressLine}, {order.shippingSubcity || ''}, {order.shippingCity}
              </span>
            </div>
            <div className="flex justify-between font-medium text-stone-600">
              <span>Item Value:</span>
              <span className="font-mono font-bold text-amber-800">
                {order.totalAmount.toLocaleString()} ETB
              </span>
            </div>
          </div>

          {/* Select Delivery Partner */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-2">
              Authorized Delivery Courier *
            </label>
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {activePartners.map((partner) => {
                const isSelected = selectedPartnerId === partner.id;
                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-300/50'
                        : 'border-stone-200 bg-white hover:border-amber-200 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>{partner.partnerName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-normal">
                            ★ {partner.rating}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {partner.vehicleType} • Plate: {partner.licensePlate}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-mono text-stone-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {partner.phoneNumber}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {partner.activeDeliveriesCount} active deliveries
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions for Courier */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Pickup & Fragrance Handling Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Fragile extrait flacons. Keep climate control in vehicle. Handover at Bole boutique counter."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Security note */}
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-300/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-950">
              Upon assignment, a unique 6-digit recipient delivery PIN will be generated and issued to the customer. The courier will be required to input this PIN at the customer&apos;s door to verify delivery.
            </p>
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
              disabled={isSubmitting || !selectedPartnerId}
              className="px-6 py-2.5 text-xs font-serif font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

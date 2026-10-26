import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DeliveryPartner, DeliveryAssignment } from '../../types';
import { DeliveryPartnerOrderCard } from '../../components/delivery/DeliveryPartnerOrderCard';
import { PickupConfirmation } from '../../components/delivery/PickupConfirmation';
import { DeliveryConfirmationForm } from '../../components/delivery/DeliveryConfirmationForm';
import { FailedDeliveryDialog } from '../../components/delivery/FailedDeliveryDialog';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

export const DeliveryPartnerPage: React.FC = () => {
  const { user } = useAuth();
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [pickupAssignment, setPickupAssignment] = useState<DeliveryAssignment | null>(null);
  const [confirmAssignment, setConfirmAssignment] = useState<DeliveryAssignment | null>(null);
  const [failAssignment, setFailAssignment] = useState<DeliveryAssignment | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersList, allAssignments] = await Promise.all([
        api.getDeliveryPartners(),
        api.getDeliveryAssignments(),
      ]);

      // Identify partner by user ID or fallback to first active courier (Dawit Haile)
      const currentPartner =
        partnersList.find((p) => p.userId === user?.id) ||
        partnersList.find((p) => p.partnerName.includes('Dawit')) ||
        partnersList[0];

      setPartner(currentPartner || null);

      if (currentPartner) {
        // Enforce partner assignment ownership
        const filtered = allAssignments.filter(
          (a) => a.deliveryPartnerId === currentPartner.id
        );
        setAssignments(filtered);
      } else {
        setAssignments(allAssignments);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to load delivery assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Actions
  const handleConfirmPickup = async (assignmentId: number) => {
    try {
      const updated = await api.courierConfirmPickup(assignmentId);
      showToast(`Package #${updated.orderNumber || updated.orderId} picked up from boutique.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to confirm pickup', 'error');
      throw err;
    }
  };

  const handleStartDelivery = async (assignmentId: number) => {
    try {
      const updated = await api.courierStartDelivery(assignmentId);
      showToast(`Delivery started for #${updated.orderNumber || updated.orderId}. Status marked In Transit.`);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to start delivery', 'error');
    }
  };

  const handleConfirmDelivery = async (
    assignmentId: number,
    otpCode: string,
    recipientName?: string,
    notes?: string
  ) => {
    try {
      const updated = await api.courierConfirmDelivery(assignmentId, otpCode, recipientName, notes);
      showToast(
        `Doorstep delivery verified! Proof of delivery generated: ${updated.proofCode}`
      );
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'PIN verification failed', 'error');
      throw err;
    }
  };

  const handleFailDelivery = async (assignmentId: number, reason: string, notes?: string) => {
    try {
      const updated = await api.courierFailDelivery(assignmentId, reason, notes);
      showToast(`Delivery failure recorded for #${updated.orderNumber || updated.orderId}.`, 'error');
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to report delivery failure', 'error');
      throw err;
    }
  };

  // Filter into Active vs History
  const activeAssignments = assignments.filter(
    (a) => a.status === 'ASSIGNED' || a.status === 'PICKED_UP' || a.status === 'IN_TRANSIT'
  );
  const historyAssignments = assignments.filter(
    (a) => a.status === 'DELIVERED' || a.status === 'FAILED' || a.status === 'CANCELLED'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-12 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-md transition-all animate-in slide-in-from-top-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-400/40 shadow-emerald-900/20'
              : 'bg-rose-900/90 text-white border-rose-400/40 shadow-rose-900/20'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Courier Identity Card (Mobile-First Hero) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 text-white shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
                  {partner?.partnerName || (user ? `${user.firstName} ${user.lastName}` : 'Dawit Haile')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>On Duty</span>
                </span>
              </div>
              <p className="text-xs text-amber-200/90 mt-1">
                {partner?.vehicleType || 'Toyota Vitz Sedan'} • Plate: {partner?.licensePlate || 'AA-2-A12345'}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-stone-300 mt-1">
                <span className="font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" />
                  {partner?.phoneNumber || '+251911223344'}
                </span>
                <span>•</span>
                <span className="text-amber-300 font-bold">★ {partner?.rating || '4.9'} Courier Rating</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Quick Dispatch Stats */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-white/10 text-center relative z-10">
          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] uppercase font-mono text-stone-400">Active Tasks</div>
            <div className="text-xl font-bold font-mono text-amber-300">{activeAssignments.length}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] uppercase font-mono text-stone-400">Delivered</div>
            <div className="text-xl font-bold font-mono text-emerald-300">
              {historyAssignments.filter((a) => a.status === 'DELIVERED').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] uppercase font-mono text-stone-400">Success Rate</div>
            <div className="text-xl font-bold font-mono text-white">98%</div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Deliveries ({activeAssignments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Delivery History ({historyAssignments.length})</span>
          </button>
        </div>
        <span className="text-xs text-stone-600 font-mono hidden sm:inline">
          {activeTab === 'active' ? 'Assigned to your vehicle' : 'Archived deliveries'}
        </span>
      </div>

      {/* Delivery Cards Feed */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading assigned deliveries...</p>
        </div>
      ) : activeTab === 'active' ? (
        activeAssignments.length === 0 ? (
          <div className="py-16 text-center bg-white/70 rounded-3xl border border-stone-200/80 p-8 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              Queue Clear! No Active Deliveries
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You are all caught up. When merchants assign perfume orders to you, they will appear here with pickup and navigation instructions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <DeliveryPartnerOrderCard
                key={assignment.id}
                assignment={assignment}
                onOpenPickupModal={setPickupAssignment}
                onStartDelivery={handleStartDelivery}
                onOpenConfirmModal={setConfirmAssignment}
                onOpenFailModal={setFailAssignment}
              />
            ))}
          </div>
        )
      ) : historyAssignments.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500 bg-white/50 rounded-2xl border border-stone-200">
          No delivery history recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {historyAssignments.map((assignment) => (
            <DeliveryPartnerOrderCard
              key={assignment.id}
              assignment={assignment}
              onOpenPickupModal={setPickupAssignment}
              onStartDelivery={handleStartDelivery}
              onOpenConfirmModal={setConfirmAssignment}
              onOpenFailModal={setFailAssignment}
            />
          ))}
        </div>
      )}

      {/* Pickup Confirmation Modal */}
      <PickupConfirmation
        assignment={pickupAssignment}
        isOpen={!!pickupAssignment}
        onClose={() => setPickupAssignment(null)}
        onConfirm={handleConfirmPickup}
      />

      {/* Doorstep Delivery Confirmation PIN Modal */}
      <DeliveryConfirmationForm
        assignment={confirmAssignment}
        isOpen={!!confirmAssignment}
        onClose={() => setConfirmAssignment(null)}
        onConfirm={handleConfirmDelivery}
      />

      {/* Delivery Failure Report Modal */}
      <FailedDeliveryDialog
        assignment={failAssignment}
        isOpen={!!failAssignment}
        onClose={() => setFailAssignment(null)}
        onFail={handleFailDelivery}
      />
    </div>
  );
};

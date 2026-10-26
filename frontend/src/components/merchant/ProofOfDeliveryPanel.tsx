import React from 'react';
import { DeliveryAssignment } from '../../types';
import { ShieldCheck, CheckCircle2, KeyRound, UserCheck, Clock, FileCheck } from 'lucide-react';

interface ProofOfDeliveryPanelProps {
  assignment?: DeliveryAssignment;
  deliveryOtp?: string;
}

export const ProofOfDeliveryPanel: React.FC<ProofOfDeliveryPanelProps> = ({
  assignment,
  deliveryOtp,
}) => {
  if (!assignment && !deliveryOtp) return null;

  const isDelivered = assignment?.status === 'DELIVERED';
  const proofCode = assignment?.proofCode;
  const otp = assignment?.deliveryOtp || deliveryOtp;

  return (
    <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-500/5 via-white/80 to-amber-50/40 p-4 shadow-sm backdrop-blur-md relative overflow-hidden">
      {/* Decorative Gold Watermark Accent */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3 border-b border-amber-200/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-300 flex items-center justify-center text-amber-800">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-950">
              Proof of Delivery (White Glove)
            </h4>
            <p className="text-[11px] text-stone-500">
              Cryptographic PIN & Verified Recipient Handshake
            </p>
          </div>
        </div>

        {isDelivered ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified & Delivered
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            In Transit / Pending OTP
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Recipient Security OTP */}
        <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium text-[11px] uppercase tracking-wide">Customer OTP Code</span>
          </div>
          <div className="font-mono text-base font-bold tracking-widest text-stone-900 bg-amber-50/60 px-2 py-1 rounded border border-amber-200/50 inline-block">
            {otp || '••••••'}
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            Provided exclusively to recipient via SMS/portal to authorize package handover.
          </p>
        </div>

        {/* Proof of Delivery Hash / Code */}
        <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium text-[11px] uppercase tracking-wide">Proof Reference</span>
          </div>
          <div className="font-mono text-xs font-semibold text-stone-800 truncate">
            {proofCode || 'Pending doorstep confirmation'}
          </div>
          {assignment?.deliveredAt && (
            <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {new Date(assignment.deliveredAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Recipient Signature / Name */}
        {assignment?.recipientName && (
          <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-stone-500 mb-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-[11px] uppercase tracking-wide">Confirmed Recipient</span>
            </div>
            <div className="font-medium text-stone-900">
              {assignment.recipientName}
            </div>
          </div>
        )}

        {/* Courier Notes */}
        {assignment?.recipientNotes && (
          <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
            <div className="text-[11px] font-medium uppercase tracking-wide text-stone-500 mb-1">
              Courier Dispatch Notes
            </div>
            <div className="text-stone-700 italic">
              &ldquo;{assignment.recipientNotes}&rdquo;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { PaymentMethod, BankAccount } from '../../types';
import { Banknote, ShieldCheck, Check, Info } from 'lucide-react';
import {
  TelebirrIcon,
  BankIcon,
  CbeBankIcon,
  AwashBankIcon,
  DashenBankIcon,
  BoaBankIcon,
} from '../common/PaymentIcons';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  bankAccounts: BankAccount[];
  selectedMethodCode: string;
  onSelectMethod: (code: string) => void;
  selectedBankId?: number;
  onSelectBank?: (id: number) => void;
  totalAmount: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethods,
  bankAccounts,
  selectedMethodCode,
  onSelectMethod,
  selectedBankId,
  onSelectBank,
  totalAmount,
}) => {
  const getBankIcon = (bankName: string) => {
    if (bankName.includes('Commercial')) return <CbeBankIcon size="sm" />;
    if (bankName.includes('Awash')) return <AwashBankIcon size="sm" />;
    if (bankName.includes('Dashen')) return <DashenBankIcon size="sm" />;
    return <BoaBankIcon size="sm" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg font-bold text-charcoal">
          Choose Your Payment Method
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          All transactions are secured and denominated in Ethiopian Birr (ETB).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Telebirr */}
        <div
          onClick={() => onSelectMethod('TELEBIRR')}
          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
            selectedMethodCode === 'TELEBIRR'
              ? 'glass-panel-elevated border-gold-500 ring-2 ring-gold-500/30'
              : 'glass-panel border-champagne-border hover:border-gold-300'
          }`}
        >
          {selectedMethodCode === 'TELEBIRR' && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
          <div className="mb-3">
            <TelebirrIcon size="lg" />
          </div>
          <h4 className="font-serif font-bold text-sm text-charcoal flex items-center gap-1.5">
            <span>Telebirr SuperApp</span>
          </h4>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Automated instant payment via Ethio Telecom mobile money. Order confirmed immediately.
          </p>
          <span className="inline-block mt-3 px-2 py-0.5 text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-full font-medium">
            Instant Verification
          </span>
        </div>

        {/* 2. CBE Bank Transfer / Bank Payment */}
        <div
          onClick={() => onSelectMethod('BANK_TRANSFER_CBE')}
          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
            selectedMethodCode.startsWith('BANK_TRANSFER')
              ? 'glass-panel-elevated border-gold-500 ring-2 ring-gold-500/30'
              : 'glass-panel border-champagne-border hover:border-gold-300'
          }`}
        >
          {selectedMethodCode.startsWith('BANK_TRANSFER') && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
          <div className="mb-3">
            <BankIcon size="lg" />
          </div>
          <h4 className="font-serif font-bold text-sm text-charcoal flex items-center gap-1.5">
            <span>Direct Bank Transfer</span>
          </h4>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Transfer directly to our official corporate accounts: CBE, Awash, Dashen, or BoA.
          </p>
          <span className="inline-block mt-3 px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium">
            Official Reconciled Transfer
          </span>
        </div>

        {/* 3. Cash on Delivery */}
        <div
          onClick={() => onSelectMethod('CASH_ON_DELIVERY')}
          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
            selectedMethodCode === 'CASH_ON_DELIVERY'
              ? 'glass-panel-elevated border-gold-500 ring-2 ring-gold-500/30'
              : 'glass-panel border-champagne-border hover:border-gold-300'
          }`}
        >
          {selectedMethodCode === 'CASH_ON_DELIVERY' && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
            <Banknote className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-charcoal">Cash on Delivery</h4>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Available for Addis Ababa deliveries. Pay cash or local transfer upon courier arrival.
          </p>
          <span className="inline-block mt-3 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700 border border-gray-200 rounded-full font-medium">
            Addis Ababa Only
          </span>
        </div>
      </div>

      {/* Sub-selector for specific Bank when Bank Transfer is selected */}
      {selectedMethodCode.startsWith('BANK_TRANSFER') && (
        <div className="p-5 rounded-xl bg-white/70 border border-champagne-border space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gold-600" />
            <h5 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
              Select Destination Bank for Deposit
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bankAccounts.map((account) => {
              const methodCode =
                account.bankName.includes('Commercial') ? 'BANK_TRANSFER_CBE' :
                account.bankName.includes('Awash') ? 'BANK_TRANSFER_AWASH' :
                account.bankName.includes('Dashen') ? 'BANK_TRANSFER_DASHEN' : 'BANK_TRANSFER_BOA';

              const isSelected = selectedMethodCode === methodCode;

              return (
                <div
                  key={account.id}
                  onClick={() => {
                    onSelectMethod(methodCode);
                    if (onSelectBank) onSelectBank(account.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gold-50/80 border-gold-500 shadow-sm'
                      : 'bg-white border-champagne-border hover:border-gold-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getBankIcon(account.bankName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-serif font-bold text-charcoal">{account.bankName}</p>
                    <p className="text-xs font-mono font-semibold text-gold-800 mt-0.5">
                      Acc: {account.accountNumber}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      Holder: {account.accountHolderName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trust Notice */}
      <div className="p-3.5 rounded-lg bg-gold-50/50 border border-champagne-border/80 flex items-start gap-2.5 text-xs text-gray-600">
        <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Security Guarantee:</strong> Edris Perfume enforces server-side validation. Your total amount of <span className="font-bold text-charcoal">{totalAmount.toLocaleString()} ETB</span> is locked and protected. Bank transfers are audited by our certified accounting desk before order dispatch.
        </p>
      </div>
    </div>
  );
};

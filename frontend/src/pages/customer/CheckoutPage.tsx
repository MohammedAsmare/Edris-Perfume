import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PaymentMethod, BankAccount, Order } from '../../types';
import { PaymentMethodSelector } from '../../components/customer/PaymentMethodSelector';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone,
  Building2,
  CheckCircle2,
  QrCode,
  Copy,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  TelebirrIcon,
  BankIcon,
  CbeBankIcon,
  AwashBankIcon,
  DashenBankIcon,
  BoaBankIcon,
} from '../../components/common/PaymentIcons';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discount, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Delivery Form
  const [shippingFullName, setShippingFullName] = useState(
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [shippingPhone, setShippingPhone] = useState(user?.phoneNumber || '+251 9');
  const [shippingCity, setShippingCity] = useState('Addis Ababa');
  const [shippingSubcity, setShippingSubcity] = useState('Bole');
  const [shippingAddressLine, setShippingAddressLine] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');

  // Payment Selection
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedMethodCode, setSelectedMethodCode] = useState('TELEBIRR');
  const [selectedBankId, setSelectedBankId] = useState<number>(1);

  // Workflow State
  const [step, setStep] = useState<'DETAILS' | 'PAYMENT_PENDING' | 'SUCCESS'>('DETAILS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [telebirrData, setTelebirrData] = useState<{
    transactionReference: string;
    checkoutUrl?: string;
    qrCodeData?: string;
  } | null>(null);

  // Bank Transfer Claim State
  const [transferRefInput, setTransferRefInput] = useState('');
  const [transferNotesInput, setTransferNotesInput] = useState('');
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [methods, accounts] = await Promise.all([
        api.getPaymentMethods(),
        api.getBankAccounts(),
      ]);
      setPaymentMethods(methods);
      setBankAccounts(accounts);
    };
    load();
  }, []);

  if (cart.length === 0 && step === 'DETAILS') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal">Your Fragrance Bag is Empty</h2>
        <p className="text-xs text-gray-500">Please select a perfume from our collection before proceeding to checkout.</p>
        <button onClick={() => navigate('/shop')} className="btn-gold text-xs">
          Explore The Collection
        </button>
      </div>
    );
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingFullName || !shippingPhone || !shippingAddressLine) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create Order on backend
      const newOrder = await api.createOrder({
        customerId: user?.id || 3,
        shippingFullName,
        shippingPhone,
        shippingCity,
        shippingSubcity,
        shippingAddressLine,
        shippingNotes,
        subtotal,
        discountAmount: discount,
        deliveryFee,
        totalAmount: total,
        paymentMethod: selectedMethodCode,
        items: cart.map((c, idx) => ({
          id: idx + 1,
          productId: c.product.id,
          productName: c.product.name,
          sku: c.product.sku,
          unitPrice: c.product.price,
          quantity: c.quantity,
          subtotal: c.product.price * c.quantity,
          imageUrl: c.product.imageUrl,
        })),
      });

      setCreatedOrder(newOrder);

      // Step 2: Initiate Payment Workflow
      const paymentInit = await api.initiatePayment(newOrder.id, selectedMethodCode);

      if (selectedMethodCode === 'TELEBIRR' || selectedMethodCode === 'CBE_BIRR') {
        setTelebirrData(paymentInit);
        setStep('PAYMENT_PENDING');
      } else if (selectedMethodCode.startsWith('BANK_TRANSFER')) {
        setStep('PAYMENT_PENDING');
      } else {
        // Cash on delivery
        clearCart();
        setStep('SUCCESS');
      }
    } catch (err: any) {
      alert(err?.message || 'Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateTelebirrPay = async (success: boolean) => {
    if (!createdOrder) return;
    setIsSubmitting(true);
    try {
      const updated = await api.simulateTelebirrCallback(createdOrder.id, success);
      setCreatedOrder(updated);
      if (success) {
        clearCart();
        setStep('SUCCESS');
      } else {
        alert('Telebirr payment failed or was cancelled by user.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBankTransferProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdOrder || !transferRefInput.trim()) return;
    setIsSubmitting(true);
    try {
      const updated = await api.submitBankProof(createdOrder.id, transferRefInput, transferNotesInput);
      setCreatedOrder(updated);
      setProofSubmitted(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const activeBankAccount = bankAccounts.find((a) => {
    if (selectedMethodCode.includes('CBE')) return a.bankName.includes('Commercial');
    if (selectedMethodCode.includes('AWASH')) return a.bankName.includes('Awash');
    if (selectedMethodCode.includes('DASHEN')) return a.bankName.includes('Dashen');
    if (selectedMethodCode.includes('BOA')) return a.bankName.includes('Abyssinia');
    return a.id === selectedBankId;
  }) || bankAccounts[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step 1: Address & Payment Selection */}
      {step === 'DETAILS' && (
        <form onSubmit={handleCreateOrder} className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
              Checkout & Escrow Protection
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              Complete Your Fragrance Acquisition
            </h1>
            <p className="text-xs text-gray-500 font-light">
              Server-side validated prices in Ethiopian Birr (ETB). Protected delivery by Edris Concierge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Shipping & Payment Method */}
            <div className="lg:col-span-7 space-y-8">
              {/* Delivery Address */}
              <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-4">
                <h3 className="font-serif text-base font-bold text-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Delivery Address (Ethiopia)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Full Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingFullName}
                      onChange={(e) => setShippingFullName(e.target.value)}
                      placeholder="e.g. Selamawit Tadesse"
                      className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="+251 911 22 33 44"
                      className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">City *</label>
                    <select
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                    >
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Hawassa">Hawassa</option>
                      <option value="Bahir Dar">Bahir Dar</option>
                      <option value="Dire Dawa">Dire Dawa</option>
                      <option value="Adama / Nazret">Adama / Nazret</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Subcity / Area</label>
                    <input
                      type="text"
                      value={shippingSubcity}
                      onChange={(e) => setShippingSubcity(e.target.value)}
                      placeholder="e.g. Bole, Kirkos, Yeka"
                      className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Detailed Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddressLine}
                    onChange={(e) => setShippingAddressLine(e.target.value)}
                    placeholder="e.g. Bole Medhanialem area, House 42, near Edna Mall"
                    className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Delivery Notes for Courier</label>
                  <input
                    type="text"
                    value={shippingNotes}
                    onChange={(e) => setShippingNotes(e.target.value)}
                    placeholder="e.g. Ring bell, call before arrival, luxury gift wrapping requested"
                    className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="glass-panel p-6 rounded-2xl border border-champagne-border">
                <PaymentMethodSelector
                  paymentMethods={paymentMethods}
                  bankAccounts={bankAccounts}
                  selectedMethodCode={selectedMethodCode}
                  onSelectMethod={setSelectedMethodCode}
                  selectedBankId={selectedBankId}
                  onSelectBank={setSelectedBankId}
                  totalAmount={total}
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 space-y-4 sticky top-28">
              <div className="glass-panel-elevated p-6 rounded-2xl border border-gold-400/50 space-y-4">
                <h3 className="font-serif text-base font-bold text-charcoal pb-3 border-b border-champagne-border">
                  Order Summary
                </h3>

                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-lg border border-champagne-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-charcoal truncate">{item.product.name}</p>
                        <p className="text-gray-500 text-[11px]">
                          Qty: {item.quantity} • {item.product.concentration}
                        </p>
                      </div>
                      <span className="font-serif font-bold text-gold-900">
                        {(item.product.price * item.quantity).toLocaleString()} ETB
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-champagne-border/80 pt-3 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal">{subtotal.toLocaleString()} ETB</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700 font-medium">
                      <span>Privilege Discount</span>
                      <span>-{discount.toLocaleString()} ETB</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery (Addis Ababa)</span>
                    <span className="font-medium text-charcoal">{deliveryFee.toLocaleString()} ETB</span>
                  </div>
                  <div className="border-t border-champagne-border/80 pt-2 flex justify-between text-base font-bold text-charcoal">
                    <span className="font-serif">Total Due</span>
                    <span className="font-serif text-gold-800 text-lg">{total.toLocaleString()} ETB</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold text-sm py-3.5 justify-center shadow-lg font-semibold"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Securing Order...' : 'Proceed to Payment'}</span>
                </button>

                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                  <span>256-Bit Encrypted Official Payment Gateway</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Step 2: Payment Pending Workflow (Telebirr or Bank Transfer) */}
      {step === 'PAYMENT_PENDING' && createdOrder && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
              Action Required
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              Order #{createdOrder.orderNumber} Created
            </h1>
            <p className="text-xs text-gray-500 font-light">
              Final amount: <span className="font-bold text-charcoal">{createdOrder.totalAmount.toLocaleString()} ETB</span>
            </p>
          </div>

          {/* TELEBIRR WORKFLOW */}
          {(selectedMethodCode === 'TELEBIRR' || selectedMethodCode === 'CBE_BIRR') && (
            <div className="glass-panel-elevated p-8 rounded-3xl border-2 border-gold-400/50 space-y-6 text-center">
              <div className="flex justify-center">
                <TelebirrIcon size="xl" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-charcoal flex items-center justify-center gap-2">
                  <span>Telebirr SuperApp Mobile Payment</span>
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Scan the dynamic QR code using your Telebirr app or authorize through the USSD prompt sent to {shippingPhone}.
                </p>
              </div>

              {/* Dynamic QR Code */}
              <div className="p-4 bg-white rounded-2xl border border-champagne-border inline-block shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=telebirr-pay-${createdOrder.orderNumber}`}
                  alt="Telebirr QR Code"
                  className="w-48 h-48 mx-auto"
                />
                <p className="text-[10px] text-gray-400 mt-2 font-mono">
                  Order Ref: {createdOrder.orderNumber}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-champagne-border text-xs text-gray-600 max-w-md mx-auto space-y-1 text-left">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="font-bold text-charcoal">EDRIS PERFUME TRADING</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant ID:</span>
                  <span className="font-mono text-charcoal">EDRIS_MERCHANT_001</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Due:</span>
                  <span className="font-serif font-bold text-gold-900">{createdOrder.totalAmount.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Sandbox / Testing Action Simulator */}
              <div className="pt-4 border-t border-champagne-border/80 space-y-3">
                <p className="text-xs text-gray-500 font-medium">
                  Payment Verification Simulator:
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleSimulateTelebirrPay(true)}
                    disabled={isSubmitting}
                    className="btn-gold text-xs px-6 py-2.5 font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Telebirr Payment Success</span>
                  </button>
                  <button
                    onClick={() => handleSimulateTelebirrPay(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 rounded-full border border-red-200 font-medium"
                  >
                    Simulate Payment Failure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BANK TRANSFER WORKFLOW (SECTION 8.4) */}
          {selectedMethodCode.startsWith('BANK_TRANSFER') && (
            <div className="glass-panel-elevated p-8 rounded-3xl border-2 border-gold-400/50 space-y-6">
              <div className="flex items-center gap-3">
                {activeBankAccount?.bankName.includes('Commercial') ? (
                  <CbeBankIcon size="lg" />
                ) : activeBankAccount?.bankName.includes('Awash') ? (
                  <AwashBankIcon size="lg" />
                ) : activeBankAccount?.bankName.includes('Dashen') ? (
                  <DashenBankIcon size="lg" />
                ) : (
                  <BoaBankIcon size="lg" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-charcoal">
                      {activeBankAccount?.bankName} Deposit Details
                    </h3>
                    <BankIcon size="xs" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Follow these official beneficiary details to complete your transfer.
                  </p>
                </div>
              </div>

              {/* Beneficiary Details Box */}
              <div className="p-5 rounded-2xl bg-white border border-champagne-border space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Bank Name</span>
                  <span className="font-serif font-bold text-charcoal">{activeBankAccount?.bankName}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Account Holder</span>
                  <span className="font-bold text-charcoal">{activeBankAccount?.accountHolderName}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gold-900">
                      {activeBankAccount?.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeBankAccount?.accountNumber || '', 'account')}
                      className="p-1 hover:bg-gold-50 rounded text-gold-700"
                      title="Copy Account Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedField === 'account' && (
                      <span className="text-[10px] text-green-600 font-semibold">Copied!</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Branch</span>
                  <span className="text-charcoal">{activeBankAccount?.branch}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Required Amount</span>
                  <span className="font-serif font-bold text-sm text-gold-900">
                    {createdOrder.totalAmount.toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Unique Payment Remark / Reason</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-charcoal bg-gold-100 px-2 py-0.5 rounded">
                      {createdOrder.orderNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdOrder.orderNumber, 'ref')}
                      className="p-1 hover:bg-gold-50 rounded text-gold-700"
                      title="Copy Order Reference"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedField === 'ref' && (
                      <span className="text-[10px] text-green-600 font-semibold">Copied!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions notice */}
              <div className="p-3.5 rounded-xl bg-gold-50/70 border border-gold-300 text-xs text-gray-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Critical:</strong> You MUST include your unique Order Number <span className="font-mono font-bold text-charcoal">{createdOrder.orderNumber}</span> in the description/remark of your bank mobile transfer so our accounting desk can automatically reconcile it with your order.
                </p>
              </div>

              {/* Submission of Unverified Claim Form */}
              {!proofSubmitted ? (
                <form onSubmit={handleSubmitBankTransferProof} className="space-y-4 pt-2">
                  <h4 className="font-serif font-bold text-sm text-charcoal">
                    Submit Transfer Reference / Transaction ID
                  </h4>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Bank Transaction ID or SMS Reference Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={transferRefInput}
                      onChange={(e) => setTransferRefInput(e.target.value)}
                      placeholder="e.g. FT261093847192 or CBE-TRANS-9812"
                      className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Additional Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={transferNotesInput}
                      onChange={(e) => setTransferNotesInput(e.target.value)}
                      placeholder="e.g. Transferred from Selamawit's CBE account at 10:15 AM"
                      className="w-full text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold text-xs py-3 justify-center font-semibold"
                  >
                    <span>Submit Proof for Admin Reconciliation</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span>Bank Transfer Proof Submitted for Reconcilement</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Transaction reference <span className="font-mono font-bold">{transferRefInput}</span> has been logged under audit. In accordance with Section 8.3 & 8.4, your order remains in <span className="font-bold">PROCESSING / PENDING RECONCILIATION</span> until our verified accounting desk reconciles the bank statement.
                  </p>
                  <button
                    onClick={() => navigate('/orders')}
                    className="btn-gold text-xs mt-2"
                  >
                    View in Order Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 'SUCCESS' && createdOrder && (
        <div className="max-w-xl mx-auto glass-panel-elevated p-10 rounded-3xl border-2 border-gold-400 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-700 shadow-lg">
            <Sparkles className="w-10 h-10 text-green-600 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
              Congratulations
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal">
              Order Confirmed & Secured!
            </h2>
            <p className="text-xs text-gray-500 font-light max-w-sm mx-auto">
              Your order <span className="font-bold text-charcoal">#{createdOrder.orderNumber}</span> has been registered into our fulfillment pipeline.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-ivory-50 border border-champagne-border text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-mono font-bold text-charcoal">{createdOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status:</span>
              <span className="font-semibold text-green-700">{createdOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fulfillment Status:</span>
              <span className="font-semibold text-gold-800">{createdOrder.fulfillmentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="text-charcoal truncate">{createdOrder.shippingAddressLine}, {createdOrder.shippingCity}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/orders')}
              className="btn-gold text-xs px-6 py-3 font-semibold"
            >
              Track Order & Delivery
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="btn-outline-gold text-xs px-6 py-3"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

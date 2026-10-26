import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('ORDER_INQUIRY');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    const ticketId = `TKT-AA-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(ticketId);
    setSubject('');
    setMessage('');
    setOrderNumber('');
  };

  const faqs = [
    {
      q: 'How does Telebirr payment work on Edris Perfume?',
      a: 'When you select Telebirr at checkout, our system creates an order reference and displays a unique QR code or initiates USSD authorization. Upon completing payment on your Telebirr app, Ethio Telecom sends an instant server-to-server callback, and your order status automatically changes to CONFIRMED.',
    },
    {
      q: 'What is the verification timeline for Commercial Bank of Ethiopia (CBE) transfers?',
      a: 'Bank deposits and mobile transfers are processed during business hours (8:30 AM - 7:00 PM EAT). Once you submit your bank reference code or transaction receipt, our certified finance desk reconciles the transaction with our statement within 30 to 60 minutes.',
    },
    {
      q: 'How long does delivery take in Addis Ababa and other Ethiopian cities?',
      a: 'For Addis Ababa addresses (Bole, Kirkos, Yeka, Arada, etc.), orders placed before 2:00 PM are dispatched same-day by our white-glove courier in luxury presentation packaging. Regional deliveries (Hawassa, Bahir Dar, Dire Dawa, Adama) arrive within 48 to 72 hours.',
    },
    {
      q: 'Are all fragrances 100% genuine and original?',
      a: 'Yes. Edris Perfume strictly sources from verified authorized distributors and licensed master perfumers. Every flacon bears our holographic gold authenticity seal and batch code.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
          Client Assistance
        </span>
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          Edris Concierge & Customer Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
          Need fragrance guidance, order status verification, or assistance with a bank deposit? Our dedicated Addis Ababa concierge team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Support Ticket Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-champagne-border space-y-6">
          <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold-600" />
            <span>Open a Support Inquiry</span>
          </h3>

          {submittedTicket ? (
            <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
              <h4 className="font-serif font-bold text-lg">Inquiry Ticket #{submittedTicket} Created</h4>
              <p className="text-xs text-green-800 leading-relaxed max-w-md mx-auto">
                Thank you. Your inquiry has been routed to our customer support desk. An Edris concierge will reply to your registered email or phone within 2 hours.
              </p>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="btn-gold text-xs px-5 py-2 font-semibold mt-2"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Bank transfer deposit verification"
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  >
                    <option value="ORDER_INQUIRY">Order & Delivery Status</option>
                    <option value="PAYMENT_ISSUE">Payment & Bank Reconciliation</option>
                    <option value="PRODUCT_ADVICE">Scent Recommendation & Notes</option>
                    <option value="AUTHENTICITY">Authenticity & Batch Verification</option>
                    <option value="MERCHANT_SUPPORT">Merchant Partner Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Order Number (Optional)</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. EDR-2026-88192"
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your question or issue in detail..."
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold text-xs py-3 justify-center font-semibold"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Concierge</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-champagne-border space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Addis Ababa Flagship Boutique
            </h3>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>Bole Medhanialem Luxury Arcade, 2nd Floor, Suite 204, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>+251 911 22 33 44 / +251 116 67 88 99</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>concierge@edrisperfume.et</span>
              </div>
            </div>

            <div className="pt-3 border-t border-champagne-border/60 text-xs">
              <p className="font-semibold text-charcoal">Boutique & Phone Concierge Hours:</p>
              <p className="text-gray-500 mt-1">Monday – Saturday: 8:30 AM – 8:00 PM EAT</p>
              <p className="text-gray-500">Sunday: 10:00 AM – 6:00 PM EAT</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-champagne-border space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gold-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Escrow Dispute Protection</span>
            </div>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              If your perfume is not delivered within the guaranteed timeline or fails authenticity verification, our administrator escrow guarantees a 100% full refund through Telebirr or your designated Ethiopian bank.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 max-w-4xl mx-auto pt-6">
        <h3 className="font-serif text-2xl font-bold text-charcoal text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl border border-champagne-border overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-serif font-bold text-charcoal hover:bg-gold-50/50"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-gold-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-champagne-border/40 pt-2 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  TelebirrIcon,
  BankIcon,
  CbeBankIcon,
  AwashBankIcon,
  DashenBankIcon,
  BoaBankIcon,
} from './PaymentIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1918] text-white border-t border-gold-500/20 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mt-3">
              Edris Perfume embodies the highest standard of artistic perfumery in Ethiopia. We unite centuries-old Ethiopian botanical traditions—sacred Tigray frankincense and Lalibela honeyed rose—with world-renowned French haute perfumery.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Bole Medhanialem Luxury Arcade, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>+251 911 22 33 44 / +251 116 67 88 99</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>concierge@edrisperfume.et</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              The Collection
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/shop?category=extrait-de-parfum" className="hover:text-gold-200 transition-colors">
                  Extrait de Parfum
                </Link>
              </li>
              <li>
                <Link to="/shop?category=eau-de-parfum" className="hover:text-gold-200 transition-colors">
                  Eau de Parfum
                </Link>
              </li>
              <li>
                <Link to="/shop?category=oriental-oud" className="hover:text-gold-200 transition-colors">
                  Oriental & Smoky Oud
                </Link>
              </li>
              <li>
                <Link to="/shop?category=floral-romantic" className="hover:text-gold-200 transition-colors">
                  Lalibela Golden Rose
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gold-200 transition-colors">
                  Niche Fragrance Discovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Concierge & Trust
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/orders" className="hover:text-gold-200 transition-colors">
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="hover:text-gold-200 transition-colors">
                  Royal Privilege Club
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-200 transition-colors">
                  Authenticity Guarantee
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-gold-200 transition-colors">
                  Support & Concierge
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-200 transition-colors">
                  Payment & Delivery FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Enterprise & Merchant Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Partners & Admin
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/merchant" className="hover:text-gold-200 transition-colors flex items-center gap-1">
                  <span>Merchant Portal</span>
                  <span className="text-[9px] bg-gold-900/60 text-gold-300 px-1.5 py-0.2 rounded border border-gold-500/30">
                    Seller
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/merchant/register" className="hover:text-gold-200 transition-colors">
                  Apply as Merchant Partner
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold-200 transition-colors flex items-center gap-1">
                  <span>Administrator Control</span>
                  <ShieldCheck className="w-3 h-3 text-gold-400" />
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-gray-500 block pt-1">
                  Primary Market: Ethiopia (ETB)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethiopia Payment Trust Architecture Bar */}
        <div className="pt-8 pb-4">
          <p className="text-[11px] text-center uppercase tracking-widest text-gold-400 mb-4 font-serif">
            Secured Official Ethiopian Payment Channels
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-3 py-1.5 bg-white/5 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xs">
              <TelebirrIcon size="xs" />
              <span>Telebirr SuperApp</span>
            </div>
            <div className="px-3 py-1.5 bg-white/5 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xs">
              <CbeBankIcon size="xs" />
              <span>Commercial Bank of Ethiopia (CBE)</span>
            </div>
            <div className="px-3 py-1.5 bg-white/5 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xs">
              <AwashBankIcon size="xs" />
              <span>Awash Bank & Awash Birr</span>
            </div>
            <div className="px-3 py-1.5 bg-white/5 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xs">
              <DashenBankIcon size="xs" />
              <span>Dashen Bank & Amole</span>
            </div>
            <div className="px-3 py-1.5 bg-white/5 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xs">
              <BoaBankIcon size="xs" />
              <span>Bank of Abyssinia (Apollo)</span>
            </div>
            <div className="px-3 py-1.5 bg-white/5 border border-gold-500/20 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xs">
              <BankIcon size="xs" />
              <span>Cash / Doorstep Transfer</span>
            </div>
          </div>
        </div>

        {/* Copyright and legal */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Edris Perfume Trading PLC. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-gold-500 fill-gold-500" />
            <span>for Ethiopian Haute Fragrance Connoisseurs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

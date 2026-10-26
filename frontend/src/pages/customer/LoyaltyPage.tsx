import React from 'react';
import { Award, Sparkles, Gift, Crown, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LoyaltyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold-600" />
          <span>The Royal Privilege Club</span>
        </div>
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          Customer Loyalty & Sillage Rewards
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
          Every fragrance acquired earns precious privilege points. Unlock private extrait tastings, custom engraving, and bespoke deliveries across Ethiopia.
        </p>
      </div>

      {/* Member Card */}
      <div className="max-w-xl mx-auto rounded-3xl bg-gradient-to-br from-[#2D2A26] via-[#1A1918] to-[#121110] text-white p-8 border-2 border-gold-400/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold-300 font-mono">
              Member Tier
            </p>
            <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span>Silver Connoisseur</span>
              <Sparkles className="w-4 h-4 text-gold-400" />
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full border border-gold-400/40 bg-white/5 flex items-center justify-center text-gold-300">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-400">Available Privilege Points</span>
            <span className="font-serif font-bold text-3xl text-gold-300">245 pts</span>
          </div>

          {/* Progress bar to Gold */}
          <div className="space-y-1">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-gold-400 to-gold-600 h-full w-[49%]" />
            </div>
            <p className="text-[10px] text-gray-400 text-right">
              255 points until Gold Imperial Tier (1 ETB spent = 1 Privilege Point)
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Client: Selamawit Tadesse</span>
          <span className="font-mono text-[11px]">EP-VIP-9941</span>
        </div>
      </div>

      {/* Redeemable Rewards Grid */}
      <div className="space-y-6">
        <h3 className="font-serif text-2xl font-bold text-charcoal text-center">
          Available Privilege Privileges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal">
                1,000 ETB Privilege Voucher
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Redeem against any extrait or perfume flacon order over 8,000 ETB.
              </p>
            </div>
            <div className="pt-2 border-t border-champagne-border/60 flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-gold-800">200 Points</span>
              <button className="btn-gold text-xs px-4 py-1.5 font-semibold">
                Redeem
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal">
                Extrait Discovery Duo (5ml)
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Pocket travel flacons of Edris Royale Extrait & Addis Nights Oud.
              </p>
            </div>
            <div className="pt-2 border-t border-champagne-border/60 flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-gold-800">350 Points</span>
              <button disabled className="px-4 py-1.5 rounded-full text-xs bg-gray-100 text-gray-400 font-medium">
                Need 105 more
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-3">
                <Crown className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal">
                VIP Same-Day Dispatch
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Complimentary express white-glove courier delivery anywhere in Addis Ababa.
              </p>
            </div>
            <div className="pt-2 border-t border-champagne-border/60 flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-gold-800">100 Points</span>
              <button className="btn-gold text-xs px-4 py-1.5 font-semibold">
                Redeem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

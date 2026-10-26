import React from 'react';
import { Sparkles, ShieldCheck, Award, Droplets, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
          Haute Parfumerie d'Éthiopie
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal">
          The Story of Edris Perfume
        </h1>
        <p className="font-serif italic text-lg text-gold-800">
          "Elegance in Every Drop."
        </p>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Born in the highlands of Ethiopia, Edris Perfume was established to revive the ancient, imperial relationship between Ethiopia’s sacred botanical resins and the pinnacle of global artistic perfumery.
        </p>
      </div>

      {/* Main Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            The Cradle of Sacred Mountain Frankincense
          </h2>
          <p>
            For thousands of years, the northern highlands of Tigray and the valleys of Amhara produced Boswellia papyrifera—the most coveted white frankincense in the ancient world. Hand-harvested during dry mountain seasons, this resin burns with clean balsamic citrus notes, sweet pine, and warm ceremonial myrrh.
          </p>
          <p>
            At Edris Perfume, our perfumers combine this authentic Ethiopian heritage with French compounding techniques from Grasse. Every extraction is aged in dark amber barrels to achieve unparalleled depth, velvety projection, and longevity exceeding 24 hours.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden glass-panel-elevated p-3 border border-gold-400/40 shadow-xl aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800"
            alt="Artisanal Mountain Resins"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Authenticity & Escrow Promise */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-champagne-border space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="font-serif text-2xl font-bold text-charcoal">
            Our Fourfold Authenticity & Quality Pledge
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Every bottle that leaves our Addis Ababa atelier meets uncompromised standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="p-4 rounded-2xl bg-white/60 border border-champagne-border space-y-2 text-center">
            <ShieldCheck className="w-8 h-8 text-gold-600 mx-auto" />
            <h4 className="font-serif font-bold text-sm text-charcoal">100% Genuine Perfumes</h4>
            <p className="text-xs text-gray-500">
              Directly imported from licensed brand houses with manufacturer batch codes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 border border-champagne-border space-y-2 text-center">
            <Droplets className="w-8 h-8 text-gold-600 mx-auto" />
            <h4 className="font-serif font-bold text-sm text-charcoal">Certified Extraits</h4>
            <p className="text-xs text-gray-500">
              High oil concentration formulation ensuring 24h+ sillage and personal aura.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 border border-champagne-border space-y-2 text-center">
            <Award className="w-8 h-8 text-gold-600 mx-auto" />
            <h4 className="font-serif font-bold text-sm text-charcoal">Escrow Protected</h4>
            <p className="text-xs text-gray-500">
              Your Telebirr and bank payments remain protected until your order is verified.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 border border-champagne-border space-y-2 text-center">
            <Sparkles className="w-8 h-8 text-gold-600 mx-auto" />
            <h4 className="font-serif font-bold text-sm text-charcoal">White-Glove Courier</h4>
            <p className="text-xs text-gray-500">
              Delivered across Addis Ababa in velvet gift boxes sealed with royal gold wax.
            </p>
          </div>
        </div>
      </div>

      {/* Flagship Atelier */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="font-serif text-2xl font-bold text-charcoal">
          Visit Our Addis Ababa Atelier
        </h3>
        <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed">
          Experience personal fragrance consultations, scent layering workshops, and bespoke flacon engraving at our flagship boutique in Bole Medhanialem Arcade.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link to="/shop" className="btn-gold text-xs px-6 py-3 font-semibold">
            Explore The Collection
          </Link>
          <Link to="/support" className="btn-outline-gold text-xs px-6 py-3">
            Contact Concierge
          </Link>
        </div>
      </div>
    </div>
  );
};

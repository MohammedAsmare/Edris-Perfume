import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/customer/ProductCard';
import { api } from '../../services/api';
import { Product, Category, AdvertisingCampaign } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Droplets,
  ArrowRight,
  Star,
  Award,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [campaigns, setCampaigns] = useState<AdvertisingCampaign[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [prodData, catData, campData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getCampaigns(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      setCampaigns(campData);
    };
    load();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Luxury Hero Section */}
      <section className="relative overflow-hidden bg-ivory-100 min-h-[580px] sm:min-h-[640px] flex items-center border-b border-champagne-border/80">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-gold-300/20 via-gold-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-gold-400/60 shadow-sm text-gold-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                <span className="tracking-widest uppercase text-[11px]">
                  Haute Parfumerie d'Éthiopie
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.12]">
                Elegance in <span className="text-gold-gradient italic">Every Drop</span>.
              </h1>

              <p className="text-sm sm:text-base text-charcoal-light leading-relaxed max-w-xl font-light">
                Discover Ethiopia’s most coveted artisanal extraits and niche fragrances. Hand-selected rare Tigray mountain frankincense, Lalibela rose, and authentic royal Cambodian ouds.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/shop" className="btn-gold text-sm px-7 py-3.5 font-semibold">
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/shop?category=extrait-de-parfum" className="btn-outline-gold text-sm px-6 py-3.5">
                  <span>Discover Extraits</span>
                </Link>
              </div>

              {/* Ethiopian Payment Escrow Highlights */}
              <div className="pt-6 border-t border-champagne-border/60 flex flex-wrap items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Telebirr & CBE Escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600" />
                  <span>White-Glove Addis Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-600" />
                  <span>100% Certified Authentic</span>
                </div>
              </div>
            </div>

            {/* Hero Flacon Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 sm:w-80 lg:w-96 aspect-[4/5] rounded-3xl overflow-hidden glass-panel-elevated p-3 border-2 border-gold-400/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000"
                  alt="Edris Royale Extrait"
                  className="w-full h-full object-cover rounded-2xl"
                />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel-elevated border border-gold-400/60 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gold-700">
                        Signature Extrait
                      </p>
                      <h3 className="font-serif font-bold text-sm text-charcoal">
                        Edris Royale Extrait
                      </h3>
                      <p className="text-xs text-gold-900 font-bold mt-0.5">
                        14,500 ETB
                      </p>
                    </div>
                    <Link
                      to="/product/edris-royale-extrait"
                      className="p-2.5 rounded-full bg-gold-500 text-white hover:bg-gold-600 transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Value Propositions Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal">Authenticity Guaranteed</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Directly sourced from verified master perfumers and authorized luxury distributors.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 flex-shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal">24h+ Lasting Sillage</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Rich concentrations featuring pure extracts, natural myrrh, and rare Ethiopian resins.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal">White-Glove Delivery</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Same-day & next-day courier across Addis Ababa; prompt delivery throughout Ethiopia.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-champagne-border flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal">Official Ethiopian Payments</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Protected Telebirr integration and audited accounts at CBE, Awash, Dashen, & BoA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Fragrance Families Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-gold-700 uppercase">
              Olfactory Architecture
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mt-1">
              Curated Fragrance Families
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-gold-800 hover:text-gold-900 inline-flex items-center gap-1 group"
          >
            <span>View All Fragrance Profiles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="glass-card group p-5 rounded-2xl border border-champagne-border text-center flex flex-col items-center justify-between hover:border-gold-500 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-gold-200 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif font-bold text-sm text-charcoal group-hover:text-gold-700 transition-colors">
                {cat.name}
              </h4>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-gold-700 uppercase">
              Masterpieces of Scent
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mt-1">
              The Royal Collection
            </h2>
          </div>
          <Link
            to="/shop"
            className="btn-outline-gold text-xs px-5 py-2.5 font-medium"
          >
            Browse All {products.length} Fragrances
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Heritage Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel-elevated border border-gold-400/50 p-8 sm:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
                The Heritage of Ethiopian Frankincense
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-snug">
                Sacred Mountain Resins & Haute French Perfumery
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                Ethiopia has been the cradle of rare aromatic resins for millennia—from the Boswellia groves of Tigray to the myrrh valleys of the Ogaden. Edris Perfume bridges this sacred ancient heritage with modern artistic compounding, creating scents that evoke imperial splendor and transcendent spirituality.
              </p>
              <div className="pt-2 flex items-center gap-6">
                <div>
                  <p className="font-serif font-bold text-2xl text-gold-800">24+ hrs</p>
                  <p className="text-[11px] text-gray-500">Extrait Longevity</p>
                </div>
                <div className="w-px h-10 bg-champagne-border" />
                <div>
                  <p className="font-serif font-bold text-2xl text-gold-800">100%</p>
                  <p className="text-[11px] text-gray-500">Pure Certified Oils</p>
                </div>
                <div className="w-px h-10 bg-champagne-border" />
                <div>
                  <p className="font-serif font-bold text-2xl text-gold-800">Addis</p>
                  <p className="text-[11px] text-gray-500">Same-Day Courier</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold-300 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=900"
                alt="Ethiopian Resins & Artisan Perfume"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Merchant Partner Invitation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal text-white rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-300">
              Partner with Edris Perfume
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Are you a Luxury Perfumer or Fragrance Boutique in Ethiopia?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              Join Ethiopia's premier fragrance marketplace. Enjoy verified merchant escrow, automatic Telebirr payouts, order processing tools, and access to thousands of discerning scent connoisseurs nationwide.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <Link to="/merchant/register" className="btn-gold text-xs px-6 py-3 font-semibold">
                Apply for Merchant Account
              </Link>
              <Link to="/merchant" className="px-5 py-3 rounded-full text-xs font-medium border border-gold-400/40 text-gold-200 hover:bg-white/10 transition-colors">
                Merchant Portal Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

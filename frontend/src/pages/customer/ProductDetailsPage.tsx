import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Droplets,
  Heart,
  Share2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'olfactory' | 'delivery' | 'merchant'>('olfactory');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (slug) {
        const found = await api.getProductBySlug(slug);
        if (found) {
          setProduct(found);
          const all = await api.getProducts();
          setRelatedProducts(all.filter((p) => p.id !== found.id).slice(0, 3));
        }
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Sparkles className="w-8 h-8 text-gold-600 animate-spin mx-auto mb-4" />
        <p className="font-serif text-sm text-gray-500">Unveiling Fragrance Masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal">Fragrance Not Found</h2>
        <p className="text-xs text-gray-500">The requested fragrance profile does not exist or has been archived.</p>
        <Link to="/shop" className="btn-gold text-xs">
          Return to Collection
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to The Collection</span>
      </Link>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-panel-elevated border-2 border-gold-400/40 shadow-2xl relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-md text-gold-900 border border-gold-300 shadow-sm">
                {product.concentration}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold-600/90 text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>24h+ Sillage</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span className="uppercase tracking-[0.2em] font-bold text-gold-700">
                {product.brandName}
              </span>
              <div className="flex items-center gap-1 text-charcoal font-semibold">
                <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                <span>{product.ratingAvg.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount} connoisseur reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              {product.name}
            </h1>

            <p className="text-xs text-gold-800 font-medium mt-1">
              {product.fragranceFamily} • {product.volumeMl}ml flacon • Artisanal batch
            </p>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl glass-panel border border-champagne-border flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block">
                Official Price (Ethiopian Birr)
              </span>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="font-serif font-bold text-3xl text-gold-900">
                  {product.price.toLocaleString()} ETB
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.compareAtPrice.toLocaleString()} ETB
                  </span>
                )}
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              In Stock ({product.stockQuantity} available)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            {product.fullDescription || product.shortDescription}
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-champagne-border rounded-full bg-white px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-gold-700 font-bold px-2"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="text-gray-500 hover:text-gold-700 font-bold px-2"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 btn-gold text-sm py-3.5 shadow-md font-semibold"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full btn-outline-gold text-xs py-3 justify-center font-semibold"
            >
              <span>Instant Telebirr Checkout</span>
            </button>
          </div>

          {/* Tabs: Olfactory Notes, Delivery, Merchant Partner */}
          <div className="pt-6 border-t border-champagne-border/80 space-y-4">
            <div className="flex gap-4 border-b border-champagne-border/60 pb-2">
              <button
                onClick={() => setActiveTab('olfactory')}
                className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-all ${
                  activeTab === 'olfactory'
                    ? 'border-gold-600 text-gold-900'
                    : 'border-transparent text-gray-400 hover:text-charcoal'
                }`}
              >
                Olfactory Pyramid
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-all ${
                  activeTab === 'delivery'
                    ? 'border-gold-600 text-gold-900'
                    : 'border-transparent text-gray-400 hover:text-charcoal'
                }`}
              >
                Delivery & Escrow
              </button>
              <button
                onClick={() => setActiveTab('merchant')}
                className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-all ${
                  activeTab === 'merchant'
                    ? 'border-gold-600 text-gold-900'
                    : 'border-transparent text-gray-400 hover:text-charcoal'
                }`}
              >
                Verified Partner
              </button>
            </div>

            {activeTab === 'olfactory' && (
              <div className="space-y-3 text-xs animate-in fade-in duration-200">
                <div className="p-3 rounded-lg bg-gold-50/50 border border-champagne-border flex items-start gap-3">
                  <span className="font-semibold text-gold-800 w-24 flex-shrink-0">Top Notes:</span>
                  <span className="text-charcoal">{product.topNotes || 'Bergamot, Saffron, Spiced Citrus'}</span>
                </div>
                <div className="p-3 rounded-lg bg-gold-50/50 border border-champagne-border flex items-start gap-3">
                  <span className="font-semibold text-gold-800 w-24 flex-shrink-0">Heart Notes:</span>
                  <span className="text-charcoal">{product.heartNotes || 'Ethiopian Frankincense, Damask Rose, Jasmine'}</span>
                </div>
                <div className="p-3 rounded-lg bg-gold-50/50 border border-champagne-border flex items-start gap-3">
                  <span className="font-semibold text-gold-800 w-24 flex-shrink-0">Base Notes:</span>
                  <span className="text-charcoal">{product.baseNotes || 'Cambodian Oud, Bourbon Vanilla, Ambergris'}</span>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-2.5 text-xs text-gray-600 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>White-glove delivery in Addis Ababa within 24 hours.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Sealed in presentation velvet gift box with gold wax seal.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Guaranteed authentic or 100% money back through our escrow account.</span>
                </div>
              </div>
            )}

            {activeTab === 'merchant' && (
              <div className="p-4 rounded-xl bg-white/80 border border-champagne-border text-xs space-y-2 animate-in fade-in duration-200">
                <p className="font-serif font-bold text-sm text-charcoal">
                  {product.merchantName || 'Edris Official Atelier'}
                </p>
                <p className="text-gray-500">
                  Approved & certified luxury fragrance merchant partner on Edris Perfume.
                </p>
                <div className="flex items-center gap-1.5 text-gold-700 font-medium pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Government Licensed & TIN Verified Merchant</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

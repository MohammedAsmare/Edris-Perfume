import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-champagne-border/70 hover:border-gold-500/60 transition-all duration-300">
      {/* Image & Badges */}
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-50">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-md text-gold-800 border border-gold-300 shadow-sm">
            {product.concentration}
          </span>
          {product.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gold-600/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Royal Selection</span>
            </span>
          )}
        </div>

        {/* Quick Add overlay button */}
        <button
          onClick={() => addToCart(product, 1)}
          className="absolute bottom-3 right-3 p-3 rounded-full bg-white/90 hover:bg-gold-500 text-charcoal hover:text-white backdrop-blur-md shadow-lg border border-champagne-border transition-all duration-200 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          title="Add to Bag"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="uppercase tracking-widest text-[10px] font-semibold text-gold-700">
              {product.brandName}
            </span>
            <span className="text-[11px] font-medium text-gray-400">
              {product.volumeMl}ml
            </span>
          </div>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-gold-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Olfactory Notes Preview */}
          {product.topNotes && (
            <div className="mt-2.5 pt-2 border-t border-champagne-border/40 text-[11px] text-gray-500 flex items-center gap-1.5 truncate">
              <span className="font-semibold text-gold-700">Notes:</span>
              <span className="italic truncate">{product.topNotes}</span>
            </div>
          )}
        </div>

        {/* Price & Rating */}
        <div className="pt-2 border-t border-champagne-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-gold-800">
                {product.price.toLocaleString()} ETB
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {product.compareAtPrice.toLocaleString()} ETB
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-charcoal font-medium">
            <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            <span>{product.ratingAvg.toFixed(1)}</span>
            <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

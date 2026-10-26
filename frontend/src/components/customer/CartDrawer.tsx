import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    deliveryFee,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponMsg({ text: `Code '${couponInput.toUpperCase()}' applied successfully!`, error: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: 'Invalid promo code. Try WELCOME10 or EDRISGOLD', error: true });
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-elevated bg-[#FAF7F0] border-l border-champagne-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-champagne-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <h2 className="font-serif text-lg font-bold text-charcoal">Your Fragrance Bag</h2>
              <span className="text-xs bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full font-medium">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-charcoal rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold-100/60 border border-gold-300 flex items-center justify-center text-gold-700">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal">Your bag is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our luxury collection of extraits and rare Ethiopian oud fragrances.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="btn-gold text-xs mt-2"
                >
                  Explore The Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl glass-card border border-champagne-border/70 flex gap-3.5 items-center relative group"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded-lg border border-champagne-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gold-700">
                      {item.product.brandName}
                    </p>
                    <h4 className="text-xs font-serif font-bold text-charcoal truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {item.product.volumeMl}ml • {item.product.concentration}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-champagne-border rounded-full bg-white/70 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-500 hover:text-gold-700 hover:bg-gold-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-500 hover:text-gold-700 hover:bg-gold-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-bold text-xs text-gold-800">
                        {(item.product.price * item.quantity).toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-champagne-border/80 bg-white/70 backdrop-blur-md space-y-4">
              {/* Promo code */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-gold-50 border border-gold-300 px-3 py-1.5 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-gold-800 font-medium">
                      <Tag className="w-3.5 h-3.5 text-gold-600" />
                      <span>{couponCode} (-{discount.toLocaleString()} ETB)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 bg-white border border-champagne-border rounded-lg uppercase tracking-wider focus:outline-none focus:border-gold-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-charcoal text-white text-xs rounded-lg hover:bg-charcoal-light font-medium"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[10px] mt-1 ${couponMsg.error ? 'text-red-600' : 'text-green-700 font-medium'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Cost Summary in Ethiopian Birr */}
              <div className="space-y-1.5 text-xs text-gray-600">
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
                <div className="border-t border-champagne-border/80 pt-2 flex justify-between text-sm font-bold text-charcoal">
                  <span className="font-serif">Total Due</span>
                  <span className="font-serif text-gold-800 text-base">{total.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full btn-gold text-sm py-3 justify-center shadow-md font-semibold"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                <span>Certified Official Telebirr & CBE Payment Escrow</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  Award,
  Sparkles,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-champagne-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <Link
              to="/"
              className="text-charcoal hover:text-gold-700 transition-colors uppercase tracking-wider text-xs font-semibold"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-charcoal hover:text-gold-700 transition-colors uppercase tracking-wider text-xs font-semibold"
            >
              The Collection
            </Link>
            <Link
              to="/shop?category=extrait-de-parfum"
              className="text-charcoal hover:text-gold-700 transition-colors uppercase tracking-wider text-xs font-semibold"
            >
              Extrait
            </Link>
            <Link
              to="/shop?category=oriental-oud"
              className="text-charcoal hover:text-gold-700 transition-colors uppercase tracking-wider text-xs font-semibold"
            >
              Oud & Resins
            </Link>
            <Link
              to="/about"
              className="text-charcoal hover:text-gold-700 transition-colors uppercase tracking-wider text-xs font-semibold"
            >
              Heritage
            </Link>
            <Link
              to="/support"
              className="text-charcoal hover:text-gold-700 transition-colors uppercase tracking-wider text-xs font-semibold"
            >
              Concierge
            </Link>
          </nav>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
              <input
                type="text"
                placeholder="Search rare notes, oud, extrait..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 lg:w-64 pl-9 pr-4 py-1.5 text-xs bg-white/80 border border-champagne-border rounded-full focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 text-charcoal transition-all placeholder:text-gray-400 placeholder:italic"
              />
              <Search className="w-3.5 h-3.5 text-gold-600 absolute left-3 pointer-events-none" />
            </form>

            {/* Loyalty Quick Pill */}
            <Link
              to="/loyalty"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gold-50 border border-gold-200/80 rounded-full text-gold-800 text-xs hover:bg-gold-100 transition-colors"
              title="Edris Royal Privilege Club"
            >
              <Award className="w-3.5 h-3.5 text-gold-600" />
              <span className="font-medium text-[11px]">245 pts</span>
            </Link>

            {/* User Account / Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-charcoal hover:text-gold-700 transition-colors rounded-full hover:bg-gold-50"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 glass-panel-elevated rounded-xl shadow-glass-hover py-2 border border-champagne-border z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-champagne-border/50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-xs font-semibold text-charcoal truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-medium bg-gold-100 text-gold-800 rounded-full">
                      {role.replace('ROLE_', '')}
                    </span>
                  </div>

                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-xs text-charcoal hover:bg-gold-50 hover:text-gold-700 transition-colors"
                  >
                    My Orders & Tracking
                  </Link>
                  <Link
                    to="/loyalty"
                    className="block px-4 py-2 text-xs text-charcoal hover:bg-gold-50 hover:text-gold-700 transition-colors"
                  >
                    Royal Loyalty Rewards
                  </Link>

                  {role === 'ROLE_MERCHANT' && (
                    <>
                      <Link
                        to="/merchant/dispatch"
                        className="block px-4 py-2 text-xs font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
                      >
                        Order Dispatch & Delivery
                      </Link>
                      <Link
                        to="/merchant"
                        className="block px-4 py-2 text-xs text-charcoal hover:bg-gold-50 transition-colors"
                      >
                        Merchant Portal
                      </Link>
                    </>
                  )}

                  {role === 'ROLE_DELIVERY_PARTNER' && (
                    <Link
                      to="/delivery"
                      className="block px-4 py-2 text-xs font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
                    >
                      Delivery Partner Route & Queue
                    </Link>
                  )}

                  {role === 'ROLE_ADMIN' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-xs font-medium text-gold-700 hover:bg-gold-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-champagne-border/50 my-1" />

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-charcoal hover:text-gold-700 transition-colors rounded-full hover:bg-gold-50"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gold-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-gold-500 to-gold-700 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal hover:text-gold-700 rounded-md"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-champagne-border/50 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="mb-4 relative">
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-champagne-border rounded-full"
              />
              <Search className="w-4 h-4 text-gold-600 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            <nav className="flex flex-col space-y-3 text-sm">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                All Perfumes
              </Link>
              <Link
                to="/shop?category=extrait-de-parfum"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                Extrait de Parfum
              </Link>
              <Link
                to="/shop?category=oriental-oud"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                Oriental & Oud
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                My Orders
              </Link>
              <Link
                to="/loyalty"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                Loyalty Privileges
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal hover:text-gold-700 font-medium py-1"
              >
                Concierge Support
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

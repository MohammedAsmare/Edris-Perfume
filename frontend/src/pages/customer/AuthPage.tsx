import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/brand/Logo';
import { Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, ShieldCheck } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    // Success login
    login(email, 'ROLE_CUSTOMER');
    navigate('/');
  };

  const handleDemoFill = () => {
    setEmail('customer@edrisperfume.et');
    setPassword('Edris@123456');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-panel-elevated p-8 sm:p-10 rounded-3xl border-2 border-gold-400/40 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <Logo size="md" showSlogan={false} className="justify-center" />
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            {isLogin ? 'Welcome Back, Connoisseur' : 'Create Your Royal Account'}
          </h2>
          <p className="text-xs text-gray-500 font-light">
            {isLogin
              ? 'Sign in to access your orders, fragrance wishlist, and privilege points.'
              : 'Join Ethiopia’s premier luxury perfumery boutique.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">First Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Selamawit"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tadesse"
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Phone Number (Ethiopia) *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 911 22 33 44"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                />
                <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="connoisseur@edrisperfume.et"
                className="w-full pl-8 pr-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-gray-700">Password *</label>
              {isLogin && (
                <a href="#forgot" className="text-[10px] text-gold-700 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-8 pr-9 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-charcoal"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-gold text-xs py-3 justify-center font-semibold shadow-md mt-2"
          >
            <span>{isLogin ? 'Sign In to Edris Concierge' : 'Register Account'}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs space-y-3">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gold-800 hover:text-gold-900 font-semibold"
          >
            {isLogin
              ? "Don't have an account? Apply for Membership"
              : 'Already have an account? Sign in'}
          </button>

          <div className="pt-3 border-t border-champagne-border/70 flex items-center justify-between">
            <button
              onClick={handleDemoFill}
              className="text-[11px] text-gold-700 underline font-medium hover:text-gold-900"
            >
              Fill Demo Customer Credentials
            </button>
            <Link to="/merchant" className="text-[11px] text-gray-500 hover:text-charcoal">
              Merchant Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

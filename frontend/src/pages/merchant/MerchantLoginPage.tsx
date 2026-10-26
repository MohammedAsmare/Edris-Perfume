import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/brand/Logo';
import { Mail, Lock, Eye, EyeOff, Store, ShieldCheck, Building2, Phone, FileText } from 'lucide-react';

export const MerchantLoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('merchant@edrisperfume.et');
  const [password, setPassword] = useState('Edris@123456');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Fields
  const [businessName, setBusinessName] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bankName, setBankName] = useState('Commercial Bank of Ethiopia');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your merchant email and password.');
      return;
    }

    login(email, 'ROLE_MERCHANT');
    navigate('/merchant');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!businessName || !tinNumber || !contactPhone || !bankAccountNumber) {
      setError('Please fill in all mandatory business verification fields.');
      return;
    }

    setSuccessMsg(
      'Merchant application submitted! In accordance with Section 2.B, merchant accounts must be reviewed and approved by an administrator before selling.'
    );
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-panel-elevated p-8 sm:p-10 rounded-3xl border-2 border-gold-400/50 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Logo size="md" showSlogan={false} className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-semibold mt-2">
            <Store className="w-3.5 h-3.5 text-gold-700" />
            <span>Merchant Partner Portal</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            {isRegister ? 'Apply as Merchant Partner' : 'Merchant Partner Sign In'}
          </h2>
          <p className="text-xs text-gray-500 font-light">
            {isRegister
              ? 'Join Ethiopia’s certified luxury fragrance marketplace.'
              : 'Manage products, inventory, orders, and Telebirr/Bank payouts.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {successMsg ? (
          <div className="p-5 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-green-600 mx-auto" />
            <h4 className="font-serif font-bold text-sm">Application Under Review</h4>
            <p className="text-xs text-green-800 leading-relaxed">{successMsg}</p>
            <button
              onClick={() => {
                setIsRegister(false);
                setSuccessMsg(null);
              }}
              className="btn-gold text-xs px-4 py-2 font-semibold mt-2"
            >
              Sign In to Approved Account
            </button>
          </div>
        ) : !isRegister ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Merchant Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@edrisperfume.et"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                />
                <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-gray-700">Password *</label>
                <a href="#forgot" className="text-[10px] text-gold-700 hover:underline">
                  Forgot password?
                </a>
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
              <span>Sign In to Merchant Console</span>
            </button>

            <div className="pt-2 text-center space-y-2">
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-gold-800 hover:text-gold-900 font-semibold"
              >
                New business? Apply to sell on Edris Perfume
              </button>
              <div className="pt-2">
                <Link to="/" className="text-[11px] text-gray-500 hover:text-charcoal">
                  ← Return to Customer Store
                </Link>
              </div>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Business / Boutique Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Red Sea Oud Importers PLC"
                className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">TIN Number *</label>
                <input
                  type="text"
                  required
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  placeholder="0012345678"
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Trade License No.</label>
                <input
                  type="text"
                  value={tradeLicense}
                  onChange={(e) => setTradeLicense(e.target.value)}
                  placeholder="TL-AA-2026-XXXX"
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Official Contact Phone (Ethiopia) *</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+251 911 88 77 66"
                className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Payout Bank Name *</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
              >
                <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia (CBE)</option>
                <option value="Awash Bank">Awash Bank</option>
                <option value="Dashen Bank">Dashen Bank</option>
                <option value="Bank of Abyssinia">Bank of Abyssinia</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Payout Bank Account Number *</label>
              <input
                type="text"
                required
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="1000XXXXXXXXX"
                className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-gold text-xs py-3 justify-center font-semibold shadow-md mt-2"
            >
              <span>Submit Verification Application</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-gold-800 hover:text-gold-900 font-semibold"
              >
                Already registered? Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

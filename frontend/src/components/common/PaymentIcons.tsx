import React from 'react';

interface PaymentIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
};

/**
 * Authentic Telebirr official brand mark / logo.
 * Telebirr uses vibrant Ethio telecom cyan (#0072CE / #00A3E0) & bright gold (#FFB81C)
 * with the signature rounded 'tb' monogram.
 */
export const TelebirrIcon: React.FC<PaymentIconProps> = ({ className = '', size = 'md' }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm ${s} ${className}`}
      title="Telebirr SuperApp"
      style={{
        background: 'linear-gradient(135deg, #0078D7 0%, #005A9E 50%, #004578 100%)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none">
        {/* Glowing backdrop circular aura */}
        <circle cx="50" cy="50" r="46" fill="#0078D7" />
        <circle cx="50" cy="50" r="42" fill="url(#telebirrGrad)" />
        
        {/* Telebirr 't' and 'b' stylized emblem */}
        <path
          d="M28 32h14v38H28V32z"
          fill="#FFFFFF"
        />
        <path
          d="M22 40h26v8H22v-8z"
          fill="#FFB81C"
        />
        <path
          d="M48 32h16c8 0 14 6 14 14 0 5-3 9-7 12 6 2 9 7 9 13 0 9-7 15-16 15H48V32zm14 18c3.5 0 6-2.5 6-6s-2.5-6-6-6h-4v12h4zm2 26c4 0 7-3 7-7s-3-7-7-7h-6v14h6z"
          fill="#FFFFFF"
        />
        {/* Dynamic Telebirr wave / curve */}
        <path
          d="M18 78c18-6 32-6 58 4 4 1 8-2 8-6s-4-6-8-7c-26-8-42-8-60-2-3 1-5 5-3 8s3 3 5 3z"
          fill="#FFB81C"
        />
        <defs>
          <linearGradient id="telebirrGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0099FF" />
            <stop offset="0.6" stopColor="#0066CC" />
            <stop offset="1" stopColor="#004499" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/**
 * Universal Bank Column / Landmark Architectural Icon.
 * Premium gold-and-charcoal emblem with classical pediment and columns.
 */
export const BankIcon: React.FC<PaymentIconProps> = ({ className = '', size = 'md' }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-amber-300/60 ${s} ${className}`}
      title="Official Ethiopian Bank"
      style={{
        background: 'linear-gradient(135deg, #FAF4E6 0%, #F5E8C7 50%, #EBD29A 100%)',
      }}
    >
      <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-amber-900" fill="currentColor">
        {/* Roof / Pediment */}
        <path d="M12 2L2 7v2h20V7L12 2z" />
        {/* Columns */}
        <rect x="4" y="10" width="2.5" height="8" rx="0.5" />
        <rect x="9.25" y="10" width="2.5" height="8" rx="0.5" />
        <rect x="14.5" y="10" width="2.5" height="8" rx="0.5" />
        <rect x="17.5" y="10" width="2.5" height="8" rx="0.5" />
        {/* Base / Foundation */}
        <path d="M2 19h20v3H2v-3z" />
      </svg>
    </div>
  );
};

/**
 * Commercial Bank of Ethiopia (CBE) Brand Icon.
 * Iconic royal purple (#5C1D6E / #6A1B7A) and bright gold radiating emblem.
 */
export const CbeBankIcon: React.FC<PaymentIconProps> = ({ className = '', size = 'md' }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-purple-300/60 ${s} ${className}`}
      title="Commercial Bank of Ethiopia (CBE)"
      style={{
        background: 'linear-gradient(135deg, #6B1D76 0%, #4D1255 100%)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        {/* CBE Sunburst / Radiance */}
        <circle cx="50" cy="50" r="42" fill="#781F85" />
        <circle cx="50" cy="50" r="36" fill="#581662" />
        {/* Golden Crown / Emblem */}
        <path
          d="M50 20l7 18 19-3-9 16 14 13-19 4 1 19-13-14-13 14 1-19-19-4 14-13-9-16 19 3 7-18z"
          fill="#FFD700"
          opacity="0.85"
        />
        <circle cx="50" cy="50" r="16" fill="#3D0B44" />
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          CBE
        </text>
      </svg>
    </div>
  );
};

/**
 * Awash Bank Brand Icon.
 * Distinctive royal blue (#0B3B60) and warm orange-gold chevron.
 */
export const AwashBankIcon: React.FC<PaymentIconProps> = ({ className = '', size = 'md' }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-blue-300/60 ${s} ${className}`}
      title="Awash Bank"
      style={{
        background: 'linear-gradient(135deg, #0B3B60 0%, #062238 100%)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <circle cx="50" cy="50" r="42" fill="#0B3B60" />
        {/* Awash River wave / chevron */}
        <path
          d="M26 36l24 24 24-24"
          stroke="#F37021"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 50l24 24 24-24"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/**
 * Dashen Bank Brand Icon.
 * Deep midnight blue and golden peak geometry.
 */
export const DashenBankIcon: React.FC<PaymentIconProps> = ({ className = '', size = 'md' }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-blue-400/50 ${s} ${className}`}
      title="Dashen Bank"
      style={{
        background: 'linear-gradient(135deg, #0E2B5C 0%, #051430 100%)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <circle cx="50" cy="50" r="42" fill="#0E2B5C" />
        {/* Mount Dashen Peak / Diamond */}
        <polygon points="50,22 76,46 50,78 24,46" fill="#C99700" />
        <polygon points="50,28 70,46 50,72 30,46" fill="#E8B828" />
        <text
          x="50"
          y="52"
          textAnchor="middle"
          fill="#051430"
          fontSize="14"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          D
        </text>
      </svg>
    </div>
  );
};

/**
 * Bank of Abyssinia (BoA) Brand Icon.
 * Rich navy blue and radiant Apollo gold star.
 */
export const BoaBankIcon: React.FC<PaymentIconProps> = ({ className = '', size = 'md' }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-amber-400/50 ${s} ${className}`}
      title="Bank of Abyssinia"
      style={{
        background: 'linear-gradient(135deg, #1C2D42 0%, #0F1A26 100%)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <circle cx="50" cy="50" r="42" fill="#1C2D42" />
        {/* Radiant BoA Star / Apollo symbol */}
        <path
          d="M50 18l6 20 20 2-16 12 5 20-15-12-15 12 5-20-16-12 20-2z"
          fill="#F5A623"
        />
        <circle cx="50" cy="46" r="7" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

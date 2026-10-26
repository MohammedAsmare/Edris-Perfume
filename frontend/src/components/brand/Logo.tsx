import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'gold';
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  showSlogan = true,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 42;
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const sloganSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Royal Monogram Flacon Icon */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBB6C" />
              <stop offset="50%" stopColor="#C89B3C" />
              <stop offset="100%" stopColor="#9A6A18" />
            </linearGradient>
            <linearGradient id="innerShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Luxury Octagonal Seal Background */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="16"
            fill="#FAF7F0"
            stroke="url(#logoGoldGrad)"
            strokeWidth="1.5"
          />

          {/* Perfume Bottle Cap */}
          <rect x="26" y="11" width="12" height="7" rx="2" fill="url(#logoGoldGrad)" />
          <rect x="29" y="18" width="6" height="3" fill="#EBD29A" />

          {/* Perfume Bottle Silhouette */}
          <path
            d="M18 24 C18 22, 46 22, 46 24 L48 48 C48 52, 45 54, 40 54 L24 54 C19 54, 16 52, 16 48 Z"
            fill="url(#innerShine)"
            stroke="url(#logoGoldGrad)"
            strokeWidth="2"
          />

          {/* Elegant Monogram 'EP' */}
          <text
            x="32"
            y="41"
            fontFamily="'Playfair Display', serif"
            fontWeight="700"
            fontSize="15"
            fill="url(#logoGoldGrad)"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            EP
          </text>
          <circle cx="32" cy="46" r="1.2" fill="#C89B3C" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-[0.2em] uppercase leading-none transition-colors duration-200 ${titleSize} ${
            variant === 'dark'
              ? 'text-white group-hover:text-gold-200'
              : 'text-charcoal group-hover:text-gold-700'
          }`}
        >
          EDRIS <span className="text-gold-600 font-normal">PERFUME</span>
        </span>
        {showSlogan && (
          <span
            className={`font-serif italic tracking-[0.15em] transition-colors duration-200 mt-1 ${sloganSize} ${
              variant === 'dark' ? 'text-gold-200/80' : 'text-gold-700'
            }`}
          >
            Elegance in Every Drop
          </span>
        )}
      </div>
    </Link>
  );
};

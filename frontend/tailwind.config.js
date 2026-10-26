/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FCF9F2',
          100: '#F5E8C7',
          200: '#EBD29A',
          300: '#DFBB6C',
          400: '#D5A84B',
          500: '#C89B3C', // Primary gold
          600: '#B0832F',
          700: '#9A6A18', // Dark gold
          800: '#754E0E',
          900: '#523405',
        },
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F0', // Warm ivory
          200: '#F4EFE6',
          300: '#EAE1D3',
          400: '#DCCFBD',
        },
        champagne: {
          border: '#E9DCC4',
          subtle: 'rgba(233, 220, 196, 0.45)',
          glow: 'rgba(200, 155, 60, 0.15)',
        },
        charcoal: {
          DEFAULT: '#252525',
          dark: '#171717',
          light: '#3F3F46',
          muted: '#71717A',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(197, 160, 89, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 12px 40px 0 rgba(200, 155, 60, 0.16), 0 4px 12px 0 rgba(0, 0, 0, 0.06)',
        'gold-glow': '0 0 25px rgba(200, 155, 60, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

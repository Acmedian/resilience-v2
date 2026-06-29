/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1628',
        mint: '#2DD4A0',
        'mint-light': '#E6F9F4',
        'mint-dark': '#0D9488',
        'mint-mid': '#1BB88A',
        surface: '#F8FAFC',
        'surface-soft': '#F1F5F9',
        border: '#E2E8F0',
        'border-strong': '#E4E7EC',
        faint: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(10,22,40,0.06), 0 1px 2px rgba(10,22,40,0.04)',
        lift: '0 4px 12px rgba(10,22,40,0.10), 0 2px 6px rgba(10,22,40,0.06)',
        float: '0 8px 24px rgba(10,22,40,0.12), 0 4px 12px rgba(10,22,40,0.08)',
        glow: '0 0 20px rgba(45,212,160,0.35), 0 0 40px rgba(45,212,160,0.15)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-up': 'slide-up 0.4s ease-out both',
        'pulse-mint': 'pulse-mint 2s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        blink: 'blink 1s step-end infinite',
        'orb-speak': 'orb-speak 0.6s ease-in-out infinite alternate',
        'orb-listen': 'orb-listen 1.4s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-mint': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45,212,160,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(45,212,160,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'orb-speak': {
          '0%': { transform: 'scale(1)', opacity: '0.9' },
          '100%': { transform: 'scale(1.15)', opacity: '1' },
        },
        'orb-listen': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(45,212,160,0.5)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 16px rgba(45,212,160,0)' },
        },
      },
    },
  },
  plugins: [],
};

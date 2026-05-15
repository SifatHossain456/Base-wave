import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: '#0052FF',
          dark: '#050B18',
          navy: '#0A1628',
          card: '#0D1F38',
        },
        arena: {
          cyan: '#00D4FF',
          purple: '#7C3AED',
          pink: '#EC4899',
          gold: '#F59E0B',
          green: '#10B981',
          red: '#EF4444',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-arena': 'linear-gradient(135deg, #050B18 0%, #0A1628 50%, #050B18 100%)',
        'gradient-blue': 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #7C3AED 0%, #0052FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(13,31,56,0.8) 0%, rgba(5,11,24,0.9) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 82, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 82, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

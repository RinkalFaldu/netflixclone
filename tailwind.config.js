/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414', 
          dark: '#000000',
          gray: '#808080',
          'light-gray': '#e5e5e5'
        },
        success: {
          light: '#4ADE80',
          DEFAULT: '#22C55E',
          dark: '#16A34A'
        },
        warning: {
          light: '#FCD34D',
          DEFAULT: '#F59E0B',
          dark: '#D97706'
        },
        error: {
          light: '#F87171',
          DEFAULT: '#EF4444',
          dark: '#DC2626'
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding'
      }
    },
  },
  plugins: [],
};
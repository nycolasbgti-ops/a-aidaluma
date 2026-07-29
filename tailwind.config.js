/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'acai-bg':       '#07011A',
        'acai-surface':  '#100528',
        'acai-raised':   '#190844',
        'acai-brand':    '#7C3AED',
        'acai-brand-lt': '#A78BFA',
        'acai-cta':      '#DB2777',
        'acai-gold':     '#D97706',
        'acai-gold-lt':  '#FCD34D',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':  { transform: 'translateX(-8px)' },
          '40%':  { transform: 'translateX(8px)' },
          '60%':  { transform: 'translateX(-8px)' },
          '80%':  { transform: 'translateX(8px)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shake:   'shake 0.4s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
        fadeIn:  'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          950: '#2E0A17',
          900: '#420F20',
          800: '#5C1428',
          700: '#731A33',
          600: '#8A1F3D',
          500: '#A32B4C',
        },
        gold: {
          600: '#A5811F',
          500: '#C8A02E',
          400: '#D9B855',
          300: '#E7CE8A',
          200: '#F2E4BC',
        },
        cream: '#FAF6EF',
        ink: '#1A1215',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        arch: '0 18px 50px -20px rgba(46,10,23,.55)',
        gold: '0 0 0 1px rgba(200,160,46,.35), 0 10px 30px -12px rgba(200,160,46,.45)',
      },
      keyframes: {
        kedip: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(37,211,102,.65)' },
          '50%': { boxShadow: '0 0 0 14px rgba(37,211,102,0)' },
        },
        kedipGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(200,160,46,.6)' },
          '50%': { boxShadow: '0 0 0 12px rgba(200,160,46,0)' },
        },
        naik: {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        geser: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        kedip: 'kedip 1.8s ease-out infinite',
        kedipGold: 'kedipGold 2.4s ease-out infinite',
        naik: 'naik .6s cubic-bezier(.2,.7,.3,1) both',
        geser: 'geser 32s linear infinite',
      },
    },
  },
  plugins: [],
};

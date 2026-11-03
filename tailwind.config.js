/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'counter-bounce': 'counterBounce 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-green': 'pulseGreen 1000ms cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-red': 'pulseRed 500ms cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        counterBounce: {
          '0%': { transform: 'translateY(0)', opacity: '1', color: 'white' },
          '25%': { transform: 'translateY(-4px)', opacity: '1', color: '#fbbf24' },
          '50%': { opacity: '0.5' },
          '75%': { transform: 'translateY(0)', opacity: '1', color: '#fbbf24' },
          '100%': { transform: 'translateY(0)', opacity: '1', color: 'white' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
          '50%': { boxShadow: '0 0 0 4px rgba(16, 185, 129, 0)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { boxShadow: '0 0 0 4px rgba(239, 68, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
};

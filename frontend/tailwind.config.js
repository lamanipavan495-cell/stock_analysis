/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-very-dark': '#030306',
        'panel-dark': '#0b0f12',
        'accent-red': '#ef4444',
        'accent-green': '#22c55e',
        'muted': '#94a3b8',
        'glass': 'rgba(255,255,255,0.03)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

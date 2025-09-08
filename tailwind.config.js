/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e5e8ff',
          200: '#d0d4ff',
          300: '#b4b8ff',
          400: '#9790ff',
          500: '#7c69ff',
          600: '#6f4ef7',
          700: '#5d3ee3',
          800: '#4c35bf',
          900: '#1a1a2e',
          950: '#16213e'
        },
        gold: {
          50: '#fefdf4',
          100: '#fefae8',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#facc15',
          500: '#d4af37',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
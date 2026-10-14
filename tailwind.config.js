/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#120609',
          surface: '#3B0A18',
          card: '#3B0A18',
          primary: '#780000',
          maroon: '#780000',
          crimson: '#780000',
          ruby: '#B23A48',
          coral: '#B23A48',
          highlight: '#B23A48',
          rose: '#B23A48',
          accent: '#C7B5FF',
          lavender: '#C7B5FF',
          lightGlow: '#C7B5FF',
          border: 'rgba(178, 58, 72, 0.35)',
          borderHover: 'rgba(199, 181, 255, 0.55)',
          textLight: '#FBF5F6',
          textMuted: '#D8C7CA',
          textDim: '#A89297'
        }
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

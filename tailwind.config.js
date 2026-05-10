/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#121019',
          100: '#1c1a2b',
          200: '#262435',
        },
        sage: {
          300: '#c0b0d8',
          400: '#9a82c0',
          500: '#7c64a6',
        },
        mist: {
          300: '#ecc88e',
          400: '#d4a85c',
        },
        stone: {
          400: '#68607e',
          600: '#a59cb8',
          800: '#e6def2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 20px rgba(0,0,0,0.3)',
        card: '0 4px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FAFAF8',
          100: '#F5F0EB',
          200: '#EDE6DC',
        },
        sage: {
          300: '#B8D0C4',
          400: '#8BAF9E',
          500: '#6A9485',
        },
        mist: {
          300: '#D6CCE8',
          400: '#B8A8D4',
        },
        stone: {
          400: '#9B9590',
          600: '#6B6560',
          800: '#3A3530',
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
        soft: '0 2px 20px rgba(0,0,0,0.06)',
        card: '0 4px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

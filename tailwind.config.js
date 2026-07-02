/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsla(335, 100%, 50%, 1.00)',
          50:  'hsl(335, 100%, 97%)',
          100: 'hsl(335, 100%, 93%)',
          200: 'hsl(335, 100%, 85%)',
          300: 'hsl(335, 100%, 75%)',
          400: 'hsl(335, 100%, 63%)',
          500: 'hsla(335, 100%, 50%, 1.00)',
          600: 'hsl(335, 100%, 42%)',
          700: 'hsl(335, 100%, 34%)',
          800: 'hsl(335, 100%, 26%)',
          900: 'hsl(335, 100%, 18%)',
        },
        secondary: 'hsla(0, 0%, 100%, 1.00)',
        background: {
          light: 'hsl(210, 40%, 98%)',
          dark:  'hsl(222, 47%, 11%)',
        },
        surface: {
          light: 'hsl(0, 0%, 100%)',
          dark:  'hsl(222, 47%, 15%)',
        },
        textColor: {
          light: 'hsl(217, 19%, 27%)',
          dark:  'hsl(210, 40%, 98%)',
        },
        success: 'hsl(142, 71%, 45%)',
        warning: 'hsl(38, 92%, 50%)',
        danger:  'hsl(350, 89%, 60%)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'spin-slow':  'spin 3s linear infinite',
        'bounce-sm':  'bounceSm 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'primary':    '0 4px 24px hsla(335, 100%, 50%, 0.25)',
        'primary-lg': '0 8px 40px hsla(335, 100%, 50%, 0.35)',
        'card':       '0 2px 16px rgba(0,0,0,0.08)',
        'card-dark':  '0 2px 16px rgba(0,0,0,0.4)',
        'glass':      '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

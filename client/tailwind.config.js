/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        foreground: '#18181B',
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D', // Deep Forest Green
          950: '#052E16',
          DEFAULT: '#14532D',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E8F0EA',
          200: '#D1E0D7',
          500: '#52796F', // Muted Sage
          600: '#3D5A53',
          DEFAULT: '#52796F',
        },
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#16A34A',
          600: '#166534',
          700: '#14532D', // Primary Forest Green
          800: '#0F3D24',
          DEFAULT: '#14532D',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706', // Warm Amber for Consumer
          700: '#B45309',
          DEFAULT: '#D97706',
        },
        role: {
          waste: '#14532D',
          'waste-light': '#F0FDF4',
          consumer: '#D97706',
          'consumer-light': '#FFFBEB',
          plant: '#0D9488',
          'plant-light': '#F0FDFA',
        },
        status: {
          verified: {
            bg: '#DCFCE7',
            text: '#14532D',
            border: '#86EFAC',
          },
          pending: {
            bg: '#FEF3C7',
            text: '#92400E',
            border: '#FCD34D',
          },
          missing: {
            bg: '#FEE2E2',
            text: '#991B1B',
            border: '#FCA5A5',
          },
          notsure: {
            bg: '#FEF9C3',
            text: '#854D0E',
            border: '#FDE047',
          },
          illustrative: {
            bg: '#EFF6FF',
            text: '#1E40AF',
            border: '#BFDBFE',
          },
        },
      },
      fontFamily: {
        sans: ['"Geist Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Geist Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

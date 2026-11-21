/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBFBFA',
        foreground: '#18181B',
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669', // Clean Emerald Primary
          700: '#047857',
          800: '#065F46',
          DEFAULT: '#059669',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706', // Warm Amber
          700: '#B45309',
          DEFAULT: '#D97706',
        },
        role: {
          waste: '#059669',
          'waste-light': '#ECFDF5',
          consumer: '#D97706',
          'consumer-light': '#FFFBEB',
          plant: '#0D9488',
          'plant-light': '#F0FDFA',
        },
        status: {
          verified: {
            bg: '#DCFCE7',
            text: '#166534',
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
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

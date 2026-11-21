/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F3',
        foreground: '#1E293B',
        primary: {
          50: '#EBF5F0',
          100: '#D3EBDE',
          200: '#A8D7BD',
          500: '#279B62',
          600: '#1F7A4D', // Primary Brand Deep Green
          700: '#18603D',
          800: '#12472D',
          DEFAULT: '#1F7A4D',
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
          waste: '#1F7A4D',
          'waste-light': '#EBF5F0',
          consumer: '#EA580C',
          'consumer-light': '#FFF7ED',
          plant: '#0F766E',
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
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.04)',
        card: '0 4px 20px -2px rgba(31, 122, 77, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        hover: '0 12px 28px -4px rgba(31, 122, 77, 0.1), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

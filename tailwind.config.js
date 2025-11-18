/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Binance color scheme
        bg: {
          primary: '#181A20',
          secondary: '#0B0E11',
          card: '#202630',
          vessel: '#29313D',
          trade: '#0B0E11',
        },
        text: {
          primary: '#EAECEF',
          secondary: '#929AA5',
          tertiary: '#707A8A',
          disabled: '#4F5867',
          yellow: '#202630',
        },
        buy: {
          DEFAULT: '#2EBD85',
          hover: '#2EBD85',
          bg: '#102821',
        },
        sell: {
          DEFAULT: '#F6465D',
          hover: '#F6465D',
          bg: '#35141D',
        },
        line: '#333B47',
        yellow: {
          primary: '#F0B90B',
          btn: '#FCD535',
        },
        input: {
          DEFAULT: '#29313D',
          line: '#434C5A',
        },
      },
    },
  },
  plugins: [],
}


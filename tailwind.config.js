/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          navy: '#0B1F3A',
          peacock: '#1B4D3E',
          maroon: '#7A1F2B',
          cream: '#F3ECD9',
          amber: '#D4AF37',
          gold: '#E69F00',
          paper: '#F9F6EE',
          darkborder: '#071526'
        }
      },
      fontFamily: {
        display: ['"Rozha One"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'desi': '4px 4px 0px #0B1F3A',
        'desi-lg': '6px 6px 0px #0B1F3A',
        'desi-maroon': '4px 4px 0px #7A1F2B',
        'desi-peacock': '4px 4px 0px #1B4D3E',
        'inset-vintage': 'inset 0 0 10px rgba(11, 31, 58, 0.15)'
      }
    },
  },
  plugins: [],
}

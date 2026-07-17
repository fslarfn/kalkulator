/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf6f0',
          100: '#f3e8d8',
          200: '#e6d3ba',
          300: '#d3b691',
          400: '#bd9463',
          500: '#a67844',
          600: '#8a5e33',
          700: '#6f4a29',
          800: '#573a22',
          900: '#412c1b'
        },
        wa: '#5a3617'
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif']
      }
    }
  },
  plugins: []
}

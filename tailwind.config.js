/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'apple-black': '#080808',
        'apple-surface': '#111111',
        'apple-elevated': '#1a1a1a',
        'apple-white': '#f5f5f7',
        'apple-gray': '#86868b',
        'apple-blue': '#2997ff',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

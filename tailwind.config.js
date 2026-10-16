/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FBFBF9',
          warm: '#F5F5F0',
          dark: '#0D0D0D',
          muted: '#8A8A86',
          border: '#E5E5DF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Didot', 'Bodoni MT', 'Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'a4-w': '210mm',
        'a4-h': '297mm',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141414',
        card: '#1A1A1A',
        'border-dark': '#2A2A2A',
        muted: '#666666',
      }
    },
  },
  plugins: [],
}
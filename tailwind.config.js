/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',   // Very light pastel mint
          100: '#dcfce7',  // Light pastel mint
          200: '#bbf7d0',  // Soft pastel green
          300: '#86efac',  // Pastel green
          400: '#4ade80',  // Medium pastel green
          500: '#22c55e',  // Main brand pastel green (money green)
          600: '#16a34a',  // Deeper green for hover states
          700: '#15803d',  // Deep green
          800: '#166534',  // Very deep green for dark mode
          900: '#14532d',  // Darkest green for dark mode accents
        },
      },
    },
  },
  plugins: [],
}



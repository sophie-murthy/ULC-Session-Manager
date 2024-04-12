/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './**/*.js', './**/*.css', './**/*.mjs'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Didot', 'sans-serif'],
      },
    },
    colors: {
      'purple': '#601B9C',
    }
  },
  plugins: [],
}


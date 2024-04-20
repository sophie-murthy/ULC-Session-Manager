/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './**/*.js', './**/*.css', './**/*.mjs', './**/*.hbs'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Didot', 'sans-serif'],
      },
      fontSize: {
        'ft-10': '10px',
        'ft-15': '15px',
        'ft-20': '20px',
        'ft-25': '25px',
        'ft-30': '30px',
        'ft-35': '35px',
        'ft-40': '40px',
      },
      margin: {
        // Add a comma after the opening curly brace
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '35': '35px',
        '40': '40px',
        '45': '45px',
        '50': '50px',
      },
    },
    colors: {
      'purple': '#601B9C',
    }
  },
  plugins: [],
}


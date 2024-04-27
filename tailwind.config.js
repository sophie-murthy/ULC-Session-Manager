/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.hbs', './**/*.html', './**/*.js', './**/*.css', './**/*.mjs', './**/*.hbs'],
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
        'ft-45': '45px',
        'ft-50': '50px',
        'ft-55': '55px',
        'ft-60': '60px',
      },
      margin: {
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

      height: {
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '35': '35px',
        '40': '40px',
        '45': '45px',
        '50': '50px',
        '55': '55px',
        '60': '60px',
        '65': '65px',
        '70': '70px',
        '75': '75px',
        '80': '80px',
        '85': '85px',
        '90': '90px',
        '95': '95px',
        '100': '100px',

      }, 
      width: {
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '35': '35px',
        '40': '40px',
        '45': '45px',
        '50': '50px',
        '55': '55px',
        '60': '60px',
        '65': '65px',
        '70': '70px',
        '75': '75px',
        '80': '80px',
        '85': '85px',
        '90': '90px',
        '95': '95px',
        '100': '100px',
      },
      padding: {
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '35': '35px',
        '40': '40px',
        '45': '45px',
        '50': '50px',
        '55': '55px',
        '60': '60px',
        '65': '65px',
        '70': '70px',
        '75': '75px',
        '80': '80px',
        '85': '85px',
        '90': '90px',
        '95': '95px',
        '100': '100px',
      },
      borderRadius: {
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '35': '35px',
        '40': '40px',
        '45': '45px',
        '50': '50px',
        '55': '55px',
        '60': '60px',
        '65': '65px',
        '70': '70px',
        '75': '75px',
        '80': '80px',
        '85': '85px',
        '90': '90px',
        '95': '95px',
        '100': '100px',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      zIndex: {
        '-10': '-10',
        '-20': '-20',
        '-30': '-30',
        '-40': '-40',
        '-50': '-50',
        '-60': '-60',
        '-70': '-70',
        '-80': '-80',
        '-90': '-90',
        '-100': '-100',
        '100': 100,
        '1000': 1000,
        'auto': 'auto',
      },

    },
    colors: {
      'purple1': '#601B9C',
      'purple2': '#EADCEF',
      'purple3': '#401850',
    }
  },
  plugins: [],
}


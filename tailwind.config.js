/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
   theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        secondary: '#1E90FF',
        accent: '#006400',
        neutral: '#00008B',
        success: '#32CD32',
      }
    },
  },
  plugins: [],
};

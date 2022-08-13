/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}","./resource/**/*.{html,js}"],
  theme: {
    screens: {
      'xsm': '280px',
      
      'xs': '450px',
      
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        'back': '#14110d',
        'fb-back': '#E4E6EB',
        'postback': '#333'
      },
      height: {
        "100v": "100vh",
      },
    },
  },
  plugins: [],
}
 
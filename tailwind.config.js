/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'verde-profundo': '#3B6E58',
        'negro-calido': '#1E1E1E',
        'beige-arena': '#F7EFE9',
        'rosa-terracota': '#E2725B',
        'dorado-miel': '#F5C542',
        'gris-piedra': '#5F5F5F',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

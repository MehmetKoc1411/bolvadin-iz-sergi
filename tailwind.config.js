/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sergi-kagit': '#f4f1ea', // Sulu boya kağıdı dokusu rengi
        'sergi-fume': '#2d2d2d', // Monokrom resimler için şık bir gri/siyah
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  safelist: [
    "btn-flash",
    "tab-btn",
    "tab-btn--active",
    "sub-tab-btn",
    "sub-tab-btn--active",
  ],
  plugins: [],
}

import tailwindScrollbarhide from "tailwind-scrollbar-hide"
/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbarhide],
};

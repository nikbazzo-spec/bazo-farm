/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bazo: {
          darkgreen: "#1B4332",
          green: "#2D6A4F",
          lightgreen: "#95D5B2",
          bg: "#F7F9F7",
          alert: "#D62828",
          warning: "#F77F00",
          info: "#4361EE",
        },
      },
    },
  },
  plugins: [],
};

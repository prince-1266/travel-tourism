/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your React files
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        "primary-dark": "#3730a3",
        accent: "#10b981",
      },
    },
  },
  plugins: [],
};

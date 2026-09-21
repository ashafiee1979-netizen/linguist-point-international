/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: "#173d40",
          light: "#e6fffa",
          accent: "#227074",
        },
        gold: {
          primary: "#f59e0b",
          dark: "#d97706",
          light: "#fef3c7",
        },
        slate: {
          deep: "#0f172a",
        }
      }
    },
  },
  plugins: [],
};

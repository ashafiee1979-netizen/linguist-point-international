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
      // globals.css imports Plus Jakarta Sans; without this, `font-sans` fell
      // back to the default system stack and the webfont never rendered.
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
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
      },
      // The `xs` / `2xs` step and the fine-grained scales below are used across
      // the components but are not part of Tailwind 3's default theme, so they
      // are defined here rather than silently resolving to nothing.
      boxShadow: {
        xs: "0 1px 2px 0 rgb(15 23 42 / 0.06)",
        "2xs": "0 1px 1px 0 rgb(15 23 42 / 0.04)",
      },
      borderRadius: {
        xs: "0.125rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      scale: {
        98: "0.98",
        102: "1.02",
        115: "1.15",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "accordion-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "modal-in": "modal-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-down": "accordion-down 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

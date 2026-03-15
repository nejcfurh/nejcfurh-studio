/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./app/components/**/*.{ts,tsx}",
    "./app/features/**/*.{ts,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050505",
        secondary: "#888888",
        tertiary: "#111111",
        accent: "#6086BE",
        "accent-light": "#8aaed6",
        "card-bg": "rgba(255, 255, 255, 0.03)",
        "white-100": "#fafafa",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        glow: "0 0 40px rgba(96, 134, 190, 0.15)",
      },
      screens: {
        xs: "450px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

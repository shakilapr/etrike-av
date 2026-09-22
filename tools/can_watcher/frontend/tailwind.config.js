/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDarkest: "#000000",
        bgCard: "#0a0a0a",
        bgCardHover: "#121212",
        bgCardActive: "#1a1a1a",
        borderDark: "#1f1f1f",
        borderFocus: "#38bdf8",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

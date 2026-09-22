/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDarkest: "#090d13",
        bgCard: "#121820",
        bgCardHover: "#18222d",
        bgCardActive: "#1f2b38",
        borderDark: "#222e3c",
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

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        "primary-hover": "#16a34a",
        "brand-text": "#15803d",
        "green-light": "#f0faf0",
        "page-bg": "#f8f8f6",
        "card-border": "#e5e7eb",
        "text-primary": "#0f0f0f",
        "text-secondary": "#6b7280",
        surface: "#141414",
      },
      fontFamily: {
        arabic: ["Tajawal", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;

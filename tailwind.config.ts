import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#faf6f0",
          100: "#f4ebe0",
          200: "#e8d6c0",
          300: "#d9bc9b",
          400: "#c79e74",
          500: "#b58253",
          600: "#9e6942",
          700: "#7c4e33",
          800: "#573827",
          900: "#362218",
          950: "#1e120c",
        },
        cream: {
          50: "#ffffff",
          100: "#fdfbf7",
          200: "#faf6ed",
          300: "#f4eedf",
          400: "#ede2cc",
          500: "#e3d2b2",
        },
        beige: {
          50: "#faf8f5",
          100: "#f5efe6",
          200: "#ebdccb",
          300: "#dec6a6",
          400: "#cdae7f",
          500: "#b8935c",
        },
        amberGold: {
          DEFAULT: "#d97706",
          hover: "#b45309",
          light: "#fef3c7",
          accent: "#e06b2d",
        },
        darkGreen: {
          DEFAULT: "#1b4332",
          light: "#d8f3dc",
          border: "#2d6a4f",
          accent: "#40916c",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 18, 12, 0.06)',
        'premium': '0 12px 36px -4px rgba(30, 18, 12, 0.12)',
        'elevated': '0 20px 48px -8px rgba(30, 18, 12, 0.18)',
      }
    },
  },
  plugins: [],
};
export default config;

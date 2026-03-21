/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#012d1d",
          container: "#1b4332",
          on: "#ffffff",
        },
        secondary: {
          DEFAULT: "#d4af37",
          fixed: "#d4af37",
          on: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#2d6a4f",
          container: "#00452e",
          on: "#ffffff",
        },
        surface: {
          DEFAULT: "#fbf9f6",
          bright: "#fbf9f6",
          dim: "#dbdad7",
          container: {
            lowest: "#ffffff",
            low: "#f5f3f0",
            DEFAULT: "#efeeeb",
            high: "#eae8e5",
            highest: "#e4e2df",
          },
        },
        background: "#fbf9f6",
        outline: {
          DEFAULT: "#717973",
          variant: "#c1c8c2",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "hsl(158, 94%, 30%)",
          light: "hsl(158, 94%, 40%)",
          glow: "hsla(158, 94%, 30%, 0.15)",
        },
        secondary: {
          DEFAULT: "hsl(199, 89%, 48%)",
          glow: "hsla(199, 89%, 48%, 0.1)",
        },
        accent: "hsl(38, 92%, 50%)",
      },
      fontFamily: {
        main: ['Plus Jakarta Sans', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

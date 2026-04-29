import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0D0D0F",
          surface: "#141418",
          border: "#2A2A30",
          muted: "#6B6B75",
        },
        amber: {
          DEFAULT: "#F5A623",
          dim: "#C4841C",
        },
      },
    },
  },
  plugins: [],
};
export default config;

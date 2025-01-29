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
        background: '#1e1b4b', // indigo-950
        foreground: '#f8fafc', // Light gray/white text
        primary: {
          DEFAULT: '#2563eb', // blue-600
          hover: '#1d4ed8', // blue-700
        },
        secondary: {
          DEFAULT: '#4338ca', // indigo-700
          hover: '#3730a3', // indigo-800
        },
        accent: '#1e3a8a', // blue-900
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
      },
      fontFamily: {
        sans: ['var(--font-rubik)'], // This will use the Rubik font
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#2563eb",    // blue-600
          secondary: "#4338ca",  // indigo-700
          accent: "#1e3a8a",     // blue-900
        },
      },
    ],
  },
};

export default config;

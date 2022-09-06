/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages.components/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // From Small to big
      ...defaultTheme.screens,
      sm: "325px",
      md: "800px",
      lg: "990px",
      xl: "1440px",
    },

    extend: {
      fontFamily: {
        monto: ["Montserrat Alternates", "san-serif"],
      },
      fontSize: {
        34: "2.125rem",
      },
      flexShrink: {
        4: 4,
      },
      height: {
        113.5: "28.375rem",
      },

      width: {
        18: "4.5rem",
        77: "19.25rem",
        82.5: "20.625rem",
        100: "25rem",
        106: "26.5rem",
        113.5: "28.375rem",
        120: "30rem",
        140: "35rem",
        164: "41rem",
        186: "46.5rem",
        200: "50rem",
        302: "75.5rem",
      },

      colors: {
        yellow: {
          theme: "#FEBF32",
        },
        danger: "#EA3943",
        gray: {
          "shade-1": "#ADADAD",
          "shade-2": "#ABAFC4",
          "shade-3": "#2A2D3C",
          "shade-4": "#6B7280",
          "shade-5": "#222531",
          "shade-6": "#1C1C1F",
        },
        background: {
          "shade-1": "#141417",
        },
        "black-shade": {
          1: "#0A0A0A",
          2: "#141414",
          3: "#17171A",
          4: "#202020",
          5: "#16161A",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("flowbite/plugin"),
  ],
};

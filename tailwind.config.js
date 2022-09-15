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
        24: "1.6rem",
        22: "1.375rem",
        20: "1.25rem",
        16: "1rem",
        14: "0.875rem",
        12: "0.875rem",
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
        brand: {
          primary: "#FEBF32",
        },
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
          "shade-7": "#888DAA",
          "shade-8": "#4C516B",
        },
        background: {
          "shade-1": "#141417",
          "shade-2": "#1C1F29",
          "shade-3": "#1B1C22",
        },
        "black-shade": {
          1: "#0A0A0A",
          2: "#141414",
          3: "#17171A",
          4: "#202020",
          5: "#16161A",
          6: "#191B24",
          7: "#1E212B",
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

// "shade-7": "#44485F",
// "shade-8": "#888DAA",

// 6: "#141416",

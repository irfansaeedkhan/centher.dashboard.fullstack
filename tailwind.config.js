/** @type {import('tailwindcss').Config} */
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages.components/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // From Small to big
      fxs: "320px",
      sm: "320px",
      fsm: "560px",
      md: "767px",
      fmd: "768px",
      lg: "1024px",
      flg: "1024px",
      fxl: "1280px",
      f2xl: "1440px",
      ...defaultTheme.screens,
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
      borderRadius: {
        "10px": "10px",
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
      backgroundImage: {
        "buydao-pattern": "url('/images/buyntrdaoBackground.png')",
      },
      colors: {
        app: {
          "post-text": "#e7e8ee",
        },
        brand: {
          primary: "#FEBF32",
          "primary-dark": "#DA9C24",
        },
        yellow: {
          theme: "#FEBF32",
        },
        red: {
          theme: "#E35259",
        },
        danger: "#EA3943",
        "gray-shade": {
          1: "#ADADAD",
          2: "#ABAFC4",
          3: "#2A2D3C",
          4: "#6B7280",
          5: "#222531",
          6: "#1C1C1F",
          7: "#888DAA",
          8: "#4C516B",
          9: "#1E1F28",
          10: "#666c8f",
          11: "#44485F",
          12: "#3B3F54",
          13: "#C4C4C4",
          14: "#A0A4BB",
          15: "#17171a66",
          16: "#F6F7FA",
          17: "#45474D",
          18: "#B7BBCC",
          "border-color": "#202027",
        },
        "background-shade": {
          1: "#141417",
          2: "#1C1F29",
          3: "#1B1C22",
        },
        "black-shade": {
          1: "#0A0A0A",
          2: "#141414",
          3: "#17171A",
          4: "#202020",
          5: "#16161A",
          6: "#191B24",
          7: "#1E212B",
          8: "#0B0B0B",
          9: "#141416",
          10: "#1C1C21",
          11: "#18181C",
          12: "#0D0D0D",
        },
        elevation: {
          1: "#1B1C22",
        },
        popup: {
          0: "#0B0B0B",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: "#C6F432", // фирменный лайм Золотого Яблока
          dark: "#B4E617",
          soft: "#EEFBBF",
        },
        ink: "#0A0A0A",
        gift: "#B884D8", // лиловый подарочной карты
      },
      fontFamily: {
        sans: ["Onest", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
      },
      maxWidth: {
        app: "520px",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        moveClouds: {
          "0%": { transform: "translateX(-220%)" }, // Start far right
          "100%": { transform: "translateX(100vw)" }, // Move far left
        },
      },
      // clouds passing by sheesh
      animation: {
        clouds: "moveClouds 50s linear infinite",
      },
    },
    // grass sway
      animation: {
        sway: "sway 2s ease-in-out infinite",
      },
      keyframes: {
        sway: {
          "0%": { transform: "rotate(-15deg)" }, //magsugod sa -20 degrees
          "50%": { transform: "rotate(15deg)" }, // mag Peak sa 20 degrees
          "100%": { transform: "rotate(-15 deg)" }, // Return tp -20 degrees
        },
      },
    },
  plugins: [],
};

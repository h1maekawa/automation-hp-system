import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a18",
        secondary: "#5f5e5a",
        tertiary: "#888780",
        border: "rgba(0,0,0,0.12)",
        bgPrimary: "#ffffff",
        bgSecondary: "#f5f5f4",
        bgTertiary: "#eeece8",
        info: "#185fa5",
        infoBg: "#e6f1fb",
        success: "#3b6d11",
        successBg: "#eaf3de",
        warning: "#854f0b",
        warningBg: "#faeeda",
        danger: "#a32d2d",
        dangerBg: "#fcebeb"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)"
      },
      borderRadius: {
        input: "6px",
        card: "12px",
        modal: "16px"
      }
    }
  },
  plugins: []
};

export default config;

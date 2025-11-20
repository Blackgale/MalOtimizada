import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Open Sans", "Arial", "sans-serif"],
        body: ["Open Sans", "Arial", "sans-serif"]
      },
      colors: { brand: "#16a34a" },
      boxShadow: { heavy: "0 10px 30px rgba(0,0,0,.25)" }
    }
  },
  plugins: []
} satisfies Config;

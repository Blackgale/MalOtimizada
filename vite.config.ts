// vite.config.ts ou vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://72.61.52.29:8080",
        changeOrigin: true,
      },
    },
  },
});

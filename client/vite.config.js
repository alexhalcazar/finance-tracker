import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const aliases = {
  "@": path.resolve(__dirname, "./src"),
  "@components": path.resolve(__dirname, "./src/components"),
  "@features": path.resolve(__dirname, "./src/features"),
  "@pages": path.resolve(__dirname, "./src/pages"),
  "@hooks": path.resolve(__dirname, "./src/hooks"),
  "@utils": path.resolve(__dirname, "./src/utils"),
  "@lib": path.resolve(__dirname, "./src/lib"),
  "@styles": path.resolve(__dirname, "./src/styles"),
  "@assets": path.resolve(__dirname, "./src/assets"),
  "@router": path.resolve(__dirname, "./src/router"),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: aliases,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    css: true,
    resolve: {
      alias: aliases,
    },
  },
});

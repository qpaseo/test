import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/openapi": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/openapi/, ""),
      },
    },
  },
});

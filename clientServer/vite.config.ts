import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,  // Set to false if using self-signed SSL certificates
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react"],
          charts: ["chart.js", "react-chartjs-2"],
          utils: ["html2canvas", "jspdf", "moment", "dom-to-image-more"],
          draft: ["draft-js"],
          animation: ["framer-motion"],
        },
      },
    },
    sourcemap: true, // ✅ Enable source maps for debugging
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit
  },
});

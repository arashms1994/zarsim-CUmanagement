import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/SitePages/CUmanagement.aspx",
  build: {
    outDir: "dist",
    assetsDir: ".",
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `index.js`,
        chunkFileNames: `chunk.js`,
        assetFileNames: `index.css`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss()],
});

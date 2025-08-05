import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import fs from "fs";

export default defineConfig({
  plugins: [svgr({ exportAsDefault: true }), react()],
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "https://modidiary.store/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
     https: {
       key: fs.readFileSync("./ssl/key.pem"),
       cert: fs.readFileSync("./ssl/cert.pem"),
     },

  },
  define: {
    global: "globalThis",
  },
});

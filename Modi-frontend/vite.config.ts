import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr({ exportAsDefault: true }), react()],
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "http://ec2-3-38-55-66.ap-northeast-2.compute.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    global: "globalThis",
  },
});

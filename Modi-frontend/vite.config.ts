import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr({ exportAsDefault: true }), react()],
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "https://modidiary.store/api", // 💡 Spring 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: "globalThis",
  },
});

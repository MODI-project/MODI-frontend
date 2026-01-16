// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import fs from "fs";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const hasCert =
    fs.existsSync("./ssl/key.pem") && fs.existsSync("./ssl/cert.pem");

  return {
    plugins: [svgr({ exportAsDefault: true }), react()],
    server: {
      open: true,
      https:
        isDev && hasCert
          ? {
              key: fs.readFileSync("./ssl/key.pem"),
              cert: fs.readFileSync("./ssl/cert.pem"),
            }
          : undefined,
      proxy: {
        "/api": {
          // 환경 변수에서 프록시 타겟 가져오기 (로컬 개발: http://localhost:8080, 프로덕션: https://modi-server.store)
          target: process.env.VITE_API_BASE_URL
            ? process.env.VITE_API_BASE_URL.replace("/api", "")
            : "https://modi-server.store",
          changeOrigin: true,
          secure: false,
          // CORS 우회를 위해 Origin 헤더 제거
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.removeHeader("origin");
            });
          },
        },
      },
    },
    define: {
      global: "globalThis",
    },
  };
});

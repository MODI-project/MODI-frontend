import type { Plugin } from "vite";

export interface VitePluginSvgrOptions {
  exportAsDefault?: boolean;
  exportType?: "url" | "component";
  [key: string]: any;
}
declare function svgr(options?: VitePluginSvgrOptions): Plugin;
export default svgr;

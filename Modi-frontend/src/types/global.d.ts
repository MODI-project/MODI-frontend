import type { PluginOption } from "vite";

declare module "vite-plugin-svgr" {
  import type { Plugin } from "vite";
  const svgr: (...options: any[]) => Plugin | Plugin[];
  export default function svgr(options?: Record<string, any>): PluginOption;
}

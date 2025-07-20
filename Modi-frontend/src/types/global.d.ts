import type { PluginOption } from "vite";

declare module "vite-plugin-svgr" {
  import type { Plugin } from "vite";
  const svgr: (...options: any[]) => Plugin | Plugin[];
  export default function svgr(options?: Record<string, any>): PluginOption;
}

declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

const modules = import.meta.glob<IconModule>(
  "../assets/emotion_home/**/*.svg",
  { import: "ReactComponent", eager: true }
);

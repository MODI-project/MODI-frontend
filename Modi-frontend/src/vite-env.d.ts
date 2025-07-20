/// <reference types="vite/client" />
interface ImportMeta {
  globEager<T = any>(
    pattern: string,
    options?: { import: "default" | "ReactComponent" }
  ): Record<string, T>;
}

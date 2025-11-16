export const SERVER_TO_CSS_FONT: Record<string, string> = {
  온글맆박다현체: "ParkDaHyun",
  온글맆류류체: "Onryuruu",
  이서윤체: "LeeSeoYoon",
  ParkDaHyun: "ParkDaHyun",
  Onryuruu: "Onryuruu",
  LeeSeoYoon: "LeeSeoYoon",
};

export const DEFAULT_FONT = "LeeSeoYoon";

export function mapFontName(input: unknown): string {
  // 서버가 객체/문자열 등으로 줄 가능성 방어
  const raw =
    typeof input === "object" && input !== null
      ? (input as any).name ?? (input as any).fontName ?? ""
      : String(input ?? "");

  return SERVER_TO_CSS_FONT[raw] ?? DEFAULT_FONT;
}

import { CharacterType } from "../contexts/CharacterContext";
import type { Emotion } from "../data/diaries";

export type CharacterKey = Exclude<CharacterType, null>;

const slugToEmotion: Record<string, Emotion> = {
  happy: "기쁨",
  surprised: "놀람",
  normal: "보통",
  tremble: "떨림",
  loved: "사랑",
  excited: "신남",
  sick: "아픔",
  sad: "슬픔",
  boring: "지루함",
  angry: "화남",
};

const modules = import.meta.glob(
  ["../assets/map-marker/*-marker/*-marker.svg"],
  {
    as: "url",
    eager: true,
  }
);

export const mapMarkerIconMap: Record<
  CharacterKey,
  Partial<Record<Emotion, string>>
> = {
  momo: {},
  boro: {},
  lumi: {},
  zuni: {},
};

Object.entries(modules).forEach(([rawPath, url]) => {
  const parts = rawPath.split("/"); // ["..", "assets", "map-marker", "momo-marker", "happy-momo-marker.svg"]
  const folder = parts[parts.length - 2]!; // "momo-marker"
  const character = folder.replace("-marker", ""); // "momo"
  const fileName = parts[parts.length - 1]!; // "happy-momo-marker.svg"
  const slug = fileName.split("-")[0]!; // "happy"

  const emotion = slugToEmotion[slug]; // 슬러그에 대응하는 한글 감정
  if (!emotion) return;

  mapMarkerIconMap[character as CharacterKey][emotion] = url as string;
});

// 호출 헬퍼
export function getMapMarkerIcon(
  character: CharacterKey,
  emotion: Emotion
): string | undefined {
  return mapMarkerIconMap[character]?.[emotion];
}

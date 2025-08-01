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

console.log("🔍 glob 결과:", Object.keys(modules));

export const mapMarkerIconMap: Record<
  CharacterKey,
  Partial<Record<Emotion, string>>
> = {
  momo: {},
  boro: {},
  lumi: {},
  zuni: {},
};

Object.entries(modules).forEach(([path, url]) => {
  // path 예시: "../assets/map-marker/momo-marker/happy-momo-marker.svg"
  const match = path.match(/map-marker\/([^-]+)-marker\/([^-]+)-marker\.svg$/);

  if (!match) return;
  const [, charKey, slug] = match;
  const emotion = slugToEmotion[slug];
  if (!emotion) return;

  // 캐릭터별·감정별 URL 세팅
  (mapMarkerIconMap[charKey as CharacterKey] as any)[emotion] = url as string;
});

// 호출 헬퍼
export function getMapMarkerIcon(
  character: CharacterKey,
  emotion: Emotion
): string | undefined {
  return mapMarkerIconMap[character]?.[emotion];
}

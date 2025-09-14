import { CharacterType } from "../contexts/CharacterContext";
import type { Emotion } from "../data/diaries";

export type CharacterKey = Exclude<CharacterType, null>;

const slugToEmotion: Record<string, Emotion> = {
  happy: "기쁨",
  surprised: "놀람",
  normal: "보통",
  nervous: "떨림",
  love: "사랑",
  excited: "신남",
  sick: "아픔",
  sad: "슬픔",
  bored: "지루함",
  angry: "화남",
};

const modules = import.meta.glob(["../assets/emotion_home/**/*.svg"], {
  as: "url",
  eager: true,
});

export const emotionIconMap: Partial<
  Record<CharacterKey, Partial<Record<Emotion, string>>>
> = {};

Object.entries(modules).forEach(([path, url]) => {
  const parts = path.split("/");
  const characterKey = parts[3] as CharacterKey;
  const fileName = parts[4]; // 'home_momo-happy.svg'
  const match = fileName.match(/home_[^-]+-([^.]+)\.svg/)!;
  if (!match) return;

  const slug = match[1];
  const emotion = slugToEmotion[slug];

  if (!emotion) return;

  if (!emotionIconMap[characterKey]) {
    emotionIconMap[characterKey] = {};
  }
  emotionIconMap[characterKey][emotion] = url;
});

export function getEmotionIcon(
  character: CharacterKey,
  emotion: Emotion
): string | undefined {
  return emotionIconMap[character]?.[emotion];
}

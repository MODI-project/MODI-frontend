import EmotionCircleList from "../ChartItem/EmotionCircleList";
import styles from "./StatsCard.module.css";
import { useCharacter } from "../../../../contexts/CharacterContext";

interface EmotionStatsCardProps {
  data: {
    label: string;
    value: number;
  }[];
  month: string;
}

export default function EmotionStatsCard({
  data,
  month,
}: EmotionStatsCardProps) {
  const { character } = useCharacter();
  if (!character) return null;
  const maxValue = Math.max(...data.map((item) => item.value));
  const maxEmotion = data.find((item) => item.value === maxValue)?.label;
  const emotionTextMap: Record<string, string> = {
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
  const emotionTextToKeyMap: Record<string, string> = {
    기쁨: "happy",
    놀람: "surprised",
    보통: "normal",
    떨림: "nervous",
    사랑: "love",
    신남: "excited",
    아픔: "sick",
    슬픔: "sad",
    지루함: "bored",
    화남: "angry",
  };
  function getEmotionIconPath(
    character: string,
    emotionLabel: string,
    isMax: boolean
  ): string {
    const key = emotionTextToKeyMap[emotionLabel];
    const prefix = isMax ? "clicked_" : "";
    return `/emotion_tag/${character}/${prefix}${character}-${key}.svg`;
  }

  if (!character) return null;

  const enrichedData = data.map((item) => ({
    label: item.label,
    value: item.value,
    icon: getEmotionIconPath(character, item.label, item.value === maxValue),
  }));

  const MAX_ITEMS = 4;

  const topReal = [...enrichedData]
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_ITEMS);

  const fillerIcon = `/emotion_tag/${character}/${character}-normal.svg`;
  while (topReal.length < MAX_ITEMS) {
    topReal.push({ icon: fillerIcon, label: "", value: undefined as any });
  }

  const sortedData = [...enrichedData].sort(
    (a, b) => (b.value ?? -1) - (a.value ?? -1)
  );
  const monthNumber = parseInt(month.split("-")[1], 10);
  const isEnglishLabel = maxEmotion && emotionTextMap[maxEmotion] !== undefined;
  const maxEmotionText = isEnglishLabel
    ? emotionTextMap[maxEmotion!]
    : maxEmotion ?? "";

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        {monthNumber}월은 {maxEmotionText}을 가장 많이 느꼈어요
      </h3>
      <EmotionCircleList data={topReal} />
    </div>
  );
}

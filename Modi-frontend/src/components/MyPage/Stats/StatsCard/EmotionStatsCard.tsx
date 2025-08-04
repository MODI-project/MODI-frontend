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

  const emotionKeyMap: Record<string, string> = {
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

  function getEmotionIconPath(
    character: string,
    emotionLabel: string,
    isMax: boolean
  ): string {
    const key = emotionKeyMap[emotionLabel];
    const prefix = isMax ? "clicked_" : "";
    return `/emotion_tag/${character}/${prefix}${character}-${key}.svg`;
  }

  if (!character) return null;

  const enrichedData = data.map((item) => ({
    ...item,
    icon: getEmotionIconPath(character, item.label, item.value === maxValue),
  }));
  const sortedData = [...enrichedData].sort((a, b) => b.value - a.value);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        {month.split("-")[1]}월은 {maxEmotion}을 가장 많이 느꼈어요
      </h3>
      <EmotionCircleList data={sortedData} />
    </div>
  );
}

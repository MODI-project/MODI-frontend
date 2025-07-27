import EmotionCircleList from "../ChartItem/EmotionCircleList";
import styles from "./StatsCard.module.css";
import { useCharacter } from "../../../../contexts/CharacterContext";

export default function EmotionStatsCard() {
  const { character } = useCharacter();

  const data = [
    { label: "기쁨", value: 15 },
    { label: "슬픔", value: 7 },
    { label: "사랑", value: 5 },
    { label: "놀람", value: 2 },
  ];
  if (!character) return null;
  const maxValue = Math.max(...data.map((item) => item.value));
  const maxEmotion = data.find((item) => item.value === maxValue)?.label;

  const emotionKeyMap: { [label: string]: string } = {
    기쁨: "happy",
    슬픔: "sad",
    사랑: "love",
    놀람: "surprised",
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
        한달 중 {maxEmotion} 감정을 가장 많이 느꼈어요
      </h3>
      <EmotionCircleList data={sortedData} />
    </div>
  );
}

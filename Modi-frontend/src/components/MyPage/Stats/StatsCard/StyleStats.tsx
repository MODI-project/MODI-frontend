import { useState } from "react";
import styles from "./StatsCard.module.css";
import StyleStatsBarList from "../ChartItem/StyleStatsBarList";

const toneTextMap: Record<string, string> = {
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
  calm: "차분함",
  none: "없음",
};

export default function StyleStatsCard({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  // 데이터 없으면 전체 카드 숨김
  if (!data || data.length === 0) return null;

  const [maxLabel, setMaxLabel] = useState<string | null>(null);

  // 타이틀도 안전하게
  const title = maxLabel
    ? `${toneTextMap[maxLabel] ?? maxLabel} 언어 스타일을 가장 많이 사용했어요`
    : null;

  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <StyleStatsBarList data={data} onMaxLabelChange={setMaxLabel} />
    </div>
  );
}

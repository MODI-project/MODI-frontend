import { useState } from "react";
import styles from "./StatsCard.module.css";
import StyleStatsBarList from "../ChartItem/StyleStatsBarList";

export default function StyleStatsCard({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const [maxLabel, setMaxLabel] = useState<string | null>(null);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        {maxLabel} 언어 스타일을 가장 많이 사용했어요
      </h3>
      <StyleStatsBarList data={data} onMaxLabelChange={setMaxLabel} />
    </div>
  );
}

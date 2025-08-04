import { useState, useMemo } from "react";
import styles from "./StatsCard.module.css";
import StyleStatsBarList from "../ChartItem/StyleStatsBarList";
import { getToneStatsByMonth } from "../../../../utils/getToneStatsByMonths";

interface Props {
  month: string; // "2025-07" 형태
}

export default function StyleStatsCard({ month }: Props) {
  const [maxLabel, setMaxLabel] = useState<string | null>(null);

  // ✅ 해당 월 데이터 필터링
  const toneData = useMemo(() => getToneStatsByMonth(month), [month]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        {maxLabel} 언어 스타일을 가장 많이 사용했어요
      </h3>
      <StyleStatsBarList data={toneData} onMaxLabelChange={setMaxLabel} />
    </div>
  );
}

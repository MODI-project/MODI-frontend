import { useState } from "react";
import styles from "./StatsCard.module.css";
import VisitStatsBarList from "../ChartItem/VisitStatsBarList";

interface VisitStatsCardProps {
  data: { label: string; value: number }[];
}

export default function VisitStatsCard({ data }: VisitStatsCardProps) {
  const [maxLabel, setMaxLabel] = useState<string | null>(null);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        한달 간 {maxLabel}을 가장 많이 방문했어요
      </h3>
      <VisitStatsBarList data={data} onMaxLabelChange={setMaxLabel} />
    </div>
  );
}

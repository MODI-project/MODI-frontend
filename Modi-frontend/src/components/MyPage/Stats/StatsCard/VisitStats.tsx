import { useState } from "react";
import styles from "./StatsCard.module.css";
import VisitStatsBarList from "../ChartItem/VisitStatsBarList";

interface VisitStatsCardProps {
  data: { label: string; value: number }[];
}

function hasFinalConsonant(koreanChar: string): boolean {
  const code = koreanChar.charCodeAt(0) - 0xac00;
  const jong = code % 28;
  return jong !== 0;
}

function getParticle(
  word: string,
  particleWithConsonant: string,
  particleWithoutConsonant: string
): string {
  if (!word) return "";
  const lastChar = word[word.length - 1];
  return hasFinalConsonant(lastChar)
    ? particleWithConsonant
    : particleWithoutConsonant;
}

export default function VisitStatsCard({ data }: VisitStatsCardProps) {
  const [maxLabel, setMaxLabel] = useState<string | null>(null);
  const particle = maxLabel ? getParticle(maxLabel, "을", "를") : "";

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        한달 간 {maxLabel && `${maxLabel}${particle}`} 가장 많이 방문했어요
      </h3>
      <VisitStatsBarList data={data} onMaxLabelChange={setMaxLabel} />
    </div>
  );
}

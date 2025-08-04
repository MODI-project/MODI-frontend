import { mockDiaries } from "../apis/diaryInfo";

export function getToneStatsByMonth(ym: string) {
  const filtered = mockDiaries.filter((d) => d.date.startsWith(ym));
  const counter: Record<string, number> = {};

  filtered.forEach((d) => {
    if (!d.tone) return;
    counter[d.tone] = (counter[d.tone] || 0) + 1;
  });

  const result = Object.entries(counter).map(([label, value]) => ({
    label,
    value,
  }));

  return result.sort((a, b) => b.value - a.value);
}

import { mockDiaries } from "../apis/diaryInfo";

export function getEmotionStatsByMonth(ym: string) {
  const filtered = mockDiaries.filter((d) => d.date.startsWith(ym));
  const counter: Record<string, number> = {};

  filtered.forEach((d) => {
    if (!d.emotion) return;
    counter[d.emotion] = (counter[d.emotion] || 0) + 1;
  });

  const result = Object.entries(counter).map(([name, count]) => ({
    name,
    count,
  }));

  return result.sort((a, b) => b.count - a.count);
}

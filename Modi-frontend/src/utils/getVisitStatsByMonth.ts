import { mockDiaries } from "../apis/diaryInfo";

export function getVisitStatsByMonth(ym: string) {
  const filtered = mockDiaries.filter((d) => d.date.startsWith(ym));
  const counter: Record<string, number> = {};

  filtered.forEach((d) => {
    if (!d.address) return;
    counter[d.address] = (counter[d.address] || 0) + 1;
  });

  const result = Object.entries(counter).map(([label, value]) => ({
    label,
    value,
  }));

  return result.sort((a, b) => b.value - a.value);
}

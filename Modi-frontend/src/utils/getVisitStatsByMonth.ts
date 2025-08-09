import { mockDiaries } from "../apis/diaryInfo";
import { extractSiDong } from "./address";

export function getVisitStatsByMonth(ym: string) {
  const filtered = mockDiaries.filter((d) => d.date.startsWith(ym));
  const counter: Record<string, number> = {};

  filtered.forEach((d) => {
    if (!d.address) return;
    const label = extractSiDong(d.address);
    if (!label) return;
    counter[label] = (counter[label] || 0) + 1;
  });

  return Object.entries(counter)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

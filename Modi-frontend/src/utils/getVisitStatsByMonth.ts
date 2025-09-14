import { fetchStatisticsByYm } from "./statisticsFetcher";
import { formatVisitLabel } from "./address";

export async function getVisitStatsByMonth(ym: string) {
  const stats = await fetchStatisticsByYm(ym); // 캐시로 1회 호출
  const counter: Record<string, number> = {};

  for (const loc of stats.topLocations ?? []) {
    // 응답 name(예: "서울시 강남구\n역삼동" 또는 "역삼동")을 표준화
    const normalized = formatVisitLabel(loc.name);
    const label = normalized || loc.name || ""; // 파서가 빈 문자열 내면 원본 사용
    if (!label) continue;
    counter[label] = (counter[label] || 0) + (loc.count ?? 0);
  }

  return Object.entries(counter)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

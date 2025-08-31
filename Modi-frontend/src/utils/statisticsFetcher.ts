import { getStatistics, StatisticsResponse } from "../apis/MyPageAPIS/stats";

const cache = new Map<string, StatisticsResponse>(); // key: "YYYY-MM"

function parseYm(ym: string) {
  const [y, mm] = ym.split("-");
  return { year: y, month: String(Number(mm)) }; // "08" → "8"
}

export async function fetchStatisticsByYm(ym: string) {
  if (cache.has(ym)) return cache.get(ym)!;
  const { year, month } = parseYm(ym);
  const { data } = await getStatistics(year, month);
  cache.set(ym, data);
  return data;
}

import { fetchStatisticsByYm } from "./statisticsFetcher";

export async function getEmotionStatsByMonth(ym: string) {
  const data = await fetchStatisticsByYm(ym);
  return (data.topEmotions ?? [])
    .map((it) => ({ label: it.name, value: it.count }))
    .sort((a, b) => b.value - a.value);
}

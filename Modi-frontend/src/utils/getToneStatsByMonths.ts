import { fetchStatisticsByYm } from "./statisticsFetcher";

export async function getToneStatsByMonth(ym: string) {
  const data = await fetchStatisticsByYm(ym);
  return (data.topTones ?? [])
    .filter((it) => it.name && it.name.trim() !== "" && it.name !== "없음")
    .map((it) => ({ label: it.name, value: it.count }))
    .sort((a, b) => b.value - a.value);
}

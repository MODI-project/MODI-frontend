import { fetchStatisticsByYm } from "./statisticsFetcher";

export async function getToneStatsByMonth(ym: string) {
  const data = await fetchStatisticsByYm(ym);
  console.log("toneData", data);
  return (data.topTones ?? [])
    .map((it) => ({ label: it.name, value: it.count }))
    .sort((a, b) => b.value - a.value);
}

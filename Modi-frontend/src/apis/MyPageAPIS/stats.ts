import apiClient from "../apiClient";

export interface StatisticsItem {
  name: string;
  count: number;
}

export interface StatisticsResponse {
  totalCount: number;
  topEmotions: StatisticsItem[];
  topTones: StatisticsItem[];
  topLocations: StatisticsItem[];
}

export const getStatistics = (year: string, month: string) =>
  apiClient.get<StatisticsResponse>(
    `/diaries/statistics?year=${year}&month=${month}`
  );

export async function fetchStatisticsByYm(ym: string) {
  const [year, month] = ym.split("-");
  const { data } = await getStatistics(year, month);

  const toneData = (data.topTones ?? []).map((it) => ({
    label: it.name, // 서버 name
    value: it.count, // 서버 count
  }));
  return {
    totalCount: data.totalCount,
    toneData,
  };
}

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

const normalize = (s?: string) => (s ?? "").trim().toLowerCase();

export async function fetchStatisticsByYm(ym: string) {
  const [year, month] = ym.split("-");
  const { data } = await getStatistics(year, month);

  const toneData = (data.topTones ?? [])
    .filter((it) => it.count > 0) // 0건 제거 (선택)
    .filter((it) => {
      const k = normalize(it.name);
      // '없음', 빈 문자열, none/unknown 류 제거
      return k && k !== "없음" && k !== "none" && k !== "unknown";
    })
    .map((it) => ({ label: it.name, value: it.count }));

  return {
    totalCount: data.totalCount,
    toneData, // 여기까지 오면 “보여줄 데이터만” 남음
    hasToneStats: toneData.length > 0, // 필요하면 플래그도 같이
  };
}

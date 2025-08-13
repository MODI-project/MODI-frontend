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

import apiClient from "../apiClient";
import type { DiaryData } from "../../components/common/frame/Frame";

/** 서버 → 화면 모델 매핑(월/일 공통) */
const normalize = (r: any): DiaryData => ({
  id: Number(r.id),
  date: (r.date ?? "").slice(0, 10), // "YYYY-MM-DD"
  photoUrl: r.thumbnailUrl ?? r.photoUrl ?? r.imageUrl ?? "",
  summary: r.summary ?? "",
  emotion: r.emotion ?? "",
  tags: Array.isArray(r.tags) ? r.tags : [],
  content: r.content,
  address: r.address,
  latitude: r.latitude,
  longitude: r.longitude,
  tone: r.tone,
  font: r.font,
  frame: r.frame,
});

export const fetchMonthlyDiaries = async (
  year: number,
  month: number
): Promise<DiaryData[]> => {
  const { data } = await apiClient.get("/diaries", { params: { year, month } });
  const list = Array.isArray(data) ? data : data?.diaries ?? data?.items ?? [];
  return list.map(normalize);
};

export type DailyGroup = {
  date: string; // "YYYY-MM-DD"
  diaries: DiaryData[]; // 그 날짜의 일기들
};

export const fetchDailyGroups = async (
  year: number,
  month: number
): Promise<DailyGroup[]> => {
  const { data } = await apiClient.get("/diaries/daily", {
    params: { year, month },
  });

  if (
    Array.isArray(data) &&
    data.length &&
    data[0]?.date &&
    Array.isArray(data[0]?.diaries)
  ) {
    return (data as any[])
      .map((g) => ({
        date: String(g.date).slice(0, 10),
        diaries: (g.diaries as any[]).map(normalize).filter((d) => d.date),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // 2) 평탄 배열
  const diariesRaw: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.diaries)
    ? data.diaries
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const diaries = diariesRaw.map(normalize).filter((d) => d.date);

  const map: Record<string, DiaryData[]> = {};
  for (const d of diaries) {
    (map[d.date] ||= []).push(d);
  }

  return Object.entries(map)
    .map(([date, ds]) => ({ date, diaries: ds }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

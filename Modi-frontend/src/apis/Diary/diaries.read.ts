import apiClient from "../apiClient";
import type { DiaryData } from "../../components/common/frame/Frame";
import { mapFontName } from "../../utils/fontMap";

const toFrame = (r: any): string => {
  const cand =
    r?.frameId ??
    r?.frame ??
    r?.frame_uuid ??
    r?.frameNo ??
    r?.frameCode ??
    r?.frame?.id ??
    r?.frame?.code ??
    r?.templateId ?? // 혹시 이런 이름일 수도
    r?.frameTemplateId ?? // 혹시 이런 이름일 수도
    null;
  return cand == null ? "" : String(cand);
};

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
  frame: toFrame(r),
});

export const fetchMonthlyDiaries = async (
  year: number,
  month: number
): Promise<DiaryData[]> => {
  const { data } = await apiClient.get("/diaries", { params: { year, month } });
  const list = Array.isArray(data) ? data : data?.diaries ?? data?.items ?? [];
  const mapped = list.map(normalize);
  console.log("[monthly] raw sample:", list[0]);
  console.log("[monthly] normalized sample:", mapped[0]); // 🔎 frame 확인
  return mapped;
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
    const groups = (data as any[])
      .map((g) => ({
        date: String(g.date).slice(0, 10),
        diaries: (g.diaries as any[]).map(normalize).filter((d) => d.date),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    console.log("[daily groups] normalized sample:", groups[0]?.diaries?.[0]);
    return groups;
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

export const fetchDiaryById = async (
  diaryId: number | string
): Promise<DiaryData> => {
  const { data } = await apiClient.get(`/diaries/${diaryId}`);
  return normalizeDiaryDetail(data);
};

// 상세 일기 데이터 변환 함수
function normalizeDiaryDetail(r: any): DiaryData {
  return {
    id: Number(r.id),
    date: (r.date ?? "").slice(0, 10),
    photoUrl: r.imageUrls?.[0] ?? "",
    summary: r.summary ?? "",
    emotion: typeof r.emotion === "object" ? r.emotion.name : r.emotion ?? "",
    tags: Array.isArray(r.tags)
      ? r.tags.map((t: any) =>
          t && typeof t === "object" ? t.name ?? "" : String(t)
        )
      : [],
    content: r.content,
    address: r.location?.address ?? "",
    latitude: r.location?.latitude,
    longitude: r.location?.longitude,
    tone: typeof r.tone === "object" ? r.tone.name : r.tone ?? "",
    font: mapFontName(r.font),
    frame: toFrame(r),
  };
}

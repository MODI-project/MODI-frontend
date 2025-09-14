import apiClient from "../apiClient";

export type DiaryCard = {
  id: number;
  photoUrl: string | null;
};

type ApiGroupItem = {
  date: string;
  diaries: Array<{
    diaryId: number;
    imageUrls: string[];
  }>;
};

const formatDateK = (isoDate: string) => {
  const d = new Date(isoDate + "T00:00:00");
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}. ${m}. ${day}`;
};

export const searchDiaries = async (
  tagName: string
): Promise<Record<string, DiaryCard[]>> => {
  const t = tagName.trim();
  if (!t) return {};

  const { data } = await apiClient.get<ApiGroupItem[]>(`/diaries`, {
    params: { tagName: t },
  });

  const grouped: Record<string, DiaryCard[]> = {};
  for (const g of data ?? []) {
    const key = formatDateK(g.date);
    const items: DiaryCard[] = g.diaries.map((d) => ({
      id: d.diaryId,
      photoUrl: d.imageUrls?.[0] ?? null,
    }));
    grouped[key] = items;
  }
  return grouped;
};

export const getDiaryById = async (id: number) => {
  const { data } = await apiClient.get(`/diaries/${id}`);
  return data;
};

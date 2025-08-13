import apiClient from "../apiClient";

export type Diary = {
  id: number;
  date: string;
  photoUrl: string | null;
  summary: string;
  emotion: string;
  tags: string[];
  created_at: string;
};

type DiariesResponse = {
  diaries: Diary[];
};

export const formatDateK = (isoDate: string) => {
  const d = new Date(isoDate + "T00:00:00");
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}. ${m}. ${day}`;
};

export const matchDiary = (diary: Diary, term: string) => {
  const tokens = term.trim().toLowerCase().split(/\s+/);
  const hay = [
    diary.summary,
    diary.emotion,
    ...diary.tags,
    formatDateK(diary.date),
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => hay.includes(t));
};

/* 사용자 일기 전체 조회 */
export const getAllDiaries = async (): Promise<Diary[]> => {
  const { data } = await apiClient.get<DiariesResponse>("/diaries", {
    headers: { "Content-Type": "application/json" },
  });
  return data?.diaries ?? [];
};

export const searchDiaries = async (
  query: string
): Promise<Record<string, Diary[]>> => {
  const q = query.trim();
  if (!q) return {};

  const all = await getAllDiaries();

  const filtered = all
    .filter((d) => matchDiary(d, q))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const grouped = filtered.reduce<Record<string, Diary[]>>((acc, d) => {
    const key = formatDateK(d.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  return grouped;
};

export const getDiaryById = async (id: number) => {
  const { data } = await apiClient.get(`/diaries/${id}`);
  return data;
};

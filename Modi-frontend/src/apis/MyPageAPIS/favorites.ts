import apiClient from "../apiClient";

type FavoriteItemRaw = {
  id: number;
  date: string;
  thumbnailUrl?: string;
  photoUrl?: string;
  imageUrl?: string;
  thumbnailId?: string;
};

export type FavoriteItem = {
  id: number;
  date: string;
  imageSrc: string; // 화면에서 쓸 최종 절대 URL
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

const ORIGIN = "https://modi-server.store";

const toAbsoluteUrl = (u?: string) =>
  !u ? "" : u.startsWith("http") ? u : `${ORIGIN}${u}`;

const imageFromId = (id?: string) => (id ? `${ORIGIN}/api/files/${id}` : "");

const normalizeFavorite = (r: FavoriteItemRaw): FavoriteItem => {
  const raw = r.thumbnailUrl ?? r.photoUrl ?? r.imageUrl ?? ""; // 우선순위 매칭
  const url = raw ? toAbsoluteUrl(raw) : imageFromId(r.thumbnailId);
  return { id: r.id, date: (r.date ?? "").slice(0, 10), imageSrc: url };
};

export const getFavorites = async (
  page = 0,
  size = 20
): Promise<FavoriteItem[]> => {
  const { data } = await apiClient.get<PageResponse<FavoriteItemRaw>>(
    "/diaries/favorites",
    { params: { page, size } }
  );

  return (data.content ?? []).map(normalizeFavorite);
};

export const updateFavorite = (diaryId: number, favorite: boolean) =>
  apiClient.post(`/diaries/${diaryId}/favorite`, null, {
    params: { favorite },
  });

import apiClient from "./apiClient";

type FavoriteItemRaw = {
  id: number;
  date: string;
  thumbnailUrl?: string;
  photoUrl?: string; // 'https://...'
  imageUrl?: string; // 다른 이름일 수도
  thumbnailId?: string; // '99464d7-...' 같은 키
};

export type FavoriteItem = {
  id: number;
  date: string;
  imageSrc: string; // 화면에서 쓸 최종 절대 URL
};

const ORIGIN = "https://modidiary.store";

const toAbsoluteUrl = (u?: string) =>
  !u ? "" : u.startsWith("http") ? u : `${ORIGIN}${u}`;

const imageFromId = (id?: string) => (id ? `${ORIGIN}/api/files/${id}` : "");

const normalizeFavorite = (r: FavoriteItemRaw): FavoriteItem => {
  const raw = r.thumbnailUrl ?? r.photoUrl ?? r.imageUrl ?? ""; // 우선순위 매칭
  const url = raw ? toAbsoluteUrl(raw) : imageFromId(r.thumbnailId);
  return { id: r.id, date: r.date, imageSrc: url };
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const { data } = await apiClient.get<FavoriteItemRaw[]>("/diaries/favorites");
  return data.map(normalizeFavorite);
};

export const updateFavorite = (diaryId: number, favorite: boolean) =>
  apiClient.post(`/diaries/${diaryId}/favorite?favorite=${favorite}`);

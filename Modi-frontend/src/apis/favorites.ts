import apiClient from "./apiClient";

export interface FavoriteItem {
  id: number;
  date: string;
  thumbnailUrl: string;
}

// 즐겨찾기 목록 불러오기
export const getFavorites = () =>
  apiClient.get<FavoriteItem[]>("/diaries/favorites");

// 즐겨찾기 추가, 해제 (상세 페이지에서 누를 때)
export const updateFavorite = (diaryId: number, favorite: boolean) =>
  apiClient.post(`/diaries/${diaryId}/favorite?favorite=${favorite}`);

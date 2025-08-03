import apiClient from "./apiClient";

export interface FavoriteItem {
  id: number;
  date: string;
  thumbnailUrl: string;
}

// 즐겨찾기 목록 불러오기
export const getFavorites = () =>
  apiClient.get<FavoriteItem[]>("/api/diaries/favorites");

// 즐겨찾기 추가 (상세 페이지에서 누를 때)
export const addFavorite = (diaryId: number) =>
  apiClient.post(`/api/diaries/${diaryId}/favorite`);

// 즐겨찾기 해제 (토글 해제 시)
export const removeFavorite = (diaryId: number) =>
  apiClient.delete(`/api/diaries/${diaryId}/favorite`);

import apiClient from "../apiClient";

export const getPopularTags = async (): Promise<string[]> => {
  const { data } = await apiClient.get<string[]>("/diaries/tags/popular");
  const arr = Array.isArray(data) ? data : [];
  return Array.from(new Set(arr.map((t) => (t ?? "").trim()).filter(Boolean)));
};

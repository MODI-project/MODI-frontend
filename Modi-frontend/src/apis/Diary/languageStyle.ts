import apiClient from "../apiClient";

export const fetchLanguageStyles = async (
  emotion: string | null | undefined,
  content: string
): Promise<string[]> => {
  const res = await apiClient.post("/utils/language-style", {
    emotion: emotion ?? "",
    content,
  });
  return res.data?.styles ?? [];
};

import apiClient from "../apiClient";

export const generateSummary = async (
  content: string
): Promise<string | null> => {
  const res = await apiClient.post("/utils/summary", { content });
  return res.data?.summary ?? null;
};

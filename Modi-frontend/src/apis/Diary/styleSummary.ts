import apiClient from "../apiClient";

export const generateStyledSummary = async (
  style: string,
  summary: string
): Promise<string | null> => {
  const res = await apiClient.post("/utils/summary/styled", {
    style,
    summary,
  });
  return res.data?.summary ?? null;
};

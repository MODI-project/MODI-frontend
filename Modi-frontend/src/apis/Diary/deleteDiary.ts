import apiClient from "../apiClient";

export interface DeleteDiaryResponse {
  message: string;
}

export const deleteDiary = async (
  diaryId: number
): Promise<DeleteDiaryResponse> => {
  const res = await apiClient.delete<DeleteDiaryResponse>(
    `/diaries/${diaryId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

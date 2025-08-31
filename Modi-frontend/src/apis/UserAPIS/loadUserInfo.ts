import apiClient from "../apiClient";

export interface MeResponse {
  userId: number;
  email: string;
  nickname: string;
  character: "momo" | "boro" | "lumi" | "zuni";
}

export const loadUserInfo = async (): Promise<MeResponse> => {
  const res = await apiClient.get<MeResponse>("/members/me");
  return res.data;
};

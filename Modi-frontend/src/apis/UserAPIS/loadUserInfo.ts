import apiClient from "../apiClient";

export interface MeResponse {
  userId: number;
  email: string;
  nickname: string;
  character: "momo" | "boro" | "lumi" | "zuni";
}

export const loadUserInfo = async (): Promise<MeResponse> => {
  const res = await apiClient.get<MeResponse>("/members/me"); // 쿠키로 인증
  console.log("✅ 유저 정보 불러오기 성공:", res.data);
  return res.data;
};

import apiClient from "../apiClient";

export interface EditUserInfoParams {
  nickname: string;
  character: string;
}

export const editUserInfo = async (params: EditUserInfoParams) => {
  const response = await apiClient.put("/members/me", params);
  return response.data;
};

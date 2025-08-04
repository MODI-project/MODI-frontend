import apiClient from "../apiClient";

export interface EditUserInfoParams {
  nickname: string;
  character: string;
}

export const editUserInfo = async (params: EditUserInfoParams) => {
  const response = await apiClient.put("/users/me", params);
  return response.data;
};

import type { MeRequest, MeResponse } from "../../types/UserInfo";
import useApi from "./useApi";

const API_BASE_URL = "https://modi-server.store/api";

function useEditUserInfo() {
  const { api } = useApi();

  const editUserInfo = (userInfo: MeRequest) => {
    return api
      .put<MeResponse>("/members/me", userInfo)
      .then((response) => response.data);
  };

  return { editUserInfo };
}

export default useEditUserInfo;

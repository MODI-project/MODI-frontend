import useApi from "./useApi";

export interface MeResponse {
  userId: number;
  email: string;
  nickname: string;
  character: "momo" | "boro" | "lumi" | "zuni";
}

function useLoadUserInfo() {
  const { api } = useApi();

  const userInfo = () => {
    return api.get<MeResponse>("/members/me").then((response) => response.data);
  };

  return { userInfo };
}

export default useLoadUserInfo;

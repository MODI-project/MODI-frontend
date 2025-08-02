import axios from "axios";
import type { SignUpRequest, SignUpResponse } from "../../types/UserInfo";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://ec2-3-38-55-66.ap-northeast-2.compute.amazonaws.com/api";

export const signUp = async (
  userInfo: SignUpRequest,
  accessToken: string
): Promise<SignUpResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userInfo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("회원가입 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

// 사용 예시 함수 (InfoSetting.tsx에서 사용할 수 있음)
export const handleUserSignUp = async (nickname: string, character: string) => {
  try {
    // localStorage에서 accessToken 가져오기 (OAuth 콜백에서 저장되었다고 가정)
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Access token이 없습니다. 다시 로그인해주세요.");
    }

    const userInfo: SignUpRequest = {
      nickname,
      character,
    };

    const response = await signUp(userInfo, accessToken);

    // 회원가입 성공 후 처리
    localStorage.setItem("userInfo", JSON.stringify(response));

    return response;
  } catch (error) {
    console.error("회원가입 처리 실패:", error);
    throw error;
  }
};

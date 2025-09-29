import axios from "axios";
import type { MeRequest, MeResponse } from "../../types/UserInfo";

const API_BASE_URL = "https://modi-server.store/api";

export const handleUserSignUp = async (
  nickname: string,
  character: string,
  code?: string | null
): Promise<MeResponse> => {
  try {
    const userInfo: MeRequest = {
      nickname,
      character,
    };
    // 로그인하고 리디랙션되는 페이지를 하나 만들어서 여기서 분기처리를 하자 -> 명세 수정 필요
    // signUp 로직을 통합: axios로 직접 회원가입 요청
    const requestBody = code ? { ...userInfo, code } : userInfo;
    const response = await axios.post(`${API_BASE_URL}/members`, requestBody, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("회원가입 성공");
    const data: MeResponse = response.data;

    return data;
  } catch (error: any) {
    console.error("handleUserSignUp 실패:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    let userMessage = "회원가입에 실패했습니다.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        userMessage = "인증에 실패했습니다. 다시 로그인해주세요.";
      } else if (status === 400) {
        userMessage =
          data?.message || "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (status === 409) {
        userMessage = "이미 존재하는 사용자입니다.";
      } else if (status >= 500) {
        userMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }
    } else if (error.request) {
      userMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
    }

    error.userMessage = userMessage;
    throw error;
  }
};

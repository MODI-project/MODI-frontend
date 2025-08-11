import axios from "axios";
import type { SignUpRequest, SignUpResponse } from "../../types/UserInfo";

const API_BASE_URL = "https://modidiary.store/api";

export const signUp = async (
  userInfo: SignUpRequest,
  code?: string | null
): Promise<SignUpResponse> => {
  console.log("=== signUp API 호출 시작 ===");
  console.log("API URL:", `${API_BASE_URL}/users`);
  console.log("요청 데이터:", userInfo);
  console.log("요청 데이터 JSON:", JSON.stringify(userInfo, null, 2));

  try {
    console.log("HttpOnly 쿠키 방식으로 인증 진행");
    console.log("현재 모든 쿠키:", document.cookie);

    // code가 있으면 request body에 포함
    const requestBody = code ? { ...userInfo, code } : userInfo;

    console.log("최종 request body:", requestBody);

    const response = await axios.post(`${API_BASE_URL}/members`, requestBody, {
      headers: {
        "Content-Type": "application/json",
        // HttpOnly 쿠키는 자동으로 전송되므로 Authorization 헤더 불필요
      },
      withCredentials: true, // HttpOnly 쿠키 자동 전송
    });

    console.log("✅ 회원가입 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 회원가입 실패 - 상세 에러 정보:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    if (error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 데이터:", error.response.data);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 에러:", error.message);
    }

    throw error;
  }
};

export const handleUserSignUp = async (
  nickname: string,
  character: string,
  code?: string | null
) => {
  try {
    console.log("=== handleUserSignUp 시작 ===");

    const userInfo: SignUpRequest = {
      nickname,
      character,
    };

    const response = await signUp(userInfo, code);
    localStorage.setItem("userInfo", JSON.stringify(response));
    console.log("✅ 회원가입 완료 - localStorage에 사용자 정보 저장");

    return response;
  } catch (error: any) {
    console.error("❌ handleUserSignUp 실패:");
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

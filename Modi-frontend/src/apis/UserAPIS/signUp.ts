import axios from "axios";
import type { SignUpRequest, SignUpResponse } from "../../types/UserInfo";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://ec2-3-38-55-66.ap-northeast-2.compute.amazonaws.com/api";

export const signUp = async (
  userInfo: SignUpRequest
): Promise<SignUpResponse> => {
  console.log("=== signUp API 호출 시작 ===");
  console.log("API URL:", `${API_BASE_URL}/users`);
  console.log("요청 데이터:", userInfo);

  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userInfo, {
      headers: {
        "Content-Type": "application/json",
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
      // 서버에서 응답을 받았지만 에러 상태 코드
      console.error("응답 상태:", error.response.status);
      console.error("응답 데이터:", error.response.data);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      // 요청 설정 중 에러
      console.error("요청 설정 에러:", error.message);
    }

    throw error;
  }
};

// 사용 예시 함수 (InfoSetting.tsx에서 사용할 수 있음)
export const handleUserSignUp = async (nickname: string, character: string) => {
  try {
    console.log("=== handleUserSignUp 시작 ===");
    console.log("HttpOnly 쿠키를 사용하여 인증 진행");

    const userInfo: SignUpRequest = {
      nickname,
      character,
    };

    const response = await signUp(userInfo);

    // 회원가입 성공 후 처리
    localStorage.setItem("userInfo", JSON.stringify(response));
    console.log("✅ 회원가입 완료 - localStorage에 사용자 정보 저장");

    return response;
  } catch (error: any) {
    console.error("❌ handleUserSignUp 실패:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    // 사용자에게 더 구체적인 에러 메시지 제공
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

    // 에러 객체에 사용자 메시지 추가
    error.userMessage = userMessage;
    throw error;
  }
};

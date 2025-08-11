import axios from "axios";
import type { SignUpRequest, SignUpResponse } from "../../types/UserInfo";

const API_BASE_URL = "https://modidiary.store/api";

export const editUserInfo = async (
  userInfo: SignUpRequest
): Promise<SignUpResponse> => {
  console.log("=== editUserInfo API 호출 시작 ===");
  console.log("API URL:", `${API_BASE_URL}/members/me`);
  console.log("요청 데이터:", userInfo);
  console.log("요청 데이터 JSON:", JSON.stringify(userInfo, null, 2));

  try {
    console.log("HttpOnly 쿠키 방식으로 인증 진행");
    console.log("현재 모든 쿠키:", document.cookie);

    const response = await axios.put(`${API_BASE_URL}/members/me`, userInfo, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // HttpOnly 쿠키 자동 전송
    });

    console.log("✅ 회원 정보 수정 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 회원 정보 수정 실패 - 상세 에러 정보:");
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

export const handleEditUserInfo = async (
  nickname: string,
  character: string
) => {
  try {
    console.log("=== handleEditUserInfo 시작 ===");

    const userInfo: SignUpRequest = {
      nickname,
      character,
    };

    const response = await editUserInfo(userInfo);

    // 로컬 스토리지의 사용자 정보 업데이트
    const existingUserInfo = localStorage.getItem("userInfo");
    if (existingUserInfo) {
      const updatedUserInfo = { ...JSON.parse(existingUserInfo), ...response };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    }

    console.log("✅ 회원 정보 수정 완료 - localStorage 업데이트");

    return response;
  } catch (error: any) {
    console.error("❌ handleEditUserInfo 실패:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    let userMessage = "회원 정보 수정에 실패했습니다.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        userMessage = "인증에 실패했습니다. 다시 로그인해주세요.";
      } else if (status === 400) {
        userMessage =
          data?.message || "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (status === 404) {
        userMessage = "사용자 정보를 찾을 수 없습니다.";
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

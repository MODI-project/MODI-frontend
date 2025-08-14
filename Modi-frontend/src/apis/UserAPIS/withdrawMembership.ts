import apiClient from "../apiClient";

const API_BASE_URL = "https://modidiary.store/api";

interface WithdrawResponse {
  message: string;
}

export const withdrawMembership = async (): Promise<WithdrawResponse> => {
  console.log("=== withdrawMembership API 호출 시작 ===");
  console.log("API URL:", `/members/me`);

  try {
    console.log("apiClient를 통한 인증 진행");
    console.log("현재 모든 쿠키:", document.cookie);

    const response = await apiClient.delete<WithdrawResponse>("/members/me");

    console.log("✅ 회원 탈퇴 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 회원 탈퇴 실패 - 상세 에러 정보:");
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

export const handleWithdrawMembership = async () => {
  try {
    console.log("=== handleWithdrawMembership 시작 ===");

    const response = await withdrawMembership();

    // 로컬 스토리지의 사용자 정보 및 설정 삭제
    localStorage.removeItem("nickname");
    localStorage.removeItem("character");
    localStorage.removeItem("geolocation_permission");

    console.log("✅ 회원 탈퇴 완료 - 로컬 스토리지 정리");

    return response;
  } catch (error: any) {
    console.error("❌ handleWithdrawMembership 실패:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    let userMessage = "회원 탈퇴에 실패했습니다.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        userMessage = "인증에 실패했습니다. 다시 로그인해주세요.";
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

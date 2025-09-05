import axios from "axios";

const API_BASE_URL = "https://modi-server.store/api";

// 토큰 요청 Request 타입
interface TokenRequest {
  code: string;
}

// 토큰 요청 API
export const requestToken = async (code: string): Promise<void> => {
  console.log("=== 토큰 요청 API 호출 시작 ===");
  console.log("API URL:", `${API_BASE_URL}/oauth2/set-cookie`);
  console.log("요청 데이터:", { code });
  console.log("현재 쿠키 상태:", document.cookie);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/oauth2/set-cookie`,
      { code } as TokenRequest,
      {
        withCredentials: true, // HttpOnly 쿠키 자동 전송
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Set-Cookie 헤더 상세 분석
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      // access_token 쿠키 분석
      const accessTokenCookie = setCookieHeader.find((cookie: string) =>
        cookie.includes("access_token")
      );

      if (accessTokenCookie) {
        // 토큰 값이 비어있는지 확인
        if (accessTokenCookie.includes("access_token=")) {
          const tokenValue = accessTokenCookie
            .split("access_token=")[1]
            ?.split(";")[0];
          if (!tokenValue || tokenValue === "") {
            console.warn("access_token 값이 비어있습니다!");
            console.warn("백엔드에서 토큰 생성에 실패했을 가능성이 높습니다.");
          } else {
          }
        }
      } else {
        console.warn("access_token 쿠키를 찾을 수 없습니다!");
      }
    } else {
      console.warn("Set-Cookie 헤더가 없습니다!");
    }

    return response.data;
  } catch (error: any) {
    console.error("토큰 요청 실패 - 상세 에러 정보:");
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

// 토큰 요청 핸들러 (에러 처리 포함)
export const handleTokenRequest = async (code: string): Promise<void> => {
  try {
    console.log("=== handleTokenRequest 시작 ===");
    console.log("code:", code);

    await requestToken(code);
    console.log("토큰 요청 완료 - HttpOnly 쿠키로 access_token 설정됨");
  } catch (error: any) {
    console.error("handleTokenRequest 실패:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    let userMessage = "토큰 요청에 실패했습니다.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        userMessage = "잘못된 요청입니다. code 값을 확인해주세요.";
      } else if (status === 401) {
        userMessage = "인증에 실패했습니다. 다시 로그인해주세요.";
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

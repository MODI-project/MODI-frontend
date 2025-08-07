import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const OAuthCallback = () => {
  console.log("=== OAuthCallback 컴포넌트 렌더링 ===");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("로그인 처리 중...");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("=== OAuthCallback 컴포넌트 마운트됨 ===");
    console.log("현재 URL:", window.location.href);
    console.log("현재 경로:", window.location.pathname);
    console.log("현재 검색 파라미터:", window.location.search);

    const handleOAuthCallback = async () => {
      console.log("=== handleOAuthCallback 함수 시작 ===");

      try {
        // URL에서 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const isNew = urlParams.get("isNew");
        const error = urlParams.get("error");

        console.log("URL 파라미터 추출 완료:", { isNew, error });

        console.log("=== OAuth 콜백 디버깅 정보 ===");
        console.log("전체 URL:", window.location.href);
        console.log("URL 파라미터:", {
          isNew,
          error,
        });

        // 모든 URL 파라미터 출력
        console.log("모든 URL 파라미터:");
        for (const [key, value] of urlParams.entries()) {
          console.log(`  ${key}: ${value}`);
        }

        // 쿠키 확인
        console.log("현재 모든 쿠키:", document.cookie);
        console.log(
          "쿠키 개수:",
          document.cookie ? document.cookie.split(";").length : 0
        );

        // HttpOnly 쿠키 확인 (JavaScript에서는 읽을 수 없지만 존재 여부는 확인 가능)
        const cookies = document.cookie.split(";");
        console.log("=== 쿠키 상세 분석 ===");
        if (document.cookie) {
          cookies.forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            console.log(
              `쿠키 이름: ${name}, 값: ${value || "HttpOnly (읽을 수 없음)"}`
            );
          });
        } else {
          console.log("쿠키가 없습니다!");
        }

        // access_token 쿠키 존재 여부 확인
        const hasAccessToken = document.cookie.includes("access_token");
        console.log("access_token 쿠키 존재 여부:", hasAccessToken);

        // 네트워크 요청 확인
        console.log("=== 네트워크 요청 확인 ===");
        console.log("현재 페이지 URL:", window.location.href);
        console.log("Referrer:", document.referrer);
        console.log("User Agent:", navigator.userAgent);

        // Response Body 확인 (페이지 로드 시점)
        console.log("페이지 제목:", document.title);
        console.log("현재 URL:", window.location.href);

        if (error) {
          setStatus("error");
          setMessage("로그인에 실패했습니다.");
          console.error("OAuth 에러:", error);
          setTimeout(() => {
            navigate("/");
          }, 3000);
          return;
        }

        console.log("Google OAuth 콜백 성공! isNew:", isNew);

        // HttpOnly 쿠키 방식 사용 - 토큰은 쿠키로 자동 전송됨
        console.log("=== HttpOnly 쿠키 인증 방식 ===");
        console.log("토큰은 HttpOnly 쿠키로 백엔드에서 관리됨");
        console.log("프론트엔드에서는 쿠키 자동 전송만 사용");

        // 개발자 도구에서 확인하는 방법 안내
        console.log("=== 토큰 확인 방법 ===");
        console.log("1. 개발자 도구 (F12) → Application → Cookies");
        console.log(
          "2. 개발자 도구 → Network → OAuth 콜백 요청 → Response Headers"
        );
        console.log("3. Set-Cookie 헤더에서 access_token 확인");
        console.log(
          "4. HttpOnly 쿠키는 JavaScript에서 읽을 수 없지만 브라우저가 자동으로 전송"
        );

        // 백엔드에 쿠키 설정 요청
        console.log("=== 백엔드 쿠키 설정 요청 ===");
        console.log("백엔드에서 Set-Cookie 헤더로 토큰을 설정해야 합니다.");
        console.log(
          "예시: Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax"
        );

        setStatus("success");

        // isNew 값을 로컬 스토리지에 저장
        if (isNew) {
          localStorage.setItem("isNew", isNew);
          console.log("isNew 값을 로컬 스토리지에 저장:", isNew);
        }

        // 만약 백엔드에서 토큰을 URL 파라미터로 전달한다면
        const token = urlParams.get("token");
        if (token) {
          console.log(
            "URL에서 토큰을 받았습니다:",
            token.substring(0, 20) + "..."
          );
          // 프론트엔드에서 쿠키 설정 (보안상 권장하지 않음)
          document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax`;
          console.log("프론트엔드에서 access_token 쿠키 설정 완료");
        }

        if (isNew === "true") {
          // 새로운 회원은 정보 설정 페이지로
          setTimeout(() => {
            navigate("/information-setting", {
              state: { isNew: true },
            });
          }, 2000);
        } else {
          // 기존 회원은 홈 페이지로
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        }
      } catch (error: any) {
        console.error("OAuth 콜백 처리 중 오류:", error);
        console.error("에러 상세 정보:", {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        });
        setStatus("error");
        setMessage("로그인 처리 중 오류가 발생했습니다.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className={styles.loginPage_wrapper}>
      <div className={styles.loginPage}>
        <div className={styles.oauth_callback}>
          <div className={styles.loading_spinner}></div>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;

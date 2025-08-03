import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const OAuthCallback = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("로그인 처리 중...");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("=== OAuthCallback 컴포넌트 마운트됨 ===");
    console.log("현재 URL:", window.location.href);

    const handleOAuthCallback = async () => {
      try {
        // URL에서 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const isNew = urlParams.get("isNew");
        const error = urlParams.get("error");
        const accessToken = urlParams.get("token"); // Access token 추출

        console.log("=== OAuth 콜백 디버깅 정보 ===");
        console.log("전체 URL:", window.location.href);
        console.log("URL 파라미터:", {
          isNew,
          error,
          hasAccessToken: !!accessToken,
          accessTokenLength: accessToken?.length || 0,
        });

        // 모든 URL 파라미터 출력
        console.log("모든 URL 파라미터:");
        for (const [key, value] of urlParams.entries()) {
          console.log(`  ${key}: ${value}`);
        }

        // 쿠키 확인
        console.log("현재 모든 쿠키:", document.cookie);

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

        setStatus("success");

        if (isNew === "true") {
          // 새로운 회원은 정보 설정 페이지로
          setTimeout(() => {
            navigate("/information-setting");
          }, 2000);
        } else {
          // 기존 회원은 홈 페이지로
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        }
      } catch (error) {
        console.error("OAuth 콜백 처리 중 오류:", error);
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

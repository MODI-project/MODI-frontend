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

        // Access token 처리
        console.log("=== Access Token 처리 시작 ===");

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          console.log(
            "✅ Access Token을 URL에서 추출하여 localStorage에 저장 완료"
          );
          console.log("저장된 토큰 길이:", accessToken.length);
          console.log("토큰 앞 10자리:", accessToken.substring(0, 10) + "...");
        } else {
          console.log("❌ URL에서 Access Token을 찾을 수 없음");

          // 쿠키에서 토큰 확인 (백엔드가 쿠키로 토큰을 관리하는 경우)
          console.log("쿠키에서 토큰 확인 중...");
          const cookies = document.cookie.split(";");
          console.log("현재 모든 쿠키:", cookies);

          const tokenCookie = cookies.find((cookie) =>
            cookie.trim().startsWith("accessToken=")
          );

          if (tokenCookie) {
            const token = tokenCookie.split("=")[1];
            localStorage.setItem("accessToken", token);
            console.log(
              "✅ Access Token을 쿠키에서 추출하여 localStorage에 저장 완료"
            );
            console.log("저장된 토큰 길이:", token.length);
            console.log("토큰 앞 10자리:", token.substring(0, 10) + "...");
          } else {
            console.warn("❌ Access Token이 URL이나 쿠키에 없습니다.");
            console.log(
              "백엔드에서 토큰을 전달하지 않았거나 다른 방식으로 전달되었을 수 있습니다."
            );
          }
        }

        // localStorage 확인
        const savedToken = localStorage.getItem("accessToken");
        console.log("=== localStorage 확인 ===");
        console.log("저장된 토큰 존재 여부:", !!savedToken);
        if (savedToken) {
          console.log("저장된 토큰 길이:", savedToken.length);
          console.log(
            "저장된 토큰 앞 10자리:",
            savedToken.substring(0, 10) + "..."
          );
        }

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

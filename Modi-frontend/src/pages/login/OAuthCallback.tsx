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
        // URL에서 isNew 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const isNew = urlParams.get("isNew");
        const error = urlParams.get("error");

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

        // JWT는 쿠키로 전달되므로 별도 처리 불필요
        // 백엔드에서 자동으로 쿠키 설정

        setStatus("success");

        if (isNew === "true") {
          setMessage("새로운 회원입니다! 정보 설정 페이지로 이동합니다...");
          // 새로운 회원은 정보 설정 페이지로
          setTimeout(() => {
            navigate("/information-setting");
          }, 2000);
        } else {
          setMessage("로그인 성공! 홈 페이지로 이동합니다...");
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

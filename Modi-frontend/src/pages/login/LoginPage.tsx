import { useEffect, useState } from "react";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 백엔드 API 호출하여 Google 로그인 페이지로 리다이렉트
    const backendOAuthUrl = `http://ec2-3-38-55-66.ap-northeast-2.compute.amazonaws.com/api/oauth2/authorize/google`;

    console.log("Google 로그인 URL:", backendOAuthUrl);
    console.log("환경변수 VITE_API_URL:", import.meta.env.VITE_API_URL);

    // 외부 URL로 이동하므로 window.location.href 사용
    // React Router가 내부 라우트로 인식하지 않도록 전체 URL 사용
    if (backendOAuthUrl.startsWith("http")) {
      window.location.href = backendOAuthUrl;
    } else {
      // 상대 경로인 경우 현재 도메인과 결합
      window.location.href = `${window.location.origin}${backendOAuthUrl}`;
    }
  };

  return (
    <div className={styles.loginPage_wrapper}>
      <div className={styles.loginPage}>
        <PrimaryButton
          location="login"
          label="구글로 시작하기"
          onClick={handleGoogleLogin}
        />
      </div>
    </div>
  );
};

export default LoginPage;

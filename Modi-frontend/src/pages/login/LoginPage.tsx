import { useEffect, useState } from "react";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 환경 변수에서 API URL 가져오기 (로컬 개발: http://localhost:8080/api, 프로덕션: https://modi-server.store/api)
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "https://modi-server.store/api";
    
    // 현재 프론트엔드 origin (로컬: http://localhost:5173, 프로덕션: 배포 URL)
    const frontendOrigin = window.location.origin;
    const redirectUri = `${frontendOrigin}/home`;
    
    // 백엔드 OAuth URL에 redirect_uri 파라미터 추가
    const backendOAuthUrl = `${API_BASE_URL}/oauth2/authorize/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

    console.log("=== Google 로그인 시작 ===");
    console.log("API Base URL:", API_BASE_URL);
    console.log("프론트엔드 Origin:", frontendOrigin);
    console.log("리디렉션 URI:", redirectUri);
    console.log("Google 로그인 URL:", backendOAuthUrl);

    // 외부 URL로 이동하므로 window.location.href 사용
    // React Router가 내부 라우트로 인식하지 않도록 전체 URL 사용
    if (backendOAuthUrl.startsWith("http")) {
      console.log("Google OAuth 페이지로 리다이렉트 중...");
      window.location.href = backendOAuthUrl;
    }
  };

  return (
    <div className={styles.loginPage_wrapper}>
      <div className={styles.loginPage_container}>
        <div className={styles.modi_information}>
          <img className={styles.modi_logo} src="/icons/modi.svg" />
          <span className={styles.modi_introduction}>하루의 순간에</span>
          <div>
            <span className={styles.modi_introduction}>함께하는 친구, </span>
            <span className={styles.modi_name}>모디</span>
          </div>
        </div>
        <div className={styles.character_container}>
          <img
            className={styles.modi_character}
            src="/images/background/intro-character.svg"
            alt="모디 캐릭터 이미지"
          />
        </div>
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

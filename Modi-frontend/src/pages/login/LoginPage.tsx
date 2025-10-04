import { useEffect, useState } from "react";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 백엔드 API 호출하여 Google 로그인 페이지로 리다이렉트
    const backendOAuthUrl = `https://modi-server.store/api/oauth2/authorize/google`;

    console.log("=== Google 로그인 시작 ===");
    console.log("Google 로그인 URL:", backendOAuthUrl);
    console.log("현재 도메인:", window.location.origin);
    console.log("예상 리다이렉트 URL:", `${window.location.origin}/home`);

    // 외부 URL로 이동하므로 window.location.href 사용
    // React Router가 내부 라우트로 인식하지 않도록 전체 URL 사용
    if (backendOAuthUrl.startsWith("https")) {
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

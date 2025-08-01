import { useEffect, useState } from "react";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // const [loggedIn, setLoggedIn] = useState(false);
  // const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID;
  // const REDIRECT_URI = "http://localhost:5173/oauth/callback?isNew=true";
  // const SCOPE = process.env.REACT_APP_GOOGLE_SCOPE;

  // const handleGoogleLogin = () => {
  //   const googleOAuthUrl =
  //     "https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}";
  //   window.location.href = googleOAuthUrl;
  // };

  // useEffect(() => {
  //   // URL에 "code" 매개변수가 있는지 확인하여 Google 로그인이 성공했는지 여부를 확인
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const authorizationCode = urlParams.get("code");

  //   //인증 코드가 있는 경우 사용자를 로그인된 것으로 간주하loggedIn 상태를 true로 설정
  //   if (authorizationCode) {
  //     setLoggedIn(true);
  //   }
  // }, []);
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    // "/information-setting" 페이지로 이동
    navigate("/information-setting");
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

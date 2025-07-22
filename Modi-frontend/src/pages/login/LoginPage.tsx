import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5173/api/oauth2/authorize/google";
    // .env에 api 서버 주소를 저장하는 방법도 고려!
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

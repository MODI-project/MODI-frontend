import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 로그인 로직 여기서 구현!
    navigate("/test-initialsetting");
  };

  return (
    <div className={styles.loginPage_wrapper}>
      <div className={styles.loginPage}>
        <button className={styles.googleLogin_btn} onClick={handleGoogleLogin}>
          <span>구글로 시작하기</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

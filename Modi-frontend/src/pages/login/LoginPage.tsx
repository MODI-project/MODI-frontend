import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
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

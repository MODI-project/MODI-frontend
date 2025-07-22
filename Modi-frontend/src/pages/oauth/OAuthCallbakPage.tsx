import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      navigate("/signup"); // 추가 정보 입력 페이지로 이동
    } else {
      alert("로그인 실패");
      navigate("/login");
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthCallbackPage;

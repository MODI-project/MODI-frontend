import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLoadUserInfo from "../../apis/UserAPIS/loadUserInfo";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserInfo } = useLoadUserInfo();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // OAuth 콜백 중인지 확인 (code 파라미터 존재)
      const urlParams = new URLSearchParams(location.search);
      const hasCode = urlParams.has("code");

      if (hasCode) {
        // OAuth 콜백 중이면 인증 체크를 건너뛰고 페이지 렌더링 허용
        console.log("OAuth 콜백 감지 - 인증 체크 건너뜀");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      try {
        await fetchUserInfo();
        // 인증 성공
        setIsAuthenticated(true);
      } catch (error: any) {
        // 모든 에러를 로그인 실패로 처리
        console.error("인증 확인 실패:", error);
        setIsAuthenticated(false);
        // 401과 403 모두 로그인 페이지로 리다이렉트
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        로딩 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

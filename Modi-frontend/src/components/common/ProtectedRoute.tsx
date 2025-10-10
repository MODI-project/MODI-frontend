import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoadUserInfo from "../../apis/UserAPIS/loadUserInfo";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { fetchUserInfo } = useLoadUserInfo();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUserInfo();
        // 인증 성공
        setIsAuthenticated(true);
      } catch (error: any) {
        // 모든 에러를 로그인 실패로 처리
        console.error("인증 확인 실패:", error);
        setIsAuthenticated(false);
        // useApi의 interceptor가 401은 자동으로 처리하지만
        // 다른 에러들도 로그인 페이지로 리다이렉트
        if (error.response?.status !== 401) {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

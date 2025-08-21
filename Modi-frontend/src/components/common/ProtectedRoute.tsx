import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { loadUserInfo } from "../../apis/UserAPIS/loadUserInfo";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 백엔드 API 호출로 인증 상태 확인 (HttpOnly 쿠키 자동 전송)
        await loadUserInfo();
        setIsAuthenticated(true);
      } catch (error) {
        // API 호출 실패 시 인증되지 않은 것으로 간주
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  // 인증되지 않은 경우 시작화면으로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;

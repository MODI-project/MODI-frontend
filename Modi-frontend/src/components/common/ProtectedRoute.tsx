import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "16px",
        }}
      >
        로딩 중...
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  // 원래 접근하려던 페이지 정보를 state로 전달
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

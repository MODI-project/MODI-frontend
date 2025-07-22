// src/hooks/useGoogleLogin.ts
import { useCallback } from "react";

export function useGoogleLogin() {
  // 실제로는 window.location.href로 백엔드 인증 URL로 이동
  const loginWithGoogle = useCallback(() => {
    window.location.href = "/api/oauth2/authorize/google";
  }, []);

  return { loginWithGoogle };
}

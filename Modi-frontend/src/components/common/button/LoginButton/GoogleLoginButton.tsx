import React from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import PrimaryButton from "../ButtonBar/PrimaryButton";

export default function GoogleLoginButton() {
  const clientId = "clientID";

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // 로그인 성공 시 처리
      console.log(tokenResponse);
    },
    onError: (error) => {
      // 로그인 실패 시 처리
      console.log("로그인 실패", error);
    },
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <PrimaryButton
        label="구글로 로그인"
        onClick={() => login()}
        selected={true}
        size="primary"
        location="login"
      />
    </GoogleOAuthProvider>
  );
}

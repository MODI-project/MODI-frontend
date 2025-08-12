import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://modidiary.store/api",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN", // ✅ 서버 쿠키 이름
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// 토큰 + FormData 헤더 처리
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // ✅ devToken fallback 제거 권장
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ FormData면 Content-Type 없애서 axios가 boundary 자동생성하도록
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete (config.headers as any)["Content-Type"];
      delete (config.headers as any)["content-type"];
    }
  } else {
    // JSON 보낼 때만 명시 (선택)
    config.headers = config.headers ?? {};
    (config.headers as any)["Content-Type"] = "application/json";
  }

  // 디버그
  console.log(
    "[api req]",
    config.method,
    config.baseURL,
    config.url,
    "Auth?",
    !!token,
    "FD?",
    config.data instanceof FormData
  );
  return config;
});

export default apiClient;

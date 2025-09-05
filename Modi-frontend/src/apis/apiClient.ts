import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: "https://modi-server.store/api",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN", // ✅ 서버 쿠키 이름
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// 토큰 + FormData 헤더 처리
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData && config.headers) {
    delete (config.headers as any)["Content-Type"];
    delete (config.headers as any)["content-type"];
  }
  return config;
});

let isRefreshing = false;

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    const status = error.response?.status;

    // 이미 한 번 재시도했다면 그대로 에러 반환
    if (original?._retry) throw error;

    // 예시: CSRF 토큰 만료(419) 또는 금지(403)일 때 재발급 후 재시도
    if (status === 419 || (status === 403 && !isRefreshing)) {
      try {
        isRefreshing = true;
        // ⬇️ 서버에 맞는 CSRF 재발급 엔드포인트로 변경하세요
        await apiClient.get("/auth/csrf"); // e.g. /auth/csrf or /sanctum/csrf-cookie
        isRefreshing = false;
        original._retry = true;
        return apiClient(original);
      } catch (e) {
        isRefreshing = false;
        throw error;
      }
    }

    // 예시: 세션 만료(401) → 리프레시 시도 후 재요청
    if (status === 401 && !original?._retry) {
      try {
        // ⬇️ 서버에 맞는 리프레시 엔드포인트로 변경하세요
        await apiClient.post("/auth/refresh");
        original._retry = true;
        return apiClient(original);
      } catch {
        // 새로고침 실패 시 로그인 페이지로 보내거나 상태 초기화
        // window.location.href = "/login";
      }
    }

    throw error;
  }
);

export default apiClient;

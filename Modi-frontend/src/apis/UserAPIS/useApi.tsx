import axios, {
  type AxiosResponse,
  HttpStatusCode,
  type InternalAxiosRequestConfig,
} from "axios";
import { useNavigate } from "react-router-dom";

function useApi() {
  const navigate = useNavigate();
  const controller = new AbortController();

  const commonRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    return config;
  };

  const commonResponseInterceptor = (response: AxiosResponse) => {
    return response;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commonErrorInterceptor = (error: any) => {
    return Promise.reject(error);
  };

  // 환경 변수에서 API URL 가져오기 (로컬 개발: http://localhost:8080/api, 프로덕션: https://modi-server.store/api)
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://modi-server.store/api";

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    commonRequestInterceptor,
    commonErrorInterceptor
  );
  api.interceptors.response.use(commonResponseInterceptor, (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      controller.abort();
      alert("로그인이 필요합니다.");
      navigate("/");
    }

    return Promise.reject(error);
  });

  return { api };
}

export default useApi;

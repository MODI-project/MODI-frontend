import axios, {
  type AxiosResponse,
  HttpStatusCode,
  type InternalAxiosRequestConfig,
} from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function useApi() {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const api = axios.create({
    baseURL: "https://modi-server.store/api",
    withCredentials: true,
  });

  api.interceptors.request.use(
    commonRequestInterceptor,
    commonErrorInterceptor
  );
  api.interceptors.response.use(commonResponseInterceptor, (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      controller.abort();
      // AuthContext의 로그아웃 함수 호출하여 상태 동기화
      logout();
      alert("로그인이 필요합니다.");
      navigate("/");
    }

    return Promise.reject(error);
  });

  return { api };
}

export default useApi;

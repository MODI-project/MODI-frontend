import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://modidiary.store/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const devToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzU0MzA2Mzk2LCJleHAiOjE3NTQzMDk5OTZ9.661tf8-IYT-sdsROYaBNhipclyNlBdltInog4YfCdFs";

  const token = localStorage.getItem("accessToken") || devToken; // 로그인 시 저장한 토큰
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ API 요청에 사용된 토큰:", token);
  }

  return config;
});

export default apiClient;

import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://modidiary.store/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

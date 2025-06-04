import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Returns a configured axios instance with interceptor for token refresh
export function getAxiosInstance({
  expire,
  setExpire,
  setToken,
  navigate,
  BASE_URL,
}) {
  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      // Ambil token terbaru dari localStorage
      const latestToken = localStorage.getItem("token");
      if (latestToken) {
        config.headers.Authorization = `Bearer ${latestToken}`;
      }
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`${BASE_URL}/token`, {
          withCredentials: true,
        });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      setToken("");
      localStorage.removeItem("token");
      navigate("/login");
    }
  );
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
}

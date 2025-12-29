import api from "./api";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors: any[];
  success: boolean;
  data?: any;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (value?: any) => void;
}[] = [];

// stores process invokes in between refresh process
const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest: any = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // if a refresh token process invoke again while token is refreshing then it gets reject
    if (originalRequest.url?.includes("/auth/refresh-access-token")) {
      return Promise.reject(error);
    }

    // if any request, response have status code 401 with data TOKEN EXPIRED then
    if (status === 401 && data?.errors?.includes("TOKEN EXPIRED")) {
      // check for already running request
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // check for already running refresh access token request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      //   refresh access token
      //    if token refreshes then it all request processed again from queue
      // else all the requests are get rejected and user logout
      try {
        await api.post("/auth/refresh");
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

function logout() {
  window.location.href = "/login";
}

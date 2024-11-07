import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { envVariables } from "./variables";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const API_BASE_URL =
  envVariables.MODE === "development" ? "" : envVariables.API_BASE_URI;

const AxiosAPIInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000, // Request timeout in milliseconds
  withCredentials: true, // Allow cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

type AxiosInterceptorProps = {
  children: React.ReactNode;
};
const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = AxiosAPIInstance.interceptors.response.use(
      (response) => response,
      // Just return the response if successful
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Check if error is 401 Unauthorized and if request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Implement logic for unauthorized access, like refreshing the token
          try {
            // Attempt to refresh the token
            await AxiosAPIInstance.get(
              `${API_BASE_URL}/api/v1/user/refresh-session`,
              {
                withCredentials: true,
              }
            );

            // Retry the original request after refreshing the token
            return AxiosAPIInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login or handle logout
            console.error("Refresh session failed", refreshError);
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // cleanup
    return () => {
      AxiosAPIInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return <>{children}</>;
};

export { AxiosAPIInstance, AxiosInterceptor };

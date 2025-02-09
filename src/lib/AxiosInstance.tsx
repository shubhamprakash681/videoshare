import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { envVariables } from "./variables";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const API_BASE_URL = envVariables.API_BASE_URI;

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
  const [isRefreshing, setIsRefreshing] = useState(false); // Prevents multiple refresh requests
  const [lastRefreshed, setLastRefreshed] = useState(0); // Last refresh timestamp

  useEffect(() => {
    const responseInterceptor = AxiosAPIInstance.interceptors.response.use(
      (response) => response, // Just return the response if successful
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Check if error is 401 Unauthorized and if request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Check if we should throttle the refresh request
          const now = Date.now();
          const throttleTime = 5000; // Minimum interval in ms before another refresh

          if (isRefreshing || now - lastRefreshed < throttleTime) {
            return Promise.reject(error); // Prevent immediate retry if already refreshing
          }

          originalRequest._retry = true;
          setIsRefreshing(true);

          try {
            // Attempt to refresh the token
            await AxiosAPIInstance.post(
              `${API_BASE_URL}/api/v1/user/refresh-session`
            );
            setLastRefreshed(now); // Update last refreshed timestamp
            setIsRefreshing(false); // Reset refreshing state

            // Retry the original request after refreshing the token
            return AxiosAPIInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login or handle logout
            console.error("Refresh session failed", refreshError);
            navigate("/login");
            setIsRefreshing(false); // Reset refreshing state
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
  }, [navigate, isRefreshing, lastRefreshed]);

  return <>{children}</>;
};

export { AxiosAPIInstance, AxiosInterceptor };

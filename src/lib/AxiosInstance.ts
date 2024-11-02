import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { envVariables } from "./variables";

const AxiosAPIInstance = axios.create({
  baseURL: envVariables.API_BASE_URI, // Replace with your API's base URL
  timeout: 10000, // Request timeout in milliseconds
  withCredentials: true, // Allow cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set cookies in the headers if needed
// AxiosAPIInstance.interceptors.request.use(
//   (config) => {
//     // If your server automatically handles cookies, you don't need to manually add tokens.
//     // Cookies are sent automatically due to `withCredentials: true`.
//     return config;
//   },
//   (error: AxiosError) => {
//     // Handle request errors
//     return Promise.reject(error);
//   }
// );

// AxiosAPIInstance.interceptors.response.use(
//   (response: AxiosResponse) => response, // Just return the response if successful
//   async (error: AxiosError) => {
//     // Handle response errors (e.g., refresh token logic)
//     if (error.response && error.response.status === 401) {
//       // Implement logic for unauthorized access, like refreshing the token
//       try {
//         // Attempt to refresh the token
//         await axios.get(`${envVariables.API_BASE_URI}/user/refresh-session`, {
//           withCredentials: true,
//         });

//         // Retry the original request after refreshing the token
//         return AxiosAPIInstance.request(error.request);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login or handle logout
//         console.error("Refresh token failed", refreshError);
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default AxiosAPIInstance;

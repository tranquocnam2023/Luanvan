// src/infrastructure/api/http.ts (Updated: Use VITE_API_URL; Enhanced error logging to capture more details)
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:44336/api";
console.log('API Base URL:', apiUrl); // Log for debug

export const http = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s timeout
});

// ✅ Request Interceptor — để Axios tự set multipart/form-data khi có FormData
http.interceptors.request.use(
  (config) => {
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      dataType: config.data instanceof FormData ? 'FormData' : typeof config.data,
    });
    if (config.data instanceof FormData) {
      // Xóa header mặc định, để browser tự thêm boundary chính xác
      delete config.headers["Content-Type"];
      config.headers['Accept'] = 'application/json';
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor — chỉ trả về response.data và xử lý lỗi đẹp, with more logging
http.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    if (Array.isArray(response.data)){
      return response;
    }
    return response.data;
  },
  (error) => {
    console.error('Response error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      headers: error.response?.headers,
      data: error.response?.data,
    });
    let message = "Unknown error";
    if (error.response) {
      const status = error.response.status;
      message = error.response.data?.Message || 
                error.response.data?.message || 
                error.response.data?.error ||
                error.response.data?.detail || // For some .NET errors
                `Server error: ${status} ${error.response.statusText}`;
      if (status === 400) {
        message += ` - Check request payload for validation errors.`;
      } else if (status === 401) {
        message = "Unauthorized - Please log in again.";
      } else if (status === 404) {
        message = "Not found - Resource does not exist.";
      } else if (status === 500) {
        message = "Internal server error - Please try again later.";
      }
    } else if (error.request) {
      message = "Network error: Unable to reach the server. Check if backend is running on " + apiUrl;
    } else {
      message = error.message || "Request setup error";
    }
    return Promise.reject(new Error(message));
  }
);

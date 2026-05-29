import axios from 'axios';
import { authStorage } from './authStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.homeorbit.in';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await authStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        // Implement token refresh logic here if applicable
        // const newAccessToken = await refreshAccessToken();
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;

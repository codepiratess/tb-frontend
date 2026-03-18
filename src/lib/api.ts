import axios, { 
  AxiosInstance, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';
import { store } from '@/store';
import { logout, setToken } from '@/store/slices/authSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Authenticated instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public instance (no auth interceptors needed)
export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try Redux first
    let token = store.getState().auth?.accessToken;

    // If no Redux token, try cookie (fallback for SSR or initial load)
    if (!token && typeof document !== 'undefined') {
      const match = document.cookie.match(/townbolt_token=([^;]+)/);
      token = match?.[1] || null;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Api-Version'] = '1.0';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Token Refresh Logic)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle Network Errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    // Handle Server Errors (500+)
    if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    // Handle 401 Unauthorized (Token Refresh)
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = response.data;
        store.dispatch(setToken(accessToken));
        
        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

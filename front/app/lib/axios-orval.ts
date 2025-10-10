import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '4000',
  },
});

apiInstance.interceptors.request.use((config) => {
  const jwt = getCookie('token');
  
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !error.response?.config?.url?.includes('login')) {
      deleteCookie('token');
      deleteCookie('user');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  },
);

// Função customizada para o Orval
export const api = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return apiInstance(config);
};

export default apiInstance;
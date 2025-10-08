import {
  BadRequestGenericResponseDto,
  ForbiddenGenericResponseDto,
  NotFoundGenericResponseDto,
  UnauthorizedGenericResponseDto,
} from '@/app/schemas/model';
import axios, { AxiosError } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '4000',
  },
});

api.interceptors.request.use((config) => {
  const jwt = getCookie('token');

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

export function formatError(
  error: AxiosError<
    | BadRequestGenericResponseDto
    | UnauthorizedGenericResponseDto
    | ForbiddenGenericResponseDto
    | NotFoundGenericResponseDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
  defaultMessage?: string,
) {
  return (error.response?.data.message ||
    (error.cause && typeof error.cause === 'object' && 'message' in error.cause ? error.cause.message : undefined) ||
    error.message ||
    defaultMessage) as string;
}

api.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      deleteCookie('token');
      deleteCookie('user');
      window.location.href = '/auth/login';
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && !error.response?.config?.url?.includes('login')) {
      deleteCookie('token');
      deleteCookie('user');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  },
);

export default api;

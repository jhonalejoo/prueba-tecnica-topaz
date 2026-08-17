import axios, { AxiosRequestConfig } from 'axios';
import { normalizeHttpError } from './errors';

export const API_BASE_URL = 'https://dummyjson.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeHttpError(error)),
);

export const httpClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw normalizeHttpError(error);
    }
  },
};

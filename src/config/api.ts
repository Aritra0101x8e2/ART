import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  LoginResponse, 
  SignupResponse, 
  VerificationResult, 
  GalleryResponse, 
  MediaFile 
} from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('artchain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('artchain_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const postSignup = async (
  username: string, 
  email: string, 
  password: string
): Promise<SignupResponse> => {
  const response: AxiosResponse<ApiResponse<SignupResponse>> = await api.post('/api/auth/signup', {
    username,
    email,
    password,
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Signup failed');
  }
  
  return response.data.data!;
};

export const postLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const response: AxiosResponse<ApiResponse<LoginResponse>> = await api.post('/api/auth/login', {
    email,
    password,
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Login failed');
  }
  
  return response.data.data!;
};

export const postVerify = async (formData: FormData): Promise<VerificationResult> => {
  const response: AxiosResponse<ApiResponse<VerificationResult>> = await api.post('/api/verify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Verification failed');
  }
  
  return response.data.data!;
};

export const saveToBlockchainPlaceholder = async (formData: FormData): Promise<{ transactionHash: string; recordId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        recordId: 'art_' + Math.random().toString(36).substr(2, 9),
      });
    }, 2000);
  });
};

export const getGallery = async (
  page: number = 1,
  limit: number = 12,
  filters: Record<string, string> = {}
): Promise<GalleryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });
  
  const response: AxiosResponse<ApiResponse<GalleryResponse>> = await api.get(`/api/gallery?${params}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch gallery');
  }
  
  return response.data.data!;
};

export const getUserUploads = async (userId: string): Promise<MediaFile[]> => {
  const response: AxiosResponse<ApiResponse<MediaFile[]>> = await api.get(`/api/users/${userId}/uploads`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch user uploads');
  }
  
  return response.data.data!;
};
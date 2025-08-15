import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Create axios instance
export const APIIns: AxiosInstance = axios.create({
  baseURL: 'https://api.echoreads.online/api/v1', // Updated API base URL
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management
let authToken: string | null = null;

export const attachAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    APIIns.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete APIIns.defaults.headers.common['Authorization'];
  }
};

export const attachAuthTokenToAsyncStorage = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    attachAuthToken(token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

// Request interceptor
APIIns.interceptors.request.use(
  (config) => {
    console.log('🔍 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
    });
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with 401 handling
let isRetrying = false;

APIIns.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ API Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !isRetrying) {
      isRetrying = true;
      
      // Clear token and redirect to auth
      attachAuthToken(null);
      await AsyncStorage.removeItem('authToken');
      
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please log in again',
      });
      
      isRetrying = false;
      return Promise.reject(error);
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
      });
    }

    return Promise.reject(error);
  }
);

export default APIIns;
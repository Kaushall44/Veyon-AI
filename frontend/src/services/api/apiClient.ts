import axios from 'axios';

// Base API Client Instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('soa_nexus_auth_token') || 'mock-jwt-token-2026';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Security & Rate Limit Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access request (HTTP 401). Invalid or missing Bearer token.');
    } else if (error.response?.status === 429) {
      console.warn('Rate Limit Exceeded (HTTP 429). Maximum 60 requests per minute allowed.');
    }
    return Promise.reject(error);
  }
);

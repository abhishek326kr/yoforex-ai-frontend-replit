import axios from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle errors
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized access - please login again');
      } else if (error.response.status === 404) {
        console.error('The requested resource was not found');
      } else if (error.response.status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server');
    } else {
      // Something happened in setting up the request
      console.error('Error', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

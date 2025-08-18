// Centralized API configuration
// Handles environment-based URL configuration for development and production

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  // In development, always use localhost:8000
  if (isDevelopment) {
    return 'http://localhost:8000';
  }
  
  // In production, use environment variable or fallback
  if (isProduction) {
    const prodUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
    if (!prodUrl) {
      console.warn('VITE_API_BASE_URL not set in production environment');
      return 'http://localhost:8000'; // Fallback for safety
    }
    return prodUrl;
  }
  
  // Default fallback
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// Export configuration object for easier testing and debugging
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 60000,
  retries: 3,
  isDevelopment,
  isProduction,
};

// Log current configuration in development
if (isDevelopment) {
  console.log('API Configuration:', apiConfig);
}

// Centralized API configuration
// Handles environment-based URL configuration for development and production

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  // In development, always use localhost:8000
  if (isDevelopment) {
<<<<<<< HEAD
    return 'https://backend.axiontrust.com';
=======
    return 'http://localhost:8000';
>>>>>>> cdeaa4e (aaj to phaad hi denge)
  }
  
  // In production, use environment variable or fallback
  if (isProduction) {
    const prodUrl =
      // Prefer VITE_API_BASE_URL (matches .env.example), fallback to VITE_PUBLIC_API_BASE_URL
      import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_PUBLIC_API_BASE_URL;
    if (!prodUrl) {
      console.warn('API base URL not set. Please define VITE_API_BASE_URL (preferred) or VITE_PUBLIC_API_BASE_URL in your environment. Falling back to https://backend.axiontrust.com');
      return 'https://backend.axiontrust.com'; // Fallback for safety
    }
    return prodUrl as string;
  }
  
  // Default fallback
<<<<<<< HEAD
  return 'https://backend.axiontrust.com';
=======
  return 'http://localhost:8000';
>>>>>>> cdeaa4e (aaj to phaad hi denge)
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

// Centralized API configuration
<<<<<<< HEAD
// Single source of truth: VITE_PUBLIC_API_BASE_URL from frontend/.env
// No dev/prod branching; you control the backend by setting this one variable.

const PUBLIC_BASE = (import.meta.env.VITE_PUBLIC_API_BASE_URL as string | undefined)?.trim();

const getApiBaseUrl = (): string => {
  if (PUBLIC_BASE && PUBLIC_BASE.length > 0) return PUBLIC_BASE;
  console.warn(
    'VITE_PUBLIC_API_BASE_URL not set. Falling back to http://localhost:8000. Set it in frontend/.env to remove this warning.'
  );
=======
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
    const prodUrl =
      // Prefer VITE_API_BASE_URL (matches .env.example), fallback to VITE_PUBLIC_API_BASE_URL
      import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_PUBLIC_API_BASE_URL;
    if (!prodUrl) {
      console.warn('API base URL not set. Please define VITE_API_BASE_URL (preferred) or VITE_PUBLIC_API_BASE_URL in your environment. Falling back to http://localhost:8000');
      return 'http://localhost:8000'; // Fallback for safety
    }
    return prodUrl as string;
  }
  
  // Default fallback
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

<<<<<<< HEAD
=======
// Export configuration object for easier testing and debugging
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 60000,
  retries: 3,
<<<<<<< HEAD
};

// Always log in development tools for quick visibility
// console.log('API Configuration:', apiConfig);
=======
  isDevelopment,
  isProduction,
};

// Log current configuration in development
if (isDevelopment) {
  console.log('API Configuration:', apiConfig);
}
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2

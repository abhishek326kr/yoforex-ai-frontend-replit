// Centralized API configuration
// Handles environment-based URL configuration for development and production

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const mode = import.meta.env.MODE;

// Optional explicit toggle to force target backend in any mode
// Set VITE_API_TARGET=dev or prod in .env to override Vite's DEV/PROD flags
const target = (import.meta.env.VITE_API_TARGET as string | undefined)?.toLowerCase();

// Prefer explicit environment variables in any mode
const envBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_PUBLIC_API_BASE_URL as string | undefined);

// Optional explicit URLs per target
const devEnvUrl =
  (import.meta.env.VITE_API_BASE_URL_DEV as string | undefined) || 'http://localhost:8000';
const prodEnvUrl =
  (import.meta.env.VITE_API_BASE_URL_PROD as string | undefined) || envBaseUrl;

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  // 0) If an explicit target is provided, use it first
  if (target === 'prod' || target === 'production') {
    if (prodEnvUrl && prodEnvUrl.trim().length > 0) return prodEnvUrl;
    console.warn(
      'VITE_API_TARGET=prod set but no production URL provided. Define VITE_API_BASE_URL or VITE_API_BASE_URL_PROD. Falling back to https://backend.axiontrust.com'
    );
    return 'https://backend.axiontrust.com';
  }
  if (target === 'dev' || target === 'development') {
    return devEnvUrl;
  }

  // 1) If explicitly provided, always honor env variable (dev or prod)
  if (envBaseUrl && envBaseUrl.trim().length > 0) {
    return envBaseUrl;
  }

  // 2) In development, default to localhost when no env var
  if (isDevelopment) {
    return devEnvUrl;
  }

  // 3) Safe production fallback
  if (prodEnvUrl && prodEnvUrl.trim().length > 0) return prodEnvUrl;
  console.warn(
    'API base URL not set. Define VITE_API_BASE_URL (preferred), VITE_PUBLIC_API_BASE_URL, or VITE_API_BASE_URL_PROD. Falling back to https://backend.axiontrust.com'
  );
  return 'https://backend.axiontrust.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Export configuration object for easier testing and debugging
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 60000,
  retries: 3,
  isDevelopment,
  isProduction,
  mode,
  envBaseUrl,
  devEnvUrl,
  prodEnvUrl,
  target,
};

// Log current configuration in development
if (isDevelopment) {
  console.log('API Configuration:', apiConfig);
}

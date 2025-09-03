// Centralized API configuration
// Single source of truth: VITE_PUBLIC_API_BASE_URL from frontend/.env
// No dev/prod branching; you control the backend by setting this one variable.

const PUBLIC_BASE = (import.meta.env.VITE_PUBLIC_API_BASE_URL as string | undefined)?.trim();

const getApiBaseUrl = (): string => {
  if (PUBLIC_BASE && PUBLIC_BASE.length > 0) return PUBLIC_BASE;
  console.warn(
    'VITE_PUBLIC_API_BASE_URL not set. Falling back to http://localhost:8000. Set it in frontend/.env to remove this warning.'
  );
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 60000,
  retries: 3,
};

// Always log in development tools for quick visibility
console.log('API Configuration:', apiConfig);

// Normalize Cashfree environment across the frontend
// Set VITE_CASHFREE_ENV in your .env to 'sandbox' or 'production'
const RAW = (import.meta.env.VITE_CASHFREE_ENV as string | undefined) || '';
const NORM = RAW.trim().toLowerCase();

export const CASHFREE_MODE: 'sandbox' | 'production' =
  NORM === 'prod' || NORM === 'production' ? 'production' : 'sandbox';

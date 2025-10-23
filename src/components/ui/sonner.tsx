// This component is deprecated in favor of react-toastify
// The ToastContainer from react-toastify is now used in App.tsx
// This file is kept for backward compatibility but should not be used

export function Toaster() {
  // This component is no longer used - react-toastify ToastContainer is used instead
  return null;
}

// Deprecated toast function - use the one from @/hooks/use-toast instead
export const toast = () => {
  console.warn('Sonner toast is deprecated. Use toast from @/hooks/use-toast instead.');
};

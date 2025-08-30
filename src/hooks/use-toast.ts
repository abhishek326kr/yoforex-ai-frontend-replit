import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toast = (options: ToastOptions) => {
  const message = options.title || options.description || '';
  
  if (options.variant === 'destructive') {
    return toastify.error(message);
  }
  
  return toastify.success(message);
};

// Add methods to the toast function
toast.success = (options: ToastOptions) => {
  const message = options.title || options.description || '';
  return toastify.success(message);
};

toast.error = (options: ToastOptions) => {
  const message = options.title || options.description || '';
  return toastify.error(message);
};

toast.info = (options: ToastOptions) => {
  const message = options.title || options.description || '';
  return toastify.info(message);
};

toast.warning = (options: ToastOptions) => {
  const message = options.title || options.description || '';
  return toastify.warning(message);
};

const useToast = () => {
  return {
    toast,
    dismiss: toastify.dismiss,
  };
};

export { useToast, toast };

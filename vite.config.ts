import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base configuration
const baseConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    'process.env': {}
  },
};

// Proxy configuration for development
const devProxy = {
  '/api': {
    target: process.env.NODE_ENV === 'production' ? 'https://backend.axiontrust.com' : 'http://localhost:8000',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  },
  '/auth': {
    target: process.env.NODE_ENV === 'production' ? 'https://backend.axiontrust.com' : 'http://localhost:8000',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/auth/, '')
  },
  '/prices': {
    target: process.env.NODE_ENV === 'production' ? 'https://backend.axiontrust.com' : 'http://localhost:8000',
    changeOrigin: true,
    secure: true
  },
  '/analysis': {
    target: process.env.NODE_ENV === 'production' ? 'https://backend.axiontrust.com' : 'http://localhost:8000',
    changeOrigin: true,
    secure: true
  }
};

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  // Base URL for API requests - use env variable or default to backend.axiontrust.com
  const apiBaseUrl = env.VITE_PUBLIC_API_BASE_URL || 'https://backend.axiontrust.com';
  
  // Production configuration
  if (isProduction) {
    return {
      ...baseConfig,
      define: {
        'process.env': {
          VITE_PUBLIC_API_BASE_URL: JSON.stringify(apiBaseUrl)
        }
      },
      build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
      },
      server: {
        proxy: devProxy,
        cors: {
          origin: [
            'https://app.yoforex.co.in',
            'https://yoforex-ai.vercel.app',
            'https://backend.axiontrust.com'
          ],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials'],
          credentials: true
        }
      }
    };
  }

  // Development configuration
  return {
    ...baseConfig,
    define: {
      'process.env': {
        VITE_PUBLIC_API_BASE_URL: JSON.stringify('/api')
      }
    },
    server: {
      proxy: devProxy,
      cors: true
    },
    preview: {
      proxy: devProxy,
      cors: true
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
  };
});
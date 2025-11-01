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
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
};

// Proxy configuration for development
const devProxy = {
  '/api': {
    target: 'https://backend.axiontrust.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.replace(/^\/api/, '')
  },
  '/prices': {
    target: 'https://backend.axiontrust.com',
    changeOrigin: true,
    secure: true
  },
  '/analysis': {
    target: 'https://backend.axiontrust.com',
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
  
  // Base URL for the application
  const base = isProduction ? '/' : '/';
  
  // Production configuration
  if (isProduction) {
    return {
      ...baseConfig,
      base: base,
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
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
            }
          }
        }
      },
      server: {
        host: '0.0.0.0',
        port: 5000,
        strictPort: true,
        proxy: {
          '/api': {
            target: apiBaseUrl,
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          '/prices': {
            target: apiBaseUrl,
            changeOrigin: true,
            secure: true
          },
          '/analysis': {
            target: apiBaseUrl,
            changeOrigin: true,
            secure: true
          }
        },
        cors: {
          origin: [
            'https://app.yoforex.co.in',
            'https://yoforex-ai.vercel.app',
            'https://backend.axiontrust.com',
          ],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Allow-Origin'
          ],
          credentials: true,
          maxAge: 86400
        }
      },
      preview: {
        host: '0.0.0.0',
        port: 5000,
        strictPort: true,
        cors: {
          origin: true,
          credentials: true
        }
      }
    };
  }

  // Development configuration
  return {
    ...baseConfig,
    base: base,
    define: {
      'process.env': {
        VITE_PUBLIC_API_BASE_URL: JSON.stringify('/api')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      strictPort: true,
      proxy: devProxy,
      open: false,
      historyApiFallback: {
        disableDotRule: true,
        index: '/',
      }
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
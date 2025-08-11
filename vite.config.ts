import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      'process.env': env,
    },
    server: {
      proxy: {
        '/auth': {
          target: env.VITE_PUBLIC_API_BASE_URL || 'https://backend.axiontrust.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/auth/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
          },
        },
        '/prices': {
          target: env.VITE_PUBLIC_API_BASE_URL || 'https://backend.axiontrust.com',
          changeOrigin: true,
          secure: true,
        },
        '/api': {
          target: env.VITE_PUBLIC_API_BASE_URL || 'https://backend.axiontrust.com',
          changeOrigin: true,
          secure: true,
        },
      },
      cors: {
        origin: ['https://app.yoforex.co.in', 'https://backend.axiontrust.com', 'https://yoforex-ai.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers'],
        credentials: true,
      },
    },
    // For production build
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
  };
});
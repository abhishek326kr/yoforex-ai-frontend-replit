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
          secure: false,
        },
        '/prices': {
          target: env.VITE_PUBLIC_API_BASE_URL || 'https://backend.axiontrust.com',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: env.VITE_PUBLIC_API_BASE_URL || 'https://backend.axiontrust.com',
          changeOrigin: true,
          secure: false,
        },
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
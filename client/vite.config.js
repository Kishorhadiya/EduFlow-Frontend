import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let apiUrl = env.VITE_API_URL || process.env.VITE_API_URL;
  
  if (!apiUrl || apiUrl === 'undefined') {
    apiUrl = mode === 'production' 
      ? 'https://eduflow-backend.onrender.com/api' 
      : 'http://localhost:5000/api';
  }

  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl)
    },
    build: {
      // Increase warning threshold to avoid noise (953KB is a warning, not an error)
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Code split vendors to improve load times and caching
          manualChunks: {
            // React core
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // Charts library (largest dependency)
            'recharts-vendor': ['recharts'],
            // UI libraries
            'ui-vendor': ['lucide-react', 'sweetalert2'],
          }
        }
      }
    }
  };
})

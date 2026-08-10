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
    }
  };
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL !== 'undefined' && process.env.VITE_API_URL ? process.env.VITE_API_URL : 'https://eduflow-backend.onrender.com/api')
  }
})

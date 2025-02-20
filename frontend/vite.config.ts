import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://chat-web-app-e8q5.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
})

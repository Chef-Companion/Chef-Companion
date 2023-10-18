import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://backend:8000'
    },
    host: '0.0.0.0',
    hmr: {
      clientPort: 3000
    },
    port: 3000,
    watch: {
      usePolling: true
    }
  }
})

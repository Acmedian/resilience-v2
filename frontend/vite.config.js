import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('recharts')) return 'charts'
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react')) return 'vendor'
          }
        }
      }
    }
  }
})

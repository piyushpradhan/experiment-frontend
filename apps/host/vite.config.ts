import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          messaging: ['../messaging/src/App.tsx'],
          collaboration: ['../collaboration/src/index.tsx'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@messaging': path.resolve(__dirname, '../messaging/src'),
      '@collaboration': path.resolve(__dirname, '../collaboration/src'),
    },
  },
})

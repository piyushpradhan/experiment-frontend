import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@messaging': path.resolve(__dirname, '../messaging/src'),
      '@collaboration': path.resolve(__dirname, '../collaboration/src'),
    },
  },
})

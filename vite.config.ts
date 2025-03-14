import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: false,
    open: true,
    cors: true
  },
  preview: {
    port: 4000,
    host: true
  },
  base: process.env.NODE_ENV === 'production' ? '/surveyor-management/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 
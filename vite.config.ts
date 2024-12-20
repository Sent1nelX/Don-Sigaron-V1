import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:10000',  // Перенаправляем на сервер Node.js
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/media': {
        target: 'http://localhost:10000',  // Тоже перенаправляем на сервер Node.js
        changeOrigin: true,
        secure: false,
      }
    }
  }
});

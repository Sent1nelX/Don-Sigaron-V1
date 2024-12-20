import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:10000',  // Сервер Node.js должен быть здесь
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api') // если путь должен оставаться таким же
      },
      '/media': {
        target: 'http://localhost:10000',  // Тот же сервер для медиа
        changeOrigin: true,
        secure: false
      }
    }
  }
});

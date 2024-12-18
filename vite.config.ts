import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // proxy: {
    //   // Прокси для запросов на API
    //   '/api': {
    //     target: 'http://localhost:4000',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, '/api')
    //   },
    //   // Прокси для запросов на медиафайлы
    //   '/media': {
    //     target: 'http://localhost:4000',
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  }
});

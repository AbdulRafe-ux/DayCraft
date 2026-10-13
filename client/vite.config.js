import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, requests to /api are forwarded to the Express server,
// so the browser sees one address (http://localhost:5173) and cookies just work.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true },
    },
  },
});

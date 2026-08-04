import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7002,
    strictPort: true,
    host: true,
    allowedHosts: ['hospitals.docapp.co.in', 'localhost', '127.0.0.1'],
    hmr: {
      host: 'localhost',
      port: 7002,
      protocol: 'ws'
    }
  }
});
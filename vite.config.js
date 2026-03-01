import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    allowedHosts: ['3000-i6n62s9mro7avqw9wqgrs-cc6e246c.us1.manus.computer', 'localhost', '127.0.0.1']
  }
});

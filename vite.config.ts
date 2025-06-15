import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gvc-browser/',
  server: {
    port: 5173
  }
}); 
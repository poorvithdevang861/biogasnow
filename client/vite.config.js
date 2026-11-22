import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Base URL for GitHub Pages (https://poorvithdevang861.github.io/biogasnow/)
const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.VITE_BASE_PATH || (isProd ? '/biogasnow/' : '/');

export default defineConfig({
  base: basePath,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

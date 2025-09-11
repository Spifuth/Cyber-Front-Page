import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => ({
  plugins: [react({ include: '**/*.{jsx,js,tsx,ts}' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HOT_RELOAD === 'true' ? false : undefined,
  },
}));

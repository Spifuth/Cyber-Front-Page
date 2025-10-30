import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react({ include: '**/*.{jsx,js,tsx,ts}' })],
  server: {
    hmr: process.env.DISABLE_HOT_RELOAD === 'true' ? false : undefined,
  },
}));

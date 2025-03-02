import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['./src/**/*.{test,spec}.tsx'],
    exclude: [
      '**/.husky/**',
      '**/.vscode/**',
      '**/.git/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/public/**',
      '**/public/**',
      '**/hooks/**',
      '**/components/**',
      '**/lib/**',
      '**/locales/**',
      '**/mocks/**',
      '**/routes/**',
      '**/test/**',
      '**/types/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

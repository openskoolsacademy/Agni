import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, '../backend/public'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/embed.ts'),
      name: 'ChatbotWidget',
      formats: ['iife'],
      fileName: () => 'chatbot.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    minify: 'esbuild',
  },
});

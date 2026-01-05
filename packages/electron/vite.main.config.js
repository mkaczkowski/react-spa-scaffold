import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.vite/build',
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron'],
    },
    minify: false,
    sourcemap: true,
  },
  resolve: {
    conditions: ['node'],
  },
});

import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  server: {
    port: 8080
  },
  test: {
    include: ['test/**/*.test.js', 'test/**/*.spec.js']
  }
});

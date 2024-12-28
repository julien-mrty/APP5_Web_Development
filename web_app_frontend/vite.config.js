import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'phaser': fileURLToPath(new URL('./node_modules/phaser/dist/phaser.js', import.meta.url)), // Corrige l'alias // Addition of Phaser.js to run
    },
  },
  optimizeDeps: {
    include: ['phaser'],
  },
})

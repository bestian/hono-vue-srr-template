import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  publicDir: 'public',
  plugins: [
    cloudflare(),
    vue(),
  ],
})

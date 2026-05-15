import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
})

import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function manualChunk(id) {
  if (!id.includes('node_modules')) return undefined
  if (id.includes('element-ui')) return 'element-ui'
  if (/node_modules[/\\]vue-router[/\\]/.test(id)) return 'vue-vendor'
  if (/node_modules[/\\]vuex[/\\]/.test(id)) return 'vue-vendor'
  if (/node_modules[/\\]vue[/\\]/.test(id)) return 'vue-vendor'
  if (id.includes('axios')) return 'axios'
  return 'vendor'
}

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
  build: {
    // 目标适度提高可减少转译体积（按需调整）
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: manualChunk,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 900,
  },
})

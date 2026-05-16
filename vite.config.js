import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function manualChunk(id) {
  if (!id.includes('node_modules')) return undefined
  // element-ui 每个 lib/*.js 都是独立 webpack 打包体；强行合并到同一 chunk 会在生产包中产生
  // TDZ 报错（如 Cannot access 'X' before initialization）。不指定 chunk，让其跟随入口同步打包。
  if (id.includes('element-ui')) return undefined
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

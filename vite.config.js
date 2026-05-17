import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import * as path from 'path'

const analyze = process.env.ANALYZE === 'true'

export default defineConfig({
  plugins: [
    react(),
    analyze &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  base: '/find-player-game',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      shared: path.resolve(__dirname, './shared'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // react·recoil·styled-components 간 순환 청크를 피하기 위해 query만 분리합니다.
          if (id.includes('@tanstack')) return 'vendor-query'
        },
      },
    },
  },
})

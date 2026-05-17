import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import * as path from 'path'

export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE === 'true' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  base: '/find-player-game',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      shared: path.resolve(__dirname, './shared'),
    },
  },
})

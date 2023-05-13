import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: '动漫下载',
        short_name: '动漫下载',
        description: 'Anime Download',
        theme_color: '#FF618E',
        icons: [
          {
            src: 'icon.png',
            sizes: '256x256',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    host:'0.0.0.0',
    proxy: {
      '/jsonrpc': {
        target: 'http://aria2.tckxjzc.online',
        changeOrigin:true,
      },
      '/api': {
        target: 'http://127.0.0.1:3006',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/test': {
        target: 'http://localhost:9600',
        changeOrigin:true,
      },
    }
  }
})

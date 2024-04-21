import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import path from "path";
import {fileURLToPath} from "url";

export default defineConfig({
  plugins: [vue(), ElementPlus({ useSource: true })],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src")
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/variables.scss" as *;`,
      }
    }
  },
  define: {
    __BUILD_TIME__: Date.now()
  }
})

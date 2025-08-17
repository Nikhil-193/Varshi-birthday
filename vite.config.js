import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        birthday: 'Bujji-birthday-wishes.html',
        love: 'love/index.html'
      }
    }
  }
})
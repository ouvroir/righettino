import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: "/righettino/",
    build: {
        rollupOptions: {
            input: {
                main: resolve('./', 'index.html'),
                nested: resolve('./app/', 'index.html')
            }
        }
    }
})
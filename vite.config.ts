import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: 'https://github.com/ouvroir/righettino/',
    build: {
        rollupOptions: {
            input: {
                main: resolve('/', 'index.html'),
                nested: resolve('/', 'app.html')
            }
        }
    }
})
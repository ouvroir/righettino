import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig((command, mode) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('app is in', env.NODE_ENV, 'mode')
  console.log(env)

  if (env.NODE_ENV === 'production')
    return {
      base: '/righettino/',
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            nested: resolve(__dirname, 'app/index.html'),
          },

          //removes files from build
          external: /external/,
        },
      },
    }
  else
    return {
      base: '/',
    }
})

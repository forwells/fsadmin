import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import process from 'node:process'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  
  
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env.VITE_PORT);
  return {
    server: {
      host: '127.0.0.1',
      port: env.VITE_PORT
    },
    plugins: [
      svgr({
        svgrOptions: { icon: true }
      }),
      react(),
    ],
  }
})

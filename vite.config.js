import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true, // Expose to local network (Mobile testing ke liye zaroori)
    port: 5173
  }
})

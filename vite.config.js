import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // older iOS Safari (pre 16.4, e.g. iPhone X) can't read media range syntax like (width<=899px)
  build: { cssTarget: ['safari14'] },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 5173,
      overlay: false, // Disable error overlay
    },
  },
  logLevel: 'silent', // Suppress all Vite logs
  customLogger: {
    info: () => {},
    warn: () => {},
    warnOnce: () => {},
    error: () => {},
    clearScreen: () => {},
    hasErrorLogged: () => false,
    hasWarned: false,
  },
})


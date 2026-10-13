import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,    // 👈 8000번 포트로 변경
    host: true     // 👈 외부 IP 및 네트워크 접근 허용
  }
})
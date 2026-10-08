import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1001,     // 1번 목표: 1001 포트 고정
    host: true      // 2번 목표: 외부 IP/네트워크 접근 허용
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for GNG Redesign v2
// - React 19 + TypeScript
// - 정적 자산(logo.png, hero_dashboard.png, about_tech.png)은 public/ 에서 서빙
//   (기존 publicDir 'dist'는 옛 빌드 산출물 index.html·JS가 빌드에 섞여 들어가 표준 public/으로 이전)
export default defineConfig({
  // 상대 base: GitHub Pages 하위 경로(/GNG_Homepage/) 등 어디에 올려도 동작
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});

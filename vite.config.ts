import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for GNG Homepage
// - React 19 + TypeScript + Tailwind(PostCSS 빌드)
// - 정적 자산(logo.png, 배경 영상·poster, campus_map.webp, og-image.png, robots/sitemap)은 public/ 에서 서빙
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
    sourcemap: false, // 운영 배포물에 1.1MB map 미포함 (디버깅 필요 시 true)
  },
});

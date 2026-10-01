# GNG Homepage — 실행·배포 가이드

> React 19 + TypeScript + Vite + Tailwind CSS(PostCSS 빌드).
> `.tsx`는 브라우저가 직접 실행할 수 없으므로 **반드시 Vite로** 실행합니다. `file://`이나 단순 정적 서버로는 동작하지 않습니다.

---

## 실행

```cmd
cd D:\DEV_2026\GNG_Homepage_rev_260511\GNG_Homepage_rev_260510\redesigned
npm install
npm run dev
```

`npm run dev` 후 `http://localhost:5173` 에서 확인합니다. (`start_server.bat`도 같은 동작)

| 명령 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 (핫 리로드) |
| `npm run build` | `tsc` 타입 검사 + 프로덕션 빌드 → `build/` |
| `npm run preview` | 빌드 결과 미리보기 (배포 전 최종 확인은 이 방식으로) |

Node.js 18 이상 필요. `npm install` 에러 시 `node --version` 확인 → `npm cache clean --force` → 재시도.

---

## 배포

| 대상 | 설정 | 트리거 |
|---|---|---|
| **gngss.co.kr (공식)** | `netlify.toml` — `npm run build`, publish `build` | Netlify에 연결된 브랜치 push |
| GitHub Pages (검토용) | `.github/workflows/deploy.yml` | `main` push |

- 두 대상 모두 같은 `build/` 산출물을 쓰며 `vite.config.ts`의 `base: './'` 덕분에 루트·하위 경로 어디서나 동작합니다.
- 대표 URL은 `https://gngss.co.kr/` (`index.html`의 canonical). GitHub Pages 주소는 검색 색인 대상이 아니므로 외부에 공유하지 않습니다.
- 배포 후 확인: 첫 화면 헤드라인 표시, `/#contact` 직접 진입, `/#product-sson` 모달 오픈, 모바일에서 영상이 화면에 보일 때만 재생.

---

## 폴더 구조

```
redesigned/
├── index.html             ← 진입점 (메타·JSON-LD·스크롤 복원·reveal 옵저버)
├── index.tsx              ← React 마운트 + index.css import
├── index.css              ← Tailwind 지시문 + 커스텀 유틸리티(.reveal, .word-reveal, .ticker …)
├── tailwind.config.js     ← 디자인 토큰·keyframes
├── postcss.config.js
├── App.tsx                ← 섹션 순서
├── types.ts
├── components/
│   ├── Navbar / Hero / About / WhyGNG / Company / Process / Platforms / Spotlight / CTABand / Contact / Footer
│   ├── BackgroundVideo.tsx    ← 배경 영상 공용 (모션 감소·가시성 기반 재생)
│   ├── CampusMap.tsx          ← 제품 적용 영역 개념도
│   ├── PlatformModal.tsx / LegalModal.tsx
├── public/                ← logo.png, hero_bg.mp4(+poster), about_bg.mp4(+poster), campus_map.webp, og-image.png, robots.txt, sitemap.xml
├── IMPROVEMENT_PLAN.md    ← 2026-10 개선 기획안 (적용 이력 포함)
└── REDESIGN_NOTES.md      ← 2026-05 리디자인 v2 변경 노트 (이력)
```

---

## 화면이 안 나올 때

1. `file://`이 아닌 `http://localhost:5173`으로 접속
2. `npm install` 완료 확인
3. 개발자 도구 Console의 에러 메시지 확인
4. 강제 새로고침 (Ctrl + Shift + R)

원본 사이트 비교용 소스: `D:\DEV_2026\GNG_Homepage_rev_260511\GNG_Homepage_rev_260510\original_site\gng_homepage_251202\`

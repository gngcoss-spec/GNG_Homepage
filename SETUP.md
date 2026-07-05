# GNG Redesign — 실행 가이드

> 화면이 까맣게 보이는 이유: React + TypeScript(.tsx) 프로젝트는 브라우저가 직접 실행할 수 없고
> **빌드 도구(Vite)가 TSX를 JS로 변환해야** 합니다.
> file:// 로 열거나 단순 정적 서버로는 동작하지 않습니다.

---

## 가장 빠른 실행 방법 (권장)

Node.js가 설치되어 있다면 (없으면 https://nodejs.org 에서 LTS 설치):

```cmd
cd D:\DEV_2026\GNG_Homepage_rev_260511\GNG_Homepage_rev_260510\redesigned
npm install
npm run dev
```

`npm run dev` 실행 후 자동으로 브라우저가 열리고 `http://localhost:5173` 에서 동작합니다.
첫 실행 시 `npm install`은 1~3분 정도 걸립니다.

---

## 만약 npm install에서 에러가 난다면

1. **Node.js 버전 확인**: `node --version` 결과가 v18 이상이어야 합니다.
2. **레지스트리 캐시 정리**: `npm cache clean --force`
3. **재시도**: `npm install`

---

## 개발 중 주요 명령어

| 명령 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 (핫 리로드 포함) |
| `npm run build` | 프로덕션 빌드 → `build/` 폴더 |
| `npm run preview` | 빌드된 결과 미리보기 |

---

## 폴더 구조

```
redesigned/
├── package.json          ← npm 의존성
├── vite.config.ts        ← Vite 설정
├── tsconfig.json         ← TypeScript 설정
├── index.html            ← 진입점
├── index.tsx             ← React 마운트
├── index.css             ← 글로벌 CSS
├── App.tsx               ← 루트 컴포넌트
├── types.ts              ← 타입 정의
│
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx           ← 3D 디지털트윈 + 카운트업 + HUD
│   ├── About.tsx          ← 스크롤 리빌 + 카드 틸트
│   ├── Platforms.tsx      ← 3개 플랫폼 카드 (SSiN/SSoN/SSAx)
│   ├── PlatformModal.tsx  ← 플랫폼 상세 모달
│   ├── Process.tsx        ← 4단계 진행도 라인
│   ├── Contact.tsx        ← EmailJS 폼
│   ├── Footer.tsx         ← 라이브 시계
│   ├── LegalModal.tsx     ← 약관/정책 모달
│   └── DigitalTwinScene.tsx  ← Three.js 3D 씬
│
├── logo.png               ← 로고
├── hero_dashboard.png     ← Hero 우측 이미지
├── about_tech.png         ← About 좌측 이미지
│
└── dist/                  ← 원본 빌드 결과 (참고용)
```

---

## 화면이 안 나올 때 체크리스트

1. ✅ file:// 로 열지 말고 반드시 `http://localhost:5173` 으로 접속
2. ✅ `npm install` 완료되었는지 확인
3. ✅ 개발자 도구 Console 탭에서 빨간 에러 메시지 확인
4. ✅ 브라우저 캐시 강제 새로고침 (Ctrl + Shift + R)

---

## 기존 dist/ 폴더로 원본 사이트 확인하기

원본 빌드 결과(`dist/index.html` + `dist/assets/index-Dyuz3w4j.js`)는 그대로 보존되어 있습니다.
원본을 비교 확인하고 싶으시다면 아래 경로에 원본 풀 사이트가 있습니다:

```
D:\DEV_2026\GNG_Homepage_rev_260511\GNG_Homepage_rev_260510\original_site\gng_homepage_251202\
```

---

*문제가 계속되면 Console에 표시된 정확한 에러 메시지를 알려주세요.*

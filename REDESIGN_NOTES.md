# GNG Homepage Redesign v2 — 변경 사항 노트

> 작성일: 2026-05-12
> 원본: `original_site/gng_homepage_251202/`
> 작업본: `redesigned/`
> 컨셉: **"Digital Twin × Mission Control"** — 3D 공간 위에 데이터가 흐르고 AI가 분석하는 인터랙션을 추가

---

## 1. 핵심 원칙 — 콘텐츠 100% 보존

리뉴얼 작업의 모든 변경은 **인터랙션·시각 레이어** 추가에 집중했고,
원본의 **모든 카피 / 메뉴 / 플랫폼 데이터 / 회사 정보 / 약관**은 1:1로 보존했습니다.

### 보존 검증 완료 항목 (38개)
- 메뉴 라벨, CTA 텍스트, Hero/About/Process/Contact 모든 카피
- 3개 플랫폼(SSiN/SSoN/SSAx)의 모든 feature/items/valueProp 텍스트
- 회사 주소(세종특별자치시 한누리대로 1824, 606-74호), 사업자번호(681-86-03173), 대표이사(박웅철), 이메일
- 개인정보처리방침 / 이용약관 모달 콘텐츠
- EmailJS 설정값 (`service_myccx8i`, `template_vt9hwe1`, public key)

---

## 2. 신규 추가 컴포넌트 / 파일

| 파일 | 용도 |
|---|---|
| `components/DigitalTwinScene.tsx` | Three.js 기반 3D 디지털트윈 빌딩 + 데이터 노드 + AI 스캔 시각화 |
| `types.ts` | 누락되어 있던 `TechItem` / `PlatformItem` 인터페이스 재구성 |
| `REDESIGN_NOTES.md` | 본 문서 |

---

## 3. 컴포넌트별 변경 요약

### 3.1 `index.html`
- Tailwind config에 신규 토큰 추가
  - `colors.signal.{green,amber,red}` (관제 시그널 컬러)
  - `backgroundImage.tech-grid`, `scan-line`
  - `animation.{fade-in-up, reveal-word, scan-vertical, gradient-shift, shimmer}`
  - 대응 keyframes 추가
- importmap에 `three`, `@emailjs/browser` 추가
- 글로벌 CSS 유틸리티 추가
  - `.scroll-progress` (상단 진행도 바)
  - `.reveal` 클래스 (스크롤 트리거 페이드업)
  - `.word-reveal`, `.tilt-card`, `.grad-anim`, `.hud-corner`, `.scan-overlay`, `.live-dot`, `.ticker`
  - `prefers-reduced-motion` 대응
- IntersectionObserver + MutationObserver 기반 글로벌 reveal 트리거 스크립트

### 3.2 `components/Navbar.tsx`
- 추가: scroll-spy로 활성 섹션 추적 → 메뉴 아래 그라데이션 underline
- 추가: 우측 상단 "SYSTEM ONLINE" 라이브 인디케이터
- 보존: 로고, 4개 메뉴, 모바일 햄버거, 문의하기 CTA

### 3.3 `components/Hero.tsx`
- 추가: 배경에 `<DigitalTwinScene>` 마운트 (opacity 60%, pointer-events 차단)
- 추가: 우측 상단 시스템 티커 (NODES 카운트업, UTC 시계)
- 추가: 헤드라인 단어별 리빌(`word-reveal`), 그라데이션 텍스트(`grad-anim`)
- 추가: 대시보드 카드 마우스 따라가는 3D 틸트
- 추가: 대시보드 좌상단 "LIVE · DIGITAL TWIN OPS" 라벨, 우상단 ID
- 추가: Active Sensors 숫자 1,248까지 카운트업 애니메이션
- 추가: 카드 4코너 HUD 마커
- 보존: 모든 카피, 3 features, CTA 링크/텍스트, hero_dashboard.png

### 3.4 `components/About.tsx`
- 추가: 섹션 배경 `bg-tech-grid` 그리드
- 추가: 이미지 카드에 HUD 코너 + tilt-card 클래스
- 추가: 모든 텍스트/카드에 `.reveal` 클래스 (스크롤 페이드업)
- 추가: Core Value 카드 호버 시 3D 틸트, 하단 "v2.6 / ACTIVE" 라이브 인디케이터
- 추가: Tech Item 카드 호버 시 3D 틸트, 하단 그라데이션 progress 라인
- 보존: 4개 TechItem, 3개 Core Value, 2개 본문 단락, 이미지

### 3.5 `components/Platforms.tsx`
- 추가: 펄스하는 grid 배경
- 추가: 각 플랫폼 카드 마우스 3D 틸트
- 추가: 카드 코너 HUD 마커, 하단 그라데이션 progress 라인
- 보존: 3개 플랫폼 데이터(SSiN/SSoN/SSAx)의 모든 항목, 모달 트리거, 아이콘

### 3.6 `components/Process.tsx`
- 추가: 스크롤 진행도에 따라 4단계 connecting line이 0%→100% 채워짐
- 추가: 스크롤이 각 단계에 도달하면 그 단계 아이콘에 펄스 링 + primary 색상 활성화
- 추가: "STEP / 01" 형태의 mono 인디케이터
- 보존: 4단계 텍스트, 아이콘, 모바일 화살표

### 3.7 `components/Contact.tsx`
- **변경 없음** (EmailJS 키, 폼 구조, 카피, URL 파라미터 처리 모두 원본 그대로)

### 3.8 `components/Footer.tsx`
- 추가: 상단 시스템 상태 바 (`GNG OPS · ONLINE`, `SECTOR · KR-SEJONG`, 오늘 날짜, 실시간 시계)
- 추가: 미세한 grid 배경
- 추가: 하단 BUILD / UPTIME 인디케이터
- 보존: 회사 정보 전체, 바로가기 5개, 정책 약관 2개, 저작권 표기

### 3.9 `components/PlatformModal.tsx` / `LegalModal.tsx`
- **변경 없음**

---

## 4. 인터랙션 디자인 원칙

### 4.1 Mission Control 스타일
모든 신규 인터랙션은 "운영 중인 관제센터"의 살아있는 느낌을 표현합니다.
- Live dot (펄스 그린)
- 모노스페이스 ticker (시계, 시스템 ID, build 버전)
- HUD 코너 마커 (4코너 미세 라인)
- 스크롤 진행도 바 + Process 라인 진행도

### 4.2 Digital Twin 시각화
Hero 배경의 3D 씬으로 GNG의 핵심 차별화(DT)를 즉시 증명합니다.
- 와이어프레임 빌딩 6동
- 70개 데이터 노드 (시안/그린/앰버/레드 — 정상/주의/경고)
- 노드 간 자동 연결되는 데이터 흐름 라인
- 빌딩 사이를 호 그리며 날아다니는 데이터 패킷
- 빌딩을 순차 스캔하는 AI 분석 프레임 (그린)

### 4.3 마이크로 인터랙션
- 카드 호버 시 3D 틸트 (perspective 1200px, ±4~5deg)
- 헤드라인 단어 단위 0.08초 간격 리빌
- 그라데이션 텍스트 무한 시프트
- IntersectionObserver 기반 .reveal 페이드업

### 4.4 접근성
- `prefers-reduced-motion: reduce` 대응 — 모든 애니메이션 자동 중지
- 모든 의미 있는 인터랙션 요소는 키보드 포커스 가능
- HUD 데코는 `aria-hidden` 처리

---

## 5. 신규 의존성

| 패키지 | 용도 | 로드 방식 |
|---|---|---|
| `three@^0.160.0` | 3D 디지털트윈 씬 | `index.html`의 importmap |
| `@emailjs/browser@^4.4.1` | (기존 사용, importmap에 명시) | importmap |

> 별도 npm install 없이 importmap CDN 방식으로 동작합니다.
> production 빌드(Vite) 시에는 `npm install three @emailjs/browser` 필요할 수 있습니다.

---

## 6. 실행 방법

### 6.1 개발 (현 importmap 방식)
브라우저에서 직접 `redesigned/index.html`을 열거나 간단한 정적 서버를 실행:
```bash
cd redesigned
# Python 3
python -m http.server 5173
# 또는 Node serve
npx serve .
```
브라우저: `http://localhost:5173`

### 6.2 Vite 정식 빌드 (권장)
원본 프로젝트가 Vite 기반이었으므로, `package.json` / `vite.config.ts`를 추가하여 빌드 가능:
```bash
npm install
npm install three @emailjs/browser
npm run dev    # 개발
npm run build  # 프로덕션 빌드
```
> `package.json`은 원본 zip에 포함되지 않아 별도 생성 필요

---

## 7. 다음 단계 제안

1. **이미지 자산 추가**: `dist/logo.png`, `dist/hero_dashboard.png`, `dist/about_tech.png`를 `redesigned/public/` 또는 동일 경로에 복사
2. **Seedance 영상 통합**: `Seedance_Video_Guide.md`의 Concept 1으로 영상 제작 후 Hero 배경으로 통합 (3D 씬과 dual layer)
3. **컬러 미세 조정**: 현재는 원본 인디고/퍼플/시안 그대로 유지. 더 차가운 톤(미드나잇 블루)으로 이동할지 여부 결정
4. **다국어 지원**: 영문 페이지 추가 시 `react-i18next` 권장
5. **성능 측정**: Lighthouse Performance 90+ 목표. 3D 씬은 모바일에서는 비활성화하는 미디어쿼리 추가 권장

---

## 8. 콘텐츠 보존 체크리스트 (검증 완료)

다음 38개 핵심 키워드가 redesigned/ 폴더 내에 모두 존재함을 grep으로 확인했습니다.

| 카테고리 | 키워드 |
|---|---|
| Hero | Next-Gen Safety Solution, 안전과 보안을 넘어, 안심을 설계합니다, DT로 통합하고 AI로 고도화하는, 플랫폼 살펴보기, Integrated Security, AI Powered, Real-time Monitoring |
| About | 우리의 방향, 통합 보안 시스템, 실시간 안전 모니터링, 설비 통합 운영, 자율 최적화, 기술로 '안전'을 모니터링, AI 시뮬레이션으로 신뢰 보장, 자율 AX, DX 혁신 완성, 디지털 트윈으로 설계하고, AI로 운영합니다 |
| Platforms | AX·DX 전환 여정, SSiN, SSoN, SSAx, Security Safety Identification Network, Smart Security Operation Network, Safety & Security Autonomous Transformation, 사람이 들어오기 전에 위험을 없애는 시스템, 사람이 운영하던 건물을 AI가 스스로 운영하도록 만든다 |
| Process | 플랫폼: AX·DX 전환 플로우, 레거시 개발 시스템 환경, 디지털 트윈 통합, AI 인텔리전스 레이어, 자율 운영 |
| Contact / Footer | AX·DX 전환에 대한, gngss@gngss.co.kr, 세종특별자치시 한누리대로 1824, 606-74호, 사업자등록번호: 681-86-03173, 대표이사: 박웅철, 개인정보처리방침, 이용약관 |

---

*추가 변경 / 색감 조정 / 영상 통합 / 페이지 분할 등 어떤 방향으로든 말씀해 주시면 즉시 반영하겠습니다.*

# GNG 홈페이지 개선 기획안

> 작성일: 2026-10-01
> 대상: `redesigned/` (gngss.co.kr 배포본과 동일 빌드 `index-CrVe2rws.js` 확인)
> 작성: Claude(redesigned-6e, 오른쪽 페인) + Codex(왼쪽 페인) 독립 리뷰 2건 병합
> 점검 방법: 소스 전체 리뷰 · `tsc --noEmit` 통과 · Vite preview(4173) + Chromium 1440/768/390/320 캡처 · 모션 감소 환경 재현 · 배포 사이트 HTML 대조
> 코드 수정 없음. 아래 파일:라인은 프로젝트 루트 기준.

---

## 0. 한눈에 보기

| 구분 | 건수 | 핵심 |
|---|---|---|
| P0 지금 배포본에 보이는 결함 | 4 | Hero 메인 헤드라인 영구 비표시, 제품 모달이 헤더에 가림, 공유 링크 해시 삭제, 모션 감소 무시 |
| P1 전환·신뢰·접근성·성능 | 10 | Tailwind CDN 런타임, 문의 폼 라벨·본문 덮어쓰기·개인정보 안내 불일치, 회사소개 미노출, 수치 근거, 모바일 영상 3개 동시 재생 |
| P2 구조·SEO·정리 | 11 | 제품별 URL, 네비 재구성, 모바일 세부 UX, 미사용 자산 1.74MiB, 배포 타깃 이원화, 문서 모순 |

두 리뷰가 독립적으로 동일하게 지적한 항목: 헤드라인 비표시, 모달 z-index, Tailwind CDN, 폼 라벨, 모션 감소, Company 미노출, 해시 삭제, 미사용 자산, 배포 이원화.

---

## 1. P0 — 즉시 핫픽스 (반나절)

### 1-1. Hero 메인 헤드라인(h1)이 화면에 전혀 보이지 않음
- 근거: `components/Hero.tsx:81-85`가 h1 모든 단어에 `word-reveal` 부여. `index.html:155-159`는 `opacity:0` + `animation: revealWord`로 복원을 맡김. 그러나 `revealWord` 키프레임은 Tailwind config(`index.html:85`)에만 있고 `animate-reveal-word` 유틸리티를 쓰는 요소가 없어 Play CDN이 키프레임을 생성하지 않음.
- 재현: 1440·390·모션 감소 환경 모두 4.5초 후 7개 span `opacity: 0`. 생성된 키프레임은 `bounce, fadeInUp, ping, pulse`뿐. 운영 사이트도 동일 빌드.
- 영향: 사이트의 첫 메시지 "공간의 모든 데이터를 연결하고 AI로 운영을 전환합니다"가 모든 방문자에게 안 보임. 접근성 트리에는 있어 자동 검사로는 안 잡힘.
- 조치: 키프레임을 인라인 `<style>`로 이동(또는 Tailwind 빌드 전환과 함께 해결). 기본 상태를 보이게 두고 애니메이션은 부가 효과로.
- 검증: Playwright로 h1 span computed opacity = 1, 스타일 로드 실패 시에도 텍스트 표시.

### 1-2. 제품 상세 모달 상단(닫기 X·제목)이 고정 헤더에 가림
- 근거: `App.tsx:18` `main.relative.z-10` 안에서 `PlatformModal.tsx:26` `fixed z-50` → 헤더(`Navbar.tsx:45`, main 밖 `z-50`)가 위에 쌓임. `LegalModal`은 `z-[100]`이라 정상.
- 재현: 390px에서 닫기 아이콘 y≈54~96px 영역 hit test 결과가 header. 하단 "닫기" 버튼은 살아 있음.
- 조치: `createPortal(document.body)`로 렌더 또는 `z-[100]` 통일.
- 검증: 모든 폭에서 상단 X 클릭 가능.

### 1-3. 공유 링크·새로고침 시 섹션 해시가 삭제됨
- 근거: `index.html:18-21`이 로드 시 `location.hash`를 무조건 제거하고 맨 위로 스크롤. 브로슈어·이메일로 보낸 `gngss.co.kr/#contact`, `?inquiry=...` 링크가 Hero에 떨어짐.
- 조치: 명시적 해시가 있으면 유지하고 React 렌더 후 해당 섹션으로 이동. "재방문은 맨 위 시작" 정책은 해시 없는 경우에만 적용.
- 검증: `/#contact`, `/?inquiry=SSoN#contact` 직접 진입 시 Contact 위치·폼 프리필 확인.

### 1-4. 모션 감소(prefers-reduced-motion) 설정에서도 영상 3개가 재생됨
- 근거: `Hero.tsx:14-17,38-45`, `About.tsx:15-18,65-72`, `CTABand.tsx:12-15,21-28`. `reducedMotion` 초기값 false 상태에서 ref 콜백이 `play()`를 먼저 호출. effect가 나중에 true로 바꿔도 `pause()`하지 않음.
- 재현: 모션 감소 환경 4.5초 후 3개 video 모두 `autoplay=false`이면서 `paused=false`.
- 조치: `useState(() => matchMedia(...).matches)`로 동기 초기화, 변경 시 명시적 `pause()`. 스무스 스크롤(`index.css:4`)도 모션 감소 시 해제.
- 검증: 모션 감소 환경에서 poster만 표시, `paused=true`.

---

## 2. P1 — 전환·신뢰·접근성·성능 (2~3일)

### 2-1. Tailwind Play CDN을 운영에서 제거하고 빌드 CSS로 전환
- 근거: `index.html:23`이 `cdn.tailwindcss.com`을 동기 로드. 콘솔에 "should not be used in production" 경고. 빌드 CSS는 74 bytes뿐이라 CDN 실패 시 레이아웃 전체가 깨짐. 1-1 버그의 근본 원인.
- 조치: `tailwindcss@3` + PostCSS 설치, `tailwind.config.ts`로 토큰·keyframes 이관, `index.css`에 `@tailwind` 지시문. 폰트(`index.html:106-108`, jsDelivr Pretendard + Google JetBrains Mono)는 `preconnect` 추가 또는 self-host.
- 검증: 빌드 CSS에 모든 유틸리티·키프레임 포함, 네트워크 차단 상태에서도 레이아웃 유지, 번들 요청 수 감소.

### 2-2. 문의 폼 접근성·동작
- 라벨 5개가 입력과 미연결 (`Contact.tsx:140-209`, `labels.length === 0`). → `htmlFor`/`id` 연결, `autocomplete` 지정.
- 제품 CTA 클릭 시 작성 중인 본문이 덮어써짐 (`Contact.tsx:23-29`, 호출부 `PlatformModal.tsx:104-112`, `Spotlight.tsx:57-63`). → 선택 제품은 별도 필드로, 본문은 비어 있을 때만 초기값.
- 결과 안내가 `alert()` (`Contact.tsx:77,82`). → 인라인 상태 메시지.
- 검증: 스크린리더로 각 필드 이름 읽힘, 본문 보존, 전송 성공·실패 메시지 인라인 표시.

### 2-3. 개인정보 안내와 실제 수집 항목 불일치
- 근거: `LegalModal.tsx:35-37,57`은 회원가입·마케팅 목적, 회사명·연락처 필수로 표시. 실제 폼은 회사명 선택, 연락처 없음, EmailJS로 외부 전송(`Contact.tsx:69-74`). 폼 주변에 수집 목적·보유기간·동의 절차 없음.
- 조치: 문의 업무 기준으로 방침 문구를 실제와 맞추고, 폼에 수집·이용 안내와 동의 체크를 둠. 외부 처리(EmailJS) 관계 명시. 법적 판정은 담당자 확인 필요.

### 2-4. 회사 신뢰 근거 섹션이 코드에만 있고 화면에 없음
- 근거: `components/Company.tsx`(대표 경력·연혁·특허 출원 2건·정부지원사업·협력 네트워크)가 `App.tsx`에서 미참조. 현재 화면의 법인 정보는 푸터뿐이고 구축·실증 사례 섹션이 없음.
- 조치: 증빙·공개 권한 확인 후 Process와 Platforms 사이 또는 Contact 직전에 마운트. "대표 전 직장 경력 / GNG 법인 실적 / 특허 출원·등록 / 협약·실증 완료"를 구분. 사례는 고객명 비공개여도 시설 유형·기간·범위·성과로 제시. 자료가 없으면 만들지 않음.

### 2-5. 제공 상태·수치·보장 표현의 근거
- 개발·실증·상용이 섞여 보임: `Company.tsx:14-16`에는 Golden Bridge 개발 착수·EdgeCam 시제품 개발로 기재, `Spotlight.tsx:24-45,77-79`·`Platforms.tsx:168-193`는 2초 감지·119 자동 연동을 제공 기능처럼 설명. → 기능별 "현재 제공 / 실증 중 / 개발 예정"과 기준일 표기.
- "1/20 도입 비용"(`Spotlight.tsx:32,49-54`)은 시설당 구축비 vs 대당 구매가 vs 연 구독비 비교로 단위 불일치. → 동일 규모·대수·기간 기준으로 재산정하거나 비율 제거.
- 37초·8분·40%+·2초(`Spotlight.tsx:17-19,24,33`), "개인정보 이슈 원천 차단", "사각지대를 없앱니다"(`About.tsx:131-132`) 등 단정 표현 → 출처·측정 조건 각주, 목표치는 목표로 표기.

### 2-6. 모바일 첫 진입에 영상 3개 동시 재생
- 근거: 390px 로드 시 `hero_bg.mp4`(727KB), `about_bg.mp4`(882KB), CTA의 `hero_bg.mp4` 재사용이 모두 `paused=false`. 로컬 측정 영상 응답 합계 약 2.34MB, 전체 전송 약 3.1MB.
- 조치: `preload="none"` + IntersectionObserver로 화면 진입 시만 재생·이탈 시 정지. 모바일·저전력·데이터 절약 환경은 poster 우선. WebM/AV1 인코딩으로 용량 축소 검토.
- 검증: 모바일 초기 전송량 < 1.5MB, 화면 밖 video `paused=true`.

### 2-7. 모달 키보드·스크린리더 동작
- 근거: `PlatformModal.tsx:12-51`, `LegalModal.tsx:11-118`에 `role="dialog"`·`aria-modal`·제목 연결·초기 포커스·포커스 트랩·Escape·포커스 복원 없음. 재현: 열린 상태에서 dialog 0개, 포커스는 배경 지도 버튼, Escape 무반응.
- 조치: WAI-ARIA 모달 패턴 적용. 아이콘 닫기 버튼에 `aria-label`.

### 2-8. 모바일 메뉴 버튼 상태 미전달
- 근거: `Navbar.tsx:96-107` 이름 "메뉴 열기" 고정, `aria-expanded`·`aria-controls` 없음. → 상태별 이름·expanded 반영.

### 2-9. Hero 타이포 재균형 (1-1 수정 후 필수)
- 1-1을 고치면 `text-7xl` h1(`Hero.tsx:81`)과 `text-5xl` 문장(`Hero.tsx:88`)이 연달아 쌓여 메시지 두 개가 경쟁. → h1은 유지, "DT로 보고…" 문장은 `text-2xl~3xl` 서브헤드로 축소. 320px에서 영문 배지 3개(`Hero.tsx:113-125`)가 viewport 밖으로 잘림 → wrap 적용.

### 2-10. 푸터 연도·시계
- `Footer.tsx:103` "© 2024" 고정 → 동적 연도. `Footer.tsx:19-20,47` 로컬 시간 + UTC 날짜 + 고정 "KST" 표기가 시간대 불일치 → `Asia/Seoul`로 통일하거나 시계 제거.

---

## 3. P2 — 구조·SEO·정리 (1~2주, 선택)

### 3-1. 정보구조·네비게이션
- 현재 메뉴 4개(방향·기술·전환 모델·제품)에 섹션 9개. Spotlight(Golden Bridge·EdgeCam)와 회사소개는 메뉴에서 접근 불가. → "회사소개 / 솔루션 / Golden Bridge / 도입 절차 / 문의" 수준으로 재구성.
- 구매자 관점 진입 경로 부재: Hero·Process·Platforms 모두 DT/DX/AI/AX 구호 반복. → "공공기관 / 건물주 / 시설관리사 → 해결 업무 → 제품 → 사례 → 도입 조건 → 문의" 흐름과 "현장 조사 → 시범 적용 → 검증 → 운영 인계" 절차 섹션 추가.
- Spotlight가 모바일에서 4,150px로 가장 긺. → 스펙표·비교표를 아코디언으로 접거나 Golden Bridge 전용 페이지로 분리.

### 3-2. 제품 상세의 검색·공유 경로
- 제품 상세가 state 모달뿐이라 URL·검색·내부 품의 자료로 전달 불가 (`Platforms.tsx:309-312`, `PlatformModal.tsx:104-112`). 단일 `<title>`·meta, 빈 root HTML(`index.html:220-221`), canonical·JSON-LD·robots·sitemap 없음, OG 이미지가 142KB 로고 PNG.
- 조치: 주요 제품부터 고유 URL(`/products/sson` 등) + 정적 사전 렌더링 검토. `canonical`, Organization JSON-LD, `robots.txt`·`sitemap.xml`, 1200×630 OG 이미지, 제목에 한국어 업무명 포함("가능가(GNG) | 디지털트윈·AI 공간 운영 플랫폼"). Search Console 등록으로 색인 확인.

### 3-3. 모바일 제품 지도 세부
- 센서폴 버튼이 390px에서 약 15×15px, 320px에서 약 12×12px (`CampusMap.tsx:134-141`). 모바일에서 조작 안내·설명 숨김(`Platforms.tsx:343-366`). → hit area 44px 확보 또는 모바일은 목록을 주 경로로 안내.
- 3.8초 자동 순회(`Platforms.tsx:298-308`)가 키보드 포커스·화면 이탈·모션 감소를 무시하고 "자세히 보기" 대상을 바꿈. → 정지 제어 제공, 포커스 연동.
- 생성 이미지 기반 지도에 "CAMPUS DIGITAL TWIN · INTERACTIVE" + live-dot 표기(`Platforms.tsx:338-345`)라 실제 운영 화면으로 오인 가능. → "제품 적용 영역 개념도"로 명시, 실제 화면·설치 사진은 별도 배치.

### 3-4. 모바일 폼·표
- 320px에서 이름·회사 2열 입력이 각 95px (`Contact.tsx:135-158`). → 소형 화면 1열.
- 비교표 최소 640px·자사 열이 오른쪽 끝(`Spotlight.tsx:171-179`). → 가로 스크롤 안내 또는 모바일 비교 카드.

### 3-5. 미사용 코드·자산·의존성 정리 (삭제 전 보존 목적 확인)
| 대상 | 상태 | 비고 |
|---|---|---|
| `components/DigitalTwinScene.tsx` | 미참조, 번들 미포함 | three 사용처 |
| `three`, `@types/three` (`package.json:18,24`) | 사용처 미참조 | 번들엔 없음(트리셰이킹) |
| `public/hero_dashboard.png`(755KB), `about_tech.png`(822KB) | 미참조, 빌드에 복사됨 | |
| `public/campus_diorama.mp4`(209KB), `_poster.jpg`(33KB) | 미참조, 빌드에 복사됨 | 지도는 webp 사용 |
| 루트 `logo.png`·`hero_dashboard.png`·`about_tech.png` | public과 SHA-256 동일 | 중복 |
| `index.html:202-213` importmap(aistudiocdn) | Vite 번들과 병존, 선언만 남음 | AI Studio 잔재, 제거 |
| `dist/` | 원본 빌드 참고용 | 보존 여부 결정 |
| `vite.config.ts:18` `sourcemap: true` | 운영에 1.1MB map 배포 | 필요성 확인 |
미사용 public 자산 합계 약 1.74MiB.

### 3-6. 배포 타깃 이원화와 문서
- `netlify.toml`(gngss.co.kr)과 `.github/workflows/deploy.yml`(GitHub Pages, main push)이 병존. 빌드 경로(`base='./'`, `outDir='build'`, publish `build`)는 모두 일치해 충돌은 없음. → 공식 타깃·Pages 용도(검토용/보조)·대표 URL·색인 정책을 문서화. PR 단계 `tsc` + `build` CI 체크 추가. 분석 도구(GA4/Naver)·404 페이지 없음.
- `start_server.bat`·`REDESIGN_NOTES.md:143-150`은 정적 서버로 TSX를 띄우는 옛 방식, `SETUP.md`만 정확. → `npm run dev` / `npm run build && npm run preview`로 통일, 옛 Three.js·HUD 설명은 이력으로 분리.

### 3-7. 기타
- 제품 영문명 확인: `Platforms.tsx:35` "Smart Security Identification Network" vs `REDESIGN_NOTES.md` "Security Safety Identification Network".
- 로고: 다크용 PNG를 CSS `invert` 필터로 변환 중(`Navbar.tsx:52-56`). → 라이트 테마 SVG 원본 확보, favicon·apple-touch-icon 세트.
- 영문 페이지·hreflang 없음 → 해외 고객 필요 시 i18n.

---

## 4. 실행 로드맵과 완료 기준

| Phase | 범위 | 완료 기준(검증) |
|---|---|---|
| 0 핫픽스 (반나절) | 1-1 ~ 1-4 | Playwright: h1 opacity 1 · 모달 X 클릭 가능 · `/#contact` 직접 진입 · 모션 감소 시 video paused. 배포 후 운영 URL 재확인 |
| 1 기반 정비 (2~3일) | 2-1 ~ 2-10 | Tailwind 빌드 CSS 생성, 콘솔 경고 0 · 폼 라벨 연결·본문 보존 · 모달 dialog 패턴 · 모바일 초기 전송 < 1.5MB · Company 마운트(증빙 확인분만) · Lighthouse 모바일 Performance ≥ 90 / Accessibility ≥ 95 / SEO ≥ 95 |
| 2 구조 개선 (1~2주) | 3-1 ~ 3-7 | 네비·사례·도입 절차 섹션 · 제품 URL + canonical/sitemap/JSON-LD · 미사용 자산 제거로 빌드 폴더 < 2MB · 배포 문서 단일화 |

작업 순서 원칙: Phase 0는 콘텐츠 변경 없이 코드만. Phase 1의 2-4·2-5는 담당자 증빙 확인이 선행되어야 하므로 코드 작업과 병렬로 자료 요청.

---

## 5. 사용자 결정이 필요한 항목

1. 공식 배포 타깃: Netlify(gngss.co.kr) 단일화 여부, GitHub Pages 용도.
2. SSiN·SSoN 공식 영문명 확정.
3. Spotlight 수치(37초·8분·40%+·2초·1/20)의 출처와 공개 가능 여부. 근거 없으면 제거할지.
4. 기능별 제공 상태(제공/실증/개발) 기준일.
5. Company 섹션 공개 범위(대표 경력·특허·지원사업)와 공개 가능한 사례·파트너.
6. 개인정보 처리방침 문구 수정 주체(법무 검토 여부)와 동의 체크 도입.
7. 라이트 테마 로고 원본 보유 여부.
8. 영문 페이지 필요 여부.
9. 미사용 자산(`dist/`, 루트 PNG, Three.js 씬) 삭제 또는 아카이브.

---

## 부록 — 측정 기록 (로컬 preview, 2026-10-01)

| 항목 | 데스크톱 1440 | 모바일 390 |
|---|---|---|
| 페이지 높이 | 9,430px | 15,623px |
| 요청 수 | 29 | 30 |
| 선언 전송량 | 약 2.4MB | 약 3.1MB |
| 서드파티 | cdn.tailwindcss.com, cdn.jsdelivr.net, fonts.googleapis.com, fonts.gstatic.com | 동일 |
| 콘솔 | Tailwind CDN 운영 경고 1 | 동일 |
| 앱 JS 번들 | 280KB (gzip 86KB), three 미포함 | |
| 빌드 CSS | 74 bytes | |
| 가장 긴 섹션 | Spotlight | Spotlight 4,150px |
| h1 표시 | 비표시(opacity 0) | 비표시 |

---

## 6. 적용 이력 — 2026-10-01 (Claude + Codex 분담 구현, 미커밋)

작업 분담: Claude(redesigned-6e) — 빌드 체계·index.html·Hero/About/CTABand·Company·public·문서. Codex(왼쪽 페인) — Contact·PlatformModal·LegalModal·Navbar·Footer·CampusMap·Platforms·Spotlight.

| 항목 | 상태 | 비고 |
|---|---|---|
| 1-1 h1 비표시 | 완료 | `index.css`에 keyframes 직접 정의. 단어 공백은 span 바깥으로 이동 |
| 1-2 모달 z-index | 완료 | 두 모달 `createPortal(document.body)` + `z-[100]` |
| 1-3 해시 삭제 | 완료 | 해시 없을 때만 최상단, 해시 있으면 React 렌더 후 이동(0.9초 뒤 재보정) |
| 1-4 모션 감소 | 완료 | `BackgroundVideo.tsx` 공용 컴포넌트: 동기 초기화, 변경 시 pause, 15% 이상 보일 때만 재생, `preload="none"` |
| 2-1 Tailwind 빌드 | 완료 | `tailwindcss@3` + PostCSS, `tailwind.config.js`, Play CDN·importmap 제거. 빌드 CSS 33KB(gzip 6.8KB) |
| 2-2 문의 폼 | 완료 | 라벨 연결·autocomplete·본문 보존·hidden `solution`·인라인 상태 메시지 |
| 2-3 개인정보 정합성 | 완료(법무 검토 필요) | 폼 안내 + 필수 동의 체크, 처리방침 제2·3·5조를 실제 폼 기준으로 수정 |
| 2-4 Company 마운트 | 완료 | WhyGNG 뒤에 배치. 대표 경력에 "법인 설립 이전 포함" 캡션, 연혁 라벨 "GNG 법인 연혁" |
| 2-5 근거 표기 | 부분 완료 | 통계·셀링포인트·비교표에 공통 각주 3곳, 단정 표현 2건 완화. 수치 자체·제공 상태 라벨은 담당자 증빙 후 |
| 2-6 모바일 영상 | 완료 | 첫 진입 시 Hero만 재생, About·CTA는 화면 진입 시 재생 |
| 2-7 모달 접근성 | 완료 | dialog 역할·포커스 트랩·Escape·포커스 복원·링크 복사 |
| 2-8 모바일 메뉴 | 완료 | aria-expanded/controls, Escape |
| 2-9 Hero 타이포 | 완료 | h1 6xl, "DT로 보고…" 서브헤드 3xl, 배지 wrap |
| 2-10 푸터 | 완료 | 동적 연도, Asia/Seoul 통일 |
| 3-1 네비 재구성 | 완료 | 회사소개·솔루션·Golden Bridge·전환 모델·문의. 구매자 유형별 진입·도입 절차 섹션은 신규 카피가 필요해 보류 |
| 3-2 SEO·제품 딥링크 | 부분 완료 | `#product-<slug>` 딥링크·제목 변경, canonical·JSON-LD·OG 1200×630·robots·sitemap. 제품별 독립 URL·사전 렌더링은 보류 |
| 3-3 캠퍼스 맵 | 완료 | 44px hit area, 자동 순회 정지 조건, "제품 적용 영역 개념도" 라벨 |
| 3-4 모바일 폼·표 | 완료 | 폼 1열, 스펙·비교표 아코디언 + 모바일 카드 |
| 3-5 정리 | 완료 | 미사용 PNG·mp4·루트 중복·`DigitalTwinScene.tsx`·`three` 삭제, sourcemap off. `dist/`는 gitignore 상태로 유지 |
| 3-6 배포·문서 | 완료 | `SETUP.md` 배포 표, `start_server.bat`→npm, `REDESIGN_NOTES.md` 이력 안내. 배포 타깃 단일화는 사용자 결정 |
| 3-7 기타 | 보류 | 제품 영문명 확정, 라이트 로고 SVG, 영문 페이지 — 자료 필요 |

검증(로컬 `npm run build` + `vite preview` + Chromium): `tsc` 통과 · h1 opacity 1 · 콘솔 경고 0 · 서드파티는 폰트 2곳만 · `/#contact`·`/#product-sson` 직접 진입 동작 · 모션 감소 시 영상 3개 정지 · 모바일 첫 진입 Hero 영상만 재생 · 320px 가로 넘침 없음 · 네비 5개. EmailJS 실제 발송은 수행하지 않음(가로채기 시뮬레이션만).

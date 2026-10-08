# 홈페이지 후속 작업 — 사용자 체크리스트 + 서비스 세션별 전달문

> 작성일: 2026-10-08 · 기준 배포: gngss.co.kr (커밋 e7c997a)
> 1부는 사용자가 직접 할 일, 2부는 각 솔루션 개발 세션에 그대로 붙여 넣을 요청문입니다.

---

## 1부. 사용자가 직접 해야 할 일

### A. 계정·설정 (홈페이지 세션이 대신할 수 없는 것)

| # | 할 일 | 어디서 | 왜 필요한가 | 끝나면 홈페이지 세션에 줄 것 |
|---|---|---|---|---|
| A1 | EmailJS 템플릿 `template_vt9hwe1` 본문에 `{{solution}}` 한 줄 추가 (선택: 제목에도) | dashboard.emailjs.com → Email Templates | 문의 메일에 선택 제품명이 찍히도록 | 완료 여부만 |
| A2 | Netlify 대시보드 → Forms 탭에서 `resource-request` 폼이 등록됐는지 확인, 알림 이메일 설정 | app.netlify.com → 사이트 → Forms | 자료·데모 요청 리드가 들어오는 곳 | 미등록이면 알려주기 |
| A3 | Supabase 프로젝트 생성 → `leads` 테이블 생성 → anon insert RLS 허용 | supabase.com | 리드를 DB에 저장·조회하려면 | 프로젝트 URL, anon key (Netlify 환경변수 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`로 등록해도 됨) |
| A4 | 실제 문의·자료 요청 1건 직접 전송해 수신 확인 | gngss.co.kr/solutions/ssin 하단 | 발송·수신은 로컬에서 검증 불가 | 수신 메일 스크린샷 또는 "정상" |
| A5 | Google Search Console에 gngss.co.kr 등록, sitemap.xml 제출 | search.google.com/search-console | 상세 8페이지 색인 확인 | 색인 결과 |

`leads` 테이블 SQL (Supabase SQL Editor에 붙여 넣기):
```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text, company text, email text,
  solution text, source text, consent boolean
);
alter table public.leads enable row level security;
create policy "anon insert" on public.leads for insert to anon with check (true);
```

### B. 콘텐츠 결정 (답만 주면 홈페이지 세션이 반영)

| # | 결정할 것 | 현재 상태 |
|---|---|---|
| B1 | Smart Lock 제공 상태 (제공 중 / 시제품 / 개발 예정) | "확인 중"으로 표기 |
| B2 | SSiN·SSoN 공식 영문명 확정 — 현재 사이트: SSiN = Smart Security Identification Network, SSoN = Safety & Security Operating Nexus | 브로슈어와 일치, REDESIGN_NOTES와 불일치 |
| B3 | Spotlight 수치(37초·8분·40%+·2초·1/20)의 출처 또는 삭제 여부 | 각주 "자체 측정·추정치"로 임시 처리 |
| B4 | 공개 가능한 적용·실증 사례(고객명 공개 여부 포함), 파트너 로고 | Golden Bridge 2건만 표기 |
| B5 | 10월 5일 변경된 회사소개(대표 프로필 삭제, "기술개발과 성장 기록") 유지 여부 | 변경된 상태로 배포됨 |
| B6 | 개인정보처리방침 2·3·5조 + 리드 폼 동의 문구 법무 검토 | 실제 폼 기준으로 수정만 된 상태 |
| B7 | 통합 브로슈어 PDF: 현재 HTML 재구성본 사용 vs 원본 PPTX를 PowerPoint에서 열어 다시 저장한 PDF로 교체 | 재구성본 배포 중 |
| B8 | 솔루션별 상세 브로슈어 제작 순서 (요청이 들어오면 보낼 PDF) | 없음. 요청만 접수 중 |

### C. 서비스 세션에서 받아서 홈페이지 세션에 넘길 것

| # | 받을 것 | 규격 | 넣을 곳 |
|---|---|---|---|
| C1 | 솔루션별 실제 화면 캡처 (기능 수만큼, 4~5장) | PNG 1920×1080, 고객 데이터 마스킹, 파일명 `<slug>-01.png` … | `public/solutions/<slug>/` |
| C2 | 캡처마다 한 줄 설명(무슨 화면인지) | 텍스트 | 캡션 |
| C3 | 기능 설명 중 틀린 부분 수정 요청 | 텍스트 | `content/solutions/index.ts` |
| C4 | 연동 가능 시스템·지원 환경 목록 보완 | 텍스트 | "도입 구성" 섹션 |
| C5 | 영업이 자주 받는 질문 3~5개와 답 | 텍스트 | FAQ |
| C6 | (H/W) 제품·설치 사진 | PNG/JPG | Edge H/W, Golden Bridge |

---

## 2부. 각 서비스 세션에 남길 요청문

아래 공통문 + 해당 솔루션 블록을 그대로 복사해 각 개발 세션에 붙여 넣으세요.

### 공통 요청문 (모든 세션에 먼저)

```
홈페이지(https://gngss.co.kr/solutions/<slug>)에 이 솔루션의 상세 소개 페이지가 올라갔습니다.
페이지의 "핵심 기능" 섹션에 기능별 실제 화면 자리가 비어 있습니다("실제 화면 준비 중").
아래 기능 목록 순서대로 실제 화면을 캡처해 주세요.

규격
- PNG, 1920×1080 (브라우저 창 기준), 모바일 전용 기능은 390×844 세로 캡처 추가
- 고객명·개인정보·실제 사업장 데이터는 마스킹하거나 데모 데이터 사용
- 파일명: <slug>-01.png, <slug>-02.png … (기능 번호 순서)
- 각 파일마다 한 줄 설명(어떤 화면·어떤 상태인지)
- 1번 기능 캡처는 페이지 상단 대표 이미지로도 쓰이므로 가장 대표적인 화면으로

함께 답해 주세요
1. 기능 설명 중 현재 구현과 다른 부분 (문장 단위로 수정안)
2. 연동 가능한 외부 시스템·프로토콜, 지원 환경(클라우드/온프레미스/폐쇄망)
3. 영업 담당자가 자주 받는 질문 3~5개와 답
4. 아직 구현되지 않았거나 개발 중인 기능 (페이지에 "예정"으로 표기해야 함)

결과물은 폴더 하나에 캡처 + 설명.txt 로 모아 주세요.
```

### SSiN — https://gngss.co.kr/solutions/ssin  (파일명 접두어 `ssin`)
```
기능 목록 (캡처 순서)
1. 방문 신청 · 승인 워크플로우 — 모바일 신청 화면, 승인자 화면
2. AI OCR 안전서류 검증 — 서류 업로드 → 판독 결과(적합/만료/불일치) 화면, 보유율 대시보드
3. 출입통제(ACS) 자동 연동 — 1회용 QR 발급 화면, 권한 등록/회수 이력
4. AI 위험도 판단 · Compliance 지수 — 리스크 점수, SCI 화면
5. 관리자 대시보드 · 리포트 — 유형별 통계, 이상 패턴 경보, 리포트 PDF 내보내기
추가 확인: PRD 4.0 기준 기능 중 현재 운영 버전에 없는 것, 고객사 CI 적용 예시 1건
```

### SSoN — https://gngss.co.kr/solutions/sson  (접두어 `sson`)
```
기능 목록 (캡처 순서)
1. 3D 디지털트윈 통합관제 — 3D 관제 메인 화면, 2D 전환 화면
2. 보안 시스템 통합 — CCTV·ACS·객체인식 이벤트가 지도 위에 표시된 화면
3. 안전 시스템 통합 — 센서 이벤트, 작업허가 위험구역 표시
4. 이벤트 타임라인 · SOP — SOP 실행 화면, 타임라인/조치 이력
5. Event Priority AI — 우선순위·리스크 점수 화면
추가 확인: 연동 검증된 VMS/ACS 제조사 목록, 폐쇄망 구성 사례
```

### SSAx — https://gngss.co.kr/solutions/ssax  (접두어 `ssax`)
```
기능 목록 (캡처 순서)
1. IBS 빌딩자동화 통합 제어 — 설비 제어 화면, 공간별 에너지 흐름 시각화
2. FMS 시설·자산·점검 관리 — 자산 DB, 점검 스케줄, 고장 예측 화면
3. BEMS 에너지 관리·최적화 — 사용량 분석, 피크 예측, 자동 제어 정책 화면
4. AI 운영 자동화 — 이상 탐지 알림, SSiN/SSoN 이벤트 연동 제어 화면
추가 확인: 지원 프로토콜(BACnet·Modbus 등) 실제 목록, SSAx_IBS 기능정의서와 페이지 설명 차이
```

### SpaceOps — https://gngss.co.kr/solutions/spaceops  (접두어 `spaceops`)
```
기능 목록 (캡처 순서)
1. MeetOps — 회의실 예약·체크인 화면, 회의실 디스플레이
2. DeskOps — 좌석 예약·배정 화면
3. NaviOps — 실내 길찾기(모바일 390×844 포함), 키오스크
4. 공간 분석 · IoT · AI 어시스턴트 — 활용률 리포트, 센서 현황, AI 어시스턴트 대화
추가 확인: 연동 가능한 캘린더(Google/M365), 센서 없이 동작하는 범위
```

### Golden Bridge — https://gngss.co.kr/solutions/golden-bridge  (접두어 `golden-bridge`)
```
기능 목록 (캡처 순서)
1. 감지 — EdgeCam 이벤트가 플랫폼에 표시된 화면 (시제품 전이면 시뮬레이션 화면으로)
2. 판단 — 3D 디지털트윈 대피 경로 연산 화면, 대피 시뮬레이션 결과
3. 대응 — 유도등 방향 제어 화면 (Guardian Light 시제품 사진 있으면 추가)
4. 연동 — 자동 신고·지자체 관제 연계 화면 또는 흐름도
추가 확인: 연동이 "협의 중"인 외부 기관과 "검증 완료"인 기관 구분, 현재 실증 중인 시설 유형
```

### Smart FM — https://gngss.co.kr/solutions/smart-fm  (접두어 `smart-fm`)
```
기능 목록 (캡처 순서)
1. QR 현장 업무 · 미화 관리 — QR 스캔 후 열리는 모바일 화면(390×844), 미화 이력
2. 점검 관리 — 점검 스케줄, 측정값 입력, 이탈 알림
3. VOC 관리 — 접수 → 배정 → 처리 화면
4. 인력 · 장비 운영 — 공간별 인력 배치 지도, 장비 현황
5. AI 분석 · 리포트 — 품질 지표 대시보드, 월간 리포트
추가 확인: 다국어 지원 언어, 시설관리 전문기업이 여러 고객사를 운영하는 화면, 라셋 현장 적용 여부(공개 가능하면)
```

### Edge H/W — https://gngss.co.kr/solutions/edge-hw  (접두어 `edge-hw`)
```
자료 목록 (캡처·사진 순서)
1. EdgeCam — 시제품 외관 사진, 감지 이벤트 화면(낙상/화재/배회), 메타데이터 전송 로그
2. Guardian Light — 시제품 사진, LED 방향 전환 사진 또는 영상 캡처
3. Smart Lock — 제품 사진, 권한 연동 화면 (제공 상태도 답변)
4. 플랫폼 연동 — MQTT/API 연동 구성도
추가 확인: EdgeCam 11월 말 완료 후 디자인 변경 범위, KC 인증 일정, 현재 사양표(Jetson Orin Nano 8GB·IMX415·PoE+·IP66·10W)가 시제품 기준으로 맞는지
```

### Logistics DX — https://gngss.co.kr/solutions/logistics-dx  (접두어 `logistics-dx`)
```
자료 목록 (순서)
1. 분석 — 물동량·보관량 분석 보고서 샘플 화면(합성 데이터)
2. 설계 — Layout 설계 도면·시뮬레이션 화면
3. 설비 구축 — SIDONN AGV·ACR·AS/RS 설비 사진 (총판 계약상 사용 가능한 것만)
4. 연계 · 실행 — WMS/WCS 연계 구성도, 자동화 창고 운영 화면
추가 확인: SIDONN 로고·레퍼런스 공개 범위, 국내 구축 사례 공개 가능 여부
```

---

## 3부. 받은 자료를 홈페이지 세션에 넘길 때

폴더째로 경로만 알려주시면 됩니다. 예:
```
smart-fm 캡처 폴더: D:\...\smart-fm\  (smart-fm-01.png ~ 05.png + 설명.txt)
수정 요청: 2번 기능 설명에서 "기준치 이탈 알림" → "기준치 이탈 시 담당자 알림"
```
홈페이지 세션이 `public/solutions/<slug>/`에 배치하고 콘텐츠를 수정한 뒤 빌드·검증·배포까지 처리합니다.

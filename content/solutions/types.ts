// ============================================================
// 솔루션 상세 페이지 콘텐츠 타입
// - 출처 없는 수치는 쓰지 않는다: 수치가 들어가는 필드는 반드시 evidence를 요구
// - 실제 화면이 없으면 screenshot을 비워 두고 템플릿이 "화면 준비 중"을 표시
// ============================================================

export type SolutionStatus =
  | { kind: 'available'; label?: string }            // 제공 중
  | { kind: 'pilot'; label?: string; note?: string }  // 실증 진행 중
  | { kind: 'developing'; label?: string; eta: string; note?: string }; // 개발 중 · 예정일 필수

export type Audience = '공공기관' | '제조·물류 사업장' | '오피스·상업 빌딩' | '복지·요양 시설' | '병원·교육 시설' | '시설관리 전문기업';

export interface Screenshot {
  src: string;   // public/solutions/<slug>/ 아래 경로
  alt: string;
  caption?: string;
}

export interface Feature {
  title: string;
  summary: string;        // 무엇을 자동화하는지 1문장
  benefit?: string;       // 담당자가 얻는 것 1문장
  items: string[];        // 세부 항목 3개 내외
  screenshot?: Screenshot;
}

export interface FlowStep {
  step: string;           // 수집 · 플랫폼 · 판단 · 실행
  title: string;
  desc: string;
}

export interface Integration {
  systems: string[];      // 연동 가능 시스템
  hardware?: string[];    // 필요 H/W
  deployment: string[];   // 온프레미스 · 클라우드 · 폐쇄망 등
  reuse?: string;         // 기존 설비 재사용 범위
}

export interface ProcessStep {
  title: string;
  desc: string;
  deliverable: string;    // 단계 산출물
  customer?: string;      // 고객 준비사항
}

export interface Evidence {
  source: string;         // 출처 (문서명·측정 조건)
  date?: string;
}

export interface Metric {
  value: string;
  label: string;
  evidence: Evidence;     // 필수 — 출처 없는 수치는 타입 단계에서 차단
}

export interface CaseStudy {
  title: string;          // 고객명 비공개 시 "시설 유형(규모)"
  scope: string;
  result: string;
  status: '적용' | '실증' | '협약';
}

export interface Faq {
  q: string;
  a: string;
}

export interface SolutionPage {
  slug: string;           // URL
  id: string;             // Platforms.tsx의 id와 동일 (기존 #product-* 해시 매핑용)
  name: string;
  subtitle: string;       // 영문 정식 명칭
  category: string;       // 출입 전 보안 · 현장 통합관제 …
  tagline: string;        // 한 줄 가치 제안 (25자 내외)
  summary: string;        // 2~3문장
  audiences: Audience[];
  status: SolutionStatus;
  problems: { before: string[]; after: string[] };
  features: Feature[];
  flow: FlowStep[];
  integration: Integration;
  process?: ProcessStep[];   // 생략 시 공통 절차 사용
  metrics?: Metric[];
  cases?: CaseStudy[];
  specs?: [string, string][];
  faq: Faq[];
  related: string[];      // slug
  seo: { title: string; description: string };
}

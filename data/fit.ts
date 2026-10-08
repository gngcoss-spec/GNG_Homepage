import type { FitAnswers, FitProduct, FitQuestion, FitRecommendation } from './fitTypes.ts';

export const FIT_PROBLEMS = [
  { id: 'facility', title: '점검·민원·설비 운영', description: '흩어진 현장 기록과 점검 업무를 정리하고 싶어요.' },
  { id: 'access', title: '방문 신청·출입 절차', description: '방문 신청부터 승인·출입까지 절차를 줄이고 싶어요.' },
  { id: 'monitor', title: '안전·보안 통합관제', description: 'CCTV·센서·경보와 대응 현황을 함께 보고 싶어요.' },
  { id: 'space', title: '회의실·좌석 운영', description: '예약과 실제 공간 이용 현황을 알고 싶어요.' },
  { id: 'safety', title: '위험 감지·대피 안내', description: '현장 위험과 대피 지원 방안을 검토하고 싶어요.' },
  { id: 'logistics', title: '물류 이동·피킹·보관', description: '동선과 처리량의 병목부터 분석하고 싶어요.' },
];

export const FIT_QUESTIONS: FitQuestion[] = [
  {
    key: 'site', label: '어떤 현장인가요?', options: [
      { value: 'building', label: '건물·시설관리 현장' },
      { value: 'factory', label: '제조·산업 현장' },
      { value: 'office', label: '오피스·업무공간' },
      { value: 'public', label: '공공·복합시설' },
      { value: 'warehouse', label: '물류센터·창고' },
      { value: 'unknown', label: '아직 분류하기 어려워요' },
    ],
  },
  {
    key: 'problem', label: '가장 먼저 해결할 문제는 무엇인가요?', options: [
      ...FIT_PROBLEMS.map(problem => ({ value: problem.id, label: problem.title })),
      { value: 'unknown', label: '문제 진단부터 필요해요' },
    ],
  },
  {
    key: 'scale', label: '먼저 적용할 범위는 어디까지인가요?', options: [
      { value: 'zone', label: '한 구역·업무부터' },
      { value: 'site', label: '한 사업장 전체' },
      { value: 'multi', label: '여러 사업장' },
      { value: 'unknown', label: '범위를 정하지 못했어요' },
    ],
  },
  {
    key: 'system', label: '지금은 어떻게 운영하나요?', options: [
      { value: 'manual', label: '수기·엑셀·메신저 중심' },
      { value: 'separate', label: '기존 시스템이 각각 있어요' },
      { value: 'connected', label: '연동 가능한 시스템·데이터가 있어요' },
      { value: 'unknown', label: '시스템 현황 확인이 필요해요' },
    ],
  },
  {
    key: 'goal', label: '도입으로 무엇을 우선 바꾸려 하나요?', options: [
      { value: 'work', label: '반복 업무·누락 줄이기' },
      { value: 'view', label: '현장 상황 한눈에 보기' },
      { value: 'energy', label: '에너지·설비 운영비 개선' },
      { value: 'safety', label: '위험 감지·대응 개선' },
      { value: 'throughput', label: '처리량·공간 활용 개선' },
      { value: 'unknown', label: '목표를 함께 정하고 싶어요' },
    ],
  },
  {
    key: 'timing', label: '희망하는 검토 시기는 언제인가요?', options: [
      { value: 'explore', label: '정보 탐색·내부 검토 중' },
      { value: 'soon', label: '3개월 안에 검토하고 싶어요' },
      { value: 'planned', label: '예산·사업 일정이 정해져 있어요' },
      { value: 'unknown', label: '아직 미정이에요' },
    ],
  },
];

export const EMPTY_FIT_ANSWERS: FitAnswers = {
  site: '', problem: '', scale: '', system: '', goal: '', timing: '',
};

// 현재 홈페이지의 역할 요약. 실제 제공 범위는 제품 담당자의 자료로 확인합니다.
export const FIT_PRODUCTS: FitProduct[] = [
  { id: 'SSiN', name: 'SSiN', role: '방문 신청·승인·출입 업무', statusLabel: '도입 조건 확인 필요' },
  { id: 'SSoN', name: 'SSoN', role: '안전·보안 이벤트 통합관제', statusLabel: '도입 조건 확인 필요' },
  { id: 'SSAx', name: 'SSAx', role: '설비·에너지 운영 및 제어 검토', statusLabel: '도입 조건 확인 필요' },
  { id: 'SpaceOps', name: 'SpaceOps', role: '회의실·좌석 등 업무공간 운영', statusLabel: '도입 조건 확인 필요' },
  { id: 'Golden Bridge', name: 'Golden Bridge', role: '위험 감지·대피 지원 검토', statusLabel: '개발·실증 범위 확인 필요' },
  { id: 'Smart FM', name: 'Smart FM', role: '현장 점검·업무·VOC 관리', statusLabel: '도입 조건 확인 필요' },
  { id: 'Edge H/W', name: 'Edge H/W', role: '현장 감지·안내 장치 검토', statusLabel: '장비·실증 조건 확인 필요' },
  { id: 'Logistics DX', name: 'Logistics DX', role: '물류 병목 분석·자동화 설계 검토', statusLabel: '분석·수행 범위 확인 필요' },
];

const compatibleGoals: Record<string, string[]> = {
  facility: ['work', 'view', 'energy'],
  access: ['work', 'view', 'safety'],
  monitor: ['work', 'view', 'safety'],
  space: ['work', 'view', 'throughput'],
  safety: ['view', 'safety'],
  logistics: ['work', 'view', 'throughput'],
};

const siteChecks: Record<string, string> = {
  building: '시설 소유자·운영사·관리업체의 역할과 데이터 책임을 확인합니다.',
  factory: '생산 중단 가능 시간과 현장 출입·설치 조건을 확인합니다.',
  office: '총무·IT 담당자와 계정·공간 운영 조건을 확인합니다.',
  public: '시설 운영 기준과 공공사업·실증 적용 조건을 확인합니다.',
  warehouse: '현장 가동시간·물동량 변동·장비 설치 조건을 확인합니다.',
  unknown: '적용 현장의 종류와 실제 업무부터 확인합니다.',
};

const systemChecks: Record<string, string> = {
  manual: '수기 자료·엑셀 양식·업무 절차를 모아 현장 기록과 데이터 수집 범위를 정합니다.',
  separate: '기존 시스템 목록과 데이터 제공·연동 권한을 확인하고 재사용 범위를 정합니다.',
  connected: '연동 가능하다는 응답을 바탕으로 API 문서·데이터 품질·접근 권한을 검증합니다.',
  unknown: '시스템 목록과 담당자를 파악하는 사전 확인을 먼저 진행합니다.',
};

const scopeNotes: Record<string, string> = {
  zone: '한 구역·업무를 시작 범위로 정하고 적용 전후의 측정 조건을 맞춥니다.',
  site: '사업장 전체 요구를 정리하고 대표 구역에서 적용 조건을 먼저 확인합니다.',
  multi: '대표 사업장 한 곳에서 기준을 검토한 뒤 공통 설정과 현장 차이를 구분합니다.',
  unknown: '효과를 측정할 수 있는 최소 적용 범위부터 함께 정합니다.',
};

const goalNotes: Record<string, string> = {
  work: '반복 입력·누락·처리시간의 현재 기준값을 수집합니다.',
  view: '한 화면에서 판단해야 할 정보와 대응 담당자를 정합니다.',
  energy: '계측 데이터와 실제 비용 구조를 확인하고 개선 가능성을 검토합니다.',
  safety: '위험 유형·대응 절차와 현장에서 검증할 기준을 정합니다.',
  throughput: '처리량 또는 실제 공간 이용량의 측정 단위를 먼저 정합니다.',
  unknown: '가장 먼저 개선할 목표와 측정 기준을 상담에서 확인합니다.',
};

const timingSteps: Record<string, string> = {
  explore: '내부 검토용 요약과 필요자료 목록을 먼저 준비합니다.',
  soon: '희망 검토 시기를 전달하고 공급·연동 조건 확인 후 가능한 일정을 협의합니다.',
  planned: '예산 일정·구매 절차·필수 마감일을 확인한 뒤 수행 범위를 협의합니다.',
  unknown: '준비자료 확인 후 고객 일정에 맞는 다음 단계를 정합니다.',
};

function product(id: string): FitProduct[] {
  return FIT_PRODUCTS.filter(item => item.id === id).map(item => ({ ...item }));
}

function problemRecommendation(problem: string, goal: string): FitRecommendation {
  const shared = {
    status: 'candidate' as const, notes: [], nextStep: '',
  };

  if (problem === 'facility' && goal === 'energy') {
    return {
      ...shared, title: '설비·에너지 운영 개선 검토', products: product('SSAx'),
      reason: '시설 운영 중에서도 에너지·설비 운영비 개선을 우선 선택해 계측과 설비 데이터를 먼저 검토합니다.',
      firstStep: '한 설비군의 계측 데이터·운전 조건·비용 구조를 정리합니다.',
      extensions: ['현장 점검·VOC 업무까지 필요한 경우 Smart FM과의 역할 및 중복 범위를 확인합니다.'],
      checks: ['계측 이력·설비 목록·제어 권한·기존 BEMS/FMS와의 연동 조건을 확인합니다.'],
      metrics: ['운전 조건별 에너지 사용량', '최대 수요전력', '설비 가동시간'],
      costFactors: ['계측 포인트 수', '대상 설비 수', '데이터 연동 범위', '제어 범위·권한 검증'],
    };
  }

  switch (problem) {
    case 'facility':
      return {
        ...shared, title: '시설 운영 효율화 검토', products: product('Smart FM'),
        reason: '점검·민원·설비 이력이 흩어진 문제를 현장 업무와 기록부터 정리하는 방향으로 검토합니다.',
        firstStep: '한 설비군의 점검표·VOC 처리 절차·담당자를 정리합니다.',
        extensions: ['설비·에너지 데이터가 필요해지면 SSAx와의 역할·데이터 책임·기능 중복을 확인합니다.'],
        checks: ['자산 목록·점검표·업무 담당자·기존 FMS의 중복 기능을 확인합니다.'],
        metrics: ['누락 점검률', 'VOC 처리시간', '현장 기록 소요시간'],
        costFactors: ['사업장·공간 수', '설비·사용자 수', '데이터 이전 범위'],
      };
    case 'access':
      return {
        ...shared, title: '방문·출입 운영 간소화 검토', products: product('SSiN'),
        reason: '방문 신청과 승인·출입 절차를 줄이려는 요구에 맞춰 방문 유형별 업무를 먼저 확인합니다.',
        firstStep: '방문 유형 하나의 신청·승인 절차와 승인 담당자를 정리합니다.',
        extensions: ['현장 이벤트 확인이 필요하면 SSoN, 제한구역 제어가 필요하면 Edge H/W의 연동 조건을 확인합니다.'],
        checks: ['기존 출입통제 장비·연동 방식·방문 유형별 승인 권한을 확인합니다.'],
        metrics: ['방문 승인 소요시간', '재입력 건수', '현장 대기시간'],
        costFactors: ['방문 유형·사업장 수', '출입구 수', '장비·시스템 연동 범위'],
      };
    case 'monitor':
      return {
        ...shared, title: '안전·보안 통합관제 검토', products: product('SSoN'),
        reason: '여러 시스템의 경보와 발생 위치를 함께 파악하려는 요구에 맞춰 이벤트와 대응 업무를 연결합니다.',
        firstStep: '한 구역의 이벤트 종류·발생 위치·대응 담당자를 정리합니다.',
        extensions: ['출입 이력 연결이 필요하면 SSiN, 감지 수단이 부족하면 Edge H/W의 제공·연동 조건을 검토합니다.'],
        checks: ['CCTV·센서 목록, 이벤트 제공 방식, 도면·네트워크 조건을 확인합니다.'],
        metrics: ['이벤트 인지부터 담당자 확인까지의 시간', '중복 경보 건수'],
        costFactors: ['관제 구역 수', '장비 채널 수', '연동 시스템 수', '도면 범위'],
      };
    case 'space':
      return {
        ...shared, title: '회의실·좌석 운영 개선 검토', products: product('SpaceOps'),
        reason: '회의실·좌석 예약과 실제 이용 현황을 정리해 공간 운영 문제를 확인합니다.',
        firstStep: '회의실 또는 좌석 한 구역의 예약·이용 규칙을 정리합니다.',
        extensions: ['방문객 안내가 필요하면 SSiN, 점유 기반 설비 운영이 필요하면 SSAx의 연동 조건을 확인합니다.'],
        checks: ['회의실·좌석 수, 기존 예약·일정 시스템, 점유 데이터 수집 조건을 확인합니다.'],
        metrics: ['예약 부도율', '실제 이용률', '예약 충돌 건수'],
        costFactors: ['회의실·좌석 수', '사용자 수', '센서 수', '일정 시스템 연동 범위'],
      };
    case 'safety':
      return {
        ...shared, status: 'review', title: '위험 감지·대피 지원 개발·실증 상담', products: [],
        reason: '위험 감지와 대피 안내는 현장 조건과 기능별 검증이 필요해 개발·실증 범위 상담을 먼저 진행합니다.',
        firstStep: '한 구역·위험 시나리오의 요구사항과 실증 범위를 정의합니다.',
        extensions: ['Golden Bridge·Edge H/W는 기능 제공 상태와 실증 조건 확인 후 검토할 후보입니다.', '기존 관제 연결이 필요하면 SSoN 연계 가능성을 별도로 확인합니다.'],
        checks: ['감지 대상·도면·장비 설치 조건·비상 운영 절차를 확인합니다.', '기능별 현재 개발·제공 상태, 실증 결과와 수행 책임을 담당자에게 확인합니다.'],
        metrics: ['시나리오별 감지·안내 소요시간', '오탐·미탐 건수', '통신·전원 장애 시 동작'],
        costFactors: ['실증 시나리오·구역 수', '장비·설치 조건', '연동·검증 범위', '운영지원 범위'],
      };
    case 'logistics':
      return {
        ...shared, status: 'review', title: '물류 병목 분석·자동화 설계 검토', products: product('Logistics DX'),
        reason: '처리량과 공간 제약을 확인해야 자동화 구성의 적합성을 판단할 수 있어 분석·설계부터 검토합니다.',
        firstStep: '병목 공정 하나의 물동량·동선·레이아웃을 분석합니다.',
        extensions: ['물동량·건물 조건 검증 후 필요한 장비 후보와 연동 범위를 정합니다.', '구축 후 점검 업무가 필요하면 Smart FM의 적용 조건을 확인합니다.'],
        checks: ['SKU·피크 물동량·치수·하중·건물 조건·WMS/WCS 연동 조건을 확인합니다.'],
        metrics: ['시간당 처리량', '주문당 이동시간', '설비 가동률'],
        costFactors: ['분석·설계 범위', '장비·설치 공사 범위', '시스템 연동 범위', '유지관리 범위'],
      };
    default:
      return {
        ...shared, status: 'clarify', title: '우선 해결할 업무부터 함께 확인', products: [],
        reason: '아직 문제를 정하지 않아 현장의 반복 업무와 병목을 확인한 뒤 검토 분야를 정합니다.',
        firstStep: '현재 업무와 가장 불편한 상황 한 가지를 정리합니다.',
        extensions: [], checks: ['업무 담당자·운영 절차·사용 자료를 확인합니다.'],
        metrics: ['상담에서 목표와 측정 항목을 함께 정합니다.'],
        costFactors: ['업무·수행 범위 확인 후 비용 산정 항목을 정합니다.'],
      };
  }
}

export function buildFitRecommendation(answers: FitAnswers): FitRecommendation | null {
  if (!answers || !FIT_QUESTIONS.every(question =>
    question.options.some(option => option.value === answers[question.key]),
  )) return null;

  const conflict = answers.problem !== 'unknown' && answers.goal !== 'unknown'
    && !compatibleGoals[answers.problem].includes(answers.goal);
  const result = problemRecommendation(conflict ? 'unknown' : answers.problem, answers.goal);

  if (conflict) {
    result.title = '문제와 목표의 우선순위 확인';
    result.reason = '선택한 문제와 도입 목표의 연결을 먼저 확인해야 합니다. 제품을 정하기 전에 우선 해결할 업무를 함께 정합니다.';
    result.firstStep = '선택한 문제와 목표 중 무엇을 먼저 개선할지 상담에서 확인합니다.';
  }

  if (result.status === 'candidate' && Object.values(answers).includes('unknown')) {
    result.status = 'review';
  }
  result.checks.push(siteChecks[answers.site], systemChecks[answers.system]);
  result.notes.push(scopeNotes[answers.scale], goalNotes[answers.goal]);
  result.notes.push('표시된 구성은 검토 후보이며, 제품별 제공 범위·연동 조건은 담당자 확인이 필요합니다.');
  if (answers.problem === 'logistics' && answers.site === 'office') {
    result.checks.push('오피스 내 물류 업무의 존재·규모를 확인하기 전 자동화 장비 선정은 보류합니다.');
  }
  result.nextStep = `${result.firstStep} ${systemChecks[answers.system]} ${timingSteps[answers.timing]}`;
  return result;
}

export function createFitSummary(answers: FitAnswers, recommendation: FitRecommendation): string {
  const statuses = { candidate: '도입 조건 확인이 필요한 구성 후보', review: '사전 검토 필요', clarify: '문제·목표 확인 필요' };
  return [
    'GNG Fit | 현장 맞춤 솔루션 검토안',
    ...FIT_QUESTIONS.map(question => `${question.label} ${question.options.find(option => option.value === answers[question.key])?.label ?? '미응답'}`),
    '',
    `검토 분야: ${recommendation.title}`,
    `상태: ${statuses[recommendation.status]}`,
    `선정 이유: ${recommendation.reason}`,
    `먼저 검토할 구성: ${recommendation.products.length ? recommendation.products.map(item => `${item.name} (${item.statusLabel})`).join(', ') : '상담에서 범위 확인 후 결정'}`,
    `시작 범위: ${recommendation.firstStep}`,
    `조건부 확장: ${recommendation.extensions.join(' / ') || '우선 해결할 업무 확인 후 검토'}`,
    `확인 조건: ${recommendation.checks.join(' / ')}`,
    `측정할 항목: ${recommendation.metrics.join(' / ')}`,
    `비용을 결정하는 항목: ${recommendation.costFactors.join(' / ')}`,
    `검토 메모: ${recommendation.notes.join(' / ')}`,
    `다음 단계: ${recommendation.nextStep}`,
    '',
    '금액·구축 기간·개선 효과는 산정하지 않았으며, 확정 견적이나 도입 약속이 아닙니다.',
  ].join('\n');
}

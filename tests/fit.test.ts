import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFitRecommendation, createFitSummary, EMPTY_FIT_ANSWERS, FIT_PRODUCTS, FIT_QUESTIONS } from '../data/fit.ts';
import { FIT_RULE_VERSION } from '../data/fitTypes.ts';
import type { FitAnswers } from '../data/fitTypes.ts';

const baseline: FitAnswers = {
  site: 'building', problem: 'facility', scale: 'zone', system: 'manual', goal: 'work', timing: 'explore',
};

test('미응답과 허용하지 않은 응답은 결과를 생성하지 않는다', () => {
  assert.equal(buildFitRecommendation(EMPTY_FIT_ANSWERS), null);
  for (const question of FIT_QUESTIONS) {
    assert.equal(buildFitRecommendation({ ...baseline, [question.key]: '' }), null);
    assert.equal(buildFitRecommendation({ ...baseline, [question.key]: 'unexpected' }), null);
  }
});

test('모르겠음은 유효한 응답이며 문제 확인 전 제품을 추천하지 않는다', () => {
  const result = buildFitRecommendation({
    site: 'unknown', problem: 'unknown', scale: 'unknown', system: 'unknown', goal: 'unknown', timing: 'unknown',
  });
  assert.ok(result);
  assert.equal(result.status, 'clarify');
  assert.deepEqual(result.products, []);
  const unknownGoal = buildFitRecommendation({ ...baseline, goal: 'unknown' });
  assert.equal(unknownGoal?.status, 'review');
  assert.ok(unknownGoal?.notes.some(note => note.includes('목표와 측정 기준')));
});

test('문제와 목표가 충돌하면 제품 추천을 보류한다', () => {
  for (const [problem, goal] of [['access', 'energy'], ['space', 'safety'], ['safety', 'throughput'], ['logistics', 'energy']]) {
    const result = buildFitRecommendation({ ...baseline, problem, goal });
    assert.equal(result?.status, 'clarify');
    assert.deepEqual(result?.products, []);
    assert.match(result?.reason ?? '', /우선 해결할 업무/);
  }
});

test('시설의 에너지 목표는 SSAx와 계측·설비·연동·제어 비용요인으로 전환한다', () => {
  const regular = buildFitRecommendation(baseline);
  const energy = buildFitRecommendation({ ...baseline, goal: 'energy' });
  assert.deepEqual(regular?.products.map(item => item.name), ['Smart FM']);
  assert.deepEqual(energy?.products.map(item => item.name), ['SSAx']);
  for (const factor of ['계측', '설비', '연동', '제어']) {
    assert.ok(energy?.costFactors.some(item => item.includes(factor)), factor);
  }
  assert.notDeepEqual(regular?.metrics, energy?.metrics);
});

test('위험 감지·대피는 개발·실증 상담, 물류는 분석·설계부터 제시한다', () => {
  const safety = buildFitRecommendation({ ...baseline, problem: 'safety', goal: 'safety' });
  assert.equal(safety?.status, 'review');
  assert.deepEqual(safety?.products, []);
  assert.match(safety?.title ?? '', /개발·실증 상담/);
  const logistics = buildFitRecommendation({ ...baseline, site: 'office', problem: 'logistics', goal: 'throughput' });
  assert.equal(logistics?.status, 'review');
  assert.match(logistics?.firstStep ?? '', /분석/);
  assert.ok(logistics?.checks.some(item => item.includes('장비 선정은 보류')));
});

test('현장·규모·기존 환경·희망 시기가 확인자료와 다음 단계에 반영된다', () => {
  const result = buildFitRecommendation(baseline);
  const changed = buildFitRecommendation({ ...baseline, site: 'factory', scale: 'multi', system: 'connected', timing: 'planned' });
  assert.notDeepEqual(result?.notes, changed?.notes);
  assert.ok(changed?.checks.some(item => item.includes('생산 중단')));
  assert.ok(changed?.checks.some(item => item.includes('API 문서')));
  assert.match(changed?.nextStep ?? '', /구매 절차/);
  assert.match(result?.nextStep ?? '', /수기 자료/);
});

test('상담·저장 요약에 6개 응답과 구성·조건을 담고 내부 규칙 버전은 표시하지 않는다', () => {
  const result = buildFitRecommendation(baseline);
  assert.ok(result);
  const summary = createFitSummary(baseline, result);
  for (const question of FIT_QUESTIONS) {
    const option = question.options.find(item => item.value === baseline[question.key]);
    assert.ok(summary.includes(`${question.label} ${option?.label}`));
  }
  for (const heading of ['선정 이유:', '먼저 검토할 구성:', '확인 조건:', '비용을 결정하는 항목:', '다음 단계:']) {
    assert.ok(summary.includes(heading));
  }
  assert.ok(!summary.includes(FIT_RULE_VERSION));
  assert.match(summary, /금액·구축 기간·개선 효과는 산정하지 않았/);
});

test('응답과 제품 카탈로그를 변경하지 않고 반복 호출 결과가 동일하다', () => {
  const answers = Object.freeze({ ...baseline });
  const initial = buildFitRecommendation(answers);
  assert.deepEqual(buildFitRecommendation(answers), initial);
  assert.ok(initial);
  initial.products[0].name = 'changed';
  initial.checks.push('changed');
  assert.deepEqual(buildFitRecommendation(answers)?.products.map(item => item.name), ['Smart FM']);
  assert.equal(FIT_PRODUCTS.length, 8);
  assert.ok(FIT_PRODUCTS.every(item => item.statusLabel.includes('확인 필요')));
});

test('모든 허용 응답 조합은 유효한 결과를 만들고 불확실한 문제는 제품 없이 안내한다', () => {
  let checked = 0;
  const visit = (index: number, answers: FitAnswers) => {
    if (index === FIT_QUESTIONS.length) {
      const result = buildFitRecommendation(answers);
      assert.ok(result);
      assert.ok(result.title && result.reason && result.nextStep);
      if (answers.problem === 'unknown' || result.status === 'clarify') assert.deepEqual(result.products, []);
      if (answers.problem === 'safety') assert.deepEqual(result.products, []);
      checked++;
      return;
    }
    const question = FIT_QUESTIONS[index];
    for (const option of question.options) visit(index + 1, { ...answers, [question.key]: option.value });
  };
  visit(0, EMPTY_FIT_ANSWERS);
  assert.equal(checked, 16128);
});

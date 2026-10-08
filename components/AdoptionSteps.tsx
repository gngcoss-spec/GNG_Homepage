import React from 'react';
import { ArrowRight } from 'lucide-react';

const steps = [
  { title: '현장과 문제 확인', description: '진단 내용과 현재 운영 방식을 함께 살펴보고, 먼저 해결할 업무를 정합니다.', output: '우선 과제 · 필요한 현황 자료' },
  { title: '적용 범위 설계', description: '기존 시스템 활용 가능성, 연동 조건과 필요한 구성·비용 항목을 확인합니다.', output: '구성안 · 포함 범위 · 견적 조건' },
  { title: '필요한 범위 검증', description: '표준 적용은 구축으로 진행하고, 현장 성능이나 연동 확인이 필요하면 제한된 범위에서 먼저 검증합니다.', output: '검증 기준 · 적용 여부 결정' },
  { title: '구축과 운영 인계', description: '합의한 범위를 구축하고 사용 교육·운영 지원 범위를 정합니다. 효과를 확인한 뒤 확장을 검토합니다.', output: '운영 안내 · 지원 범위 · 개선 과제' },
];

const AdoptionSteps: React.FC = () => (
  <section id="adoption" className="border-t border-line bg-white py-20 md:py-24" aria-labelledby="adoption-title">
    <div className="max-w-7xl mx-auto px-6">
      <p className="ticker mb-4">HOW WE START</p>
      <div className="max-w-3xl mb-10">
        <h2 id="adoption-title" className="text-3xl md:text-4xl font-bold text-ink mb-4">작게 시작하고, 확인한 뒤 확장합니다</h2>
        <p className="text-slate-600 leading-relaxed">진단 결과를 바탕으로 실제 현장에 맞는 도입 범위를 함께 정합니다. 일정과 비용은 제품의 제공 범위와 현장 조건을 확인한 뒤 안내합니다.</p>
      </div>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-line bg-background p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary">0{index + 1}</span>
            <h3 className="text-lg font-bold text-ink mt-5 mb-3">{step.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
            <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed font-medium text-primary">{step.output}</p>
          </li>
        ))}
      </ol>
      <a href="#fit" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4">
        우리 현장의 시작점 찾기 <ArrowRight size={17} aria-hidden="true" />
      </a>
    </div>
  </section>
);

export default AdoptionSteps;

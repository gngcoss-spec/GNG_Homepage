import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ClipboardList, Download, RotateCcw } from 'lucide-react';
import { EMPTY_FIT_ANSWERS, FIT_PROBLEMS, FIT_QUESTIONS, buildFitRecommendation, createFitSummary } from '../data/fit';
import { FIT_INQUIRY_EVENT, FIT_INVALIDATE_EVENT, FIT_RULE_VERSION } from '../data/fitTypes';
import type { FitAnswers, FitInquiryDetail, FitRecommendation } from '../data/fitTypes';

const STEPS = ['현장과 고민', '현재 운영', '목표와 시기'];
const buttonFocus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

const scrollToElement = (element: HTMLElement | null) => {
  element?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  });
};

const FitFinder: React.FC = () => {
  const [answers, setAnswers] = useState<FitAnswers>({ ...EMPTY_FIT_ANSWERS });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<FitRecommendation | null>(null);
  const [errorKey, setErrorKey] = useState<keyof FitAnswers | null>(null);
  const [status, setStatus] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const currentQuestions = FIT_QUESTIONS.slice(step * 2, step * 2 + 2);

  useEffect(() => {
    if (result) {
      resultRef.current?.focus({ preventScroll: true });
      scrollToElement(resultRef.current);
    }
  }, [result]);

  const focusAfterUpdate = (id: string, scroll = false) => {
    window.requestAnimationFrame(() => {
      const element = document.getElementById(id);
      element?.focus({ preventScroll: true });
      if (scroll) scrollToElement(document.getElementById('fit'));
    });
  };

  const updateAnswer = (key: keyof FitAnswers, value: string) => {
    window.dispatchEvent(new Event(FIT_INVALIDATE_EVENT));
    setAnswers(previous => ({ ...previous, [key]: value }));
    setResult(null);
    setErrorKey(null);
    setStatus(result ? '선택을 변경했습니다. 검토안을 다시 만들어 주세요.' : '');
  };

  const chooseProblem = (problem: string) => {
    updateAnswer('problem', problem);
    setStep(0);
    focusAfterUpdate('fit-site', true);
  };

  const reset = () => {
    window.dispatchEvent(new Event(FIT_INVALIDATE_EVENT));
    setAnswers({ ...EMPTY_FIT_ANSWERS });
    setStep(0);
    setResult(null);
    setErrorKey(null);
    setStatus('선택을 모두 초기화했습니다.');
    focusAfterUpdate('fit-site', true);
  };

  const submitStep = (event: React.FormEvent) => {
    event.preventDefault();
    const questionsToCheck = step === STEPS.length - 1 ? FIT_QUESTIONS : currentQuestions;
    const missing = questionsToCheck.find(question => !question.options.some(option => option.value === answers[question.key]));
    if (missing) {
      setErrorKey(missing.key);
      setStep(Math.floor(FIT_QUESTIONS.indexOf(missing) / 2));
      setStatus('');
      focusAfterUpdate(`fit-${missing.key}`);
      return;
    }
    setErrorKey(null);
    if (step < STEPS.length - 1) {
      setStep(previous => previous + 1);
      focusAfterUpdate('fit-step-title');
      return;
    }
    const recommendation = buildFitRecommendation(answers);
    setResult(recommendation);
    setStatus(recommendation ? '선택하신 조건의 검토안을 준비했습니다.' : '선택 항목을 다시 확인해 주세요.');
  };

  const editAnswers = () => {
    window.dispatchEvent(new Event(FIT_INVALIDATE_EVENT));
    setResult(null);
    setStep(0);
    setStatus('선택을 수정한 뒤 검토안을 다시 만들어 주세요.');
    focusAfterUpdate('fit-site', true);
  };

  const downloadSummary = () => {
    if (!result) return;
    const blob = new Blob(['\uFEFF', createFitSummary(answers, result)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gng-fit-review.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('검토안 파일 저장을 시작했습니다.');
  };

  const prepareInquiry = () => {
    if (!result) return;
    const detail: FitInquiryDetail = {
      summary: createFitSummary(answers, result),
      solutionNames: result.products.map(product => product.name),
      ruleVersion: FIT_RULE_VERSION,
    };
    const url = new URL(window.location.href);
    url.searchParams.delete('inquiry');
    url.hash = 'contact';
    window.history.replaceState(window.history.state, '', url);
    window.dispatchEvent(new CustomEvent<FitInquiryDetail>(FIT_INQUIRY_EVENT, { detail }));
    scrollToElement(document.getElementById('contact'));
    setStatus('검토안을 아래 상담 양식에 담았습니다. 내용을 확인한 뒤 전송해 주세요.');
  };

  return (
    <section id="needs" aria-labelledby="needs-title" className="py-20 md:py-28 bg-background border-t border-line scroll-mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary mb-5">
            <ClipboardList size={14} aria-hidden="true" /> GNG Fit · 현장 맞춤 솔루션 설계
          </span>
          <h2 id="needs-title" className="text-3xl md:text-5xl font-bold text-ink leading-tight tracking-tight">
            우리 현장의 고민,<br /><span className="text-primary">어디서부터 바꿀까요?</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed">
            가장 먼저 해결할 문제를 골라 주세요. 현장 조건에 맞춰 검토할 구성과 작은 시작 범위를 함께 정리합니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FIT_PROBLEMS.map((problem, index) => {
            const selected = answers.problem === problem.id;
            return (
              <button
                key={problem.id}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseProblem(problem.id)}
                className={`group min-h-44 p-5 sm:p-6 rounded-2xl border text-left motion-safe:transition-colors ${buttonFocus} ${selected ? 'border-primary bg-[#F5F2FC]' : 'border-line bg-white hover:border-primary/40'}`}
              >
                <span className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>
                  {selected ? <Check size={18} className="text-primary" aria-hidden="true" /> : <ArrowRight size={18} className="text-slate-400 group-hover:text-primary" aria-hidden="true" />}
                </span>
                <span className="block text-lg font-bold text-ink leading-snug">{problem.title}</span>
                <span className="block mt-2 text-sm text-slate-600 leading-relaxed">{problem.description}</span>
              </button>
            );
          })}
        </div>

        <div id="fit" className="mt-12 md:mt-16 rounded-3xl border border-line bg-white overflow-hidden scroll-mt-24">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="p-5 sm:p-8 lg:p-10 bg-[#F5F2FC] border-b lg:border-b-0 lg:border-r border-line">
              <span className="text-xs font-bold tracking-widest text-primary">FIND YOUR FIT</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-ink mt-4 leading-snug">6개 질문으로 찾는<br />우리 현장의 시작점</h3>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">제품을 몰라도 괜찮습니다. 아직 정하지 못한 내용은 ‘모름’에 해당하는 답변을 선택해 주세요.</p>
              <ul className="space-y-3 mt-7 text-sm text-ink">
                {['연락처 입력 없이 검토안 확인', '선정 이유와 필요한 확인 사항 안내', '내부 검토용 요약 파일 저장'].map(text => (
                  <li key={text} className="flex items-start gap-2.5"><Check size={16} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />{text}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-600 leading-relaxed mt-8">선택 내용은 이 페이지에서만 유지되며 새로고침하면 초기화됩니다. 상담 양식에서 직접 전송하기 전에는 외부로 전달되지 않습니다.</p>
            </div>

            <form id="fit-form" onSubmit={submitStep} noValidate className="min-w-0 p-5 sm:p-8 lg:p-10">
              <ol aria-label="진단 진행 단계" className="grid grid-cols-3 gap-2 mb-7">
                {STEPS.map((label, index) => (
                  <li key={label} aria-current={index === step ? 'step' : undefined} className={`border-t-2 pt-3 ${index <= step ? 'border-primary text-primary' : 'border-line text-slate-500'}`}>
                    <span className="block font-mono text-xs mb-1">0{index + 1}</span>
                    <span className="text-xs sm:text-sm font-semibold">{label}</span>
                  </li>
                ))}
              </ol>

              <h4 id="fit-step-title" tabIndex={-1} className="text-xl font-bold text-ink focus:outline-none">{step + 1}단계 · {STEPS[step]}</h4>
              <p className="mt-2 mb-6 text-xs text-slate-500">두 항목 모두 선택해 주세요.</p>
              <div className="space-y-6">
                {currentQuestions.map(question => (
                  <div key={question.key}>
                    <label htmlFor={`fit-${question.key}`} className="block mb-2 text-sm font-semibold text-ink">{question.label}</label>
                    <select
                      id={`fit-${question.key}`}
                      name={question.key}
                      value={answers[question.key]}
                      onChange={event => updateAnswer(question.key, event.target.value)}
                      required
                      aria-invalid={errorKey === question.key || undefined}
                      aria-describedby={errorKey === question.key ? 'fit-answer-error' : undefined}
                      className={`w-full min-w-0 min-h-12 rounded-xl border bg-white pl-3 pr-7 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errorKey === question.key ? 'border-red-600' : 'border-line'}`}
                    >
                      <option value="" disabled>선택해 주세요</option>
                      {question.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    {errorKey === question.key && <p id="fit-answer-error" role="alert" className="mt-2 text-sm text-red-700">이 항목을 선택해 주세요. 아직 모르는 경우도 선택할 수 있습니다.</p>}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                {step > 0 && (
                  <button type="button" onClick={() => { setStep(previous => previous - 1); setErrorKey(null); focusAfterUpdate('fit-step-title'); }} className={`inline-flex min-h-12 items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line text-sm font-semibold text-ink hover:bg-background ${buttonFocus}`}>
                    <ArrowLeft size={16} aria-hidden="true" /> 이전
                  </button>
                )}
                <button type="submit" className={`flex-1 inline-flex min-h-12 items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold ${buttonFocus}`}>
                  {step === STEPS.length - 1 ? '맞춤 검토안 보기' : '다음'}<ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
              <button type="button" onClick={reset} className={`inline-flex min-h-11 items-center gap-2 text-xs text-slate-600 mt-2 rounded-lg px-2 hover:text-primary ${buttonFocus}`}>
                <RotateCcw size={13} aria-hidden="true" /> 선택 초기화
              </button>
            </form>
          </div>
        </div>

        <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 min-h-6 text-sm text-primary">{status}</p>

        {result && (
          <div id="fit-result" ref={resultRef} tabIndex={-1} aria-labelledby="fit-result-title" className="mt-7 rounded-3xl border border-primary/20 bg-white overflow-hidden scroll-mt-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <div className="p-5 sm:p-8 md:p-10 bg-ink text-white">
              <span className="text-xs font-semibold text-purple-200">{result.status === 'clarify' ? '추가 진단부터 시작해요' : result.status === 'review' ? '현장 조건을 먼저 확인해요' : '우선 검토할 구성'}</span>
              <h3 id="fit-result-title" className="mt-3 text-2xl sm:text-3xl font-bold leading-snug">{result.title}</h3>
              <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">{result.reason}</p>
              <p className="mt-5 text-xs text-slate-300 leading-relaxed">선택하신 조건에 따른 초기 검토안입니다. 실제 제공 범위, 연동 가능 여부와 비용은 현장 조건을 확인한 후 정합니다.</p>
            </div>

            <div className="p-5 sm:p-8 md:p-10 space-y-8">
              <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-2xl bg-background p-4 sm:p-5">
                {FIT_QUESTIONS.map(question => (
                  <div key={question.key} className="min-w-0">
                    <dt className="text-xs text-slate-500 mb-1">{question.label}</dt>
                    <dd className="text-sm font-semibold text-ink break-words">{question.options.find(option => option.value === answers[question.key])?.label}</dd>
                  </div>
                ))}
              </dl>

              {result.products.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-ink mb-4">검토할 솔루션</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.products.map(product => (
                      <article key={product.id} className="rounded-2xl border border-line p-5">
                        <span className="inline-flex rounded-full bg-[#F5F2FC] px-2.5 py-1 text-xs font-medium text-primary">{product.statusLabel}</span>
                        <h5 className="mt-3 text-xl font-bold text-ink">{product.name}</h5>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.role}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-[#F5F2FC] p-5 sm:p-6">
                <h4 className="font-bold text-primary">최소 시작 범위</h4>
                <p className="mt-2 text-sm text-ink leading-relaxed">{result.firstStep}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-7">
                {[
                  { title: '먼저 확인할 사항', items: result.checks },
                  { title: '효과를 확인할 지표', items: result.metrics },
                  { title: '비용을 결정하는 요소', items: result.costFactors },
                  { title: '필요할 때만 검토할 확장', items: result.extensions },
                ].map(group => (
                  <div key={group.title}>
                    <h4 className="text-base font-bold text-ink mb-3">{group.title}</h4>
                    <ul className="space-y-2">
                      {group.items.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"><span className="w-1 h-1 rounded-full bg-primary shrink-0 mt-2.5" aria-hidden="true" /><span>{item}</span></li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {result.notes.length > 0 && <ul className="space-y-2 border-t border-line pt-5 text-xs text-slate-600 leading-relaxed">{result.notes.map(note => <li key={note}>{note}</li>)}</ul>}

              <div className="border-t border-line pt-7">
                <h4 className="text-lg font-bold text-ink">다음 단계</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{result.nextStep}</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
                  <button type="button" onClick={prepareInquiry} className={`inline-flex min-h-12 justify-center items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark ${buttonFocus}`}>이 검토안으로 상담 준비<ArrowRight size={16} aria-hidden="true" /></button>
                  <button type="button" onClick={downloadSummary} className={`inline-flex min-h-12 justify-center items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-background ${buttonFocus}`}><Download size={16} aria-hidden="true" />검토안 저장 (.txt)</button>
                  <button type="button" onClick={editAnswers} className={`inline-flex min-h-12 justify-center items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:text-primary ${buttonFocus}`}>선택 수정</button>
                </div>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">상담 준비를 누르면 아래 문의 양식에 검토안이 담깁니다. 연락처와 내용을 확인한 뒤 직접 전송해 주세요.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FitFinder;

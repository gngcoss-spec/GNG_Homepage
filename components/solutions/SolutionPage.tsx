// ============================================================
// SolutionPage.tsx — 솔루션 상세 페이지 공통 템플릿 (/solutions/:slug)
// 섹션 순서 = 고객이 묻는 순서:
//  1 Hero · 2 문제→결과 · 3 핵심 기능 · 4 작동 흐름 · 5 도입 구성 · 6 도입 절차
//  7 사례 · 8 사양 · 9 FAQ · 10 관련 솔루션 · 11 CTA(자료·데모·문의)
// 실제 화면이 없으면 "화면 준비 중" 플레이스홀더 표시
// ============================================================
import React, { useEffect, useLayoutEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ImageOff, ChevronRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import LeadGate from './LeadGate';
import { useSeo } from '../../lib/useSeo';
import { SOLUTIONS, COMMON_PROCESS, getSolution } from '../../content/solutions';
import type { SolutionStatus } from '../../content/solutions/types';

const SITE = 'https://gngss.co.kr';

const StatusBadge: React.FC<{ status: SolutionStatus }> = ({ status }) => {
  const base = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border';
  if (status.kind === 'available')
    return <span className={`${base} bg-green-50 text-green-700 border-green-200`}><span className="w-1.5 h-1.5 rounded-full bg-green-500" />{status.label ?? '제공 중'}</span>;
  if (status.kind === 'pilot')
    return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{status.label ?? '실증 진행 중'}</span>;
  return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{status.label ?? '개발 중'} · {status.eta}</span>;
};

const SectionHead: React.FC<{ eyebrow: string; title: string; desc?: string }> = ({ eyebrow, title, desc }) => (
  <div className="mb-10">
    <div className="ticker mb-3">{eyebrow}</div>
    <h2 className="text-2xl md:text-4xl font-bold text-ink leading-tight">{title}</h2>
    {desc && <p className="text-slate-600 mt-3 max-w-3xl">{desc}</p>}
  </div>
);

const ScreenPlaceholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="aspect-[16/10] rounded-2xl border border-dashed border-line bg-[#F5F2FC]/60 flex flex-col items-center justify-center text-slate-400 gap-2" aria-label={`${label} 화면 준비 중`}>
    <ImageOff size={28} />
    <span className="text-xs tracking-wide">실제 화면 준비 중</span>
  </div>
);

const SolutionPage: React.FC = () => {
  const { slug = '' } = useParams();
  const s = getSolution(slug);

  useLayoutEffect(() => { document.documentElement.scrollTop = 0; window.scrollTo(0, 0); }, [slug]);

  const url = `${SITE}/solutions/${s?.slug ?? ''}`;
  useSeo({ title: s?.seo.title ?? '솔루션 | 가능가 GNG', description: s?.seo.description ?? '', url });

  if (!s) return <Navigate to="/solutions" replace />;

  const process = s.process ?? COMMON_PROCESS;
  const related = s.related.map(getSolution).filter(Boolean) as typeof SOLUTIONS;
  const inquiryHref = `${import.meta.env.BASE_URL}?inquiry=${encodeURIComponent(s.name)}#contact`;

  return (
    <div className="min-h-screen bg-background text-ink overflow-x-hidden">
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', name: s.name, alternateName: s.subtitle,
        description: s.seo.description, url, brand: { '@type': 'Organization', name: '가능가 주식회사 (GNG)' },
      })}</script>

      <Navbar />

      <main className="relative z-10">
        {/* ===== 1. Hero ===== */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-line bg-surface/60">
          <div className="max-w-7xl mx-auto px-6">
            <nav aria-label="breadcrumb" className="text-xs text-slate-500 mb-6 flex items-center gap-1">
              <Link to="/" className="hover:text-primary">홈</Link><ChevronRight size={12} />
              <Link to="/solutions" className="hover:text-primary">솔루션</Link><ChevronRight size={12} />
              <span className="text-ink">{s.name}</span>
            </nav>
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="ticker">{s.category}</span>
                  <StatusBadge status={s.status} />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-3">{s.name}</h1>
                <p className="text-primary font-medium mb-6">{s.subtitle}</p>
                <p className="text-2xl md:text-3xl font-semibold leading-snug mb-5">{s.tagline}</p>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-2xl">{s.summary}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {s.audiences.map((a) => <span key={a} className="px-3 py-1 rounded-full border border-line bg-white text-xs text-slate-700">{a}</span>)}
                </div>
                {s.status.kind === 'developing' && s.status.note && (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">{s.status.note}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#resource" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all">소개 자료 받기 <ArrowRight size={16} /></a>
                  <a href="#demo" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border border-line text-ink text-sm font-bold rounded-full hover:border-primary/40 hover:bg-[#F5F2FC] transition-all">데모·상담 요청</a>
                </div>
              </div>
              <div className="lg:col-span-5">
                {s.features[0]?.screenshot ? (
                  <img src={s.features[0].screenshot.src} alt={s.features[0].screenshot.alt} className="rounded-2xl border border-line shadow-xl w-full" />
                ) : <ScreenPlaceholder label={s.name} />}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. 문제 → 결과 ===== */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="BEFORE → AFTER" title="지금 현장의 문제와, 도입 후 달라지는 것" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white border border-line p-8">
                <div className="text-xs font-bold text-slate-500 tracking-wider mb-4">BEFORE · 현재</div>
                <ul className="space-y-3 text-slate-700">
                  {s.problems.before.map((t) => <li key={t} className="flex gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />{t}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl bg-[#F5F2FC] border border-primary/20 p-8">
                <div className="text-xs font-bold text-primary tracking-wider mb-4">AFTER · {s.name} 도입 후</div>
                <ul className="space-y-3 text-ink">
                  {s.problems.after.map((t) => <li key={t} className="flex gap-3"><CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />{t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. 핵심 기능 ===== */}
        <section id="features" className="py-20 md:py-28 bg-surface border-y border-line">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow={`CORE FUNCTIONS · ${s.features.length}`} title="실제로 무엇을 할 수 있나" />
            <div className="space-y-16">
              {s.features.map((f, i) => (
                <div key={f.title} className={`grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div>
                    <div className="ticker mb-3">{String(i + 1).padStart(2, '0')}</div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">{f.title}</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">{f.summary}</p>
                    {f.benefit && <p className="text-primary font-medium mb-4">{f.benefit}</p>}
                    <ul className="space-y-2 text-sm text-slate-600">
                      {f.items.map((it) => <li key={it} className="flex gap-2"><CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />{it}</li>)}
                    </ul>
                  </div>
                  <div>
                    {f.screenshot ? (
                      <figure>
                        <img src={f.screenshot.src} alt={f.screenshot.alt} loading="lazy" className="rounded-2xl border border-line shadow-lg w-full" />
                        {f.screenshot.caption && <figcaption className="text-xs text-slate-500 mt-2">{f.screenshot.caption}</figcaption>}
                      </figure>
                    ) : <ScreenPlaceholder label={f.title} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. 작동 흐름 ===== */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="HOW IT WORKS" title="어떻게 돌아가나" />
            <div className="grid md:grid-cols-4 gap-4">
              {s.flow.map((st, i) => (
                <div key={st.title} className="relative rounded-2xl bg-white border border-line p-6">
                  <div className="ticker mb-3">{String(i + 1).padStart(2, '0')} · {st.step}</div>
                  <h3 className="font-bold text-lg mb-2">{st.title}</h3>
                  <p className="text-sm text-slate-600">{st.desc}</p>
                  {i < s.flow.length - 1 && <ArrowRight size={16} className="hidden md:block absolute top-1/2 -right-3 text-primary/50" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. 도입 구성 ===== */}
        <section className="py-20 md:py-28 bg-surface border-y border-line">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="DEPLOYMENT" title="우리 환경에 들어가나" desc={s.integration.reuse} />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white border border-line p-6">
                <h3 className="font-bold mb-3">연동 가능 시스템</h3>
                <ul className="text-sm text-slate-700 space-y-1.5">{s.integration.systems.map((x) => <li key={x}>· {x}</li>)}</ul>
              </div>
              <div className="rounded-2xl bg-white border border-line p-6">
                <h3 className="font-bold mb-3">필요 H/W</h3>
                <ul className="text-sm text-slate-700 space-y-1.5">{(s.integration.hardware ?? ['별도 H/W 없음 — 웹·모바일로 운영']).map((x) => <li key={x}>· {x}</li>)}</ul>
              </div>
              <div className="rounded-2xl bg-white border border-line p-6">
                <h3 className="font-bold mb-3">구성 방식</h3>
                <ul className="text-sm text-slate-700 space-y-1.5">{s.integration.deployment.map((x) => <li key={x}>· {x}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. 도입 절차 ===== */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="PROCESS" title="얼마나 걸리고, 무엇을 준비하나" desc="기간은 적용 범위와 현장 조건에 따라 현장 조사 단계에서 안내합니다." />
            <ol className="grid md:grid-cols-5 gap-4">
              {process.map((p, i) => (
                <li key={p.title} className="rounded-2xl bg-white border border-line p-5">
                  <div className="ticker mb-2">STEP {i + 1}</div>
                  <h3 className="font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{p.desc}</p>
                  <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700">산출물</span> {p.deliverable}</p>
                  {p.customer && <p className="text-xs text-slate-500 mt-1"><span className="font-semibold text-slate-700">고객 준비</span> {p.customer}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== 7. 사례 ===== */}
        {s.cases && s.cases.length > 0 && (
          <section className="py-20 md:py-28 bg-surface border-y border-line">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHead eyebrow="CASES" title="적용 · 실증 · 협약" />
              <div className="grid md:grid-cols-2 gap-6">
                {s.cases.map((c) => (
                  <div key={c.title} className="rounded-2xl bg-white border border-line p-6">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded border border-primary/30 text-primary mb-3">{c.status}</span>
                    <h3 className="font-bold mb-2">{c.title}</h3>
                    <p className="text-sm text-slate-600">범위: {c.scope}</p>
                    <p className="text-sm text-slate-600">결과: {c.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== 8. 사양 ===== */}
        {s.specs && s.specs.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHead eyebrow="SPECIFICATIONS" title="기술 검토용 사양" />
              <dl className="rounded-2xl bg-white border border-line divide-y divide-line max-w-4xl">
                {s.specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 px-6 py-4 text-sm"><dt className="text-slate-500">{k}</dt><dd className="col-span-2 text-ink">{v}</dd></div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* ===== 9. FAQ ===== */}
        <section className="py-20 md:py-28 bg-surface border-y border-line">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="FAQ" title="자주 묻는 질문" />
            <div className="max-w-4xl space-y-3">
              {s.faq.map((f) => (
                <details key={f.q} className="group rounded-2xl bg-white border border-line px-6 py-4">
                  <summary className="cursor-pointer font-semibold text-ink list-none flex justify-between items-center gap-4">
                    {f.q}<ChevronRight size={16} className="text-slate-400 transition-transform group-open:rotate-90 shrink-0" />
                  </summary>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 10. 관련 솔루션 ===== */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="RELATED" title="함께 구성하면 좋은 솔루션" />
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} to={`/solutions/${r.slug}`} className="group rounded-2xl bg-white border border-line p-6 hover:border-primary/40 transition-all">
                  <div className="ticker mb-2">{r.category}</div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary">{r.name}</h3>
                  <p className="text-sm text-slate-600">{r.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 11. CTA ===== */}
        <section className="py-20 md:py-28 bg-[#F5F2FC] border-t border-line">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHead eyebrow="NEXT STEP" title="다음 단계로" desc="자료를 받아 내부 검토를 시작하거나, 바로 데모·상담을 요청하세요." />
            <div className="grid lg:grid-cols-2 gap-6">
              <div id="resource"><LeadGate solutionSlug={s.slug} solutionName={s.name} source="resource-download" /></div>
              <div id="demo"><LeadGate solutionSlug={s.slug} solutionName={s.name} source="demo-request" /></div>
            </div>
            <p className="text-sm text-slate-600 mt-6">
              이미 구체적인 요건이 있으시면 <a href={inquiryHref} className="text-primary font-semibold underline underline-offset-4">문의 폼</a>에 바로 남겨 주세요. 솔루션명이 자동으로 입력됩니다.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SolutionPage;

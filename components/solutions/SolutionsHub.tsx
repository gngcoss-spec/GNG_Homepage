// ============================================================
// SolutionsHub.tsx — /solutions 허브: 고객 유형별 진입 + 8개 솔루션 카드
// ============================================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { SOLUTIONS } from '../../content/solutions';
import type { Audience } from '../../content/solutions/types';
import { useSeo } from '../../lib/useSeo';

const AUDIENCES: Audience[] = ['공공기관', '제조·물류 사업장', '오피스·상업 빌딩', '복지·요양 시설', '병원·교육 시설', '시설관리 전문기업'];

const SolutionsHub: React.FC = () => {
  const [filter, setFilter] = useState<Audience | 'all'>('all');
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useSeo({
    title: '솔루션 — 8개 제품으로 공간의 안전·보안·운영·물류를 연결 | 가능가 GNG',
    description: 'SSiN·SSoN·SSAx·SpaceOps·Golden Bridge·Smart FM·Edge H/W·Logistics DX. 고객 유형별로 필요한 솔루션을 찾고 상세 기능·도입 구성·절차를 확인하세요.',
    url: 'https://gngss.co.kr/solutions',
  });
  const list = filter === 'all' ? SOLUTIONS : SOLUTIONS.filter((s) => s.audiences.includes(filter));

  return (
    <div className="min-h-screen bg-background text-ink overflow-x-hidden">
      <Navbar />
      <main className="relative z-10 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="ticker mb-4">SOLUTIONS · 8</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5">하나의 공간, 하나의 데이터,<br />하나의 운영 체계</h1>
          <p className="text-slate-600 text-lg max-w-2xl mb-10">출입 전 검증부터 현장 관제, 건물 자율운영, 스마트오피스, 시설관리, 재난대응, 물류자동화까지. 현장 유형을 고르면 맞는 솔루션만 보여드립니다.</p>

          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="고객 유형 필터">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm border transition-colors ${filter === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-line text-slate-700 hover:border-primary/40'}`}>전체</button>
            {AUDIENCES.map((a) => (
              <button key={a} onClick={() => setFilter(a)} aria-pressed={filter === a} className={`px-4 py-2 rounded-full text-sm border transition-colors ${filter === a ? 'bg-primary text-white border-primary' : 'bg-white border-line text-slate-700 hover:border-primary/40'}`}>{a}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((s, i) => (
              <Link key={s.slug} to={`/solutions/${s.slug}`} className="group rounded-2xl bg-white border border-line p-7 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="ticker">{String(i + 1).padStart(2, '0')} · {s.category}</span>
                  {s.status.kind !== 'available' && <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">{s.status.kind === 'developing' ? `개발 중 · ${s.status.eta}` : '실증 중'}</span>}
                </div>
                <h2 className="text-2xl font-bold mb-1 group-hover:text-primary">{s.name}</h2>
                <p className="text-xs text-slate-500 mb-3">{s.subtitle}</p>
                <p className="text-slate-700 mb-5 flex-grow">{s.tagline}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">{s.audiences.map((a) => <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-background border border-line text-slate-600">{a}</span>)}</div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">자세히 보기 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SolutionsHub;

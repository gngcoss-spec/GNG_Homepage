// ============================================================
// WhyGNG.tsx — Phase 2 신규 (통합브로슈어 Slide 2 "Why GNG" 기반)
// 문제 제기 3종: 운영 분절 / 데이터 단절 / 벤더 종속
// 인터랙션: 스크롤 리빌, 카드 3D 틸트, HUD 코너 (사이트 공통 문법)
// ============================================================
import React from 'react';
import { Puzzle, Unlink, Lock, ArrowDown } from 'lucide-react';

const WhyGNG: React.FC = () => {
  const problems = [
    {
      title: '운영 분절 — 사일로화',
      desc: '시스템마다 담당자, 화면, 프로세스가 달라 운영이 분절되고, 공간 전체를 아우르는 통합적인 판단이 불가능합니다.',
      icon: Puzzle,
      color: 'text-amber-500',
    },
    {
      title: '데이터 단절 — 공간 맥락 부재',
      desc: '데이터가 시스템별로 갇혀 "언제, 어디서, 무엇이" 일어났는지 공간의 맥락으로 연결되지 않습니다.',
      icon: Unlink,
      color: 'text-rose-500',
    },
    {
      title: '벤더 종속 — 폐쇄형 구조',
      desc: '폐쇄형 구조는 시스템 간 확장과 연동을 막고, 특정 벤더에 종속된 운영을 강요합니다.',
      icon: Lock,
      color: 'text-slate-600',
    },
  ];

  // ---- Tilt handler (사이트 공통) ----
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
  };

  return (
    <section id="why" className="py-32 relative overflow-hidden border-t border-line">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase flex items-center justify-center gap-2 reveal">
            <span className="w-8 h-[1px] bg-primary"></span>
            Why GNG
            <span className="w-8 h-[1px] bg-primary"></span>
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-1">
            지금의 공간 운영, 왜 전환이 필요한가
          </h3>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto reveal delay-2">
            출입·보안·CCTV·설비·에너지·미화·오피스·재난·물류 —<br className="hidden md:block" />
            공간의 운영 시스템은 여전히 각각 분리되어 움직입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((item, idx) => (
            <div
              key={idx}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className={`tilt-card relative p-8 rounded-2xl bg-white border border-line hover:border-primary/40 transition-all group overflow-hidden reveal delay-${idx + 1}`}
            >
              {/* Background decorative number */}
              <div className="absolute -right-4 -top-4 text-9xl font-black text-[#F0EDE6] select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                {idx + 1}
              </div>

              <div className={`w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-line group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={28} />
              </div>

              <div className="ticker text-primary/60 mb-2">ISSUE / {String(idx + 1).padStart(2, '0')}</div>
              <h4 className="text-xl font-bold text-ink mb-3">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 전환 유도 라인 */}
        <div className="mt-16 text-center reveal delay-3">
          <p className="text-xl md:text-2xl font-bold text-ink mb-6">
            그래서 가능가는, 공간의 모든 데이터를 하나로 연결합니다.
          </p>
          <a
            href="#process"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors"
          >
            DT → DX → AI → AX 전환 모델 보기
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyGNG;

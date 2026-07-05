// ============================================================
// Process.tsx — Phase 2 (통합브로슈어 기준 DT→DX→AI→AX 전환 모델)
// 스크롤 진행도 라인 애니메이션, 단계별 리빌, 도달 시 펄스 링,
// STEP 번호 인디케이터 인터랙션은 그대로 유지
// ============================================================
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers, Workflow, BrainCircuit, Bot } from 'lucide-react';

const Process: React.FC = () => {
  const steps = [
    {
      title: "DT · Digital Twin",
      desc: "공간·설비·사람·이벤트를 디지털 공간 위에 시각화합니다. 건물·현장·물류센터·출입자·작업자·위험요소를 하나의 뷰로.",
      icon: Layers,
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      title: "DX · Digital Transformation",
      desc: "분산된 업무·운영 프로세스를 디지털 체계로 전환합니다. 신청·승인·점검·예약·대응·이력관리를 하나의 플랫폼으로.",
      icon: Workflow,
      color: "text-violet-600",
      bg: "bg-violet-600/10"
    },
    {
      title: "AI · Intelligence",
      desc: "데이터를 분석하고 상황을 판단합니다. 출입 적합성·이상상황·활용률·설비상태·재난위험·물류흐름까지.",
      icon: BrainCircuit,
      color: "text-purple-600",
      bg: "bg-purple-600/10"
    },
    {
      title: "AX · Autonomous",
      desc: "AI 판단을 기반으로 운영을 자동 실행합니다. 출입제어·경보·대피유도·작업배정·예약최적화·물류자동화.",
      icon: Bot,
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  // ---- 스크롤 진행도에 따라 connecting line 채우기 ----
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = -rect.height * 0.5;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="process" ref={sectionRef} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal">DT → DX → AI → AX 전환 모델</h2>
          <p className="text-slate-600 max-w-2xl mx-auto reveal delay-1">단순한 시스템 구축이 아니라, 운영 방식의 단계적 전환을 제공합니다.<br />DT로 보고, DX로 연결하고, AI로 판단하며, AX로 실행합니다.</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) — 배경 + 진행도 오버레이 */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-[#E7E4DD] -z-10" />
          <div
            className="hidden md:block absolute top-12 left-0 h-0.5 -z-10"
            style={{
              width: `${progress * 100}%`,
              background: '#5B21B6',
              transition: 'width 0.2s linear',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const stepProgress = progress * steps.length;
              const isReached = stepProgress >= idx + 0.5;
              return (
                <div key={idx} className={`relative group reveal delay-${idx + 1}`}>
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-[#F5F2FC] transition-colors duration-300">
                    <div
                      className={`w-24 h-24 rounded-full bg-white border-4 ${
                        isReached || idx === 3
                          ? 'border-primary shadow-[0_4px_20px_rgba(91,33,182,0.15)]'
                          : 'border-line group-hover:border-primary/30'
                      } flex items-center justify-center mb-6 transition-all group-hover:scale-110 z-10 relative`}
                    >
                      <div className={`absolute inset-0 rounded-full ${step.bg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <step.icon size={32} className={`${step.color} relative z-10`} />
                      {/* 신규: 도달 시 펄스 링 */}
                      {isReached && (
                        <span className="absolute inset-0 rounded-full border border-primary/40 animate-ping" />
                      )}
                    </div>

                    {/* 신규: 스텝 번호 인디케이터 */}
                    <div className="ticker text-primary/60 mb-2">STEP / {String(idx + 1).padStart(2, '0')}</div>

                    <h3 className={`text-xl font-bold mb-3 ${idx === 3 ? 'text-ink' : 'text-slate-700 group-hover:text-ink'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed px-2 group-hover:text-slate-700">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow for mobile */}
                  {idx < steps.length - 1 && (
                    <div className="md:hidden flex justify-center py-4 text-primary/30 animate-bounce">
                      <ArrowRight size={24} className="rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;

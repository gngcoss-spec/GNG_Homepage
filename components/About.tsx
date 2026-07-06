// ============================================================
// About.tsx — Redesign v3 ("우리의 방향" 배경 영상판)
// 원본 콘텐츠(테크 아이템 4개, 코어 밸류 3개, 카피) 100% 보존
// 변경: 좌측 about_tech.png 이미지 제거 → 인트로 밴드 풀블리드 배경 영상
//       (Hero와 반대로 좌측에 영상 노출, 텍스트는 우측 유지)
//       데스크톱 + 모션 허용 환경에서만 재생, 파일 없으면 정적 디자인 유지
// ============================================================
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Activity, Video, Lock, Zap, BarChart3 } from 'lucide-react';
import { TechItem } from '../types';

const About: React.FC = () => {
  // ---- 배경 영상: 모바일 포함 항상 렌더링 ----
  // reduced-motion 환경에서는 재생만 멈추고 포스터를 보여준다 (빈 배경 방지)
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const techItems: TechItem[] = [
    {
      category: '보안 Security',
      title: '통합 보안 시스템',
      description: 'CCTV, 출입통제, LPR, 검색장비 등 물리적 보안 요소를 하나로 통합합니다.',
      icon: Lock,
    },
    {
      category: '안전 Safety',
      title: '실시간 안전 모니터링',
      description: 'LED 유도등 및 첨단 센서를 기반으로 위험 요소를 실시간 감지합니다.',
      icon: ShieldCheck,
    },
    {
      category: 'AI 운영 Operation',
      title: '설비 통합 운영',
      description: 'IBS, FMS, BEMS 기반으로 건물 내 모든 설비를 효율적으로 관리합니다.',
      icon: Activity,
    },
    {
      category: 'AX·DX Intelligence',
      title: '자율 최적화',
      description: 'AI 기반 예측, 분석을 통해 공간 운영을 스스로 최적화합니다.',
      icon: Cpu,
    },
  ];

  // ---- Tech card tilt handler ----
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  };

  return (
    <section id="about" className="pb-24 relative border-t border-line bg-surface/50">
      {/* ============== 인트로 밴드: 풀블리드 배경 영상 (기존 좌측 이미지 대체) ============== */}
      <div className="relative mb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <video
            ref={(el) => {
              // iOS/React 조합에서 muted 속성 처리 문제로 자동재생이 안 걸리는 경우 강제 킥
              if (el && !reducedMotion) {
                el.muted = true;
                el.play().catch(() => { /* 저전력 모드 등 — 포스터 유지 */ });
              }
            }}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster="./about_bg_poster.jpg"
            onError={(e) => {
              // 파일 없으면 배경 블록 전체를 숨기고 정적 디자인 유지
              const wrap = e.currentTarget.parentElement as HTMLElement | null;
              if (wrap) wrap.style.display = 'none';
            }}
            className="w-full h-full object-cover"
          >
            <source src="./about_bg.mp4" type="video/mp4" />
          </video>
          {/* 데스크톱 워시: 우측(텍스트)은 불투명 → 좌측으로 갈수록 영상 노출 (Hero와 반대 방향) */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-background via-background/80 to-background/25" />
          {/* 모바일 워시: 균일하게 옅게 — 영상이 보이면서 텍스트 가독 확보 */}
          <div className="absolute inset-0 bg-background/40 md:hidden" />
          {/* 상단 페이드: 섹션 경계와 자연스럽게 연결 */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
          {/* 하단 페이드: Core Values와 자연스럽게 연결 */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 py-16 md:py-24">
          <div className="md:w-1/2 md:ml-auto">
            <h2 className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase flex items-center gap-2 reveal">
              <span className="w-8 h-[1px] bg-primary"></span>
              우리의 방향
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-1">
              안전과 보안을 넘어<br />
              <span className="text-primary block mt-2">안심을 설계합니다</span>
            </h3>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed reveal delay-2">
              <p>
                비즈니스 전 생애주기를 하나의 <strong className="text-ink">AX·DX 플랫폼</strong>으로 통합하고
                플랫폼이 자율 운영되어 고객에게 안심을 제공하는 환경을 만듭니다.
              </p>
              <p>
                단순한 기술 도입을 넘어, 고객의 비즈니스 가치를 극대화하는 파트너가 되겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {[
            {
              title: "기술로 '안전'을 모니터링",
              desc: "센서 데이터를 AI 기반 분석으로 위험을 사전에 감지하고 제어합니다.",
              icon: Video,
              color: "text-blue-600"
            },
            {
              title: "AI 시뮬레이션으로 신뢰 보장",
              desc: "지능형 알고리즘이 24/7 공간을 모니터링하여 사각지대를 없앱니다.",
              icon: BarChart3,
              color: "text-purple-600"
            },
            {
              title: "자율 AX, DX 혁신 완성",
              desc: "DT, AI의 자율화를 통해 단순 관리를 넘어선 운영 혁신을 이룹니다.",
              icon: Zap,
              color: "text-amber-500"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className={`tilt-card p-8 rounded-2xl bg-white border border-line hover:border-primary/50 transition-all group hover:shadow-sm reveal delay-${idx + 1}`}
            >
              <div className={`w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary/20 ${item.color}`}>
                <item.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-ink mb-3">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                {item.desc}
              </p>

              {/* 신규: 카드 하단 데이터 라인 */}
              <div className="mt-6 pt-4 border-t border-line flex justify-between items-center ticker">
                <span className="text-slate-600">CORE VALUE · 0{idx + 1}</span>
                <span className="flex items-center gap-1.5">
                  <span className="live-dot"></span>
                  <span className="text-signal-green/80">GNG</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Area */}
        <div id="tech" className="pt-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal">디지털 트윈으로 설계하고, AI로 운영합니다</h2>
            <p className="text-slate-600 reveal delay-1">GNG의 기술은 통합과 최적화에 집중합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techItems.map((item, idx) => (
              <div
                key={idx}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className={`tilt-card group bg-white border border-line p-6 rounded-xl hover:bg-[#F5F2FC] transition-all hover:border-primary/30 reveal delay-${(idx % 4) + 1}`}
              >
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-4 flex justify-between items-center">
                  {item.category}
                  <item.icon size={16} className="text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="text-ink font-semibold text-lg mb-3">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">{item.description}</p>

                {/* 신규: 데이터 인디케이터 (호버 시 fill) */}
                <div className="mt-5 h-0.5 w-full bg-[#E7E4DD] rounded-full overflow-hidden">
                  <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

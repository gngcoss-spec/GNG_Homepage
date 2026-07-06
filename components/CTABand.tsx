// ============================================================
// CTABand.tsx — Contact 직전 풀폭 CTA 밴드 (배경 영상)
// Hero와 동일한 스카이라인 영상(hero_bg.mp4)을 재사용해 수미상관 구성
// 데스크톱 + 모션 허용 환경에서만 재생, 파일 없으면 정적 디자인 유지
// ============================================================
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const CTABand: React.FC = () => {
  // ---- 배경 영상: 모바일 포함 항상 렌더링 ----
  // reduced-motion 환경에서는 재생만 멈추고 포스터를 보여준다 (빈 배경 방지)
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden border-t border-line bg-surface/50">
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
            poster="./hero_bg_poster.jpg"
            onError={(e) => {
              // 파일 없으면 배경 블록 전체를 숨기고 정적 디자인 유지
              const wrap = e.currentTarget.parentElement as HTMLElement | null;
              if (wrap) wrap.style.display = 'none';
            }}
            className="w-full h-full object-cover"
          >
            <source src="./hero_bg.mp4" type="video/mp4" />
          </video>
          {/* 중앙 정렬 텍스트 가독용 워시 — 모바일은 조금 옅게 */}
          <div className="absolute inset-0 bg-background/60 md:bg-background/75" />
          {/* 상·하단 페이드: 인접 섹션과 자연스럽게 연결 */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase flex items-center justify-center gap-2 reveal">
          <span className="w-8 h-[1px] bg-primary"></span>
          Start AX
          <span className="w-8 h-[1px] bg-primary"></span>
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-1">
          이제, 당신의 공간에<br />
          <span className="text-primary">안심</span>을 설계할 차례입니다
        </h3>
        <p className="text-slate-600 text-lg mb-10 leading-relaxed reveal delay-2">
          현재 운영 환경을 알려주시면, 안심에 이르는 DT→DX→AI→AX 전환 여정을 함께 설계해 드립니다.
        </p>
        <a
          href="#contact"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all hover:scale-105 reveal delay-3"
        >
          문의하기
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};

export default CTABand;

// ============================================================
// CTABand.tsx — Contact 직전 풀폭 CTA 밴드 (배경 영상)
// Hero와 동일한 스카이라인 영상(hero_bg.mp4)을 재사용해 수미상관 구성
// 배경 영상은 BackgroundVideo로 통합 (모션 감소 시 poster만, 화면에 보일 때만 재생)
// ============================================================
import React from 'react';
import { ArrowRight } from 'lucide-react';
import BackgroundVideo from './BackgroundVideo';

const CTABand: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden border-t border-line bg-surface/50">
      <BackgroundVideo src="./hero_bg.mp4" poster="./hero_bg_poster.jpg">
        {/* 중앙 정렬 텍스트 가독용 워시 — 모바일은 조금 옅게 */}
        <div className="absolute inset-0 bg-background/60 md:bg-background/75" />
        {/* 상·하단 페이드: 인접 섹션과 자연스럽게 연결 */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </BackgroundVideo>
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
          먼저 현장에 맞는 구성을 살펴보세요. 이미 도입할 범위가 정해져 있다면 바로 상담을 요청할 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 reveal delay-3">
          <a href="#fit" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all">
            맞춤 솔루션 찾기
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 border border-line bg-white text-ink text-sm font-bold rounded-full hover:border-primary/40 transition-colors">
            바로 상담하기
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTABand;

// ============================================================
// Hero.tsx — Light Editorial v4 (풀블리드 배경 영상)
// 원본 콘텐츠(카피, CTA, 뱃지, 3 features)는 100% 보존
// 배경: Seedance 생성 영상(hero_bg.mp4) + 화이트 워시 오버레이
//       — 데스크톱 + 모션 허용 환경에서만 재생, 실패 시 정적 디자인 유지
// 우측 대시보드 이미지 카드는 제거됨 (배경 영상이 비주얼 역할)
// ============================================================
import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, Activity, Shield, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  // ---- 배경 영상: 모바일 포함 항상 렌더링 ----
  // reduced-motion 환경에서는 재생만 멈추고 포스터를 보여준다 (빈 배경 방지)
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // ---- 단어별 리빌 헬퍼 ----
  const renderWords = (text: string, baseDelay = 0, className = '') => {
    return text.split(' ').map((w, i) => (
      <span
        key={i}
        className={`word-reveal ${className}`}
        style={{ animationDelay: `${baseDelay + i * 0.08}s` }}
      >
        {w}
        {i < text.split(' ').length - 1 ? ' ' : ''}
      </span>
    ));
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-screen flex items-center">
      {/* ============== 풀블리드 배경 영상 (Seedance · Connected Skyline) ============== */}
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
        {/* 데스크톱 워시: 좌측(텍스트)은 불투명 → 우측으로 갈수록 영상 노출 */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/25" />
        {/* 모바일 워시: 균일하게 옅게 — 영상이 보이면서 텍스트 가독 확보 */}
        <div className="absolute inset-0 bg-background/40 md:hidden" />
        {/* 상단 페이드: 네비게이션 영역 가독성 */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/90 to-transparent" />
        {/* 하단 페이드: 다음 섹션과 자연스럽게 연결 */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* ============== Text Content (원본 콘텐츠 보존) ============== */}
        <div className="max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in-up backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            공간 운영 AX 전환 전문 기업
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink mb-8 leading-[1.1]">
            {renderWords('공간의 모든 데이터를 연결하고', 0.2)}<br />
            <span className="grad-anim">
              {renderWords('AI로 운영을 전환합니다', 0.55)}
            </span>
          </h1>

          <p className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-3">
            <span className="text-primary">DT</span>로 보고, <span className="text-primary">DX</span>로 연결하고,<br />
            <span className="text-primary">AI</span>로 판단하며, <span className="text-primary">AX</span>로 실행합니다.
          </p>
          <p className="max-w-2xl mx-auto md:mx-0 text-lg md:text-xl text-slate-600 mb-10 leading-relaxed reveal delay-3">
            가능가(GNG)는 물리 공간의 안전·보안·운영·물류 데이터를 하나로 연결하는 통합 플랫폼 기업입니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 reveal delay-4">
            <a
              href="#platform"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all hover:scale-105"
            >
              플랫폼 살펴보기
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border border-line text-ink text-sm font-bold rounded-full hover:border-primary/40 hover:bg-[#F5F2FC] transition-all"
            >
              문의하기
              <ChevronRight size={18} />
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center md:justify-start gap-8 text-slate-500 reveal delay-4">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <span className="text-sm font-medium">Integrated Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-primary" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              <span className="text-sm font-medium">Real-time Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

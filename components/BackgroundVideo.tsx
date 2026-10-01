// ============================================================
// BackgroundVideo.tsx — Hero / About / CTABand 공용 배경 영상
// - prefers-reduced-motion: 동기 초기화 → 재생하지 않고 poster만 표시, 설정 변경 시 즉시 정지
// - 화면에 들어온 영상만 재생, 벗어나면 정지 (모바일 첫 진입 시 영상 3개 동시 재생 방지)
// - preload="none": 보이기 전까지 다운로드하지 않음
// - 파일 없으면 배경 블록 전체를 숨기고 정적 디자인 유지
// ============================================================
import React, { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  src: string;
  poster: string;
  children?: React.ReactNode; // 워시·페이드 오버레이
}

const REDUCED = '(prefers-reduced-motion: reduce)';

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ src, poster, children }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
  );

  // 모션 설정 변경 추적
  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 가시성 기반 재생/정지
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    video.muted = true;

    if (reducedMotion) {
      video.pause();
      return;
    }

    // 15% 이상 보일 때만 재생 (인접 섹션 가장자리만 걸친 영상은 정지 상태 유지)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          video.play().catch(() => { /* 저전력 모드 등 — poster 유지 */ });
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.15] }
    );
    io.observe(wrap);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        onError={() => {
          if (wrapRef.current) wrapRef.current.style.display = 'none';
        }}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      {children}
    </div>
  );
};

export default BackgroundVideo;

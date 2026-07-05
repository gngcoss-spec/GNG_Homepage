// ============================================================
// Footer.tsx — Redesign v2 (인터랙션 강화판)
// 원본 콘텐츠(회사 정보, 사업자번호, 대표, 메일, 바로가기, 정책 약관) 100% 보존
// 추가 요소: 실시간 시계, 시스템 상태 인디케이터, 미세한 그리드 배경
// ============================================================
import React, { useEffect, useState } from 'react';
import LegalModal from './LegalModal';

const Footer: React.FC = () => {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');

  // ---- 신규: 실시간 시계 ----
  const [now, setNow] = useState<string>('--:--:--');
  const [today, setToday] = useState<string>('----.--.--');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.toTimeString().substring(0, 8));
      setToday(d.toISOString().substring(0, 10).replace(/-/g, '.'));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const openLegalModal = (type: 'privacy' | 'terms') => {
    setLegalType(type);
    setIsLegalModalOpen(true);
  };

  return (
    <footer className="bg-[#F3F1EC] border-t border-line py-16 text-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* 신규: 상단 시스템 상태 바 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-line ticker">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="live-dot"></span>
              <span className="text-primary">GNG · SPACE OPERATIONS</span>
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-slate-500 hidden md:inline">SECTOR · KR-SEJONG</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>{today}</span>
            <span className="text-primary">{now} KST</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px]">
                G
              </div>
              <span className="text-ink font-semibold">가능가 | GNG Co., Ltd.</span>
            </div>
            <address className="not-italic text-slate-600 space-y-2">
              <p>세종특별자치시 한누리대로 1824, 606-74호</p>
              <p>1824, 606-74, Hannuri-daero, Sejong-si, Republic of Korea</p>
              <p className="mt-4">사업자등록번호: 681-86-03173</p>
              <p>대표이사: 박웅철</p>
              <p>이메일: gngss@gngss.co.kr</p>
            </address>
          </div>

          <div>
            <h4 className="text-ink font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#about" className="hover:text-primary transition-colors">우리의 방향</a></li>
              <li><a href="#tech" className="hover:text-primary transition-colors">기술</a></li>
              <li><a href="#process" className="hover:text-primary transition-colors">전환 모델</a></li>
              <li><a href="#platform" className="hover:text-primary transition-colors">제품</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">문의하기</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-ink font-semibold mb-4">정책 및 약관</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-primary transition-colors text-left"
                >
                  개인정보처리방침
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-primary transition-colors text-left"
                >
                  이용약관
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500">© 2024 GNG Co., Ltd. All rights reserved.</p>
          <div className="flex gap-4 ticker text-slate-500">
            <span>SINCE · 2024.09</span>
            <span>·</span>
            <span>SEJONG · KOREA</span>
          </div>
        </div>
      </div>

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        type={legalType}
      />
    </footer>
  );
};

export default Footer;

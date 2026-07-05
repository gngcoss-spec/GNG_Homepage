// ============================================================
// Navbar.tsx — Redesign v2 (인터랙션 강화판)
// 원본 콘텐츠(메뉴 라벨, 로고 이미지, CTA, 모바일 메뉴) 100% 보존
// 추가 요소: 활성 섹션 추적(scroll-spy), 라이브 시스템 인디케이터,
//          호버 시 underline 애니메이션
// ============================================================
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sectionIds = ['about', 'tech', 'why', 'process', 'platform', 'spotlight', 'contact'];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ---- Scroll-spy: 가장 가까운 섹션을 활성화 ----
      let current = '';
      const offset = window.innerHeight * 0.35;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '우리의 방향', href: '#about',    id: 'about'   },
    { label: '기술',         href: '#tech',     id: 'tech'    },
    { label: '전환 모델',   href: '#process',  id: 'process' },
    { label: '제품',         href: '#platform', id: 'platform'},
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
        ? 'bg-background/90 backdrop-blur-md border-line py-3'
        : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          {/* 라이트 배경용 다크 톤 변환 (원본은 다크 배경용 밝은 로고) — 정식 라이트 로고 확보 시 필터 제거 */}
          <img
            src="./logo.png"
            alt="GNG Logo"
            className="h-16 w-auto object-contain [filter:invert(1)_hue-rotate(180deg)_saturate(1.8)_brightness(0.9)]"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-lg font-medium transition-colors group ${
                  isActive ? 'text-ink' : 'text-slate-500 hover:text-ink'
                }`}
              >
                {link.label}
                {/* 신규: underline 인디케이터 */}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Action area: CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-all hover:scale-105"
          >
            문의하기
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-ink"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-line p-6 md:hidden flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium text-slate-700 hover:text-ink block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-4 w-full text-center px-4 py-3 bg-primary text-white font-medium rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            문의하기
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;

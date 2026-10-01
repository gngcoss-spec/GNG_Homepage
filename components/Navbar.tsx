// ============================================================
// Navbar.tsx — Redesign v2 (인터랙션 강화판)
// 원본 콘텐츠(메뉴 라벨, 로고 이미지, CTA, 모바일 메뉴) 100% 보존
// 추가 요소: 활성 섹션 추적(scroll-spy), 라이브 시스템 인디케이터,
//          호버 시 underline 애니메이션
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sectionIds = ['company', 'platform', 'spotlight', 'process', 'contact'];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ---- Scroll-spy: 가장 가까운 섹션을 활성화 ----
      let current = '';
      const offset = window.innerHeight * 0.35;
      const sections = document.querySelectorAll<HTMLElement>(sectionIds.map(id => `#${id}`).join(', '));
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) current = el.id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: '회사소개',   href: '#company',  id: 'company' },
    { label: '솔루션',     href: '#platform', id: 'platform'},
    { label: 'Golden Bridge', href: '#spotlight', id: 'spotlight' },
    { label: '전환 모델',   href: '#process',  id: 'process' },
    { label: '문의',       href: '#contact',  id: 'contact' },
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
        <nav aria-label="주 메뉴" className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'location' : undefined}
                className={`relative whitespace-nowrap text-base font-medium transition-colors group ${
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
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#contact"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-all hover:scale-105"
          >
            문의하기
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          className="lg:hidden min-h-11 min-w-11 inline-flex items-center justify-center text-ink"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="모바일 주 메뉴" className="absolute top-full left-0 right-0 bg-background border-b border-line p-6 lg:hidden flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={activeSection === link.id ? 'location' : undefined}
              className="text-base font-medium text-slate-700 hover:text-ink block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;

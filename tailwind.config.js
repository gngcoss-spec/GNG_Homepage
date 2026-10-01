/** @type {import('tailwindcss').Config} */
// GNG Tailwind 설정 — index.html 인라인 Play CDN 설정을 빌드 단계로 이관
// (토큰·애니메이션·keyframes는 기존 값 그대로 유지)
export default {
  content: ['./index.html', './*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#FAF9F7',
        surface: '#FFFFFF',
        ink: '#17151F',
        muted: '#5B5766',
        line: '#E7E4DD',
        primary: {
          DEFAULT: '#5B21B6',
          glow: '#7C3AED',
          dark: '#4C1D95',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          glow: '#8B5CF6',
        },
        accent: '#5B21B6',
        signal: {
          green: '#22C55E',
          amber: '#F59E0B',
          red: '#EF4444',
        },
      },
      backgroundImage: {
        'hero-glow': 'none',
        'card-gradient': 'none',
        'grid-pattern': 'none',
        'tech-grid': 'none',
        'scan-line': 'none',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'reveal-word': 'revealWord 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scan-vertical': 'scanVertical 4s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealWord: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanVertical: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

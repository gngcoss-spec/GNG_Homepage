// ============================================================
// Company.tsx — Phase 2 신규 (사업계획서 기반 회사 신뢰 근거 섹션)
// 기업 연혁 / 특허·정부지원사업·협력 네트워크
// 모든 수치·이력은 2026년 사업계획서(.archive) 검증 내용 기준
// ============================================================
import React from 'react';
import { FileBadge, Landmark, Handshake, MapPin } from 'lucide-react';

const Company: React.FC = () => {
  const history = [
    { date: '2024.05', label: '예비창업패키지 선정' },
    { date: '2024.09', label: '가능가 주식회사 법인 설립 (세종)' },
    { date: '2024.12', label: '세이프위드미(SafeWithMe) 안전 플랫폼 개발 완료' },
    { date: '2025.06', label: 'Golden Bridge 3D 통합안전관제 플랫폼 개발 착수' },
    { date: '2025.11', label: 'Smart FM S/W 개발 완료' },
    { date: '2026.06', label: '세종시 시제품 제작 지원사업 협약 — EdgeCam 시제품 개발' },
  ];

  const facts = [
    {
      icon: FileBadge,
      title: '특허 출원 2건',
      desc: '3D 통합안전관제 플랫폼 · 디지털트윈 3D 실내공간 구축',
    },
    {
      icon: Landmark,
      title: '정부지원사업',
      desc: '예비창업패키지 선정 · NIPA 디지털트윈 혁신 서비스 실증 · 세종시 시제품 제작 지원사업 협약',
    },
    {
      icon: Handshake,
      title: '협력 네트워크',
      desc: 'AI · 디지털트윈 · 영상보안 · 소방 · 복지 · 재난 분야 전문기업 및 학회 협력',
    },
    {
      icon: MapPin,
      title: 'Since 2024 · Sejong',
      desc: '세종특별자치시 기반, 지자체·공공 실증과 함께 성장하는 딥테크 스타트업',
    },
  ];

  return (
    <section id="company" className="py-32 bg-surface border-y border-line relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20">
          <h2 className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase flex items-center gap-2 reveal">
            <span className="w-8 h-[1px] bg-primary"></span>
            기술개발과 성장 기록
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-1">
            가능가가 쌓아온<br />기술과 협력의 발자취
          </h3>
        </div>

        <div className="mb-16">
          {/* 연혁 타임라인 */}
          <div className="relative rounded-2xl bg-white border border-line p-8 overflow-hidden reveal delay-1">
            <div className="ticker text-primary/60 mb-6">HISTORY · GNG 법인 연혁</div>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 ml-2">
              {history.map((item, idx) => (
                <li key={idx} className="pl-6 relative border-l border-line">
                  <span
                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${
                      idx === history.length - 1 ? 'bg-primary' : 'bg-line'
                    }`}
                  ></span>
                  <div className="ticker text-slate-500 mb-0.5">{item.date}</div>
                  <div className="text-sm text-slate-700">{item.label}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* 신뢰 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {facts.map((item, idx) => (
            <div
              key={idx}
              className={`group bg-white border border-line p-6 rounded-xl hover:bg-[#F5F2FC] transition-all hover:border-primary/30 reveal delay-${(idx % 4) + 1}`}
            >
              <div className="w-12 h-12 bg-[#F5F2FC] rounded-lg flex items-center justify-center text-primary border border-line mb-5 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <h4 className="text-ink font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>

              <div className="mt-5 h-0.5 w-full bg-[#F5F2FC] rounded-full overflow-hidden">
                <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Company;

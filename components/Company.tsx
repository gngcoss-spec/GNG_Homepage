// ============================================================
// Company.tsx — Phase 2 신규 (사업계획서 기반 회사 신뢰 근거 섹션)
// 대표 프로필 / 연혁 타임라인 / 특허·정부지원사업·협력 네트워크
// 모든 수치·이력은 2026년 사업계획서(.archive) 검증 내용 기준
// ============================================================
import React from 'react';
import { User, FileBadge, Landmark, Handshake, MapPin } from 'lucide-react';

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
            회사소개
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-1">
            현장에서 검증된 경험으로<br />공간 운영의 전환을 만듭니다
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* CEO 프로필 */}
          <div className="relative rounded-2xl bg-white border border-line p-8 overflow-hidden reveal">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#F5F2FC] rounded-xl flex items-center justify-center text-primary border border-line">
                <User size={28} />
              </div>
              <div>
                <div className="ticker text-primary/60 mb-1">CEO</div>
                <h4 className="text-2xl font-bold text-ink">대표이사 박웅철</h4>
              </div>
            </div>

            <p className="text-slate-700 font-medium mb-4">
              안전·보안 및 디지털 전환(AX·DX·SI) 분야 18년 현장 경험
            </p>
            <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                에스원 — 대기업 B2B 보안 SI 제안·구축 PM/PL, 해외 48개 사업장 물리보안 총괄
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                솔브레인 — 통합안전관제센터 총괄 운영, 3D 통합관제플랫폼(e-SOP) 운영 총괄
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                NIPA 디지털트윈 혁신 서비스 실증 과제 수행 총괄
              </li>
            </ul>
          </div>

          {/* 연혁 타임라인 */}
          <div className="relative rounded-2xl bg-white border border-line p-8 overflow-hidden reveal delay-1">
            <div className="ticker text-primary/60 mb-6">HISTORY</div>
            <ol className="relative border-l border-line space-y-6 ml-2">
              {history.map((item, idx) => (
                <li key={idx} className="pl-6 relative">
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

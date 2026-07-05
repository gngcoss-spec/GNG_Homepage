// ============================================================
// Spotlight.tsx — Phase 3 신규 (Golden Bridge × EdgeCam 스포트라이트)
// 콘텐츠 출처: 2026 초기창업패키지 발표자료(Golden-Bridge_final) +
//            세종 시제품제작 발표자료(EdgeCam_11, 정본)
// 구성: 임팩트 통계 → End-to-End 아키텍처 → EdgeCam 셀링포인트/스펙 →
//      3종 솔루션 비교표 → 도입 문의 CTA
// ============================================================
import React from 'react';
import {
  Camera, BrainCircuit, Navigation, PhoneCall,
  ArrowRight, Timer, ShieldCheck, Coins, Check, X as XIcon,
} from 'lucide-react';

const Spotlight: React.FC = () => {
  // ---- 임팩트 통계 (발표자료 문제 제기 수치) ----
  const stats = [
    { value: '37초', label: '골든타임', desc: '아리셀 참사 기준, 생사를 가른 시간' },
    { value: '8분', label: '119 평균 현장 도착', desc: '골든타임과의 격차를 기술로 메워야 합니다' },
    { value: '40%+', label: '시설 내 CCTV 사각지대', desc: '개인정보 보호 이슈로 감시가 불가능했던 구역' },
  ];

  // ---- End-to-End 아키텍처 4단계 ----
  const flow = [
    { step: '감지', en: 'DETECT', name: 'EdgeCam', desc: '낙상·화재·배회를 온디바이스 AI가 2초 이내 감지', icon: Camera },
    { step: '판단', en: 'DECIDE', name: 'AI · Digital Twin', desc: '3D 디지털트윈 위에서 AI가 최단 대피 경로 연산', icon: BrainCircuit },
    { step: '대응', en: 'RESPOND', name: '가변형 LED 유도등', desc: 'LED 화살표 방향 실시간 변경 + 음성 안내', icon: Navigation },
    { step: '연동', en: 'CONNECT', name: '119 · 지자체 안전망', desc: '골든타임 내 자동 신고·관제 연계', icon: PhoneCall },
  ];

  // ---- EdgeCam 3대 셀링포인트 ----
  const sellingPoints = [
    { icon: Coins, title: '1/20 도입 비용', desc: '기존 NVR+AI 서버 방식(시설당 1,000만원+) 대비, 대당 30~50만원 1회성 도입.' },
    { icon: Timer, title: '2초 이내 응답', desc: '서버 왕복 없이 카메라 자체에서 AI 추론. 기존 방식 3~10초 대비 즉각 반응.' },
    { icon: ShieldCheck, title: '영상 미전송', desc: '영상 원본은 기기 내 암호화 보관, 메타데이터만 전송. 개인정보 이슈 원천 차단.' },
  ];

  // ---- EdgeCam 핵심 스펙 ----
  const specs = [
    ['AI 프로세서', 'NVIDIA Jetson Orin Nano 8GB (40 TOPS)'],
    ['이미지 센서', 'Sony IMX415 · 4K UHD · 초저조도 0.001 lux'],
    ['AI 모델', 'YOLOv8 기반 자체 학습 (낙상·연기·배회)'],
    ['통신', '1Gbps Ethernet PoE+ · Wi-Fi 6 옵션'],
    ['보안', 'MQTT 5.0 + TLS 1.3 · AES-256 로컬 암호화'],
    ['외형', '알루미늄 다이캐스팅 · IP66 방진방수 · 벽부형'],
    ['소비 전력', '평균 10W 이하 · OTA 펌웨어 업데이트'],
  ];

  // ---- 3종 솔루션 비교 (EdgeCam_11 정본 기준) ----
  const compareRows: { label: string; legacy: string; cloud: string; edge: string; edgeGood?: boolean }[] = [
    { label: '도입 비용', legacy: '1,000만원+ / 시설', cloud: '30~80만원 / 년 (구독)', edge: '30~50만원 / 대 (1회성)' },
    { label: '영상 외부 전송', legacy: '필요', cloud: '필수', edge: '메타데이터만 전송' },
    { label: '응답 시간', legacy: '3~5초', cloud: '3~10초', edge: '2초 이내' },
    { label: '통합관제 연동', legacy: '별도 개발', cloud: '벤더 종속', edge: '표준 MQTT + 오픈 API' },
  ];

  // ---- 도입 문의 CTA (Contact 폼 프리필 연동) ----
  const handleInquiry = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('inquiry', 'Golden Bridge · EdgeCam');
    window.history.pushState({}, '', url);
    window.dispatchEvent(new CustomEvent('inquiry-selected', {
      detail: { solutionName: 'Golden Bridge · EdgeCam' }
    }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="spotlight" className="py-32 relative overflow-hidden border-t border-line">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ===== 헤더 ===== */}
        <div className="text-center mb-16">
          <div className="ticker text-primary/70 mb-4 reveal">SPOTLIGHT · GOLDEN BRIDGE × EDGECAM</div>
          <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal delay-1">
            단 1초가 생사를 가릅니다.<br />
            <span className="text-primary">Golden Bridge는 그 1초를 지킵니다.</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto reveal delay-2">
            가능가는 기술로 생명을 잇는 다리를 놓습니다. 사회적 약자 시설의 재난 대응을
            감지부터 신고까지 End-to-End로 자동화합니다.
          </p>
        </div>

        {/* ===== 임팩트 통계 ===== */}
        <div className="grid md:grid-cols-3 gap-4 mb-24">
          {stats.map((s, idx) => (
            <div key={idx} className={`relative rounded-2xl bg-white border border-line p-8 text-center overflow-hidden reveal delay-${idx + 1}`}>
              <div className="text-4xl md:text-5xl font-black text-ink tabular-nums mb-2">{s.value}</div>
              <div className="text-primary font-semibold mb-2">{s.label}</div>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* ===== End-to-End 아키텍처 ===== */}
        <div className="mb-24">
          <h3 className="text-2xl md:text-3xl font-bold text-ink text-center mb-12 reveal">
            감지 → 판단 → 대응 → 연동, 하나의 플랫폼에서
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {flow.map((f, idx) => (
              <div key={idx} className={`relative group rounded-2xl bg-white border border-line p-6 hover:border-primary/40 transition-all reveal delay-${idx + 1}`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-line group-hover:bg-primary group-hover:text-white transition-all">
                    <f.icon size={24} />
                  </div>
                  <div className="ticker text-slate-500">{String(idx + 1).padStart(2, '0')} · {f.en}</div>
                </div>
                <div className="text-primary text-sm font-bold mb-1">{f.step}</div>
                <h4 className="text-lg font-bold text-ink mb-2">{f.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                {idx < flow.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 justify-center text-primary/50 z-10">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== EdgeCam 셀링포인트 + 스펙 ===== */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24 items-stretch">
          <div className="flex flex-col gap-4">
            <div className="ticker text-primary/70 reveal">EDGECAM · ON-DEVICE AI CCTV</div>
            <h3 className="text-2xl md:text-3xl font-bold text-ink mb-2 reveal delay-1">
              서버 없이, 현장에서,<br />2초 안에 판단하는 카메라
            </h3>
            {sellingPoints.map((p, idx) => (
              <div key={idx} className={`flex gap-5 rounded-2xl bg-white border border-line p-6 hover:border-primary/40 transition-all reveal delay-${idx + 1}`}>
                <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-line">
                  <p.icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ink mb-1">{p.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 스펙 카드 */}
          <div className="relative rounded-2xl bg-[#F5F2FC] border border-line p-8 overflow-hidden reveal delay-2">
            <div className="flex items-center justify-between mb-6">
              <div className="ticker text-slate-600">TECHNICAL SPEC</div>
              <div className="flex items-center gap-2 ticker">
                <span className="live-dot"></span>
                <span className="text-primary">EDGECAM</span>
              </div>
            </div>

            <dl className="divide-y divide-line">
              {specs.map(([k, v], idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <dt className="ticker text-slate-500 sm:w-32 shrink-0">{k}</dt>
                  <dd className="text-sm text-slate-700">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 h-0.5 w-full bg-[#E7E4DD] rounded-full overflow-hidden">
              <div className="h-full w-full bg-primary"></div>
            </div>
          </div>
        </div>

        {/* ===== 3종 솔루션 비교표 ===== */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-ink text-center mb-10 reveal">
            왜 EdgeCam인가
          </h3>
          <div className="overflow-x-auto reveal delay-1">
            <table className="w-full min-w-[640px] text-sm border-separate border-spacing-0">
              <thead>
                <tr className="ticker text-slate-500">
                  <th className="text-left p-4 border-b border-line font-normal">구분</th>
                  <th className="text-left p-4 border-b border-line font-normal">기존 NVR + 서버 AI</th>
                  <th className="text-left p-4 border-b border-line font-normal">클라우드 AI CCTV</th>
                  <th className="text-left p-4 border-b border-primary/40 font-bold text-primary bg-primary/5 rounded-t-xl">
                    Golden Bridge EdgeCam
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, idx) => (
                  <tr key={idx} className="text-slate-600">
                    <td className="p-4 border-b border-line text-slate-700 font-medium">{row.label}</td>
                    <td className="p-4 border-b border-line">{row.legacy}</td>
                    <td className="p-4 border-b border-line">{row.cloud}</td>
                    <td className={`p-4 border-b border-primary/20 bg-primary/5 text-ink font-medium ${idx === compareRows.length - 1 ? 'rounded-b-xl' : ''}`}>
                      {row.edge}
                    </td>
                  </tr>
                ))}
                <tr className="text-slate-600">
                  <td className="p-4 text-slate-700 font-medium">약자시설 특화 감지</td>
                  <td className="p-4"><XIcon size={16} className="text-slate-400" /></td>
                  <td className="p-4"><XIcon size={16} className="text-slate-400" /></td>
                  <td className="p-4 bg-primary/5 rounded-b-xl text-ink font-medium">
                    <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> 낙상 · 배회 · 연기</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="text-center reveal">
          <button
            onClick={handleInquiry}
            className="group inline-flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary-glow text-white text-sm font-bold rounded-full shadow-[0_4px_20px_rgba(91,33,182,0.15)] transition-all hover:scale-105"
          >
            Golden Bridge · EdgeCam 도입/실증 문의
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-xs text-slate-500">지자체 실증(PoC) · 복지시설 도입 · 파트너십 문의를 환영합니다.</p>
        </div>
      </div>
    </section>
  );
};

export default Spotlight;

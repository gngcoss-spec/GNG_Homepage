// ============================================================
// Platforms.tsx — Redesign v2 → Phase 2 (제품 포트폴리오 8종 확장)
// SSiN / SSoN / SSAx 기존 detail 데이터 보존 +
// 통합브로슈어 기준 SpaceOps / Golden Bridge / Smart FM / Edge H/W / Logistics DX 추가
// 인터랙션: 카드 3D 틸트, 데이터 라인 호버, 백그라운드 그리드 펄스,
//          스크롤 리빌, HUD 코너
// ============================================================
import React, { useEffect, useState } from 'react';
import { ScanFace, Network, Sparkles, Building2, Siren, ClipboardCheck, Camera, Warehouse, ArrowUpRight, ArrowRight } from 'lucide-react';
import { PlatformItem } from '../types';
import PlatformModal from './PlatformModal';
import CampusMap from './CampusMap';

// 캠퍼스 씬 리스트용 메타 (공간 매핑 · 한 줄 역할)
const SCENE_META: Record<string, { zone: string; role: string }> = {
  'SSiN':         { zone: 'GATE',       role: '출입 보안 · 방문자 사전 검증' },
  'SSoN':         { zone: 'CONTROL',    role: 'DT 기반 3D 통합 관제' },
  'SSAx':         { zone: 'HQ TOWER',   role: 'IBS·FMS·BEMS 운영 자동화' },
  'SpaceOps':     { zone: 'OFFICE',     role: '스마트오피스 공간 운영' },
  'Golden Bridge':{ zone: 'PUBLIC',     role: 'AI 대피안전 · 공공 안전망' },
  'Smart FM':     { zone: 'FACTORY·LAB',role: 'QR 기반 AI 시설관리' },
  'Edge H/W':     { zone: 'DEVICES',    role: '온디바이스 CCTV · 유도등' },
  'Logistics DX': { zone: 'WAREHOUSE',  role: '물류·창고 자동화 (SIDONN)' },
};

const Platforms: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [autoIdx, setAutoIdx] = useState(0);

  const platforms: PlatformItem[] = [
    {
      id: 'SSiN',
      title: 'SSiN',
      subtitle: 'Smart Security Identification Network',
      description: '모든 보안·안전 시스템의 출발점. 사업장에 ‘들어오는 사람’을 통제하고, 방문자의 위험 요소를 AI로 사전 필터링하며, 출입에 필요한 모든 절차를 자동화합니다.',
      tags: ['Access Control', 'Identity', 'Threat Prevention'],
      detail: {
        title: 'SSiN',
        description: '“사업장에 IN하는 모든 사람을 AI가 식별하고 인증한다.”',
        features: [
          {
            title: '내방객 관리 플랫폼 (Visitor Pre-Entry System)',
            items: ['방문 신청 → 약관 → 정보 입력 → AI 서류 판독 → 보안·안전 사전교육 → QR 출입', '모바일 퍼스트 구조', '고객사별 설정 반영(CI·톤앤매너)']
          },
          {
            title: 'AI 기반 위험도 판단 (Risk Scoring)',
            items: ['건강검진서 / 안전교육증 등 OCR 자동 분석', '목적별 필요한 서류 자동 제시', '위험 작업의 경우 사전 차단 기능']
          },
          {
            title: '출입통제 시스템(ACS) 자동 연동',
            items: ['QR 1회용 출입권한 생성', '시간·장소·담당자 바인딩', '복사·전달 불가']
          },
          {
            title: '데이터 기반 통제 체계 구축',
            items: ['방문자 유형 기반 리스크 예측', '작업 위험도 자동 판정', '안전/보안 Compliance 자동화']
          }
        ],
        valueProp: {
          title: '사람이 들어오기 전에, 위험을 없애는 시스템.',
          description: '기존에는 들어온 후 감시였다면, SSiN은 들어오기 전에 위험을 차단합니다. 선제적 보안 + 선제적 안전 + 완전 자동화된 출입 프로세스 = 기업 보안/안전 전략의 새로운 표준.'
        }
      }
    },
    {
      id: 'SSoN',
      title: 'SSoN',
      subtitle: 'Safety & Security Operating Nexus',
      description: '플랫폼이 ON되는 순간. 사업장 내부의 모든 보안·안전 이벤트를 DT 기반 3D로 통합 관제합니다.',
      tags: ['CCTV Integration', 'Digital Twin', 'Operations'],
      detail: {
        title: 'SSoN',
        description: '“사업장 내부의 모든 보안·안전 이벤트를 DT 기반 3D로 통합 관제한다.”',
        features: [
          {
            title: '3D 디지털 트윈 기반 통합 관제',
            items: ['건물 구조·출입구·CCTV·센서 위치를 실시간 3D로 표시', '이벤트 발생 시 위치·경로·대응 절차 자동 표시', 'SSiN과 연결되어 “누가 들어왔는지·어디에 있는지” 조회 가능']
          },
          {
            title: '보안 시스템 통합',
            items: ['출입통제(ACS)', 'CCTV + AI 객체 인식', '얼굴인식/차량번호 인식', '방범센서, 비상버튼', '외부 위협 탐지']
          },
          {
            title: '안전 시스템 통합',
            items: ['가스, 누수, 화재, 연기 센서', '작업허가 기반 위험 작업 실시간 표시', '사고 징후 자동 탐지 (AI Anomaly Detection)']
          },
          {
            title: 'Event Priority AI',
            items: ['이벤트 중요도 자동 분류', '다중 알람 시 선제적 대응 우선순위 제시', '인원·설비와 연동된 리스크 점수화']
          }
        ],
        valueProp: {
          title: '복잡한 보안/안전 시스템을 하나의 3D 지도 안에서 이해하도록 만든다.',
          description: '기존 관제는 화면이 많고 시스템이 많아 대응이 느립니다. SSoN은 3D 통합 + AI 자동분류로 관제 인력의 효율을 극적으로 끌어올립니다.'
        }
      }
    },
    {
      id: 'SSAx',
      title: 'SSAx',
      subtitle: 'Safety & Security Autonomous Transformation',
      description: '건물·공장 운영을 자동화하는 IBS, FMS, BEMS의 통합 DX 플랫폼. 시설·설비·에너지·점검·관리까지 건물 운영의 전 생애주기를 AI와 데이터 기반으로 자동화하는 “최종 단계 플랫폼"을 제공합니다.',
      tags: ['Automation', 'Energy Mgmt', 'Self-Optimization'],
      detail: {
        title: 'SSAx',
        description: '“사람이 운영하던 건물을 AI가 스스로 운영하도록 만든다.”',
        features: [
          {
            title: 'IBS (빌딩자동화) 통합 제어',
            items: ['조명 / 공조 / 난방 / 엘리베이터 / 출입 / IoT 설비 제어', 'DT 기반으로 공간별 에너지 흐름 시각화', 'AI 기반 일정·상황별 자동제어']
          },
          {
            title: 'FMS (시설/자산/점검 관리)',
            items: ['설비 자산 DB', '점검 항목 자동 스케줄링', '사진·AI 기반 점검 자동화', '고장 예측 (Predictive Maintenance)']
          },
          {
            title: 'BEMS (에너지 관리 및 최적화)',
            items: ['전력·냉난방 사용량 분석', '피크 부하 예측', '기준치 초과 시 자동 제어', '에너지 절감 정책 자동 적용']
          },
          {
            title: 'AI 기반 운영 자동화',
            items: ['설비 이상 탐지', '작업자 위험도 연동', 'SSiN/SSoN 이벤트 기반 제어']
          }
        ],
        valueProp: {
          title: '사람이 운영하던 건물을 AI가 스스로 운영하도록 만든다.',
          description: '기존 건물 시스템은 수많은 벤더, 수많은 패널, 수많은 앱들이 따로 존재합니다. SSAx는 그 모든 이기종 시스템을 자동으로 연결하고, 운영을 통합하고, 최적화까지 수행하는 단일 플랫폼입니다.'
        }
      }
    },
    {
      id: 'SpaceOps',
      title: 'SpaceOps',
      subtitle: 'Smart Space Operations Platform',
      description: '회의실·좌석·실내 길찾기·공간 분석·IoT·AI 어시스턴트를 통합한 스마트오피스 운영 플랫폼. 업무 공간의 예약부터 활용 분석까지 하나의 체계로 운영합니다.',
      tags: ['Smart Office', 'Space Analytics', 'IoT'],
      detail: {
        title: 'SpaceOps',
        description: '"업무 공간의 예약·안내·분석을 하나의 플랫폼으로 통합한다."',
        features: [
          {
            title: 'MeetOps — 회의실 운영',
            items: ['회의실 예약·운영 통합 관리', '회의 공간 활용률 분석']
          },
          {
            title: 'DeskOps — 좌석 운영',
            items: ['좌석 예약·배정 관리', '근무 공간 운영 현황 파악']
          },
          {
            title: 'NaviOps — 실내 길찾기',
            items: ['실내 내비게이션 안내', '방문자 목적지 안내 연계']
          },
          {
            title: '공간 분석 · AI 어시스턴트',
            items: ['공간 활용 데이터 분석', 'IoT 센서 연동', 'AI 어시스턴트 기반 운영 지원']
          }
        ],
        valueProp: {
          title: '공간이 스스로 판단하고 운영되는 오피스.',
          description: '회의실, 좌석, 길찾기, 공간 분석, IoT, AI 어시스턴트가 따로 운영되던 오피스 환경을 SpaceOps 하나로 통합해 공간 활용률과 업무 경험을 동시에 높입니다.'
        }
      }
    },
    {
      id: 'Golden Bridge',
      title: 'Golden Bridge',
      subtitle: 'AI 대피안전 플랫폼',
      description: '화재·가스·정전·혼잡 등 재난 상황에서 피난약자와 현장 상황을 실시간으로 인식하고, 최적 대피 경로와 유도 장치를 제공하는 AI 대피안전 플랫폼입니다.',
      tags: ['Golden Time', 'Evacuation AI', 'Digital Twin'],
      detail: {
        title: 'Golden Bridge',
        description: '"골든타임을 지키는 가장 안전한 연결 — 현장에서 감지하고, AI로 판단하며, 즉시 안내·제어한다."',
        features: [
          {
            title: '감지 — EdgeCam 온디바이스 AI',
            items: ['낙상·화재(연기·불꽃)·배회 실시간 감지', '영상 원본은 기기 내 보관, 메타데이터만 전송 (개인정보 보호)', '위험상황 2초 이내 감지']
          },
          {
            title: '판단 — AI · 디지털트윈 플랫폼',
            items: ['3D 디지털트윈 기반 현장 상황 인식', 'AI 최단경로 대피 알고리즘 (연기 확산·밀집도 반영)', '대피 시뮬레이션 기반 검증']
          },
          {
            title: '대응 — 가변형 LED 스마트 유도등',
            items: ['산출된 경로에 따라 LED 화살표 방향 실시간 변경', '연기 특성을 고려한 저위치 설치 + 음성 안내']
          },
          {
            title: '연동 — 정부·지자체 안전망',
            items: ['사고 발생 시 골든타임 내 자동 신고 연계', '지자체 관제·안심서비스 연동']
          }
        ],
        valueProp: {
          title: '단 1초가 생사를 가릅니다. Golden Bridge는 그 1초를 지킵니다.',
          description: '감지 → 판단 → 대응 → 연동을 단일 플랫폼에서 자동으로 수행하는 End-to-End AI 재난 대응 시스템으로, 사회적 약자 시설의 안전 사각지대를 해소합니다.'
        }
      }
    },
    {
      id: 'Smart FM',
      title: 'Smart FM',
      subtitle: 'QR 기반 AI 시설관리(FMS) 서비스',
      description: 'QR 코드로 공간·설비의 업무·인력·점검·VOC를 연결하는 AI 기반 FMS 서비스. 현장에서 QR을 스캔하면 운영 이력이 열리고, 축적된 데이터를 AI가 분석합니다.',
      tags: ['QR 기반 FMS', 'AI 분석', 'VOC'],
      detail: {
        title: 'Smart FM',
        description: '"QR을 스캔하면 현장의 운영 이력이 열린다."',
        features: [
          {
            title: 'QR 현장 업무 · 미화 관리',
            items: ['공간·설비 QR 스캔으로 현장 업무 시작', '청소 상태·스케줄·공간별 미화 이력 관리']
          },
          {
            title: '점검 관리',
            items: ['QR 기반 일상·정기 점검 자동 스케줄링', '측정값 기록·이력 관리']
          },
          {
            title: 'VOC 관리',
            items: ['민원 접수부터 처리까지 이력 관리', '공간 기반 VOC 현황 파악']
          },
          {
            title: 'AI 분석 · 리포트',
            items: ['점검·VOC 등 축적 데이터 AI 분석', '공간별 인력 배치·장비 현황·품질 리포트']
          }
        ],
        valueProp: {
          title: 'QR 하나로 현장 업무를 연결하고, AI로 관리한다.',
          description: '공간·설비에 부착된 QR로 분산되어 있던 시설관리 업무를 통합하고, 축적된 운영 데이터를 AI가 분석해 관리 효율을 높입니다.'
        }
      }
    },
    {
      id: 'Edge H/W',
      title: 'Edge H/W',
      subtitle: '현장 감지·실행 엣지 하드웨어',
      description: 'EdgeCam·Guardian Light·Smart Lock 등 현장에서 감지하고 실행하는 엣지 디바이스 라인업. 온디바이스 AI로 현장에서 즉시 판단합니다.',
      tags: ['EdgeCam', 'On-Device AI', 'Guardian Light'],
      detail: {
        title: 'Edge H/W',
        description: '"현장에서 감지하고, AI로 판단하며, 즉시 안내·제어한다."',
        features: [
          {
            title: 'EdgeCam — 온디바이스 AI CCTV',
            items: ['낙상·화재·배회·이상행동 실시간 감지', 'NVR·AI 서버 없이 카메라 자체 AI 추론', '메타데이터만 전송 — 영상 원본 미유출 (개인정보 보호)', '위험상황 2초 이내 감지']
          },
          {
            title: 'Guardian Light — 안내·유도',
            items: ['대피 방향 실시간 안내', '조명형 통합 디바이스 디자인 (시설 거부감 최소화)']
          },
          {
            title: 'Smart Lock — 접근 제어',
            items: ['제한구역 물리 접근을 권한 기반으로 제어', '플랫폼 연동 출입 권한 관리']
          },
          {
            title: '플랫폼 연동',
            items: ['표준 MQTT + 오픈 API', 'SSoN·Golden Bridge 관제 플랫폼 연계']
          }
        ],
        valueProp: {
          title: '서버 없이, 현장에서, 2초 안에.',
          description: '온디바이스 AI로 기존 NVR+서버 방식 대비 도입 비용을 크게 낮추고, 영상 원본을 외부로 보내지 않아 개인정보 이슈 없이 CCTV 사각지대까지 안전 감시를 확장합니다.'
        }
      }
    },
    {
      id: 'Logistics DX',
      title: 'Logistics DX',
      subtitle: 'Logistics Automation DX · SIDONN 한국 총판',
      description: '중국 물류자동화 전문 기업 SIDONN의 한국 총판으로서, 물류·창고 자동화 제품을 설계·소싱하고 프로세스·물동량 분석 기반으로 최적의 자동화 운영 구조를 구축하는 물류 DX 솔루션입니다.',
      tags: ['SIDONN 총판', 'AGV · ACR · AS/RS', 'WMS 연계'],
      detail: {
        title: 'Logistics DX',
        description: '"물류의 흐름을 데이터로 설계하고, 자동화 설비로 실행한다."',
        features: [
          {
            title: 'SIDONN 총판 · 소싱',
            items: ['중국 물류자동화 전문 기업 SIDONN 한국 총판', '글로벌 현장에서 검증된 물류·창고 자동화 설비 직접 소싱']
          },
          {
            title: '분석 · 설계',
            items: ['물류 프로세스·보관량·처리량 분석', 'Layout 최적화·자동화 설비 구성 설계']
          },
          {
            title: '설비 구축',
            items: ['AGV · ACR · CTU · 4Way Shuttle · AS/RS(스태커 크레인)', '현장 맞춤 자동화 설비 구축']
          },
          {
            title: '연계 · 실행',
            items: ['WMS 연계', '자동화 창고 운영']
          }
        ],
        valueProp: {
          title: '설비 도입이 아니라, 데이터 분석에서 출발한다.',
          description: '프로세스·물동량·공간을 분석해 최적의 자동화 구조를 설계하고, SIDONN 총판으로서 검증된 설비를 직접 소싱해 구축·WMS 연계·운영까지 이어지는 End-to-End 물류 DX를 제공합니다.'
        }
      }
    }
  ];

  const icons = [ScanFace, Network, Sparkles, Building2, Siren, ClipboardCheck, Camera, Warehouse];

  // 호버가 없을 때 3.8초 간격으로 플랫폼 자동 순회 (발견성 확보)
  useEffect(() => {
    if (hoveredId || selectedPlatform) return;
    const timer = window.setInterval(() => {
      setAutoIdx(prev => (prev + 1) % platforms.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [hoveredId, selectedPlatform, platforms.length]);

  const activeId = hoveredId ?? platforms[autoIdx].id;
  const activePlatform = platforms.find(p => p.id === activeId) ?? platforms[0];
  const selectById = (id: string) => {
    const found = platforms.find(p => p.id === id);
    if (found) setSelectedPlatform(found);
  };

  // ---- Tilt handler ----
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-8px)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
  };

  return (
    <section id="platform" className="py-32 bg-surface border-y border-line relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="ticker text-primary/70 mb-4 reveal">PRODUCT PORTFOLIO · 8</div>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight reveal">하나의 공간, 하나의 데이터,<br className="hidden md:block" /> 하나의 운영 체계</h2>
            <p className="text-slate-600 text-lg max-w-2xl reveal delay-1">
              가능가는 8개 제품 라인업으로 공간의 안전·보안·운영·물류를 연결하고, 단계별 플랫폼을 통해 고객의 비즈니스 환경을 점진적으로 디지털화하고 지능화합니다.
            </p>
          </div>
          <div className="hidden md:block reveal delay-2">
            <div className="h-px w-32 bg-gradient-to-r from-primary to-transparent" />
          </div>
        </div>

        {/* ============================================================
            데스크톱: 인터랙티브 캠퍼스 맵 패널 (맵 ↔ 리스트 양방향 동기화)
            모바일: 디오라마 영상 + 카드 그리드
        ============================================================ */}
        <div className="hidden lg:block mb-16 reveal">
            <div className="rounded-3xl bg-white border border-line overflow-hidden shadow-xl">
              {/* 패널 헤더 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="live-dot" />
                  <span className="ticker">CAMPUS DIGITAL TWIN · INTERACTIVE</span>
                </div>
                <span className="text-xs text-slate-400">
                  공간에 마우스를 올리면 해당 플랫폼이 표시됩니다 · 클릭하면 상세 정보
                </span>
              </div>

              <div className="grid grid-cols-12 items-stretch">
                {/* 인터랙티브 캠퍼스 맵 */}
                <div className="col-span-8 flex flex-col">
                  <CampusMap
                    activeId={activeId}
                    onHoverChange={setHoveredId}
                    onSelect={selectById}
                  />
                  {/* 활성 플랫폼 캡션 바 (맵 아래 — 핫스팟을 가리지 않도록) */}
                  <div className="flex items-center gap-4 px-6 py-4 border-t border-line">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-primary shrink-0">
                      {SCENE_META[activePlatform.id]?.zone}
                    </span>
                    <span className="shrink-0 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-ink">{activePlatform.title}</span>
                      <span className="text-[11px] text-slate-500">{SCENE_META[activePlatform.id]?.role}</span>
                    </span>
                    <p className="flex-grow text-xs text-slate-500 leading-relaxed line-clamp-2 min-w-0">
                      {activePlatform.description}
                    </p>
                    <button
                      onClick={() => setSelectedPlatform(activePlatform)}
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      자세히 보기 <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 제품 리스트 (호버 ↔ 맵 하이라이트 동기화) */}
                <div className="col-span-4 border-l border-line flex flex-col">
                  {platforms.map((platform, idx) => {
                    const isActive = platform.id === activeId;
                    return (
                      <button
                        key={platform.id}
                        onMouseEnter={() => setHoveredId(platform.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`group/item flex-1 flex items-center gap-4 px-5 text-left border-b border-line last:border-b-0 transition-colors duration-300 ${
                          isActive ? 'bg-[#F5F2FC]' : 'hover:bg-background'
                        }`}
                      >
                        <span className={`font-mono text-[10px] w-7 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className={`w-1 h-8 rounded-full shrink-0 transition-colors duration-300 ${isActive ? 'bg-primary' : 'bg-line'}`} />
                        <span className="min-w-0 flex-grow">
                          <span className={`block text-sm font-bold truncate transition-colors ${isActive ? 'text-ink' : 'text-slate-600'}`}>
                            {platform.title}
                          </span>
                          <span className="block text-[11px] text-slate-400 truncate">
                            {SCENE_META[platform.id]?.role}
                          </span>
                        </span>
                        <span className={`font-mono text-[9px] tracking-wider shrink-0 px-1.5 py-0.5 rounded border transition-colors ${
                          isActive ? 'text-primary border-primary/40' : 'text-slate-400 border-line'
                        }`}>
                          {SCENE_META[platform.id]?.zone}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        {/* 모바일: 회전 디오라마 영상 (앰비언트 비주얼) */}
        <div className="lg:hidden mb-10 rounded-3xl overflow-hidden border border-line shadow-sm reveal">
          <video
            src="./campus_diorama.mp4"
            poster="./campus_diorama_poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full block"
            aria-label="GNG 스마트캠퍼스 디오라마"
          />
        </div>

        {/* 카드 그리드 — 모바일 전용 (데스크톱은 위 맵 패널) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:hidden">
          {platforms.map((platform, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className={`tilt-card relative group rounded-3xl border border-line bg-white hover:border-primary/40 transition-colors duration-500 cursor-pointer reveal delay-${(idx % 4) + 1}`}
              >
                <div className="h-full bg-white rounded-3xl p-8 flex flex-col relative overflow-hidden transition-colors">

                  {/* Background decorative text */}
                  <div className="absolute -right-4 -top-4 text-9xl font-black text-ink/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                    {idx + 1}
                  </div>

                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-[#F5F2FC] rounded-2xl flex items-center justify-center text-primary border border-line group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <Icon size={28} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="text-slate-400" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-ink mb-2">{platform.title}</h3>
                  <p className="text-xs font-semibold text-primary mb-6 uppercase tracking-wider">{platform.subtitle}</p>

                  <p className="text-slate-600 mb-8 leading-relaxed flex-grow group-hover:text-slate-700 transition-colors">
                    {platform.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {platform.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-1 rounded bg-[#F5F2FC] border border-line text-slate-600 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 신규: 카드 하단 데이터 라인 (호버 시 fill) */}
                  <div className="mt-6 h-0.5 w-full bg-[#F5F2FC] rounded-full overflow-hidden">
                    <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-700"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedPlatform && (
        <PlatformModal
          platform={selectedPlatform}
          isOpen={!!selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
        />
      )}
    </section>
  );
};

export default Platforms;

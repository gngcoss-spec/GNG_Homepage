// ============================================================
// CampusMap.tsx — 제품 섹션 인터랙티브 캠퍼스 맵
//
// .source의 생성 이미지(아이소메트릭 화이트 캠퍼스 → public/campus_map.webp)를
// 배경으로 쓰고, 그 위에 %-좌표 핫스팟을 얹어 호버/클릭 인터랙션 제공.
// (기존 Three.js CampusScene을 대체 — 이미지 품질이 우수해 교체)
//
// - 호버 존 ↔ 우측 리스트 양방향 동기화 (activeId prop)
// - 활성 존: 라벤더 틴트(multiply) + 펄스 링 + 라벨 칩이 부드럽게 이동
// - Edge H/W: 단일 건물이 아니라 씬 곳곳의 센서폴 마커들이 동시에 점등
// - 클릭 시 onSelect(id) → 기존 PlatformModal 재사용
//
// 공간 매핑: 정문 게이트=SSiN · 중앙 팔각 허브=SSoN · 좌상단 타워=SSAx
//   상단 오피스=SpaceOps · 톱니지붕 공장=Smart FM · 하단 물류센터=Logistics DX
//   도로 건너 클리닉/복지시설=Golden Bridge · 센서폴=Edge H/W
// ============================================================
import React from 'react';

interface Zone {
  id: string;
  /** 호버 영역 (이미지 기준 % 좌표) */
  rect: { x: number; y: number; w: number; h: number };
  /** 링·라벨 앵커 (%) */
  anchor: { x: number; y: number };
  /** 라벤더 틴트 타원 크기 (%) */
  glow: { w: number; h: number };
}

// 이미지(1600×993) 기준 % 좌표 — campus_map.webp 교체 시 여기만 보정
const ZONES: Zone[] = [
  { id: 'SSAx',          rect: { x: 12, y: 3,  w: 22, h: 44 }, anchor: { x: 23, y: 36 }, glow: { w: 24, h: 36 } },
  { id: 'SpaceOps',      rect: { x: 39, y: 7,  w: 17, h: 27 }, anchor: { x: 47, y: 24 }, glow: { w: 18, h: 22 } },
  { id: 'Smart FM',      rect: { x: 58, y: 16, w: 26, h: 31 }, anchor: { x: 70, y: 33 }, glow: { w: 26, h: 26 } },
  { id: 'SSoN',          rect: { x: 38, y: 37, w: 20, h: 30 }, anchor: { x: 48, y: 51 }, glow: { w: 22, h: 24 } },
  { id: 'Logistics DX',  rect: { x: 5,  y: 47, w: 30, h: 39 }, anchor: { x: 20, y: 64 }, glow: { w: 30, h: 30 } },
  { id: 'SSiN',          rect: { x: 31, y: 75, w: 23, h: 22 }, anchor: { x: 42, y: 86 }, glow: { w: 20, h: 16 } },
  { id: 'Golden Bridge', rect: { x: 70, y: 50, w: 28, h: 42 }, anchor: { x: 83, y: 67 }, glow: { w: 26, h: 32 } },
];

// Edge H/W — 씬 곳곳의 센서폴 위치 (%)
const EDGE_POLES = [
  { x: 11.5, y: 37 }, { x: 40, y: 16 }, { x: 53, y: 29 },
  { x: 23, y: 72 },   { x: 60.5, y: 56 },
];
const EDGE_ZONE: Zone = {
  id: 'Edge H/W',
  rect: { x: 0, y: 0, w: 0, h: 0 }, // 폴 마커 개별 히트존 사용
  anchor: { x: 53, y: 29 },
  glow: { w: 10, h: 12 },
};

interface CampusMapProps {
  activeId: string | null;
  onHoverChange: (id: string | null) => void;
  onSelect: (id: string) => void;
  className?: string;
}

const CampusMap: React.FC<CampusMapProps> = ({ activeId, onHoverChange, onSelect, className = '' }) => {
  const isEdgeActive = activeId === 'Edge H/W';
  const activeZone = isEdgeActive ? EDGE_ZONE : ZONES.find(z => z.id === activeId) ?? null;

  const hoverProps = (id: string) => ({
    onMouseEnter: () => onHoverChange(id),
    onMouseLeave: () => onHoverChange(null),
    onClick: () => onSelect(id),
  });

  return (
    <div className={`relative w-full aspect-[1600/993] select-none ${className}`}>
      <img
        src="./campus_map.webp"
        alt="GNG 스마트캠퍼스 맵 — 게이트·관제허브·타워·오피스·공장·물류센터·공공시설"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* 활성 존 라벤더 틴트 (앵커 이동 시 부드럽게 글라이드) */}
      {activeZone && (
        <div
          className="absolute pointer-events-none rounded-full transition-all duration-700 ease-out"
          style={{
            left: `${activeZone.anchor.x}%`,
            top: `${activeZone.anchor.y}%`,
            width: `${activeZone.glow.w}%`,
            height: `${activeZone.glow.h}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0.12) 55%, transparent 75%)',
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* 활성 존 펄스 링 + 라벨 칩 */}
      {activeZone && !isEdgeActive && (
        <div
          className="absolute pointer-events-none transition-all duration-700 ease-out"
          style={{ left: `${activeZone.anchor.x}%`, top: `${activeZone.anchor.y}%` }}
        >
          <span className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-primary/20" />
          <span className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary animate-ping" />
        </div>
      )}
      {activeZone && (
        <div
          className="absolute pointer-events-none transition-all duration-700 ease-out z-10"
          style={{ left: `${activeZone.anchor.x}%`, top: `${activeZone.anchor.y}%` }}
        >
          <span className="absolute -translate-x-1/2 -translate-y-[190%] whitespace-nowrap bg-white/95 border border-primary/40 rounded-full px-3 py-1 text-xs font-bold text-ink shadow-sm">
            {activeZone.id}
          </span>
        </div>
      )}

      {/* Edge H/W 활성 시: 센서폴 마커 일제 점등 */}
      {isEdgeActive && EDGE_POLES.map((p, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-primary bg-primary/30" />
          <span className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-primary animate-ping" style={{ animationDelay: `${i * 0.15}s` }} />
        </div>
      ))}

      {/* 호버/클릭 존 */}
      {ZONES.map(z => (
        <button
          key={z.id}
          type="button"
          aria-label={`${z.id} 영역`}
          className="absolute cursor-pointer bg-transparent"
          style={{ left: `${z.rect.x}%`, top: `${z.rect.y}%`, width: `${z.rect.w}%`, height: `${z.rect.h}%` }}
          {...hoverProps(z.id)}
        />
      ))}
      {EDGE_POLES.map((p, i) => (
        <button
          key={`edge-${i}`}
          type="button"
          aria-label="Edge H/W 센서폴"
          className="absolute cursor-pointer bg-transparent rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: '4.5%', height: '7%' }}
          {...hoverProps('Edge H/W')}
        />
      ))}
    </div>
  );
};

export default CampusMap;

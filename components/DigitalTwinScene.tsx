// ============================================================
// DigitalTwinScene.tsx
// Three.js 기반 디지털트윈 빌딩 + 데이터 노드 + AI 스캔 시각화
//
// 사용처: Hero 섹션의 우측 비주얼 영역
// - 기존 정적 dashboard 이미지(/hero_dashboard.png)는 fallback으로 유지
// - 본 컴포넌트가 마운트되면 그 위에 인터랙티브 3D 씬을 오버레이
// ============================================================
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DigitalTwinSceneProps {
  /** 배경 컬러 (씬 fog 컬러도 동일하게 적용) */
  background?: string;
  className?: string;
}

const DigitalTwinScene: React.FC<DigitalTwinSceneProps> = ({
  background = '#08070E',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const setSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // ---- Scene + Camera ----
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(new THREE.Color(background).getHex(), 40, 160);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
    camera.position.set(28, 22, 60);
    camera.lookAt(0, 4, 0);

    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    setSize();
    window.addEventListener('resize', setSize);

    // ---- Colors (보라 단일 계열 팔레트) ----
    const COLOR_PRIMARY = 0x8B5CF6;
    const COLOR_SECONDARY = 0x7C3AED;
    const COLOR_ACCENT = 0xC4B5FD;
    const COLOR_GREEN = 0x22C55E;
    const COLOR_AMBER = 0xF59E0B;

    // ---- Ground grid ----
    const grid = new THREE.GridHelper(160, 32, COLOR_PRIMARY, 0x1A1B23);
    grid.position.y = -6;
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // ---- Wireframe Buildings (디지털트윈) ----
    interface BuildingDef { x: number; z: number; w: number; h: number; d: number; }
    const defs: BuildingDef[] = [
      { x: -18, z: -8,  w: 8,  h: 24, d: 8 },
      { x:  -6, z:  4,  w: 6,  h: 16, d: 6 },
      { x:   6, z: -6,  w: 10, h: 30, d: 7 },
      { x:  18, z:  6,  w: 7,  h: 20, d: 7 },
      { x: -26, z: 10,  w: 5,  h: 14, d: 5 },
      { x:  24, z: -12, w: 6,  h: 13, d: 6 },
    ];

    interface Building { wire: THREE.LineSegments; fill: THREE.Mesh; def: BuildingDef; }
    const buildings: Building[] = [];

    defs.forEach((def, i) => {
      const geo = new THREE.BoxGeometry(def.w, def.h, def.d);
      const edges = new THREE.EdgesGeometry(geo);
      const wireMat = new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? COLOR_ACCENT : (i % 3 === 1 ? COLOR_PRIMARY : COLOR_SECONDARY),
        transparent: true,
        opacity: 0.6,
      });
      const wire = new THREE.LineSegments(edges, wireMat);
      wire.position.set(def.x, def.h / 2 - 6, def.z);
      scene.add(wire);

      const fillMat = new THREE.MeshBasicMaterial({
        color: 0x0A0B10,
        transparent: true,
        opacity: 0.5,
      });
      const fill = new THREE.Mesh(geo, fillMat);
      fill.position.copy(wire.position);
      scene.add(fill);

      buildings.push({ wire, fill, def });
    });

    // ---- Data Nodes (떠다니는 센서/카메라/이벤트) ----
    interface Node {
      mesh: THREE.Mesh;
      base: THREE.Vector3;
      speed: number;
      phase: number;
    }
    const nodes: Node[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const NODE_COUNT = 70;

    for (let i = 0; i < NODE_COUNT; i++) {
      const rand = Math.random();
      const color = rand < 0.05 ? 0xEF4444
                  : rand < 0.15 ? COLOR_AMBER
                  : rand < 0.55 ? COLOR_ACCENT
                  : COLOR_GREEN;
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const m = new THREE.Mesh(nodeGeo, mat);
      m.position.set(
        (Math.random() - 0.5) * 70,
        Math.random() * 30 - 4,
        (Math.random() - 0.5) * 50
      );
      scene.add(m);
      nodes.push({
        mesh: m,
        base: m.position.clone(),
        speed: 0.5 + Math.random(),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ---- Data flow lines (노드 간 자동 연결) ----
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    function rebuildLines() {
      while (linesGroup.children.length) linesGroup.remove(linesGroup.children[0]);
      const positions: number[] = [];
      const colors: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i].mesh.position;
          const b = nodes[j].mesh.position;
          const d = a.distanceTo(b);
          if (d < 10) {
            positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
            const alpha = 1 - d / 10;
            colors.push(0.39 * alpha, 0.4 * alpha, 0.95 * alpha,
                        0.39 * alpha, 0.4 * alpha, 0.95 * alpha);
          }
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.55,
      });
      linesGroup.add(new THREE.LineSegments(geo, mat));
    }

    // ---- Data packets traveling between buildings ----
    interface Packet { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; t: number; speed: number; }
    const packets: Packet[] = [];

    function spawnPacket() {
      if (buildings.length < 2) return;
      const fromB = buildings[Math.floor(Math.random() * buildings.length)];
      const toB   = buildings[Math.floor(Math.random() * buildings.length)];
      if (fromB === toB) return;
      const from = new THREE.Vector3(fromB.def.x, fromB.def.h / 2 - 4, fromB.def.z);
      const to   = new THREE.Vector3(toB.def.x,   toB.def.h / 2 - 4,   toB.def.z);
      const geo = new THREE.SphereGeometry(0.4, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: COLOR_ACCENT });
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(from);
      scene.add(m);
      packets.push({ mesh: m, from, to, t: 0, speed: 0.005 + Math.random() * 0.008 });
    }

    // ---- AI Scan Frame ----
    const sfP = new Float32Array([
      -5, 0, -5,   5, 0, -5,
       5, 0, -5,   5, 0,  5,
       5, 0,  5,  -5, 0,  5,
      -5, 0,  5,  -5, 0, -5,
    ]);
    const scanFrameGeo = new THREE.BufferGeometry();
    scanFrameGeo.setAttribute('position', new THREE.BufferAttribute(sfP, 3));
    const scanFrame = new THREE.LineSegments(
      scanFrameGeo,
      new THREE.LineBasicMaterial({ color: COLOR_GREEN, transparent: true, opacity: 0.9 })
    );
    scene.add(scanFrame);

    // ---- Mouse Parallax ----
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMouseMove);

    // ---- Animation Loop ----
    let frame = 0;
    let camTargetX = 28, camTargetY = 22;
    let camX = 28, camY = 22;

    function animate() {
      frame++;
      const t = performance.now() * 0.001;

      // Camera slow orbit + mouse parallax
      camTargetX = 28 + mx * 6;
      camTargetY = 22 + my * 3;
      camX += (camTargetX - camX) * 0.04;
      camY += (camTargetY - camY) * 0.05;
      const orbitX = Math.cos(t * 0.03) * camX;
      const orbitZ = Math.sin(t * 0.03) * 60;
      camera.position.set(orbitX, camY, orbitZ);
      camera.lookAt(0, 4, 0);

      // Animate nodes
      nodes.forEach(n => {
        n.mesh.position.y = n.base.y + Math.sin(t * n.speed + n.phase) * 1.2;
        n.mesh.position.x = n.base.x + Math.cos(t * n.speed * 0.5 + n.phase) * 0.6;
        const s = 1 + Math.sin(t * 2 + n.phase) * 0.4;
        n.mesh.scale.setScalar(s);
      });

      // Rebuild connection lines (perf: every 6 frames)
      if (frame % 6 === 0) rebuildLines();

      // Spawn packets occasionally
      if (frame % 28 === 0) spawnPacket();

      // Move packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        p.mesh.position.lerpVectors(p.from, p.to, p.t);
        p.mesh.position.y += Math.sin(p.t * Math.PI) * 3;
        if (p.t >= 1) {
          scene.remove(p.mesh);
          (p.mesh.geometry as THREE.BufferGeometry).dispose();
          (p.mesh.material as THREE.Material).dispose();
          packets.splice(i, 1);
        }
      }

      // AI scan frame: sweep buildings
      const scanIdx = Math.floor(t * 0.35) % buildings.length;
      const target = buildings[scanIdx];
      scanFrame.position.x += (target.def.x - scanFrame.position.x) * 0.06;
      scanFrame.position.z += (target.def.z - scanFrame.position.z) * 0.06;
      scanFrame.position.y = -5 + Math.sin(t * 1.5) * 0.5;
      scanFrame.rotation.y += 0.005;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    animate();

    // ---- Cleanup ----
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', setSize);
      container.removeEventListener('mousemove', onMouseMove);
      try {
        scene.traverse(obj => {
          // dispose geometries/materials
          // (using `any` cast to avoid Three.js type complaints in strict mode)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mesh = obj as any;
          if (mesh.geometry) mesh.geometry.dispose?.();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) mesh.material.forEach((m: THREE.Material) => m.dispose());
            else mesh.material.dispose();
          }
        });
      } catch { /* noop */ }
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [background]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
    />
  );
};

export default DigitalTwinScene;

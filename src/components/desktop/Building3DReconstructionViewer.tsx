import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Building2, Layers, RotateCcw, Maximize2, Compass, Box } from 'lucide-react';

interface Building3DReconstructionViewerProps {
  selectedFloor: number | null; // null = all, 0 = Ground, 1 = 1, etc.
  onSelectFloor: (floor: number | null) => void;
  selectedUnit: string;
  onSelectUnit?: (unit: string) => void;
  height?: string;
}

export const Building3DReconstructionViewer: React.FC<Building3DReconstructionViewerProps> = ({
  selectedFloor,
  onSelectFloor,
  selectedUnit = 'A-302',
  onSelectUnit,
  height = '480px'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeFloorState, setActiveFloorState] = useState<number | null>(selectedFloor ?? 3);

  // Sync internal state with prop
  useEffect(() => {
    if (selectedFloor !== undefined) {
      setActiveFloorState(selectedFloor);
    }
  }, [selectedFloor]);

  const handleFloorClick = (fl: number | null) => {
    setActiveFloorState(fl);
    onSelectFloor(fl);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth || 700;
    const h = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08101f);
    scene.fog = new THREE.FogExp2(0x08101f, 0.035);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    const defaultDistance = 14.5;
    let cameraDistance = defaultDistance;
    let angleX = 0.75;
    let angleY = 0.42;
    let panOffset = new THREE.Vector3(0, 2.8, 0);

    const updateCamera = () => {
      camera.position.x = panOffset.x + cameraDistance * Math.sin(angleX) * Math.cos(angleY);
      camera.position.y = panOffset.y + cameraDistance * Math.sin(angleY);
      camera.position.z = panOffset.z + cameraDistance * Math.cos(angleX) * Math.cos(angleY);
      camera.lookAt(panOffset.x, panOffset.y, panOffset.z);
    };
    updateCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    sun.position.set(12, 20, 14);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x0284c7, 1.2);
    rim.position.set(-12, 10, -12);
    scene.add(rim);

    // 3. Cadastral Base Grid & Terrain
    const grid = new THREE.GridHelper(20, 40, 0x1e3a5f, 0x0d2036);
    grid.position.y = 0;
    scene.add(grid);

    // Site Pedestal (Plot B-7 Boundary)
    const siteGeom = new THREE.BoxGeometry(9.0, 0.2, 7.5);
    const siteMat = new THREE.MeshPhongMaterial({ color: 0x0c192e, specular: 0x1e3a5f, shininess: 30 });
    const site = new THREE.Mesh(siteGeom, siteMat);
    site.position.y = 0.1;
    scene.add(site);

    const siteBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(siteGeom),
      new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 })
    );
    siteBorder.position.y = 0.1;
    scene.add(siteBorder);

    // 4. MULTI-STOREY BUILDING GEOMETRY (PCCRC Complex)
    const buildingW = 5.8;
    const buildingD = 4.4;
    const numStoreys = 5; // Ground (0), 1, 2, 3, 4
    const storeyHeight = 1.15;
    const totalH = numStoreys * storeyHeight;

    const floorGroups: THREE.Group[] = [];

    for (let f = 0; f < numStoreys; f++) {
      const flGroup = new THREE.Group();
      const flBaseY = 0.2 + f * storeyHeight;
      const isIsolated = activeFloorState !== null && activeFloorState === f;
      const isGhosted = activeFloorState !== null && activeFloorState !== f;

      const floorOpacity = isGhosted ? 0.15 : isIsolated ? 0.95 : 0.8;
      const wireOpacity = isGhosted ? 0.2 : 0.9;

      // Floor slab
      const slabGeom = new THREE.BoxGeometry(buildingW, 0.08, buildingD);
      const slabMat = new THREE.MeshPhongMaterial({
        color: isIsolated ? 0x0369a1 : 0x1e293b,
        transparent: true,
        opacity: floorOpacity,
        specular: 0x38bdf8
      });
      const slab = new THREE.Mesh(slabGeom, slabMat);
      slab.position.y = flBaseY;
      flGroup.add(slab);

      // Floor boundary wireframe
      const slabWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(slabGeom),
        new THREE.LineBasicMaterial({
          color: isIsolated ? 0x38bdf8 : 0x0ea5e9,
          transparent: true,
          opacity: wireOpacity
        })
      );
      slabWire.position.y = flBaseY;
      flGroup.add(slabWire);

      // Columns
      const colGeom = new THREE.BoxGeometry(0.12, storeyHeight, 0.12);
      const colMat = new THREE.MeshPhongMaterial({
        color: isIsolated ? 0x64748b : 0x334155,
        transparent: true,
        opacity: floorOpacity
      });

      const colPositions = [
        [-buildingW / 2 + 0.06, -buildingD / 2 + 0.06],
        [buildingW / 2 - 0.06, -buildingD / 2 + 0.06],
        [-buildingW / 2 + 0.06, buildingD / 2 - 0.06],
        [buildingW / 2 - 0.06, buildingD / 2 - 0.06],
        [0, -buildingD / 2 + 0.06],
        [0, buildingD / 2 - 0.06]
      ];

      colPositions.forEach(([cx, cz]) => {
        const col = new THREE.Mesh(colGeom, colMat);
        col.position.set(cx, flBaseY + storeyHeight / 2, cz);
        flGroup.add(col);
      });

      // Exterior Glass Panels
      const glassGeom = new THREE.BoxGeometry(buildingW * 0.98, storeyHeight * 0.92, buildingD * 0.98);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: isIsolated ? 0x0284c7 : 0x0f172a,
        transparent: true,
        opacity: isGhosted ? 0.05 : isIsolated ? 0.35 : 0.18,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0
      });
      const glass = new THREE.Mesh(glassGeom, glassMat);
      glass.position.set(0, flBaseY + storeyHeight / 2, 0);
      flGroup.add(glass);

      // Floor 3 Special: Highlight Unit A-302
      if (f === 3) {
        const unitGeom = new THREE.BoxGeometry(buildingW * 0.46, storeyHeight * 0.94, buildingD * 0.46);
        const unitEdges = new THREE.EdgesGeometry(unitGeom);
        const unitLine = new THREE.LineSegments(
          unitEdges,
          new THREE.LineBasicMaterial({
            color: 0xf59e0b, // Amber Gold
            linewidth: 3,
            transparent: true,
            opacity: 1.0
          })
        );
        unitLine.position.set(buildingW * 0.23, flBaseY + storeyHeight / 2, buildingD * 0.23);
        flGroup.add(unitLine);

        // Semi-transparent volumetric solid for A-302
        const unitSolid = new THREE.Mesh(
          unitGeom,
          new THREE.MeshPhongMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: isIsolated ? 0.45 : 0.25,
            emissive: 0x78350f,
            emissiveIntensity: 0.4
          })
        );
        unitSolid.position.set(buildingW * 0.23, flBaseY + storeyHeight / 2, buildingD * 0.23);
        flGroup.add(unitSolid);
      }

      scene.add(flGroup);
      floorGroups.push(flGroup);
    }

    // Roof parapet & equipment
    const roofBaseY = 0.2 + totalH;
    const roofSlab = new THREE.Mesh(
      new THREE.BoxGeometry(buildingW, 0.1, buildingD),
      new THREE.MeshPhongMaterial({ color: 0x1e293b, transparent: true, opacity: activeFloorState !== null ? 0.2 : 0.8 })
    );
    roofSlab.position.y = roofBaseY;
    scene.add(roofSlab);

    const penthouse = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.9, 1.4),
      new THREE.MeshPhongMaterial({ color: 0x334155, transparent: true, opacity: activeFloorState !== null ? 0.2 : 0.9 })
    );
    penthouse.position.set(-1.0, roofBaseY + 0.45, -0.6);
    scene.add(penthouse);

    // 5. Mouse Orbit & Pan Controls
    let isMouseDown = false;
    let mouseButton = 0;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mouseButton = e.button;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      if (mouseButton === 0) {
        // Left click = Orbit
        angleX += dx * 0.008;
        angleY = Math.max(-0.1, Math.min(1.3, angleY + dy * 0.008));
      } else if (mouseButton === 2) {
        // Right click = Pan
        panOffset.y -= dy * 0.01;
      }
      updateCamera();
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance = Math.max(5, Math.min(25, cameraDistance + e.deltaY * 0.01));
      updateCamera();
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isMouseDown) {
        angleX += 0.0012;
        updateCamera();
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 700;
      const nh = container.clientHeight || 480;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [activeFloorState]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        backgroundColor: '#08101f',
        borderRadius: '10px',
        border: '1px solid #1e3a5f',
        overflow: 'hidden'
      }}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* TOP HUD: Live Building, Floor, Spatial Unit & Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          right: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(8, 16, 31, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #1e3a5f',
            borderRadius: '8px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#f8fafc',
            fontSize: '12px'
          }}
        >
          <div>
            <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
              Building
            </span>
            <div style={{ fontWeight: 800, color: '#f8fafc' }}>PCCRC Research Center</div>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#1e3a5f' }} />

          <div>
            <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
              Active Tier
            </span>
            <div style={{ fontWeight: 800, color: '#38bdf8' }}>
              {activeFloorState === null
                ? 'All Floors (Z0–Z5)'
                : activeFloorState === 0
                ? 'Ground Floor (Z0)'
                : `Floor 0${activeFloorState} (Z${activeFloorState})`}
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#1e3a5f' }} />

          <div>
            <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
              Spatial Unit
            </span>
            <div style={{ fontWeight: 800, color: '#f59e0b' }}>
              {activeFloorState === 3 || activeFloorState === null ? 'Unit A-302 (Isolated)' : 'Select Floor 3'}
            </div>
          </div>
        </div>

        {/* Cadastral Coordinates Badge */}
        <div
          style={{
            backgroundColor: 'rgba(8, 16, 31, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #1e3a5f',
            borderRadius: '8px',
            padding: '8px 14px',
            color: '#94a3b8',
            fontSize: '11px',
            fontFamily: 'monospace',
            textAlign: 'right'
          }}
        >
          <div>X: <strong style={{ color: '#38bdf8' }}>73.738912° E</strong></div>
          <div>Y: <strong style={{ color: '#38bdf8' }}>18.591240° N</strong></div>
          <div>Z: <strong style={{ color: '#4ade80' }}>574.60m MSL</strong></div>
        </div>
      </div>

      {/* FLOOR SELECTOR CONTROLS (GROUND, 1, 2, 3, 4, ALL) */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(8, 16, 31, 0.92)',
          backdropFilter: 'blur(6px)',
          border: '1px solid #1e3a5f',
          padding: '6px 10px',
          borderRadius: '8px'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginRight: '4px' }}>
          Floor:
        </span>

        {[
          { label: 'ALL', value: null },
          { label: 'GROUND', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 }
        ].map(item => {
          const isSelected = activeFloorState === item.value;
          return (
            <button
              key={item.label}
              onClick={() => handleFloorClick(item.value)}
              style={{
                backgroundColor: isSelected ? '#0284c7' : '#1e293b',
                color: isSelected ? '#ffffff' : '#cbd5e1',
                border: isSelected ? '1px solid #38bdf8' : '1px solid #334155',
                borderRadius: '5px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {item.label}
              {item.value === 3 && ' (Unit A-302)'}
            </button>
          );
        })}
      </div>

      {/* Orbit Helper Guide */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          right: '14px',
          fontSize: '10.5px',
          color: '#64748b',
          backgroundColor: 'rgba(8, 16, 31, 0.85)',
          padding: '4px 10px',
          borderRadius: '5px',
          pointerEvents: 'none'
        }}
      >
        Left Click: Rotate &bull; Right Click: Pan &bull; Wheel: Zoom
      </div>
    </div>
  );
};

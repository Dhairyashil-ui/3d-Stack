import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Building2, Sparkles, CheckCircle2, Waves, Layers } from 'lucide-react';

interface RealThreeJsApartmentCornerViewProps {
  progressPercent: number; // 0 to 100
  missingSummary?: string;
  width?: string;
  height?: string;
}

export const RealThreeJsApartmentCornerView: React.FC<RealThreeJsApartmentCornerViewProps> = ({
  progressPercent,
  missingSummary,
  width = '480px',
  height = '300px'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isFull = progressPercent >= 100;

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const w = container.clientWidth || 480;
    const h = container.clientHeight || 300;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060c18);
    scene.fog = new THREE.FogExp2(0x060c18, 0.045);

    // 2. Camera Setup (Iso-perspective angled for multi-storey building)
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    const cameraDistance = 11.2;
    let angleX = 0.72;
    let angleY = 0.38;

    const updateCamera = () => {
      camera.position.x = cameraDistance * Math.sin(angleX) * Math.cos(angleY);
      camera.position.y = cameraDistance * Math.sin(angleY) + 2.5;
      camera.position.z = cameraDistance * Math.cos(angleX) * Math.cos(angleY);
      camera.lookAt(0, 2.5, 0);
    };
    updateCamera();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    sunLight.position.set(10, 16, 12);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    rimLight.position.set(-10, 10, -10);
    scene.add(rimLight);

    // Underwater luminous point light
    const waterGlow = new THREE.PointLight(isFull ? 0x10b981 : 0x00d2ff, 2.2, 14);
    waterGlow.position.set(0, 1.5, 0);
    scene.add(waterGlow);

    // 5. Cadastral Grid Base
    const grid = new THREE.GridHelper(14, 28, 0x1e3a5f, 0x0f2338);
    grid.position.y = 0;
    scene.add(grid);

    // Ground platform pedestal
    const plinthGeom = new THREE.BoxGeometry(6.2, 0.18, 5.2);
    const plinthMat = new THREE.MeshPhongMaterial({
      color: 0x0c192c,
      specular: 0x1e3a5f,
      shininess: 40
    });
    const plinth = new THREE.Mesh(plinthGeom, plinthMat);
    plinth.position.y = 0.09;
    scene.add(plinth);

    // 6. MULTI-STOREY BUILDING ARCHITECTURE (PPCRC Multi-floor complex)
    const buildingW = 4.6;
    const buildingD = 3.6;
    const numFloors = 5;
    const floorHeight = 1.05;
    const totalBuildingH = numFloors * floorHeight; // ~5.25m

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // Building Envelope Wireframe Box
    const envelopeGeom = new THREE.BoxGeometry(buildingW, totalBuildingH, buildingD);
    const envelopeEdges = new THREE.EdgesGeometry(envelopeGeom);
    const envelopeLines = new THREE.LineSegments(
      envelopeEdges,
      new THREE.LineBasicMaterial({
        color: isFull ? 0x22c55e : 0x38bdf8,
        transparent: true,
        opacity: 0.85
      })
    );
    envelopeLines.position.y = totalBuildingH / 2 + 0.18;
    buildingGroup.add(envelopeLines);

    // Architectural Glass Facade (Semi-transparent outer skin)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const glassMesh = new THREE.Mesh(envelopeGeom, glassMat);
    glassMesh.position.y = totalBuildingH / 2 + 0.18;
    buildingGroup.add(glassMesh);

    // Structural Columns at Corners and Midpoints
    const columnGeom = new THREE.BoxGeometry(0.14, totalBuildingH, 0.14);
    const columnMat = new THREE.MeshPhongMaterial({
      color: 0x334155,
      specular: 0x64748b,
      shininess: 60
    });

    const colOffsets = [
      [-buildingW / 2 + 0.07, -buildingD / 2 + 0.07],
      [buildingW / 2 - 0.07, -buildingD / 2 + 0.07],
      [-buildingW / 2 + 0.07, buildingD / 2 - 0.07],
      [buildingW / 2 - 0.07, buildingD / 2 - 0.07],
      [0, -buildingD / 2 + 0.07],
      [0, buildingD / 2 - 0.07]
    ];

    colOffsets.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(columnGeom, columnMat);
      col.position.set(cx, totalBuildingH / 2 + 0.18, cz);
      buildingGroup.add(col);
    });

    // Floor Slabs & Horizontal Tiers (Ground Z0 through Roof Z5)
    const slabGeom = new THREE.BoxGeometry(buildingW * 0.98, 0.08, buildingD * 0.98);
    const slabMat = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      specular: 0x38bdf8,
      shininess: 50
    });
    const slabEdgeMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.7
    });

    const floorYPositions: number[] = [];
    for (let f = 0; f <= numFloors; f++) {
      const fy = 0.18 + f * floorHeight;
      floorYPositions.push(fy);

      const slab = new THREE.Mesh(slabGeom, slabMat);
      slab.position.y = fy;
      buildingGroup.add(slab);

      const slabEdge = new THREE.LineSegments(new THREE.EdgesGeometry(slabGeom), slabEdgeMat);
      slabEdge.position.y = fy;
      buildingGroup.add(slabEdge);

      // Floor Window Mullions (Vertical divider lines per floor)
      if (f < numFloors) {
        const mullionGeom = new THREE.BoxGeometry(0.04, floorHeight * 0.88, 0.04);
        const mullionMat = new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.6 });

        [-buildingW / 4, buildingW / 4].forEach(mx => {
          const mFront = new THREE.Mesh(mullionGeom, mullionMat);
          mFront.position.set(mx, fy + floorHeight / 2, buildingD / 2);
          buildingGroup.add(mFront);

          const mBack = new THREE.Mesh(mullionGeom, mullionMat);
          mBack.position.set(mx, fy + floorHeight / 2, -buildingD / 2);
          buildingGroup.add(mBack);
        });
      }
    }

    // Target Apartment Unit 302 Marker (Floor 3 Volumetric Highlight)
    const unit302Y = floorYPositions[3] + floorHeight / 2;
    const unit302Geom = new THREE.BoxGeometry(buildingW * 0.48, floorHeight * 0.92, buildingD * 0.48);
    const unit302Edges = new THREE.EdgesGeometry(unit302Geom);
    const unit302Line = new THREE.LineSegments(
      unit302Edges,
      new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 })
    );
    unit302Line.position.set(buildingW * 0.22, unit302Y, buildingD * 0.22);
    buildingGroup.add(unit302Line);

    // Rooftop Elevator Penthouse & Solar Array
    const roofY = floorYPositions[numFloors];
    const penthouseGeom = new THREE.BoxGeometry(1.4, 0.8, 1.2);
    const penthouse = new THREE.Mesh(
      penthouseGeom,
      new THREE.MeshPhongMaterial({ color: 0x334155, specular: 0x64748b })
    );
    penthouse.position.set(-0.8, roofY + 0.4, -0.4);
    buildingGroup.add(penthouse);

    const solarGeom = new THREE.BoxGeometry(1.6, 0.05, 1.4);
    const solarMat = new THREE.MeshPhongMaterial({ color: 0x0369a1, specular: 0x38bdf8, shininess: 80 });
    const solar = new THREE.Mesh(solarGeom, solarMat);
    solar.position.set(0.9, roofY + 0.15, 0.3);
    solar.rotation.x = -0.15;
    buildingGroup.add(solar);

    // 7. REALISTIC WATER / VOLUMETRIC FLUID SIMULATION
    const fillFraction = Math.max(0, Math.min(progressPercent / 100, 1.0));
    const maxWaterH = totalBuildingH;
    const currentWaterH = maxWaterH * fillFraction;

    let waterMesh: THREE.Mesh | null = null;
    let wavePlane: THREE.Mesh | null = null;
    let waveGeometry: THREE.PlaneGeometry | null = null;
    let surfaceFoamRing: THREE.LineSegments | null = null;
    const bubbles: { mesh: THREE.Mesh; speed: number; wobbleSpeed: number; wobbleOffset: number }[] = [];

    if (fillFraction > 0.01) {
      // (a) Main Water Body Volume with authentic refractive aquatic styling
      const waterGeom = new THREE.BoxGeometry(buildingW * 0.96, currentWaterH, buildingD * 0.96);
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: isFull ? 0x059669 : 0x0077be,
        emissive: isFull ? 0x064e3b : 0x002e5b,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.62,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.45,
        ior: 1.333,
        specularIntensity: 1.0,
        specularColor: 0xe0f2fe
      });

      waterMesh = new THREE.Mesh(waterGeom, waterMat);
      waterMesh.position.set(0, 0.18 + currentWaterH / 2, 0);
      scene.add(waterMesh);

      // (b) Undulating Animated Water Surface Mesh (High-density 32x32 plane)
      waveGeometry = new THREE.PlaneGeometry(buildingW * 0.96, buildingD * 0.96, 32, 32);
      waveGeometry.rotateX(-Math.PI / 2);

      const waveMat = new THREE.MeshPhysicalMaterial({
        color: isFull ? 0x34d399 : 0x38bdf8,
        emissive: isFull ? 0x10b981 : 0x0284c7,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.82,
        roughness: 0.02,
        metalness: 0.15,
        clearcoat: 1.0,
        specularColor: 0xffffff
      });

      wavePlane = new THREE.Mesh(waveGeometry, waveMat);
      wavePlane.position.set(0, 0.18 + currentWaterH, 0);
      scene.add(wavePlane);

      // (c) Glowing Shoreline Foam / Meniscus Edge where water touches the building
      const foamGeom = new THREE.BufferGeometry();
      const hw = (buildingW * 0.96) / 2;
      const hd = (buildingD * 0.96) / 2;
      const foamVertices = new Float32Array([
        -hw, 0, -hd,   hw, 0, -hd,
         hw, 0, -hd,   hw, 0,  hd,
         hw, 0,  hd,  -hw, 0,  hd,
        -hw, 0,  hd,  -hw, 0, -hd
      ]);
      foamGeom.setAttribute('position', new THREE.BufferAttribute(foamVertices, 3));
      surfaceFoamRing = new THREE.LineSegments(
        foamGeom,
        new THREE.LineBasicMaterial({
          color: isFull ? 0xa7f3d0 : 0xe0f2fe,
          linewidth: 2,
          transparent: true,
          opacity: 0.95
        })
      );
      surfaceFoamRing.position.set(0, 0.18 + currentWaterH, 0);
      scene.add(surfaceFoamRing);

      // (d) Effervescent Air Bubbles rising dynamically
      const bubbleCount = Math.floor(fillFraction * 36);
      const bubbleGeom = new THREE.SphereGeometry(0.045, 8, 8);
      const bubbleMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75
      });

      for (let i = 0; i < bubbleCount; i++) {
        const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
        const bx = (Math.random() - 0.5) * (buildingW * 0.82);
        const by = 0.2 + Math.random() * currentWaterH;
        const bz = (Math.random() - 0.5) * (buildingD * 0.82);
        bubble.position.set(bx, by, bz);
        scene.add(bubble);

        bubbles.push({
          mesh: bubble,
          speed: 0.008 + Math.random() * 0.012,
          wobbleSpeed: 2.5 + Math.random() * 3.0,
          wobbleOffset: Math.random() * Math.PI * 2
        });
      }
    }

    // 8. Interactive Mouse Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      angleX += deltaX * 0.008;
      angleY = Math.max(-0.15, Math.min(1.25, angleY + deltaY * 0.008));
      updateCamera();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 9. Animation Loop (Realistic wave motion, ripples, bubbles, caustics)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle ambient rotation when surveyor is idle
      if (!isDragging) {
        angleX += 0.0016;
        updateCamera();
      }

      // Dynamic Wave Surface Ripple Animation
      if (waveGeometry && wavePlane) {
        const posAttr = waveGeometry.attributes.position as THREE.BufferAttribute;
        const count = posAttr.count;

        for (let i = 0; i < count; i++) {
          const vx = posAttr.getX(i);
          const vz = posAttr.getZ(i);

          // Realistic dual-sine trochoidal wave ripples
          const wave =
            Math.sin(vx * 2.8 + time * 3.8) * 0.045 +
            Math.cos(vz * 3.2 + time * 3.2) * 0.035 +
            Math.sin((vx + vz) * 3.5 + time * 2.5) * 0.02;

          posAttr.setY(i, wave);
        }

        posAttr.needsUpdate = true;
        waveGeometry.computeVertexNormals();

        // Subtle overall fluid height fluctuation
        const surfaceFluctuation = Math.sin(time * 2.4) * 0.012;
        wavePlane.position.y = 0.18 + currentWaterH + surfaceFluctuation;

        if (surfaceFoamRing) {
          surfaceFoamRing.position.y = 0.18 + currentWaterH + surfaceFluctuation;
        }

        if (waterMesh) {
          waterMesh.position.y = 0.18 + (currentWaterH + surfaceFluctuation) / 2;
        }
      }

      // Animate Effervescent Rising Bubbles
      bubbles.forEach(b => {
        b.mesh.position.y += b.speed;
        b.mesh.position.x += Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * 0.003;

        // Reset bubble when it reaches water surface
        if (b.mesh.position.y >= 0.18 + currentWaterH) {
          b.mesh.position.y = 0.22;
          b.mesh.position.x = (Math.random() - 0.5) * (buildingW * 0.82);
          b.mesh.position.z = (Math.random() - 0.5) * (buildingD * 0.82);
        }
      });

      // Water glow pulsing
      waterGlow.position.y = 0.5 + Math.sin(time * 2.0) * 0.3;
      waterGlow.intensity = 1.8 + Math.sin(time * 3.5) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 480;
      const nh = container.clientHeight || 300;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [progressPercent, isFull]);

  return (
    <div
      style={{
        width,
        backgroundColor: '#0a0f1d',
        borderRadius: '12px',
        border: isFull ? '1.5px solid #22c55e' : '1px solid #1e3a5f',
        boxShadow: isFull
          ? '0 10px 30px rgba(34, 197, 94, 0.2), 0 0 20px rgba(34, 197, 94, 0.1)'
          : '0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(56, 189, 248, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 3D Header Bar */}
      <div
        style={{
          padding: '8px 14px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: '#e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={14} color={isFull ? '#22c55e' : '#38bdf8'} />
          <span style={{ fontWeight: 800, color: '#f8fafc' }}>
            PPCRC Building &bull; Volumetric Fluid Inflow
          </span>
          <span
            style={{
              fontSize: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Z0–Z5 Tiers
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Waves size={12} color={isFull ? '#22c55e' : '#0ea5e9'} />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 900,
              color: isFull ? '#22c55e' : '#38bdf8',
              fontFamily: 'monospace'
            }}
          >
            {progressPercent}% Liquid Fill
          </span>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height,
          position: 'relative',
          cursor: 'grab'
        }}
      >
        {/* Floating Floor Tier HUD Overlay */}
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: progressPercent >= 100 ? '#4ade80' : '#94a3b8',
              padding: '2px 6px',
              borderRadius: '3px',
              borderLeft: progressPercent >= 100 ? '2px solid #22c55e' : '2px solid #475569'
            }}
          >
            Z5: Roof Deck
          </div>
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: progressPercent >= 75 ? '#4ade80' : '#94a3b8',
              padding: '2px 6px',
              borderRadius: '3px',
              borderLeft: progressPercent >= 75 ? '2px solid #22c55e' : '2px solid #475569'
            }}
          >
            Z4: Upper Floor
          </div>
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#f59e0b',
              padding: '2px 6px',
              borderRadius: '3px',
              borderLeft: '2px solid #f59e0b'
            }}
          >
            ★ Z3: Unit 302
          </div>
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: progressPercent >= 40 ? '#4ade80' : '#94a3b8',
              padding: '2px 6px',
              borderRadius: '3px',
              borderLeft: progressPercent >= 40 ? '2px solid #22c55e' : '2px solid #475569'
            }}
          >
            Z2: Storey 2
          </div>
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: progressPercent >= 20 ? '#4ade80' : '#94a3b8',
              padding: '2px 6px',
              borderRadius: '3px',
              borderLeft: progressPercent >= 20 ? '2px solid #22c55e' : '2px solid #475569'
            }}
          >
            Z1: Storey 1
          </div>
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: progressPercent > 0 ? '#4ade80' : '#94a3b8',
              padding: '2px 6px',
              borderRadius: '3px',
              borderLeft: progressPercent > 0 ? '2px solid #22c55e' : '2px solid #475569'
            }}
          >
            Z0: Ground Entry
          </div>
        </div>

        {/* Orbit Helper Instruction */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '10px',
            fontSize: '10px',
            color: '#64748b',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            padding: '2px 8px',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        >
          Drag to Orbit 360° &bull; Live Wave Dynamics
        </div>
      </div>

      {/* Footer Status Bar */}
      <div
        style={{
          padding: '8px 14px',
          backgroundColor: '#0a0f1d',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}
      >
        <span style={{ color: isFull ? '#4ade80' : '#94a3b8' }}>
          {isFull
            ? '✓ 100% Volumetric Cadastral Space Reconstructed'
            : progressPercent > 0
            ? `${progressPercent}% Filled • Dynamic Inflow Active`
            : '0% Filled • Inflow activates on raw deliverable upload'}
        </span>
        <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
          WebGL Three.js (OpenGL 4.5)
        </span>
      </div>
    </div>
  );
};

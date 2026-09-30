import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X, Box, Rotate3d, CheckCircle2, Sparkles } from 'lucide-react';

interface ThreeJsApartmentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressPercent: number; // 0 to 100
}

export const ThreeJsApartmentViewerModal: React.FC<ThreeJsApartmentViewerModalProps> = ({
  isOpen,
  onClose,
  progressPercent
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isFull = progressPercent >= 100;

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1020);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 4.5, 7);
    camera.lookAt(0, 1.2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(isFull ? 0x22c55e : 0x0ea5e9, 1.5, 20);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // 4. Ground Grid
    const grid = new THREE.GridHelper(10, 20, 0x1e3a5f, 0x0f2942);
    grid.position.y = 0;
    scene.add(grid);

    // 5. Apartment Room Wireframe / Outer Walls
    const roomWidth = 4.2;
    const roomHeight = 2.8;
    const roomDepth = 3.6;

    // Outer Room Box wireframe
    const boxGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth);
    const boxEdges = new THREE.EdgesGeometry(boxGeometry);
    const boxLine = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: isFull ? 0x22c55e : 0x38bdf8, linewidth: 2 })
    );
    boxLine.position.y = roomHeight / 2;
    scene.add(boxLine);

    // Interior Partition Walls
    const partitionMat = new THREE.LineBasicMaterial({ color: 0x1e40af });
    // Bedroom wall
    const wall1Geom = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.1, roomHeight * 0.9, 1.8));
    const wall1 = new THREE.LineSegments(wall1Geom, partitionMat);
    wall1.position.set(-0.8, (roomHeight * 0.9) / 2, 0.9);
    scene.add(wall1);

    // Bathroom partition wall
    const wall2Geom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, roomHeight * 0.9, 0.1));
    const wall2 = new THREE.LineSegments(wall2Geom, partitionMat);
    wall2.position.set(1.2, (roomHeight * 0.9) / 2, -0.6);
    scene.add(wall2);

    // Window wireframe on back wall
    const windowGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 1.0, 0.05));
    const windowMesh = new THREE.LineSegments(
      windowGeom,
      new THREE.LineBasicMaterial({ color: 0x7dd3fc })
    );
    windowMesh.position.set(0, 1.6, -roomDepth / 2);
    scene.add(windowMesh);

    // 6. Volumetric Liquid Water Block inside room
    // Height scales with progressPercent (0 to 100)
    const fillFraction = Math.max(0.01, Math.min(progressPercent / 100, 1.0));
    const liquidHeight = Math.max(0.05, roomHeight * fillFraction);

    const liquidGeom = new THREE.BoxGeometry(roomWidth * 0.97, liquidHeight, roomDepth * 0.97);
    const liquidMat = new THREE.MeshPhongMaterial({
      color: isFull ? 0x22c55e : 0x0284c7,
      transparent: true,
      opacity: 0.55,
      shininess: 90,
      specular: 0xbae6fd
    });

    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
    liquidMesh.position.y = liquidHeight / 2;
    scene.add(liquidMesh);

    // Floating bubble particles inside liquid
    const bubbleCount = Math.floor(fillFraction * 35);
    const bubbleGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const bubbles: THREE.Mesh[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
      bubble.position.set(
        (Math.random() - 0.5) * (roomWidth * 0.8),
        Math.random() * liquidHeight,
        (Math.random() - 0.5) * (roomDepth * 0.8)
      );
      scene.add(bubble);
      bubbles.push(bubble);
    }

    // 7. Interactive Mouse Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let angleX = 0.8;
    let angleY = 0.45;
    const distance = 8.5;

    const updateCameraPos = () => {
      camera.position.x = distance * Math.sin(angleX) * Math.cos(angleY);
      camera.position.y = distance * Math.sin(angleY) + 1.2;
      camera.position.z = distance * Math.cos(angleX) * Math.cos(angleY);
      camera.lookAt(0, 1.2, 0);
    };
    updateCameraPos();

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
      angleY = Math.max(-0.2, Math.min(1.2, angleY + deltaY * 0.008));
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle room rotation if not dragging
      if (!isDragging) {
        angleX += 0.002;
        updateCameraPos();
      }

      // Animate bubbles rising
      bubbles.forEach((b) => {
        b.position.y += 0.008;
        if (b.position.y > liquidHeight) {
          b.position.y = 0.05;
        }
      });

      // Liquid top surface shimmer
      if (liquidMesh) {
        liquidMesh.position.y = liquidHeight / 2 + Math.sin(elapsedTime * 3) * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
  }, [isOpen, progressPercent, isFull]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0a1020',
          border: isFull ? '2px solid #22c55e' : '1px solid #1e3a5f',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '920px',
          height: '620px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating HUD Header */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            background: 'linear-gradient(180deg, rgba(10, 16, 32, 0.9) 0%, rgba(10, 16, 32, 0) 100%)',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              <Box size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                  Interactive 3D Apartment Space Viewer
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: isFull ? '#4ade80' : '#38bdf8',
                    backgroundColor: isFull ? 'rgba(34, 197, 94, 0.2)' : 'rgba(14, 165, 233, 0.2)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: isFull ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(14, 165, 233, 0.4)'
                  }}
                >
                  Three.js WebGL
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Target: Unit 302 (3rd Floor) • Total Volumetric Space: 285.4 m³ • Orbit Drag Enabled
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Three.js Canvas Container */}
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

        {/* Bottom Floating Status Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            background: 'linear-gradient(0deg, rgba(10, 16, 32, 0.95) 0%, rgba(10, 16, 32, 0) 100%)',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                3D Space Completion
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: isFull ? '#4ade80' : '#38bdf8' }}>
                {progressPercent.toFixed(0)}%
              </div>
            </div>

            <div style={{ width: '1px', height: '30px', backgroundColor: '#1e3a5f' }} />

            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Liquid Volumetric Level
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                {((progressPercent / 100) * 285.4).toFixed(1)} m³ of 285.4 m³
              </div>
            </div>

            <div style={{ width: '1px', height: '30px', backgroundColor: '#1e3a5f' }} />

            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Status
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: isFull ? '#4ade80' : '#bae6fd' }}>
                {isFull
                  ? '✓ 100% Volumetric Digital Twin Validated'
                  : progressPercent >= 75
                  ? 'Upper ceiling & boundary reconstructed'
                  : progressPercent >= 50
                  ? 'Middle room partition elevation reached'
                  : progressPercent >= 25
                  ? 'Lower floor datum reconstructed'
                  : 'Empty volume • Awaiting spatial package validation'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Click & drag to rotate view</span>
          </div>
        </div>
      </div>
    </div>
  );
};

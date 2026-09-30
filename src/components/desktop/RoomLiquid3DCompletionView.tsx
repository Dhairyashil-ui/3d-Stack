import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Waves, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoomLiquid3DCompletionViewProps {
  completionPercent: number; // 0 to 100
  width?: string;
  height?: string;
}

export const RoomLiquid3DCompletionView: React.FC<RoomLiquid3DCompletionViewProps> = ({
  completionPercent,
  width = '100%',
  height = '290px'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isFull = completionPercent >= 100;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 290;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1527);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    const cameraDistance = 7.4;
    let angleX = 0.82;
    let angleY = 0.38;

    const updateCamera = () => {
      camera.position.x = cameraDistance * Math.sin(angleX) * Math.cos(angleY);
      camera.position.y = cameraDistance * Math.sin(angleY) + 1.2;
      camera.position.z = cameraDistance * Math.cos(angleX) * Math.cos(angleY);
      camera.lookAt(0, 1.2, 0);
    };
    updateCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    keyLight.position.set(5, 10, 6);
    scene.add(keyLight);

    const waterLight = new THREE.PointLight(isFull ? 0x22c55e : 0x0284c7, 2.0, 12);
    waterLight.position.set(0, 2.0, 0);
    scene.add(waterLight);

    // 3. Grid Base
    const grid = new THREE.GridHelper(8, 16, 0x1e3a5f, 0x0f2338);
    grid.position.y = 0;
    scene.add(grid);

    // 4. Room Wireframe (Unit A-302 Dimensions: 4.2m W x 2.8m H x 3.4m D)
    const roomW = 4.2;
    const roomH = 2.8;
    const roomD = 3.4;

    const roomBoxGeom = new THREE.BoxGeometry(roomW, roomH, roomD);
    const roomEdges = new THREE.EdgesGeometry(roomBoxGeom);
    const roomLine = new THREE.LineSegments(
      roomEdges,
      new THREE.LineBasicMaterial({
        color: isFull ? 0x22c55e : 0x38bdf8,
        linewidth: 2,
        transparent: true,
        opacity: 0.85
      })
    );
    roomLine.position.y = roomH / 2;
    scene.add(roomLine);

    // Interior room partitions (Bedroom + Ensuite bath)
    const partMat = new THREE.LineBasicMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.7 });
    const wall1 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.08, roomH * 0.92, 1.8)), partMat);
    wall1.position.set(-0.8, (roomH * 0.92) / 2, 0.8);
    scene.add(wall1);

    const wall2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, roomH * 0.92, 0.08)), partMat);
    wall2.position.set(1.3, (roomH * 0.92) / 2, -0.6);
    scene.add(wall2);

    // Window on back wall
    const windowMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 1.0, 0.04)),
      new THREE.LineBasicMaterial({ color: 0x7dd3fc })
    );
    windowMesh.position.set(0, 1.5, -roomD / 2);
    scene.add(windowMesh);

    // Door on front wall
    const doorMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.85, 2.0, 0.04)),
      new THREE.LineBasicMaterial({ color: 0x60a5fa })
    );
    doorMesh.position.set(1.1, 1.0, roomD / 2);
    scene.add(doorMesh);

    // 5. Volumetric Liquid Water Block
    const fillFraction = Math.max(0, Math.min(completionPercent / 100, 1.0));
    const currentLiquidH = roomH * fillFraction;

    let waterMesh: THREE.Mesh | null = null;
    let wavePlane: THREE.Mesh | null = null;
    let waveGeom: THREE.PlaneGeometry | null = null;
    const bubbles: { mesh: THREE.Mesh; speed: number; wobble: number }[] = [];

    if (fillFraction > 0.01) {
      // Submerged Water Volume
      const waterGeom = new THREE.BoxGeometry(roomW * 0.97, currentLiquidH, roomD * 0.97);
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: isFull ? 0x059669 : 0x0284c7,
        emissive: isFull ? 0x064e3b : 0x023e8a,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.62,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.4,
        ior: 1.33
      });

      waterMesh = new THREE.Mesh(waterGeom, waterMat);
      waterMesh.position.set(0, currentLiquidH / 2, 0);
      scene.add(waterMesh);

      // Undulating Wave Top Surface
      waveGeom = new THREE.PlaneGeometry(roomW * 0.97, roomD * 0.97, 24, 24);
      waveGeom.rotateX(-Math.PI / 2);

      const waveMat = new THREE.MeshPhysicalMaterial({
        color: isFull ? 0x34d399 : 0x38bdf8,
        emissive: isFull ? 0x10b981 : 0x0284c7,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.8,
        roughness: 0.02,
        clearcoat: 1.0
      });

      wavePlane = new THREE.Mesh(waveGeom, waveMat);
      wavePlane.position.set(0, currentLiquidH, 0);
      scene.add(wavePlane);

      // Rising bubbles
      const bubbleCount = Math.floor(fillFraction * 26);
      const bGeom = new THREE.SphereGeometry(0.04, 6, 6);
      const bMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });

      for (let i = 0; i < bubbleCount; i++) {
        const b = new THREE.Mesh(bGeom, bMat);
        b.position.set(
          (Math.random() - 0.5) * (roomW * 0.8),
          Math.random() * currentLiquidH,
          (Math.random() - 0.5) * (roomD * 0.8)
        );
        scene.add(b);
        bubbles.push({ mesh: b, speed: 0.007 + Math.random() * 0.009, wobble: Math.random() * 5 });
      }
    }

    // 6. Interactive Orbit Controls
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
      angleY = Math.max(-0.2, Math.min(1.2, angleY + deltaY * 0.008));
      updateCamera();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (!isDragging) {
        angleX += 0.0018;
        updateCamera();
      }

      // Wave displacement
      if (waveGeom && wavePlane) {
        const pos = waveGeom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vz = pos.getZ(i);
          const wave = Math.sin(vx * 3.0 + time * 3.5) * 0.035 + Math.cos(vz * 3.0 + time * 3.0) * 0.025;
          pos.setY(i, wave);
        }
        pos.needsUpdate = true;
        waveGeom.computeVertexNormals();

        const fluctuation = Math.sin(time * 2.5) * 0.008;
        wavePlane.position.y = currentLiquidH + fluctuation;
        if (waterMesh) waterMesh.position.y = (currentLiquidH + fluctuation) / 2;
      }

      // Bubbles rising
      bubbles.forEach(b => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y >= currentLiquidH) {
          b.mesh.position.y = 0.08;
          b.mesh.position.x = (Math.random() - 0.5) * (roomW * 0.8);
          b.mesh.position.z = (Math.random() - 0.5) * (roomD * 0.8);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 400;
      const nh = container.clientHeight || 290;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [completionPercent, isFull]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#0c1527',
        borderRadius: '10px',
        border: isFull ? '1.5px solid #22c55e' : '1px solid #1e3a5f',
        overflow: 'hidden'
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Elevation Height Scale HUD Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          fontSize: '9.5px',
          fontFamily: 'monospace',
          color: '#94a3b8',
          backgroundColor: 'rgba(12, 21, 39, 0.75)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #1e3a5f',
          pointerEvents: 'none'
        }}
      >
        <span style={{ color: completionPercent >= 100 ? '#4ade80' : '#94a3b8' }}>Z: +2.8m (Ceiling)</span>
        <span style={{ color: completionPercent >= 75 ? '#4ade80' : '#94a3b8' }}>Z: +2.1m (Apartment)</span>
        <span style={{ color: completionPercent >= 50 ? '#4ade80' : '#94a3b8' }}>Z: +1.4m (BIM Mesh)</span>
        <span style={{ color: completionPercent >= 25 ? '#4ade80' : '#94a3b8' }}>Z: +0.7m (Footprint)</span>
        <span style={{ color: '#38bdf8' }}>Z: 0.0m (Floor Slab)</span>
      </div>

      {/* Stage Badge */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid #1e3a5f',
          fontSize: '11px',
          fontWeight: 700,
          color: isFull ? '#4ade80' : '#38bdf8'
        }}
      >
        <Waves size={12} />
        <span>
          {completionPercent >= 100
            ? 'Complete 3D Spatial Unit (100%)'
            : completionPercent >= 75
            ? 'Apartment / Room Geometry (75%)'
            : completionPercent >= 50
            ? 'Building / Floor Geometry (50%)'
            : completionPercent >= 25
            ? 'Basic Spatial Footprint (25%)'
            : 'Empty Spatial Model (0%)'}
        </span>
      </div>

      {/* Orbit Helper */}
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
        Drag to Orbit 360° &bull; Live Volumetric Fluid
      </div>
    </div>
  );
};

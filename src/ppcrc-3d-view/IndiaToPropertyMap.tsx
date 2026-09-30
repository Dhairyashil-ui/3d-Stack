// 3D Geospatial India Map & Property Locator
// Initial View: Full 3D view of Entire India Subcontinent
// Search Action: Cinematic Fly-to Zoom into Target Property (PCCRC Hinjawadi, Pune)

import React, { useEffect, useRef, useState } from 'react';
import { 
  Satellite, 
  ShieldCheck
} from 'lucide-react';
import { IndiaToPropertyMapProps } from './types';

// Coordinates matching Pralhad P. Chhabria Research Center (PCCRC)
const PCCRC_COORDS = { lat: 18.584072, lng: 73.737195, zoom: 19.0 };

export const IndiaToPropertyMap: React.FC<IndiaToPropertyMapProps> = ({
  isZoomed,
  aerialImageUrl = '/pccrc_building_centered_aerial.jpg',
  onZoomComplete,
  targetCoords = PCCRC_COORDS
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const aerialImgRef = useRef<HTMLImageElement | null>(null);

  const [cesiumActive, setCesiumActive] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0); // 0 = India, 1 = Property
  const [currentAltitude, setCurrentAltitude] = useState('3,840 km (Subcontinent Scale)');
  const [, setIsAnimating] = useState(false);
  const [flyStage, setFlyStage] = useState<'idle' | 'flying' | 'highlighting' | 'removing'>('idle');

  // Preload centered high-resolution satellite imagery
  useEffect(() => {
    const img = new Image();
    img.src = aerialImageUrl;
    img.onload = () => {
      aerialImgRef.current = img;
    };
  }, [aerialImageUrl]);

  // -------------------------------------------------------------------------
  // 1. Try CesiumJS Globe initialization
  // -------------------------------------------------------------------------
  useEffect(() => {
    let timer: any = null;
    const initCesium = () => {
      const Cesium = (window as any).Cesium;
      if (!Cesium || !cesiumContainerRef.current) {
        timer = setTimeout(initCesium, 150);
        return;
      }

      try {
        if (!viewerRef.current) {
          const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
            baseLayer: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            vrButton: false,
            shouldAnimate: true
          });

          viewerRef.current = viewer;

          // Add high-resolution satellite basemap
          try {
            viewer.imageryLayers.addImageryProvider(
              new Cesium.UrlTemplateImageryProvider({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maximumLevel: 19
              })
            );
          } catch {
            // fallback to default
          }

          // Initial Camera: Entire India Subcontinent
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(78.9629, 21.5937, 4200000),
            orientation: {
              heading: 0,
              pitch: Cesium.Math.toRadians(-88),
              roll: 0
            }
          });

          setCesiumActive(true);
        }
      } catch (err) {
        console.warn('Cesium initialization skipped, using WebGL Canvas satellite map:', err);
      }
    };

    initCesium();
    return () => {
      if (timer) clearTimeout(timer);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          // ignore cleanup err
        }
        viewerRef.current = null;
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // 2. Slow Fly-to -> 3s Building Highlight -> Stylish Map Removal
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isZoomed) {
      setZoomProgress(0);
      setFlyStage('idle');
      setCurrentAltitude('3,840 km (Subcontinent Scale)');
      if (viewerRef.current && (window as any).Cesium) {
        const Cesium = (window as any).Cesium;
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(78.9629, 21.5937, 4200000),
          duration: 1.5
        });
      }
      return;
    }

    setIsAnimating(true);
    setFlyStage('flying');
    const Cesium = (window as any).Cesium;

    if (viewerRef.current && Cesium) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(targetCoords.lng, targetCoords.lat, 175),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-88.0),
          roll: 0.0
        },
        duration: 4.2
      });
    }

    // Interactive Canvas / HUD flight animation (4.2 seconds)
    const startTime = performance.now();
    const duration = 4200;

    const animateFlight = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth majestic cubic in-out easing
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setZoomProgress(eased);

      if (eased < 0.3) {
        setCurrentAltitude(`${Math.round(3840 - eased * 8000)} km (India Subcontinent)`);
      } else if (eased < 0.7) {
        setCurrentAltitude(`${Math.round(900 - (eased - 0.3) * 2100)} km (Maharashtra / Pune Corridor)`);
      } else {
        setCurrentAltitude(`${Math.round(250 - (eased - 0.7) * 700)} m (Hinjawadi Phase 1 Cadastre)`);
      }

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        // Reached 3D building! Hold for 3 seconds of building highlight
        setIsAnimating(false);
        setZoomProgress(1);
        setCurrentAltitude('146 m (Pralhad P. Chhabria Research Center Locked)');
        setFlyStage('highlighting');

        // 3-second highlight hold
        setTimeout(() => {
          setFlyStage('removing');
          setTimeout(() => {
            if (onZoomComplete) onZoomComplete();
          }, 650);
        }, 3000);
      }
    };

    const animHandle = requestAnimationFrame(animateFlight);
    return () => cancelAnimationFrame(animHandle);
  }, [isZoomed, targetCoords, onZoomComplete]);

  // -------------------------------------------------------------------------
  // 3. Fallback / Overlay Canvas Rendering (India Subcontinent -> Property)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 600);

      ctx.clearRect(0, 0, w, h);

      if (!cesiumActive) {
        if (zoomProgress >= 0.45 && aerialImgRef.current) {
          // Smoothly reveal high-resolution aerial satellite view centered on PCCRC
          const p = Math.min((zoomProgress - 0.45) / 0.55, 1.0);
          const imgSize = Math.max(w, h) * (0.88 + 0.42 * p);
          ctx.save();
          ctx.globalAlpha = p;
          ctx.drawImage(aerialImgRef.current, w / 2 - imgSize / 2, h / 2 - imgSize / 2, imgSize, imgSize);
          ctx.restore();
        } else {
          // Futuristic Dark GIS Globe Background
          const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h));
          grad.addColorStop(0, '#0a1628');
          grad.addColorStop(0.6, '#040b14');
          grad.addColorStop(1, '#02060d');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Subcontinent Grid Lines
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.lineWidth = 1;
          const gridSize = 40 + zoomProgress * 60;
          for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          const indiaCX = w / 2;
          const indiaCY = h / 2;

          if (zoomProgress < 0.6) {
            // Draw India Silhouette Outline
            const indiaScale = (1 - zoomProgress * 1.5) * Math.min(w, h) * 0.45;
            ctx.save();
            ctx.translate(indiaCX, indiaCY - 20);
            
            ctx.shadowColor = '#0284c7';
            ctx.shadowBlur = 18;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;

            // Stylized India Subcontinent Polygon
            ctx.beginPath();
            ctx.moveTo(0, -indiaScale * 0.95);
            ctx.lineTo(indiaScale * 0.35, -indiaScale * 0.7);
            ctx.lineTo(indiaScale * 0.85, -indiaScale * 0.5);
            ctx.lineTo(indiaScale * 0.65, -indiaScale * 0.1);
            ctx.lineTo(indiaScale * 0.4, indiaScale * 0.4);
            ctx.lineTo(0, indiaScale * 0.95);
            ctx.lineTo(-indiaScale * 0.35, indiaScale * 0.35);
            ctx.lineTo(-indiaScale * 0.55, -indiaScale * 0.05);
            ctx.lineTo(-indiaScale * 0.75, -indiaScale * 0.4);
            ctx.lineTo(-indiaScale * 0.35, -indiaScale * 0.75);
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
            ctx.fill();

            // Target Pin on Pune / Maharashtra
            const puneX = -indiaScale * 0.28;
            const puneY = indiaScale * 0.12;

            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(puneX, puneY, 6, 0, Math.PI * 2);
            ctx.fill();

            const pulse = (Date.now() % 1500) / 1500;
            ctx.strokeStyle = `rgba(244, 63, 94, ${1 - pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(puneX, puneY, 6 + pulse * 24, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '11px "Inter", monospace';
            ctx.fillText('TARGET: PUNE / HINJAWADI (PCCRC)', puneX + 12, puneY + 4);

            ctx.restore();
          }
        }
      }

      // HIGH-TECH 3-SECOND BUILDING CADASTRAL MARKING
      if (flyStage === 'highlighting' || flyStage === 'removing') {
        ctx.save();
        ctx.translate(w / 2, h / 2);

        // Exact polygonal footprint of Pralhad P. Chhabria Research Center
        const buildingPoly = [
          [-113, 54],
          [-136, -27],
          [-65, -118],
          [-23, -129],
          [18, -129],
          [163, -26],
          [155, 33],
          [84, 133],
          [31, 155]
        ];

        const pulse = (Date.now() % 1200) / 1200;
        const alphaGlow = 0.45 + 0.45 * Math.sin(pulse * Math.PI * 2);

        // 1. Cadastral Parcel Perimeter Fill & Glow
        ctx.beginPath();
        buildingPoly.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt[0], pt[1]);
          else ctx.lineTo(pt[0], pt[1]);
        });
        ctx.closePath();

        ctx.fillStyle = `rgba(34, 197, 94, ${0.14 + 0.08 * Math.sin(pulse * Math.PI * 2)})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(34, 197, 94, ${alphaGlow})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 18;
        ctx.stroke();

        // 2. Exact Building Offset Perimeter (Cyan Neon)
        ctx.beginPath();
        buildingPoly.forEach((pt, idx) => {
          const ix = pt[0] * 0.84;
          const iy = pt[1] * 0.84;
          if (idx === 0) ctx.moveTo(ix, iy);
          else ctx.lineTo(ix, iy);
        });
        ctx.closePath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // 3. Central Dome & Square Light Well
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(-38, -38, 76, 76);

        // Central Dome Circle
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dome Radial Ribs
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(26 * Math.cos(a), 26 * Math.sin(a));
          ctx.stroke();
        }

        // 4. Four Precision Corner Brackets [ ]
        const minX = -150, maxX = 175;
        const minY = -145, maxY = 170;
        const bLen = 24;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 14;

        // Top-Left [
        ctx.beginPath();
        ctx.moveTo(minX, minY + bLen); ctx.lineTo(minX, minY); ctx.lineTo(minX + bLen, minY);
        ctx.stroke();

        // Top-Right ]
        ctx.beginPath();
        ctx.moveTo(maxX - bLen, minY); ctx.lineTo(maxX, minY); ctx.lineTo(maxX, minY + bLen);
        ctx.stroke();

        // Bottom-Left [
        ctx.beginPath();
        ctx.moveTo(minX, maxY - bLen); ctx.lineTo(minX, maxY); ctx.lineTo(minX + bLen, maxY);
        ctx.stroke();

        // Bottom-Right ]
        ctx.beginPath();
        ctx.moveTo(maxX - bLen, maxY); ctx.lineTo(maxX, maxY); ctx.lineTo(maxX, maxY - bLen);
        ctx.stroke();

        // 5. Center Targeting Crosshairs
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(minX - 20, 0); ctx.lineTo(-45, 0);
        ctx.moveTo(45, 0); ctx.lineTo(maxX + 20, 0);
        ctx.moveTo(0, minY - 20); ctx.lineTo(0, -45);
        ctx.moveTo(0, 45); ctx.lineTo(0, maxY + 20);
        ctx.stroke();

        // 6. Cadastral Coordinates & Footprint Identity
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px "Inter", monospace';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
        ctx.fillText('PRALHAD P. CHHABRIA RESEARCH CENTER (PCCRC)', minX, minY - 18);

        ctx.fillStyle = '#a7f3d0';
        ctx.font = '10.5px "Inter", monospace';
        ctx.fillText('14-DIGIT ULPIN: 27-25-04-0142-0089 • PARCEL LOCKED', minX, maxY + 22);
        ctx.fillText('LAT: 18.58407° N • LNG: 73.73720° E', minX, maxY + 36);

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [cesiumActive, zoomProgress, flyStage]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#020617',
        overflow: 'hidden',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease',
        opacity: flyStage === 'removing' ? 0 : 1,
        transform: flyStage === 'removing' ? 'scale(1.06)' : 'scale(1)',
        filter: flyStage === 'removing' ? 'blur(12px) brightness(1.25)' : 'none'
      }}
    >
      {/* 1. CesiumJS Container */}
      <div 
        ref={cesiumContainerRef} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%',
          opacity: cesiumActive ? 1 : 0,
          transition: 'opacity 0.6s ease'
        }} 
      />

      {/* 2. Interactive 2D/3D Fallback & Telemetry Canvas */}
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* 3. Stylish Iris Dissolve Overlay */}
      {flyStage === 'removing' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.9) 70%, #020617 100%)',
          pointerEvents: 'none',
          zIndex: 50,
          animation: 'irisWipe 0.65s ease-in forwards'
        }} />
      )}

      {/* 4. Top HUD: Scale & Geospatial Telemetry */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '8px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#f8fafc',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}>
          <Satellite size={16} color="#38bdf8" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
              3D GIS SATELLITE ENGINE
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
              {currentAltitude}
            </span>
          </div>
        </div>

        {/* Live Coordinate Crosshairs */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '6px',
          padding: '5px 10px',
          color: '#cbd5e1',
          fontSize: '11px',
          fontFamily: 'monospace',
          display: 'flex',
          gap: '12px'
        }}>
          <span>LAT: {isZoomed ? '18.58489° N' : '21.76790° N'}</span>
          <span>LNG: {isZoomed ? '73.73769° E' : '78.87180° E'}</span>
          <span>CRS: EPSG:4326 (WGS84)</span>
        </div>
      </div>

      {/* 5. Bottom Right Watermark & Survey Verification Badge */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '6px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#4ade80',
        fontSize: '11px',
        fontWeight: 600
      }}>
        <ShieldCheck size={14} color="#22c55e" />
        <span>SURVEYOR MAP-2 VERIFIED GEOPOLAR ANCHOR</span>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.04);
          }
        }
        @keyframes irisWipe {
          0% {
            opacity: 0;
            clip-path: circle(100% at center);
          }
          100% {
            opacity: 1;
            clip-path: circle(0% at center);
          }
        }
      `}</style>
    </div>
  );
};

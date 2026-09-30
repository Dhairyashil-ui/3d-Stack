import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  Camera,
  Radio,
  Layers,
  Box,
  Link2,
  ArrowDown,
  ArrowRight,
  Maximize2,
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';

interface SectionProcessPipelineProps {
  fusionStatus?: 'Processing' | 'Completed';
  segmentationStatus?: 'Waiting' | 'Processing' | 'Completed';
  matchingStatus?: 'Waiting' | 'Processing' | 'Completed';
  onStageSelect?: (stageIndex: number) => void;
}

export const SectionProcessPipeline: React.FC<SectionProcessPipelineProps> = ({
  fusionStatus = 'Completed',
  segmentationStatus = 'Completed',
  matchingStatus = 'Completed',
  onStageSelect
}) => {
  const [activeStageTab, setActiveStageTab] = useState<number>(3); // 3 = Point Cloud Fusion
  const [fusionSlider, setFusionSlider] = useState<number>(100); // 0 = Photogrammetry only, 50 = Merging, 100 = Fused
  const [isRecordAvailable, setIsRecordAvailable] = useState<boolean>(true);
  const fusionCanvasRef = useRef<HTMLCanvasElement>(null);
  const photogrammetryCanvasRef = useRef<HTMLCanvasElement>(null);
  const lidarCanvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Draw animated Photogrammetry visual canvas
  useEffect(() => {
    const canvas = photogrammetryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#0a1626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Drone flight path (top curve)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(20, 25);
      ctx.bezierCurveTo(80, 15, 140, 35, 200, 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Drone camera positions & projection rays
      const droneX = 60 + Math.sin(t) * 35;
      const droneY = 22 + Math.cos(t * 0.7) * 4;

      // Drone body
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(droneX - 8, droneY - 3, 16, 6);
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(droneX - 10, droneY - 3, 4, 0, Math.PI * 2);
      ctx.arc(droneX + 10, droneY - 3, 4, 0, Math.PI * 2);
      ctx.fill();

      // Camera frustum projection cone
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.moveTo(droneX, droneY);
      ctx.lineTo(droneX - 35, 95);
      ctx.lineTo(droneX + 35, 95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Reconstructed 3D point cloud dots (RGB colored)
      for (let i = 0; i < 45; i++) {
        const px = 25 + (i * 4.2) % 170;
        const py = 75 + Math.sin(i * 1.7) * 12 + ((i * 7) % 15);
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#e2e8f0' : '#d97706';
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Draw animated LiDAR visual canvas
  useEffect(() => {
    const canvas = lidarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a1626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // LiDAR Scanner origin
      const scannerX = 25;
      const scannerY = 60;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(scannerX, scannerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Laser sweep line
      const sweepAngle = Math.sin(t) * 0.55 - 0.1;
      const beamLen = 160;
      const beamX = scannerX + Math.cos(sweepAngle) * beamLen;
      const beamY = scannerY + Math.sin(sweepAngle) * beamLen;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(scannerX, scannerY);
      ctx.lineTo(beamX, beamY);
      ctx.stroke();

      // Laser dense point cloud returns with elevation gradient (Blue ground to Red roof)
      for (let i = 0; i < 60; i++) {
        const px = 70 + (i * 2.2);
        const py = 88 - (i * 0.9) - ((i * 13) % 8);
        const hue = 220 - ((90 - py) * 3); // Blue to orange
        ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3. Draw Point Cloud Fusion (Photogrammetry RGB + LiDAR Intensity Merging)
  useEffect(() => {
    const canvas = fusionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#060f1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid datum lines (Common XYZ coordinate system)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 20; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 20; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const fraction = fusionSlider / 100; // 0 to 1

      // Left: Photogrammetry Cloud (RGB points) sliding toward center
      const photoOffsetX = (1 - fraction) * -50;
      // Right: LiDAR Cloud (Laser elevation points) sliding toward center
      const lidarOffsetX = (1 - fraction) * 50;

      // Draw Photogrammetry points
      for (let i = 0; i < 90; i++) {
        const baseX = 80 + (i * 3.4) % 190;
        const baseY = 35 + ((i * 7) % 65);
        const px = baseX + photoOffsetX;
        const py = baseY + Math.sin(t + i) * 0.8;

        ctx.fillStyle = fraction > 0.8 ? '#38bdf8' : '#e0f2fe';
        ctx.beginPath();
        ctx.arc(px, py, fraction > 0.8 ? 1.4 : 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw LiDAR points
      for (let i = 0; i < 90; i++) {
        const baseX = 80 + (i * 3.4) % 190;
        const baseY = 35 + ((i * 7) % 65);
        const px = baseX + lidarOffsetX;
        const py = baseY + Math.cos(t + i) * 0.8;

        const hue = 160 + ((i * 11) % 60);
        ctx.fillStyle = fraction > 0.8 ? '#22c55e' : `hsl(${hue}, 90%, 55%)`;
        ctx.beginPath();
        ctx.arc(px, py, fraction > 0.8 ? 1.6 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fused center highlight when merged
      if (fraction > 0.75) {
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(70, 25, 210, 85);

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('REGISTERED / FUSED XYZ: EPSG:4326', 75, 20);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [fusionSlider]);

  return (
    <section id="section-process-pipeline" style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px 24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '4px',
            height: '18px',
            backgroundColor: '#0f2a4a', // Navy blue
            borderRadius: '2px'
          }} />
          <h2 style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 800,
            color: '#0f2a4a',
            letterSpacing: '0.6px',
            textTransform: 'uppercase'
          }}>
            MAIN PROCESS PIPELINE
          </h2>
          <span style={{
            fontSize: '11px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 700,
            marginLeft: '6px'
          }}>
            Stages 01 – 05
          </span>
        </div>

        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
          Seamless automated progression from Raw Sensor Data to 3D Property Cadastre
        </div>
      </div>

      {/* Prominent Horizontal Pipeline Cards (01 to 05) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Stage 01 */}
        <div
          onClick={() => setActiveStageTab(1)}
          style={{
            border: activeStageTab === 1 ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
            backgroundColor: activeStageTab === 1 ? '#f0f9ff' : '#f8fafc',
            borderRadius: '8px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              01
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#16a34a'
            }}>
              <CheckCircle2 size={13} color="#16a34a" />
              Completed
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', lineHeight: 1.3, marginBottom: '6px' }}>
            PHOTOGRAMMETRY POINT CLOUD
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
            Images → Feature Extraction → Feature Matching → 3D Reconstruction
          </div>
        </div>

        {/* Stage 02 */}
        <div
          onClick={() => setActiveStageTab(2)}
          style={{
            border: activeStageTab === 2 ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
            backgroundColor: activeStageTab === 2 ? '#f0f9ff' : '#f8fafc',
            borderRadius: '8px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              02
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#16a34a'
            }}>
              <CheckCircle2 size={13} color="#16a34a" />
              Completed
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', lineHeight: 1.3, marginBottom: '6px' }}>
            LiDAR POINT CLOUD
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
            LiDAR Scan → Point Processing → Registration → Dense Mesh
          </div>
        </div>

        {/* Stage 03 */}
        <div
          onClick={() => setActiveStageTab(3)}
          style={{
            border: activeStageTab === 3 ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
            backgroundColor: activeStageTab === 3 ? '#f0f9ff' : '#f8fafc',
            borderRadius: '8px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              03
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: fusionStatus === 'Completed' ? '#16a34a' : '#d97706'
            }}>
              {fusionStatus === 'Completed' ? (
                <>
                  <CheckCircle2 size={13} color="#16a34a" />
                  Completed
                </>
              ) : (
                <>
                  <Clock size={13} color="#d97706" />
                  Processing
                </>
              )}
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', lineHeight: 1.3, marginBottom: '6px' }}>
            POINT CLOUD FUSION
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
            Photogrammetry + LiDAR → Common XYZ Coordinates → Fused Cloud
          </div>
        </div>

        {/* Stage 04 */}
        <div
          onClick={() => setActiveStageTab(4)}
          style={{
            border: activeStageTab === 4 ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
            backgroundColor: activeStageTab === 4 ? '#f0f9ff' : '#f8fafc',
            borderRadius: '8px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              04
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#16a34a'
            }}>
              <CheckCircle2 size={13} color="#16a34a" />
              Completed
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', lineHeight: 1.3, marginBottom: '6px' }}>
            PROPERTY SEGMENTATION
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
            Building → Floors (G+5) → Apartments → Rooms / Spatial Unit
          </div>
        </div>

        {/* Stage 05 */}
        <div
          id="stage-05-matching"
          onClick={() => setActiveStageTab(5)}
          style={{
            border: activeStageTab === 5 ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
            backgroundColor: activeStageTab === 5 ? '#f0f9ff' : '#f8fafc',
            borderRadius: '8px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              05
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#16a34a'
            }}>
              <CheckCircle2 size={13} color="#16a34a" />
              Completed
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', lineHeight: 1.3, marginBottom: '6px' }}>
            PROPERTY RECORD MATCHING
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
            3D Space + GIS Parcel + Records → Matched Cadastre
          </div>
        </div>
      </div>

      {/* Stage Detail Visualizer Box */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '18px 20px'
      }}>
        {/* Stage 01 Expanded Details */}
        {activeStageTab === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>STAGE 01</span>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f2a4a' }}>
                  Photogrammetry Point Cloud Generation
                </h3>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
                Drone nadir and oblique imagery ingest (418 frames at 0.035m GSD). SIFT feature point extraction followed by bundle adjustment generates dense photogrammetric 3D point cloud with RGB radiometric values.
              </div>

              {/* Vertical flow requested */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#0f2a4a',
                flexWrap: 'wrap'
              }}>
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Images</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Feature Extraction</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Feature Matching</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>3D Reconstruction</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bae6fd', fontWeight: 700 }}>Photogrammetry Point Cloud</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#0a1626',
              borderRadius: '6px',
              height: '130px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <canvas
                ref={photogrammetryCanvasRef}
                width={340}
                height={130}
                style={{ width: '100%', height: '100%' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '6px',
                right: '8px',
                fontSize: '9px',
                color: '#38bdf8',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                Drone Ray Projection • 14.8M Points
              </span>
            </div>
          </div>
        )}

        {/* Stage 02 Expanded Details */}
        {activeStageTab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>STAGE 02</span>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f2a4a' }}>
                  LiDAR Point Cloud Acquisition & Classification
                </h3>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
                Terrestrial and aerial LiDAR scanner sweep with 82 points/m² density. Raw point filtering registers ground baseline (568.20m MSL) and architectural façade returns with millimeter ranging precision.
              </div>

              {/* Vertical flow requested */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#0f2a4a',
                flexWrap: 'wrap'
              }}>
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>LiDAR Scan</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Point Processing</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Registration</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bae6fd', fontWeight: 700 }}>LiDAR Point Cloud</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#0a1626',
              borderRadius: '6px',
              height: '130px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <canvas
                ref={lidarCanvasRef}
                width={340}
                height={130}
                style={{ width: '100%', height: '100%' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '6px',
                right: '8px',
                fontSize: '9px',
                color: '#f59e0b',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                Elevation Gradient • 22.4M Returns
              </span>
            </div>
          </div>
        )}

        {/* Stage 03 Expanded Details (POINT CLOUD FUSION) */}
        {activeStageTab === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>STAGE 03</span>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f2a4a' }}>
                  Point Cloud Fusion (Photogrammetry + LiDAR Merging)
                </h3>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px', lineHeight: 1.5 }}>
                Direct spatial fusion of high-resolution Drone Photogrammetry RGB point cloud with precision LiDAR laser scan cloud. Both datasets are mapped onto a common XYZ geodetic coordinate system (WGS84 UTM Zone 43N).
              </div>

              {/* Vertical flow requested */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#0f2a4a',
                flexWrap: 'wrap',
                marginBottom: '14px'
              }}>
                <span style={{ backgroundColor: '#ffffff', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Photogrammetry Point Cloud</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>+</span>
                <span style={{ backgroundColor: '#ffffff', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>LiDAR Point Cloud</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#ffffff', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Common XYZ Coordinate System</span>
                <ArrowRight size={12} color="#64748b" />
                <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bbf7d0', fontWeight: 700 }}>Registered / Fused Point Cloud</span>
              </div>

              {/* Interactive fusion slider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#ffffff',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <Sliders size={14} color="#0284c7" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Sensor Cloud Registration:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fusionSlider}
                  onChange={(e) => setFusionSlider(parseInt(e.target.value, 10))}
                  style={{ flex: 1, accentColor: '#0284c7', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#0284c7', width: '38px', textAlign: 'right' }}>
                  {fusionSlider}%
                </span>
              </div>
            </div>

            {/* Visual representation of two point clouds merging into one */}
            <div style={{
              backgroundColor: '#060f1e',
              borderRadius: '6px',
              height: '145px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid #1e3a5f'
            }}>
              <canvas
                ref={fusionCanvasRef}
                width={340}
                height={145}
                style={{ width: '100%', height: '100%' }}
              />
              <div style={{
                position: 'absolute',
                top: '6px',
                left: '8px',
                display: 'flex',
                gap: '8px',
                fontSize: '9px'
              }}>
                <span style={{ color: '#38bdf8', backgroundColor: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: '3px' }}>● Photogrammetry RGB</span>
                <span style={{ color: '#22c55e', backgroundColor: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: '3px' }}>● LiDAR Elevation</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 04 Expanded Details (PROPERTY SEGMENTATION) */}
        {activeStageTab === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>STAGE 04</span>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f2a4a' }}>
                Property Segmentation Hierarchy
              </h3>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '14px', lineHeight: 1.5 }}>
              Fused spatial point cloud is segmented into structured cadastral units: Building footprint detection → Multi-tier floor segmentation (Ground + 5 floors) → Individual apartment/unit boundaries → Volumetric room units.
            </div>

            {/* Visual breakdown: Building → Floors → Apartments → Rooms */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '10px'
            }}>
              {/* Level 1: Building */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Building</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2a4a', marginTop: '2px' }}>PPCRC Complex</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>BLD-PPCRC-0089 • 18.50m Total H</div>
              </div>

              {/* Level 2: Floors */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Floors</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2a4a', marginTop: '2px' }}>Ground + 5 Storeys</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>Floor Tiers Z0 through Z5</div>
              </div>

              {/* Level 3: Apartments */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Apartments / Units</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2a4a', marginTop: '2px' }}>45 Spatial Units</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>Demarcated Volumetric Cells</div>
              </div>

              {/* Level 4: Rooms */}
              <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #0284c7', borderRadius: '6px', padding: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Room / Spatial Unit</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>Room A-101 (HPC Lab)</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>68.50 m² • 3.40m Height</div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 05 Expanded Details (PROPERTY RECORD MATCHING) */}
        {activeStageTab === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>STAGE 05</span>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f2a4a' }}>
                  Property Record Matching
                </h3>
              </div>

              {/* Simulate toggle to demonstrate 'Record not available' behavior */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Test Missing Record:</span>
                <button
                  onClick={() => setIsRecordAvailable(!isRecordAvailable)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10.5px',
                    backgroundColor: isRecordAvailable ? '#f1f5f9' : '#fee2e2',
                    color: isRecordAvailable ? '#475569' : '#b91c1c',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {isRecordAvailable ? 'Toggle "Record not available"' : 'Restore Verified Record'}
                </button>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '14px', lineHeight: 1.5 }}>
              Correlation between 3D reconstructed spatial unit, authoritative 2D GIS cadastral parcel boundary, and official state land revenue records.
            </div>

            {/* Display: Parcel ID | Building | Floor | Unit | Existing Record Reference */}
            <div style={{
              overflowX: 'auto',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Parcel ID</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Building</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Floor</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Unit</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Existing Record Reference</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Match Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#0f2a4a' }}>
                      PAR-000123 (Plot B-7 / Survey No. 88)
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f2a4a' }}>
                      BLD-PPCRC-0089
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>
                      Floor 01 (Level 1 Atrium)
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0284c7' }}>
                      Unit A-101 (HPC Lab)
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {isRecordAvailable ? (
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f2a4a' }}>
                          PMRDA/HINJ/2026/P-14-1 (Khata #KH-8841)
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', fontWeight: 700, backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fecaca' }}>
                          Record not available
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {isRecordAvailable ? (
                        <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} color="#16a34a" />
                          Matched
                        </span>
                      ) : (
                        <span style={{ color: '#d97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="#d97706" />
                          Requires Resolution
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

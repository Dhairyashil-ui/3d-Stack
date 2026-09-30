import React from 'react';
import { CheckCircle2, Sparkles, Building, Box } from 'lucide-react';

interface ApartmentLiquidFillWidgetProps {
  progressPercent: number; // 0 to 100
  verifiedCount?: number;   // 0 to 4
  compact?: boolean;
  missingSummary?: string;
  onOpen3DViewer?: () => void;
}

export const ApartmentLiquidFillWidget: React.FC<ApartmentLiquidFillWidgetProps> = ({
  progressPercent,
  verifiedCount = 0,
  compact = false,
  missingSummary,
  onOpen3DViewer
}) => {
  const isFull = progressPercent >= 100;

  // Render the core room SVG and animated liquid layer
  const renderRoomBox = (boxWidth: string, boxHeight: string) => (
    <div
      style={{
        position: 'relative',
        width: boxWidth,
        height: boxHeight,
        backgroundColor: '#0f172a',
        borderRadius: '10px',
        border: isFull ? '2px solid #22c55e' : '2px solid #38bdf8',
        overflow: 'hidden',
        boxShadow: isFull
          ? '0 0 18px rgba(34, 197, 94, 0.4), inset 0 0 12px rgba(0,0,0,0.6)'
          : '0 0 14px rgba(14, 165, 233, 0.25), inset 0 0 12px rgba(0,0,0,0.6)'
      }}
    >
      {/* Apartment Architectural Wireframe Background (Inside Room) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
        viewBox="0 0 260 160"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="roomGridCompact" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Room Background Grid */}
        <rect width="260" height="160" fill="url(#roomGridCompact)" />

        {/* 3D Perspective Room Wall Lines */}
        {/* Ceiling */}
        <line x1="0" y1="0" x2="50" y2="35" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
        <line x1="260" y1="0" x2="210" y2="35" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
        <line x1="50" y1="35" x2="210" y2="35" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Floor corners */}
        <line x1="0" y1="160" x2="50" y2="125" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />
        <line x1="260" y1="160" x2="210" y2="125" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />
        <line x1="50" y1="125" x2="210" y2="125" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Vertical Wall Corners */}
        <line x1="50" y1="35" x2="50" y2="125" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
        <line x1="210" y1="35" x2="210" y2="125" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />

        {/* Apartment Window on Back Wall */}
        <rect x="85" y="50" width="45" height="40" fill="rgba(56, 189, 248, 0.05)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" rx="2" />
        <line x1="107.5" y1="50" x2="107.5" y2="90" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
        <line x1="85" y1="70" x2="130" y2="70" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />

        {/* Apartment Door on Back Wall */}
        <rect x="155" y="55" width="30" height="70" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" rx="2" />
        <circle cx="160" cy="90" r="1.5" fill="rgba(56, 189, 248, 0.5)" />

        {/* Height Elevation Scale Markers on Left Wall */}
        <text x="8" y="40" fill="#94a3b8" fontSize="8" fontFamily="monospace">Z: +3.2m</text>
        <text x="8" y="80" fill="#94a3b8" fontSize="8" fontFamily="monospace">Z: +2.0m</text>
        <text x="8" y="120" fill="#94a3b8" fontSize="8" fontFamily="monospace">Z: +1.0m</text>
        <text x="8" y="152" fill="#94a3b8" fontSize="8" fontFamily="monospace">Z: 0.0m</text>
      </svg>

      {/* DYNAMIC WATER / LIQUID LAYER THAT FILLS OVER TIME */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${Math.max(progressPercent, 0)}%`,
          background: isFull
            ? 'linear-gradient(180deg, rgba(34, 197, 94, 0.85) 0%, rgba(16, 185, 129, 0.92) 50%, rgba(5, 150, 105, 0.98) 100%)'
            : 'linear-gradient(180deg, rgba(56, 189, 248, 0.85) 0%, rgba(14, 165, 233, 0.90) 50%, rgba(3, 105, 161, 0.98) 100%)',
          transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.5s ease',
          zIndex: 2,
          boxShadow: isFull
            ? '0 -4px 15px rgba(34, 197, 94, 0.5)'
            : '0 -4px 15px rgba(56, 189, 248, 0.5)'
        }}
      >
        {/* Animated Liquid Wave Crest on top */}
        {progressPercent > 0 && progressPercent < 100 && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: 0,
              width: '200%',
              height: '12px',
              background: 'transparent',
              overflow: 'hidden'
            }}
          >
            <svg
              style={{
                width: '100%',
                height: '100%',
                animation: 'liquidWaveMove 2.5s linear infinite'
              }}
              viewBox="0 0 520 20"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 10 Q 32.5 0, 65 10 T 130 10 T 195 10 T 260 10 T 325 10 T 390 10 T 455 10 T 520 10 L 520 20 L 0 20 Z"
                fill="rgba(56, 189, 248, 0.85)"
              />
            </svg>
          </div>
        )}

        {/* Rising Bubbles inside liquid */}
        {progressPercent > 10 && (
          <>
            <div
              style={{
                position: 'absolute',
                left: '25%',
                bottom: '8px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                animation: 'bubbleFloat 2s ease-in-out infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '65%',
                bottom: '12px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                animation: 'bubbleFloat 2.4s ease-in-out infinite 0.7s'
              }}
            />
          </>
        )}

        {/* Light reflection across liquid surface */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: '10%',
            width: '80%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '2px'
          }}
        />
      </div>

      {/* Front Glass Overlays & Centered Status HUD */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '8px 10px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '8.5px',
              fontWeight: 800,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#93c5fd',
              padding: '1px 5px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(147, 197, 253, 0.2)'
            }}
          >
            UNIT 302
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#ffffff',
              backgroundColor: isFull ? 'rgba(21, 128, 61, 0.9)' : 'rgba(2, 132, 199, 0.9)',
              padding: '1px 6px',
              borderRadius: '10px',
              backdropFilter: 'blur(4px)'
            }}
          >
            {progressPercent.toFixed(0)}%
          </span>
        </div>

        <div style={{ textAlign: 'center' }}>
          {isFull ? (
            <div
              style={{
                backgroundColor: 'rgba(21, 128, 61, 0.9)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '9.5px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <CheckCircle2 size={11} />
              <span>3D SPACE COMPLETE</span>
            </div>
          ) : progressPercent > 0 ? (
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#38bdf8',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              <span>FILLING VOLUME...</span>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'rgba(255,255,255,0.7)' }}>
          <span>FLOOR: 3</span>
          <span>VOL: 285 m³</span>
        </div>
      </div>
    </div>
  );

  // If compact: render just the small corner diagram widget
  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0a1020',
          padding: '10px 12px',
          borderRadius: '10px',
          border: isFull ? '1.5px solid #22c55e' : '1.5px solid #1e3a5f',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          maxWidth: '220px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Box size={11} color="#38bdf8" />
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              3D Space Fill
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 900, color: isFull ? '#4ade80' : '#38bdf8' }}>
            {progressPercent.toFixed(0)}%
          </span>
        </div>

        <div
          onClick={onOpen3DViewer}
          title="Click to open interactive Three.js 3D Viewer"
          style={{ cursor: onOpen3DViewer ? 'pointer' : 'default' }}
        >
          {renderRoomBox('185px', '115px')}
        </div>

        <div style={{ marginTop: '6px', fontSize: '10px', color: '#94a3b8', fontWeight: 600, textAlign: 'center', width: '100%' }}>
          {isFull ? (
            <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ 100% Volumetric Reconstructed</span>
          ) : missingSummary ? (
            <span style={{ color: '#f59e0b', fontSize: '9px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`Missing: ${missingSummary}`}>
              Missing: {missingSummary}
            </span>
          ) : (
            `${verifiedCount} of 4 Streams Added`
          )}
        </div>

        {onOpen3DViewer && (
          <button
            onClick={onOpen3DViewer}
            style={{
              marginTop: '6px',
              width: '100%',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '4px',
              padding: '4px 6px',
              color: '#38bdf8',
              fontSize: '9.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>Launch Three.js 3D Viewer</span>
          </button>
        )}

        <style>{`
          @keyframes liquidWaveMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes bubbleFloat {
            0% { transform: translateY(0) scale(0.6); opacity: 0.3; }
            50% { opacity: 0.9; }
            100% { transform: translateY(-40px) scale(1.1); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // Full expanded mode (fallback)
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: isFull ? '2px solid #22c55e' : '1px solid #cbd5e1',
        padding: '20px 24px',
        boxShadow: isFull
          ? '0 10px 25px -5px rgba(34, 197, 94, 0.15)'
          : '0 4px 16px rgba(0, 0, 0, 0.05)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '28px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: isFull ? '#15803d' : '#0369a1',
              backgroundColor: isFull ? '#dcfce7' : '#e0f2fe',
              padding: '3px 10px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {isFull ? <CheckCircle2 size={12} /> : <Box size={12} />}
            3D APARTMENT VOLUMETRIC DATA FILL
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: 900, margin: '2px 0 0 0', color: isFull ? '#15803d' : '#0284c7' }}>
            {progressPercent.toFixed(0)}%
          </h3>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>
            Filled to Generate 3D Apartment Space
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderRoomBox('240px', '140px')}
      </div>
    </div>
  );
};

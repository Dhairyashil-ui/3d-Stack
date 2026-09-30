// NAKSHA V2.0 - Authoritative Property & Room Details HUD Overlay
// Strictly Separated Identifiers:
// 1. 14-Digit ULPIN: State(2) + District(2) + Taluka(2) + Village(4) + Building(4) -> 27-25-04-0142-0089
// 2. Below that: Building & Room Unit ID: Building(4) + Floor(2) + Area(2) + Room(3) -> 0089-01-01-119
// Clean, professional layout with integrated 3D Digital Twin controls (display mode, floor filter, point cloud, replay)

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Layers,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Scan,
  Sparkles,
  Key,
  Compass,
  RotateCcw,
  Maximize2,
  Box,
  Eye,
  Sliders
} from 'lucide-react';
import { DisplayMode, RoomCadastreRecord, PropertyDetailsPanelProps } from './types';
import { getRoomCadastre } from './pccrcRoomCadastre';

export const PropertyDetailsPanel: React.FC<PropertyDetailsPanelProps> = ({
  roomNumber = 'A-101',
  onRoomSelect,
  onDisplayModeChange,
  currentDisplayMode,
  onFloorFilterChange,
  selectedFloor: propSelectedFloor,
  onTogglePointCloud,
  showPointCloud: propShowPointCloud,
  onReplayConstruction
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'gnss' | 'room' | 'all_rooms'>('overview');
  const [copied, setCopied] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>(propSelectedFloor || 'all');
  const [pointCloudActive, setPointCloudActive] = useState<boolean>(propShowPointCloud || false);

  // Fetch Authoritative Cadastral Record for active room
  const cadastre: RoomCadastreRecord = getRoomCadastre(roomNumber);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `14-DIGIT ULPIN: ${cadastre.ulpinFormatted}\nBUILDING & UNIT NUMBER: ${cadastre.buildingUnitId}\nROOM: ${cadastre.roomCode} (${cadastre.roomName})\nLATITUDE: ${cadastre.latitude}° N\nLONGITUDE: ${cadastre.longitude}° E\nHEIGHT MSL: ${cadastre.elevationMsl} m`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisplayModeSelect = (mode: DisplayMode) => {
    onDisplayModeChange(mode);
    if ((window as any).__twinViewer?.applyDisplayMode) {
      (window as any).__twinViewer.applyDisplayMode(mode);
    }
  };

  const handleFloorSelect = (f: string) => {
    setSelectedFloor(f);
    if (onFloorFilterChange) onFloorFilterChange(f);
    if ((window as any).__twinViewer?.applyFloorFilter) {
      (window as any).__twinViewer.applyFloorFilter(f);
    }
  };

  const handleTogglePointCloud = () => {
    const next = !pointCloudActive;
    setPointCloudActive(next);
    if (onTogglePointCloud) onTogglePointCloud(next);
    if ((window as any).__twinViewer?.togglePointCloud) {
      (window as any).__twinViewer.togglePointCloud(next);
    }
  };

  const handleReplay = () => {
    if (onReplayConstruction) onReplayConstruction();
    if ((window as any).__twinViewer?.handleManualReplay) {
      (window as any).__twinViewer.handleManualReplay();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '68px',
      left: '16px',
      bottom: '16px',
      width: isCollapsed ? '48px' : '430px',
      maxWidth: 'calc(100vw - 32px)',
      backgroundColor: 'rgba(15, 23, 42, 0.94)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(56, 189, 248, 0.35)',
      borderRadius: '12px',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(56, 189, 248, 0.12)',
      color: '#f8fafc',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* 1. Professional Header Bar */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(2, 6, 23, 0.7)',
        flexShrink: 0
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} color="#38bdf8" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.5px' }}>
                PROPERTY CADASTRE DETAILS
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                PCCRC RESEARCH COMPLEX • PUNE
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#38bdf8',
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isCollapsed ? 'Expand Details Panel' : 'Collapse Details'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* When Collapsed: Vertical Title */}
      {isCollapsed && (
        <div
          onClick={() => setIsCollapsed(false)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '12px',
            color: '#38bdf8',
            fontWeight: 700,
            letterSpacing: '1px'
          }}
        >
          PROPERTY DETAILS • ROOM {cadastre.roomCode}
        </div>
      )}

      {/* When Expanded: Full Details Body */}
      {!isCollapsed && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Active Room Title Banner */}
          <div style={{
            padding: '12px 16px 8px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: 'rgba(30, 41, 59, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                ACTIVE CADASTRAL UNIT
              </span>
              <span style={{ fontSize: '10.5px', color: '#a7f3d0', fontFamily: 'monospace', backgroundColor: 'rgba(167, 243, 208, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                {cadastre.wing}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '3px 0 1px 0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Room {cadastre.roomCode}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Tier {cadastre.floorNumber}
              </span>
            </h3>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              {cadastre.roomName} • {cadastre.floorLabel}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 14-DIGIT ULPIN & BUILDING NUMBER (Clean & Professional Without Redundancy) */}
          {/* ========================================================================= */}
          <div style={{
            margin: '10px 14px 8px 14px',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            padding: '11px 13px',
            display: 'flex',
            flexDirection: 'column',
            gap: '9px',
            fontSize: '11px'
          }}>
            {/* 1. 14-Digit ULPIN (Clean formatted only, redundant raw number removed per instruction) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8', fontSize: '9.5px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  1. 2d ULPIN ID (Land ID):
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    color: copied ? '#4ade80' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px'
                  }}
                  title="Copy Cadastral Identifiers"
                >
                  {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#38bdf8', marginTop: '3px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                {cadastre.ulpinFormatted}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span>State: <b style={{ color: '#94a3b8' }}>{cadastre.stateCode}</b></span>
                <span>• Dist: <b style={{ color: '#94a3b8' }}>{cadastre.districtCode}</b></span>
                <span>• Taluka: <b style={{ color: '#94a3b8' }}>{cadastre.talukaCode}</b></span>
                <span>• Village: <b style={{ color: '#94a3b8' }}>{cadastre.villageCode}</b></span>
                <span>• Building: <b style={{ color: '#94a3b8' }}>{cadastre.buildingNum4}</b></span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />

            {/* 2. Building & Room Unit Number */}
            <div>
              <span style={{ color: '#94a3b8', fontSize: '9.5px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                2. 3D ulpin id (Appartment ID):
              </span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#a7f3d0', marginTop: '3px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                {cadastre.buildingUnitId}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span>Building: <b style={{ color: '#94a3b8' }}>{cadastre.buildingNum4}</b></span>
                <span>• Floor: <b style={{ color: '#94a3b8' }}>{cadastre.floorNum2}</b></span>
                <span>• Area: <b style={{ color: '#94a3b8' }}>{cadastre.areaNum2}</b></span>
                <span>• Room: <b style={{ color: '#94a3b8' }}>{cadastre.roomNum3}</b></span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* INTEGRATED 3D CONTROLS & LAYERS (Moved from right-side into details box)  */}
          {/* ========================================================================= */}
          <div style={{
            margin: '6px 14px 10px 14px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sliders size={12} /> 3D DIGITAL TWIN CONTROLS
              </span>
              <button
                onClick={handleReplay}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#cbd5e1',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Replay 15-Second Futuristic Construction"
              >
                <RotateCcw size={11} /> Replay Build
              </button>
            </div>

            {/* Row 1: Shading Modes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => handleDisplayModeSelect('realistic')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: currentDisplayMode === 'realistic' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: currentDisplayMode === 'realistic' ? '#0284c7' : 'rgba(255, 255, 255, 0.05)',
                  color: currentDisplayMode === 'realistic' ? '#ffffff' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={12} /> Realistic
              </button>

              <button
                onClick={() => handleDisplayModeSelect('xray')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: currentDisplayMode === 'xray' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: currentDisplayMode === 'xray' ? '#0891b2' : 'rgba(255, 255, 255, 0.05)',
                  color: currentDisplayMode === 'xray' ? '#ffffff' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Scan size={12} /> X-Ray
              </button>

              <button
                onClick={() => handleDisplayModeSelect('wireframe')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: currentDisplayMode === 'wireframe' ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: currentDisplayMode === 'wireframe' ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
                  color: currentDisplayMode === 'wireframe' ? '#ffffff' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Layers size={12} /> Wireframe
              </button>
            </div>

            {/* Row 2: Point Cloud BIM Toggle (Dots visible only after clicking per instruction) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleTogglePointCloud}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: pointCloudActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: pointCloudActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: pointCloudActive ? '#34d399' : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Click to toggle LiDAR floor segmentation point cloud dots"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={13} color={pointCloudActive ? '#34d399' : '#94a3b8'} />
                  Point Cloud BIM (LiDAR Dots)
                </span>
                <span style={{
                  fontSize: '9.5px',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  backgroundColor: pointCloudActive ? '#059669' : 'rgba(255,255,255,0.1)',
                  color: pointCloudActive ? '#ffffff' : '#94a3b8'
                }}>
                  {pointCloudActive ? 'ACTIVE (VISIBLE)' : 'OFF (CLICK TO VIEW)'}
                </span>
              </button>
            </div>

            {/* Row 3: Floor Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, marginRight: '2px' }}>FLOOR:</span>
              {['all', '0', '1', '2', '3', '4'].map(f => (
                <button
                  key={f}
                  onClick={() => handleFloorSelect(f)}
                  style={{
                    flex: 1,
                    minWidth: '46px',
                    padding: '4px 6px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: selectedFloor === f ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)',
                    color: selectedFloor === f ? '#ffffff' : '#cbd5e1',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f === 'all' ? 'All (G+4)' : f === '0' ? 'Ground' : `L${parseInt(f) + 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}>
            {[
              { id: 'overview', label: 'Unit Specs' },
              { id: 'gnss', label: 'GNSS & Volumetrics' },
              { id: 'all_rooms', label: 'All 45 Rooms' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: '9px 4px',
                  fontSize: '11px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#38bdf8' : '#94a3b8',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* TAB 1: Unit Overview & Door Specs */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  fontSize: '11.5px'
                }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>Carpet Area:</span>
                    <div style={{ fontWeight: 700 }}>{cadastre.carpetAreaSqM} m² ({cadastre.carpetAreaSqFt} sq.ft)</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>Clear Ceiling Height:</span>
                    <div style={{ fontWeight: 700 }}>{cadastre.ceilingHeightM} m</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>Occupancy Classification:</span>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>{cadastre.occupancyType}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>Wing Orientation:</span>
                    <div style={{ fontWeight: 700 }}>{cadastre.wing}</div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  padding: '11px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                      DOOR PRISM VOLUME & CENTER CLOUD
                    </span>
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>
                      {cadastre.doorVolume.volumeM3} m³
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '11px', fontFamily: 'monospace' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '6px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9px' }}>DOOR VOLUME:</span>
                      <div style={{ color: '#ffffff', fontWeight: 700 }}>{cadastre.doorVolume.volumeM3} m³</div>
                      <div style={{ color: '#64748b', fontSize: '8.5px' }}>1.80m × 2.44m × 0.22m</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '6px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9px' }}>CENTER CLOUD:</span>
                      <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                        [{cadastre.centerCloud.x}, {cadastre.centerCloud.y}, {cadastre.centerCloud.z}]
                      </div>
                      <div style={{ color: '#64748b', fontSize: '8.5px' }}>MSL: {cadastre.centerCloud.elevationMsl}m • Safe Dist: {cadastre.centerCloud.safeDistanceM}m</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '11px',
                  color: '#cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={13} color="#38bdf8" /> Architectural Door Hardware
                  </div>
                  <div>• 3D Room Placard: <code>{cadastre.roomCode}</code> (Raised lettering)</div>
                  <div>• Double Beech Timber Leaf with Matching Surround</div>
                  <div>• Dual Laminated Glass Observation Vision Panels</div>
                  <div>• Overhead Hydraulic Closers with Articulated Arms</div>
                  <div>• Stainless Steel Handles & Central Sliding Bolt Lock</div>
                </div>
              </div>
            )}

            {/* TAB 2: Precise GNSS & Geodetic Heights */}
            {activeTab === 'gnss' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10.5px', color: '#67e8f9', textTransform: 'uppercase', fontWeight: 700 }}>
                      GEOSPATIAL GNSS & COORDINATES
                    </span>
                    <span style={{ fontSize: '10px', color: '#4ade80', fontFamily: 'monospace' }}>
                      PDOP: {cadastre.pdop}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9.5px' }}>LATITUDE:</span>
                      <div style={{ color: '#38bdf8', fontWeight: 700 }}>{cadastre.latitude}° N</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9.5px' }}>LONGITUDE:</span>
                      <div style={{ color: '#38bdf8', fontWeight: 700 }}>{cadastre.longitude}° E</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9.5px' }}>HEIGHT MSL:</span>
                      <div style={{ color: '#4ade80', fontWeight: 700 }}>{cadastre.elevationMsl} m</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9.5px' }}>FLOOR LEVEL:</span>
                      <div style={{ color: '#cbd5e1', fontWeight: 700 }}>+{cadastre.heightAboveGround} m</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div><b>CRS:</b> {cadastre.crs}</div>
                    <div><b>Fix Quality:</b> {cadastre.gnssFixQuality}</div>
                    <div style={{ color: '#34d399', fontFamily: 'monospace' }}>
                      <b>Floor Segmentation:</b> Down {cadastre.floorSegmentation.startDownY.toFixed(2)}m (MSL {cadastre.floorSegmentation.startDownMsl}m) → Up {cadastre.floorSegmentation.endUpY.toFixed(2)}m (MSL {cadastre.floorSegmentation.endUpMsl}m)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Clickable List for All 45 Rooms */}
            {activeTab === 'all_rooms' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                  Click ANY room to zoom camera straight to the door center:
                </span>
                {[1, 2, 3, 4, 5].map(f => (
                  <div key={f} style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '6px 8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      LEVEL {f} ({f === 1 ? 'GROUND TIER' : `FLOOR ${f - 1}`}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {[11, 12, 13, 14, 15, 16, 17, 18, 19].map(r => {
                        const code = `A-${f}${r}`;
                        const isSel = code === roomNumber;
                        return (
                          <button
                            key={code}
                            onClick={() => onRoomSelect(code)}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '4px',
                              border: isSel ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                              backgroundColor: isSel ? '#0284c7' : 'rgba(255, 255, 255, 0.05)',
                              color: isSel ? '#ffffff' : '#cbd5e1',
                              fontSize: '10.5px',
                              fontWeight: isSel ? 800 : 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            title={`Navigate to Room ${code}`}
                          >
                            {code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

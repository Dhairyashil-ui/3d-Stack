// PPCRC 3D View Master Orchestrator Component
// Complete End-to-End Experience: Full India Subcontinent Map -> Pune Hinjawadi Flight -> 3D Building Digital Twin -> 15s Construction Sequence -> Entrance Flythrough -> Door Arrival Inspection & Volumetrics -> Property Details HUD

import React, { useState, useCallback, useEffect } from 'react';
import { IndiaToPropertyMap } from './IndiaToPropertyMap';
import { BuildingDigitalTwinViewer } from './BuildingDigitalTwinViewer';
import { PropertyDetailsPanel } from './PropertyDetailsPanel';
import { getRoomCadastre } from './pccrcRoomCadastre';
import { 
  Ppcrc3DViewProps, 
  Ppcrc3DViewState, 
  DisplayMode,
  RoomCadastreRecord 
} from './types';
import { 
  Search, 
  MapPin, 
  Building2, 
  X
} from 'lucide-react';

export const Ppcrc3DView: React.FC<Ppcrc3DViewProps> = ({
  initialRoom = 'A-101',
  initialUlpin = '27250401420089',
  initialBuildingId = '0089-01-01-101',
  initialState = 'initial_map',
  modelUrl = '/h.glb',
  aerialImageUrl = '/pccrc_building_centered_aerial.jpg',
  showSearchBox = true,
  onArrivedAtDoor,
  onRoomSelected,
  onDisplayModeChange,
  onStateChange,
  className,
  style
}) => {
  // Input states
  const [ulpinInput, setUlpinInput] = useState<string>(initialUlpin);
  const [buildingIdInput, setBuildingIdInput] = useState<string>(initialBuildingId);
  
  // Pipeline progression states: 'initial_map' -> 'zooming_to_prop' -> 'twin_active'
  const [appState, setAppState] = useState<Ppcrc3DViewState>(initialState);
  const [targetRoom, setTargetRoom] = useState<string>(initialRoom);
  const [currentDisplayMode, setCurrentDisplayMode] = useState<DisplayMode>('realistic');

  // Search box minimization: after search, it shrinks into a small search icon in top-right corner
  const [searchMinimized, setSearchMinimized] = useState<boolean>(false);

  // Property Details visibility: appears when camera reaches door without changing frame
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(false);

  // Parse room code from Building Unit ID (e.g. "0089-01-01-101" or "A-101" -> "A-101")
  const parseRoomFromId = (input: string): string => {
    const match = input.match(/([1-5][0-9]{2})/);
    if (match) {
      return `A-${match[1]}`;
    }
    return 'A-101';
  };

  // Safe Browser URL Parameter Inspection (works in any framework without requiring react-router)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('search') === '1' || params.get('direct') === '1') {
        const roomParam = params.get('room') || initialRoom;
        setTargetRoom(roomParam);
        setSearchMinimized(true);
        setShowDetailsPanel(false);
        if (params.get('direct') === '1') {
          setAppState('twin_active');
          if (onStateChange) onStateChange('twin_active');
          if ((window as any).__twinViewer?.zoomToRoom) {
            (window as any).__twinViewer.zoomToRoom(roomParam);
          }
        } else {
          setAppState('zooming_to_prop');
          if (onStateChange) onStateChange('zooming_to_prop');
        }
      }
    } catch {
      // Ignore if URLSearchParams is unavailable
    }
  }, [initialRoom, onStateChange]);

  // 1. Search Trigger: Zooms map or flies directly to door center
  const handleSearch = () => {
    const detectedRoom = parseRoomFromId(buildingIdInput);
    setTargetRoom(detectedRoom);
    if (appState === 'twin_active') {
      if ((window as any).__twinViewer?.zoomToRoom) {
        (window as any).__twinViewer.zoomToRoom(detectedRoom);
      }
      setShowDetailsPanel(false);
    } else {
      setShowDetailsPanel(false);
      setAppState('zooming_to_prop');
      if (onStateChange) onStateChange('zooming_to_prop');
    }
    setSearchMinimized(true);
  };

  // 2. Map Zoom & 3s Marking Complete -> Smoothly opens 3D building with details panel & controls
  const handleMapZoomComplete = useCallback(() => {
    setAppState('twin_active');
    setShowDetailsPanel(false);
    if (onStateChange) onStateChange('twin_active');
  }, [onStateChange]);

  // 3. Camera Arrived at Room Door -> Show Details Panel WITHOUT changing frame!
  const handleArrivedAtRoom = useCallback((room: string) => {
    setTargetRoom(room);
    setShowDetailsPanel(true);
    const cadastre: RoomCadastreRecord = getRoomCadastre(room);
    if (onArrivedAtDoor) {
      onArrivedAtDoor(room, cadastre);
    }
  }, [onArrivedAtDoor]);

  // 4. Proximity callback: details only show when user clicks directly on a door or executes search
  const handleProximityRoomChange = useCallback((_room: string | null) => {
    // Intentionally no-op to keep camera free and avoid unsolicited HUD popups
  }, []);

  // 5. Select Room (from Click or Details Panel)
  const handleRoomSelect = (newRoom: string) => {
    setTargetRoom(newRoom);
    const digits = newRoom.replace(/[^0-9]/g, '');
    const floor = digits[0] || '1';
    setBuildingIdInput(`0089-0${floor}-01-${digits}`);
    setShowDetailsPanel(true);
    if ((window as any).__twinViewer?.zoomToRoom) {
      (window as any).__twinViewer.zoomToRoom(newRoom);
    }
    const cadastre: RoomCadastreRecord = getRoomCadastre(newRoom);
    if (onRoomSelected) {
      onRoomSelected(newRoom, cadastre);
    }
  };

  const handleDisplayModeChange = (mode: DisplayMode) => {
    setCurrentDisplayMode(mode);
    if (onDisplayModeChange) {
      onDisplayModeChange(mode);
    }
  };

  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#020617',
        overflow: 'hidden',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP-RIGHT CORNER COMPACT SEARCH BOX / MINIMIZED SEARCH BUTTON          */}
      {/* ========================================================================= */}
      {showSearchBox && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 60,
          pointerEvents: 'auto'
        }}>
          {searchMinimized ? (
            <button
              onClick={() => setSearchMinimized(false)}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid #38bdf8',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 14px rgba(56, 189, 248, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Search another ULPIN / Building ID"
            >
              <Search size={18} />
            </button>
          ) : (
            <div style={{
              width: '330px',
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(16px)',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '12px 14px',
              boxShadow: '0 8px 26px rgba(0, 0, 0, 0.65), 0 0 16px rgba(56, 189, 248, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              animation: 'fadeInDown 0.2s ease-out'
            }}>
              {/* Header with Close / Minimize */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px' }}>
                  PROPERTY CADASTRE SEARCH
                </span>
                {appState !== 'initial_map' && (
                  <button
                    onClick={() => setSearchMinimized(true)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                    title="Minimize Search to Corner"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Input 1: 14-Digit ULPIN ID */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <label style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  14-Digit ULPIN ID (State 2 + Dist 2 + Tal 2 + Vill 4 + Bld 4):
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(30, 41, 59, 0.85)',
                  border: '1px solid #334155',
                  borderRadius: '5px',
                  padding: '0 8px'
                }}>
                  <MapPin size={13} color="#38bdf8" style={{ marginRight: '6px', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={ulpinInput}
                    onChange={(e) => setUlpinInput(e.target.value)}
                    placeholder="27250401420089"
                    style={{
                      width: '100%',
                      padding: '6px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Input 2: Building & Room Unit ID (Bld 4 + Floor 2 + Area 2 + Room 3) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <label style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Building Number (Bld 4 + Flr 2 + Area 2 + Room 3):
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(30, 41, 59, 0.85)',
                  border: '1px solid #334155',
                  borderRadius: '5px',
                  padding: '0 8px'
                }}>
                  <Building2 size={13} color="#a7f3d0" style={{ marginRight: '6px', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={buildingIdInput}
                    onChange={(e) => setBuildingIdInput(e.target.value)}
                    placeholder="0089-01-01-101"
                    style={{
                      width: '100%',
                      padding: '6px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                style={{
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(2, 132, 199, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <Search size={14} />
                <span>Search & Fly to Property</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL-SCREEN 3D VIEWPORT (India Map -> 3D Building Digital Twin)        */}
      {/* ========================================================================= */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }}>
        {appState === 'initial_map' || appState === 'zooming_to_prop' ? (
          <IndiaToPropertyMap
            isZoomed={appState === 'zooming_to_prop'}
            aerialImageUrl={aerialImageUrl}
            onZoomComplete={handleMapZoomComplete}
          />
        ) : (
          <BuildingDigitalTwinViewer
            targetRoomNumber={targetRoom}
            isActive={appState === 'twin_active'}
            modelUrl={modelUrl}
            onArrivedAtRoom={handleArrivedAtRoom}
            onRoomSelect={handleRoomSelect}
            onProximityRoomChange={handleProximityRoomChange}
            onExplorationModeChange={handleDisplayModeChange}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. PROPERTY DETAILS HUD OVERLAY (Appears at door without frame jump)      */}
      {/* ========================================================================= */}
      {appState === 'twin_active' && showDetailsPanel && (
        <PropertyDetailsPanel
          ulpinId={ulpinInput}
          buildingId={buildingIdInput}
          roomNumber={targetRoom}
          onRoomSelect={handleRoomSelect}
          onDisplayModeChange={handleDisplayModeChange}
          currentDisplayMode={currentDisplayMode}
          onReturnToMap={() => {
            setAppState('initial_map');
            setShowDetailsPanel(false);
            setSearchMinimized(false);
            if (onStateChange) onStateChange('initial_map');
          }}
        />
      )}

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Ppcrc3DView;

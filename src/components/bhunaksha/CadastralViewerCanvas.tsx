import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Crosshair, 
  MapPin, 
  Ruler, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { CadastralPlot, LatLonCoordinate } from '../../utils/ulpinEngine';

interface CadastralViewerCanvasProps {
  plots: CadastralPlot[];
  selectedPlot: CadastralPlot;
  onSelectPlot: (plot: CadastralPlot) => void;
  centroid: { lat: number; lon: number };
  isGenerating?: boolean;
}

export const CadastralViewerCanvas: React.FC<CadastralViewerCanvasProps> = ({
  plots,
  selectedPlot,
  onSelectPlot,
  centroid,
  isGenerating = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showVertices, setShowVertices] = useState(true);
  const [showCentroid, setShowCentroid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showOtherPlots, setShowOtherPlots] = useState(true);
  const [hoveredVertex, setHoveredVertex] = useState<LatLonCoordinate | null>(null);

  // Compute bounding box across all plots
  const bounds = useMemo(() => {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLon = Infinity;
    let maxLon = -Infinity;

    plots.forEach(p => {
      p.vertices.forEach(v => {
        if (v.lat < minLat) minLat = v.lat;
        if (v.lat > maxLat) maxLat = v.lat;
        if (v.lon < minLon) minLon = v.lon;
        if (v.lon > maxLon) maxLon = v.lon;
      });
    });

    // Add 15% margin
    const latSpan = (maxLat - minLat) || 0.005;
    const lonSpan = (maxLon - minLon) || 0.005;

    return {
      minLat: minLat - latSpan * 0.15,
      maxLat: maxLat + latSpan * 0.15,
      minLon: minLon - lonSpan * 0.15,
      maxLon: maxLon + lonSpan * 0.15,
      latSpan: latSpan * 1.3,
      lonSpan: lonSpan * 1.3
    };
  }, [plots]);

  // Coordinate projection from Lat/Lon to SVG space (800x550)
  const svgWidth = 800;
  const svgHeight = 550;

  const project = (lat: number, lon: number): { x: number; y: number } => {
    const x = ((lon - bounds.minLon) / bounds.lonSpan) * svgWidth;
    // Invert Y because latitude increases upwards
    const y = svgHeight - ((lat - bounds.minLat) / bounds.latSpan) * svgHeight;
    return { x, y };
  };

  // Convert points array to SVG polygon points string
  const getPolygonPoints = (vertices: LatLonCoordinate[]): string => {
    return vertices.map(v => {
      const p = project(v.lat, v.lon);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const centroidProjected = project(centroid.lat, centroid.lon);

  // Calculate distance between two lat/lon points in meters (Haversine formula approximation)
  const calculateDistanceMeters = (v1: LatLonCoordinate, v2: LatLonCoordinate): number => {
    const R = 6371000;
    const dLat = (v2.lat - v1.lat) * (Math.PI / 180);
    const dLon = (v2.lon - v1.lon) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(v1.lat * (Math.PI / 180)) * Math.cos(v2.lat * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Top Map Toolbar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            letterSpacing: '0.6px', 
            color: '#1e40af', 
            textTransform: 'uppercase',
            backgroundColor: '#eff6ff',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid #bfdbfe'
          }}>
            GEODETIC CADASTRAL CANVAS
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            Hinjawadi Cadastral Sheet (SU-01)
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            • WGS84 Georeferenced
          </span>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: showGrid ? '#e0f2fe' : '#ffffff',
              color: showGrid ? '#0369a1' : '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Layers size={14} />
            <span>Grid</span>
          </button>

          <button
            onClick={() => setShowVertices(!showVertices)}
            title="Toggle Vertices"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: showVertices ? '#e0f2fe' : '#ffffff',
              color: showVertices ? '#0369a1' : '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <MapPin size={14} />
            <span>Vertices</span>
          </button>

          <button
            onClick={() => setShowCentroid(!showCentroid)}
            title="Toggle Centroid Reticle"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: showCentroid ? '#fef3c7' : '#ffffff',
              color: showCentroid ? '#b45309' : '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Crosshair size={14} />
            <span>Centroid</span>
          </button>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            title="Toggle Edge Dimensions"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: showDimensions ? '#e0f2fe' : '#ffffff',
              color: showDimensions ? '#0369a1' : '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Ruler size={14} />
            <span>Dimensions</span>
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
            title="Zoom In"
            style={{
              padding: '6px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
            title="Zoom Out"
            style={{
              padding: '6px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={handleReset}
            title="Reset Pan & Zoom"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '480px',
          backgroundColor: '#ffffff',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            {/* Fine Cadastral Paper Grid Pattern */}
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
            <pattern id="mainGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
            </pattern>
            
            {/* Radial Gradient for Active Centroid Reticle */}
            <radialGradient id="centroidGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Pulsing ring filter */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Grid */}
          {showGrid && (
            <rect width={svgWidth} height={svgHeight} fill="url(#mainGrid)" />
          )}

          {/* Compass Rose in Corner */}
          <g transform="translate(740, 50)" opacity="0.65">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="0,-18 5,-3 0,-7" fill="#ef4444" />
            <polygon points="0,-18 -5,-3 0,-7" fill="#dc2626" />
            <polygon points="0,18 5,3 0,7" fill="#94a3b8" />
            <polygon points="0,18 -5,3 0,7" fill="#64748b" />
            <text x="0" y="-22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">N</text>
          </g>

          {/* Non-selected plots (Context Cadastre) */}
          {showOtherPlots && plots.filter(p => p.id !== selectedPlot.id).map(plot => {
            const pts = getPolygonPoints(plot.vertices);
            const pCentroid = calculatePolygonCentroid(plot.vertices);
            const projCentroid = project(pCentroid.lat, pCentroid.lon);

            return (
              <g 
                key={plot.id} 
                onClick={(e) => { e.stopPropagation(); onSelectPlot(plot); }}
                style={{ cursor: 'pointer' }}
              >
                <polygon
                  points={pts}
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                  opacity="0.85"
                />
                <text
                  x={projCentroid.x}
                  y={projCentroid.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#64748b"
                >
                  {plot.plotNumber}
                </text>
              </g>
            );
          })}

          {/* ACTIVE / SELECTED PLOT */}
          {selectedPlot && (
            <g id="active-plot-group">
              {/* Plot Polygon Fill & Stroke */}
              <polygon
                points={getPolygonPoints(selectedPlot.vertices)}
                fill={isGenerating ? 'rgba(59, 130, 246, 0.16)' : 'rgba(14, 165, 233, 0.12)'}
                stroke={isGenerating ? '#2563eb' : '#0284c7'}
                strokeWidth={isGenerating ? '3' : '2.5'}
                strokeDasharray={isGenerating ? '6,3' : 'none'}
                filter="url(#shadow)"
              />

              {/* Edge Dimensions */}
              {showDimensions && selectedPlot.vertices.map((v, i) => {
                const nextV = selectedPlot.vertices[(i + 1) % selectedPlot.vertices.length];
                const p1 = project(v.lat, v.lon);
                const p2 = project(nextV.lat, nextV.lon);
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                const distMeters = calculateDistanceMeters(v, nextV);

                return (
                  <g key={`dim-${i}`}>
                    <rect
                      x={midX - 22}
                      y={midY - 9}
                      width="44"
                      height="18"
                      rx="4"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#0f172a"
                    >
                      {distMeters} m
                    </text>
                  </g>
                );
              })}

              {/* Corner Vertices Nodes */}
              {showVertices && selectedPlot.vertices.map((v, idx) => {
                const pt = project(v.lat, v.lon);
                const isHovered = hoveredVertex === v;

                return (
                  <g 
                    key={`vertex-${idx}`}
                    onMouseEnter={() => setHoveredVertex(v)}
                    onMouseLeave={() => setHoveredVertex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer aura */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 12 : 7}
                      fill={isHovered ? 'rgba(2, 132, 199, 0.25)' : 'rgba(2, 132, 199, 0.15)'}
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />
                    {/* Inner core */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#0369a1"
                      strokeWidth="2"
                    />
                    {/* Node index badge */}
                    <g transform={`translate(${pt.x + 8}, ${pt.y - 8})`}>
                      <rect
                        x="-2"
                        y="-10"
                        width="24"
                        height="14"
                        rx="3"
                        fill="#0f172a"
                      />
                      <text
                        x="10"
                        y="0"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        V{idx + 1}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* DYNAMIC MATHEMATICAL CENTROID (Exact center point computed from boundary polygon) */}
              {showCentroid && (
                <g 
                  id="mathematical-centroid"
                  transform={`translate(${centroidProjected.x}, ${centroidProjected.y})`}
                >
                  {/* Radar pulse wave */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isGenerating ? "32" : "24"}
                    fill="url(#centroidGlow)"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values="16;28;16"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;0.3;0.9"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Crosshair ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="1.8"
                  />
                  {/* Crosshair lines */}
                  <line x1="-16" y1="0" x2="16" y2="0" stroke="#dc2626" strokeWidth="1.8" />
                  <line x1="0" y1="-16" x2="0" y2="16" stroke="#dc2626" strokeWidth="1.8" />
                  {/* Center red pin */}
                  <circle cx="0" cy="0" r="3.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Floating Centroid Coordinates Pill Tag */}
                  <g transform="translate(0, -28)">
                    <rect
                      x="-105"
                      y="-13"
                      width="210"
                      height="24"
                      rx="12"
                      fill="#dc2626"
                      filter="url(#shadow)"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="monospace"
                      letterSpacing="0.3px"
                    >
                      C: {centroid.lat.toFixed(6)}°N, {centroid.lon.toFixed(6)}°E
                    </text>
                  </g>
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Hovered Vertex Info Overlay */}
        {hoveredVertex && (
          <div 
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
            <div>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{hoveredVertex.label || 'Vertex Node'}:</span>{' '}
              <span style={{ fontFamily: 'monospace' }}>
                Lat: {hoveredVertex.lat.toFixed(6)}° N, Lon: {hoveredVertex.lon.toFixed(6)}° E
              </span>
            </div>
          </div>
        )}

        {/* Legend in Canvas Bottom Right */}
        <div 
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '10.5px',
            color: '#334155',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '3px', backgroundColor: '#0284c7' }} />
            <span>Plot Boundary (Closed Polygon)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #0369a1', backgroundColor: '#ffffff' }} />
            <span>Corner Geo-Vertices (V1..Vn)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
            <span>Mathematical Centroid (Exact Center)</span>
          </div>
        </div>
      </div>

      {/* Canvas Footer Status */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#475569'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Selected: <strong style={{ color: '#0f172a' }}>{selectedPlot.plotNumber}</strong></span>
          <span>Survey/Gat: <strong style={{ color: '#0f172a' }}>{selectedPlot.surveyNumber}/{selectedPlot.hissaNumber}</strong></span>
          <span>Area: <strong style={{ color: '#0f172a' }}>{selectedPlot.areaSqm.toLocaleString()} m² ({selectedPlot.areaHectares} Ha)</strong></span>
          <span>Boundary Vertices: <strong style={{ color: '#0f172a' }}>{selectedPlot.vertices.length} Nodes</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 600, fontSize: '11.5px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
          Geo-referenced Shapefile Active
        </div>
      </div>
    </div>
  );
};

// Helper for other plot centroid calculation
function calculatePolygonCentroid(vertices: LatLonCoordinate[]): { lat: number; lon: number } {
  if (vertices.length === 0) return { lat: 0, lon: 0 };
  const sumLat = vertices.reduce((acc, v) => acc + v.lat, 0);
  const sumLon = vertices.reduce((acc, v) => acc + v.lon, 0);
  return { lat: sumLat / vertices.length, lon: sumLon / vertices.length };
}

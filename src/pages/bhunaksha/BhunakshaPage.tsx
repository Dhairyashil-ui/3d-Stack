import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Sparkles, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Upload, 
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Database,
  Search,
  Globe,
  HelpCircle,
  Clock,
  Hash,
  Share2
} from 'lucide-react';

import { 
  PRECONFIGURED_CADASTRAL_PLOTS, 
  CadastralPlot, 
  UlpinComputationResult, 
  generateUlpinForPlot,
  calculatePolygonCentroid
} from '../../utils/ulpinEngine';
import { CadastralViewerCanvas } from '../../components/bhunaksha/CadastralViewerCanvas';
import { DigitalRorPreviewCard } from '../../components/bhunaksha/DigitalRorPreviewCard';
import { TechnologicalProcessPipeline } from '../../components/bhunaksha/TechnologicalProcessPipeline';

export const BhunakshaPage: React.FC = () => {
  const [plots, setPlots] = useState<CadastralPlot[]>(PRECONFIGURED_CADASTRAL_PLOTS);
  const [selectedPlot, setSelectedPlot] = useState<CadastralPlot>(PRECONFIGURED_CADASTRAL_PLOTS[0]);
  const [ulpinResult, setUlpinResult] = useState<UlpinComputationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'vertices' | 'registry'>('overview');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedGeoJson, setImportedGeoJson] = useState('');
  const [importError, setImportError] = useState('');

  // Stamped registry state
  const [stampedRegistry, setStampedRegistry] = useState<Array<{
    plotId: string;
    plotNumber: string;
    surveyNumber: string;
    ulpin: string;
    timestamp: string;
    hash: string;
    area: string;
  }>>([]);

  // Compute live centroid for current plot
  const liveCentroid = calculatePolygonCentroid(selectedPlot.vertices);

  // When plot changes, reset current result (unless already cached)
  useEffect(() => {
    // Check if this plot was already generated in registry
    const existing = stampedRegistry.find(r => r.plotId === selectedPlot.id);
    if (existing) {
      setUlpinResult(generateUlpinForPlot(selectedPlot));
    } else {
      setUlpinResult(null);
    }
  }, [selectedPlot]);

  // 1-Click ULPIN Generation Pipeline Trigger
  const handleGenerateUlpin = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationStep(1);

    // Step 1: Processing survey map (polygon & centroid)
    setTimeout(() => {
      setGenerationStep(2);
      // Step 2: Two-Part Data Structure (Administrative Prefix + Base-14 Spatial Encoding)
      setTimeout(() => {
        setGenerationStep(3);
        const result = generateUlpinForPlot(selectedPlot);
        setUlpinResult(result);

        // Add to stamped registry if not already present
        setStampedRegistry(prev => {
          if (prev.some(p => p.plotId === selectedPlot.id)) return prev;
          return [
            {
              plotId: selectedPlot.id,
              plotNumber: selectedPlot.plotNumber,
              surveyNumber: `${selectedPlot.surveyNumber}/${selectedPlot.hissaNumber}`,
              ulpin: result.ulpin14,
              timestamp: new Date().toLocaleTimeString(),
              hash: result.registryHash,
              area: `${selectedPlot.areaHectares} Ha`
            },
            ...prev
          ];
        });

        setTimeout(() => {
          setIsGenerating(false);
          setGenerationStep(0);
        }, 400);
      }, 500);
    }, 500);
  };

  // Custom GeoJSON / Coordinate importer
  const handleImportCoordinates = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importedGeoJson);
      let coords: [number, number][] = [];

      if (parsed.type === 'Feature' && parsed.geometry?.type === 'Polygon') {
        coords = parsed.geometry.coordinates[0];
      } else if (parsed.type === 'Polygon') {
        coords = parsed.coordinates[0];
      } else if (Array.isArray(parsed)) {
        coords = parsed;
      } else {
        throw new Error('Please provide a valid GeoJSON Polygon or array of [lon, lat] coordinates');
      }

      if (coords.length < 3) {
        throw new Error('A polygon requires at least 3 coordinates');
      }

      // Format into vertices
      const newVertices = coords.map((c, idx) => ({
        lat: Number(c[1]),
        lon: Number(c[0]),
        label: `V${idx + 1}`
      }));

      const newPlot: CadastralPlot = {
        id: `IMPORTED_${Date.now()}`,
        plotNumber: `Plot Custom/${plots.length + 1}`,
        surveyNumber: '99',
        hissaNumber: String(plots.length + 1),
        ownerName: 'Custom Imported Land Record',
        khataNumber: `KH-${Math.floor(1000 + Math.random() * 9000)}/2026`,
        areaSqm: 12500,
        areaHectares: 1.25,
        category: 'Commercial / IT',
        adminHierarchy: selectedPlot.adminHierarchy,
        vertices: newVertices
      };

      setPlots(prev => [newPlot, ...prev]);
      setSelectedPlot(newPlot);
      setShowImportModal(false);
      setImportedGeoJson('');
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON format');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. TOP OFFICIAL GOVERNMENT STRIP */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '6px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: '#475569'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img 
              src="/assets/bharat-sarkar.svg" 
              alt="Government of India Emblem" 
              style={{ height: '22px', width: 'auto' }}
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <span style={{ fontWeight: 700, color: '#1e293b' }}>
              भारत सरकार | Government of India
            </span>
          </div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>ग्रामीण विकास मंत्रालय | Ministry of Rural Development</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontWeight: 600, color: '#0369a1' }}>Department of Land Resources (DoLR)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803d', fontWeight: 600 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
            DILRMP Central Node: Connected
          </span>
          <Link 
            to="/" 
            style={{ 
              color: '#1e40af', 
              fontWeight: 600, 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={13} />
            <span>NAKSHA Public Portal</span>
          </Link>
        </div>
      </div>

      {/* 2. PRIMARY PORTAL HEADER (CLEAN WHITE GOVERNMENT LOOK) */}
      <header 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #1e40af',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e40af'
            }}
          >
            <Layers size={26} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                भू-नक्शा | BHUNAKSHA CADASTRE
              </h1>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                backgroundColor: '#fef08a', 
                color: '#854d0e', 
                padding: '2px 8px', 
                borderRadius: '4px',
                border: '1px solid #facc15'
              }}>
                1-CLICK ULPIN GENERATOR
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              National Geospatial Knowledge-based Cadastral Survey • OGC & ECCMA International Spatial Coding Standard
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowImportModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Upload size={14} />
            <span>Import Shapefile / GeoJSON</span>
          </button>

          <a 
            href="https://dolr.gov.in/en/ulpin/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#f1f5f9',
              color: '#1e40af',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} />
            <span>DoLR ULPIN Guidelines</span>
          </a>
        </div>
      </header>

      {/* 3. BREADCRUMBS & ADMINISTRATIVE LOCATION SELECTOR */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Administrative Hierarchy Dropdowns (Part A - 6 Digits) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>State:</span>
            <div style={{ 
              padding: '5px 10px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              fontSize: '12.5px', 
              fontWeight: 600, 
              color: '#0f172a' 
            }}>
              Maharashtra (Code: 27 / MH)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>District:</span>
            <div style={{ 
              padding: '5px 10px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              fontSize: '12.5px', 
              fontWeight: 600, 
              color: '#0f172a' 
            }}>
              Pune (Code: 27)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Taluka:</span>
            <div style={{ 
              padding: '5px 10px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              fontSize: '12.5px', 
              fontWeight: 600, 
              color: '#0f172a' 
            }}>
              Mulshi (Code: B)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Village:</span>
            <div style={{ 
              padding: '5px 10px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              fontSize: '12.5px', 
              fontWeight: 600, 
              color: '#0f172a' 
            }}>
              Hinjawadi (Code: 4)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Select Plot:</span>
            <select
              value={selectedPlot.id}
              onChange={(e) => {
                const found = plots.find(p => p.id === e.target.value);
                if (found) setSelectedPlot(found);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #0284c7',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0284c7',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {plots.map(p => (
                <option key={p.id} value={p.id}>
                  {p.plotNumber} - Survey {p.surveyNumber}/{p.hissaNumber} ({p.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big 1-Click Action Button in Top Bar */}
        <div>
          <button
            onClick={handleGenerateUlpin}
            disabled={isGenerating}
            style={{
              padding: '9px 22px',
              backgroundColor: isGenerating ? '#64748b' : '#15803d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            <span>{isGenerating ? 'Computing Geospatial Centroid...' : '⚡ Generate 14-Digit ULPIN (1-Click)'}</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: 2-COLUMN GRID */}
      <main style={{ flex: 1, padding: '20px 24px', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: Cadastral Map Canvas & Geodetic Vertices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Interactive GIS Canvas */}
          <CadastralViewerCanvas
            plots={plots}
            selectedPlot={selectedPlot}
            onSelectPlot={setSelectedPlot}
            centroid={liveCentroid}
            isGenerating={isGenerating}
          />

          {/* Tab Navigation: Centroid Math Breakdown vs Vertices Table vs Database Registry */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: '12px 18px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'overview' ? 700 : 500,
                  color: activeTab === 'overview' ? '#1e40af' : '#64748b',
                  border: 'none',
                  borderBottom: activeTab === 'overview' ? '2px solid #1e40af' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                Centroid Calculation & Norms
              </button>

              <button
                onClick={() => setActiveTab('vertices')}
                style={{
                  padding: '12px 18px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'vertices' ? 700 : 500,
                  color: activeTab === 'vertices' ? '#1e40af' : '#64748b',
                  border: 'none',
                  borderBottom: activeTab === 'vertices' ? '2px solid #1e40af' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                Boundary Vertices Coordinates ({selectedPlot.vertices.length})
              </button>

              <button
                onClick={() => setActiveTab('registry')}
                style={{
                  padding: '12px 18px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'registry' ? 700 : 500,
                  color: activeTab === 'registry' ? '#1e40af' : '#64748b',
                  border: 'none',
                  borderBottom: activeTab === 'registry' ? '2px solid #1e40af' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                Central Registry Ledger ({stampedRegistry.length})
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              {activeTab === 'overview' && (
                <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h5 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      Mathematical Centroid Calculation (Step 1 of Standard)
                    </h5>
                    <span style={{ fontFamily: 'monospace', color: '#dc2626', fontWeight: 700 }}>
                      C: {liveCentroid.lat.toFixed(6)}° N, {liveCentroid.lon.toFixed(6)}° E
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px 0' }}>
                    The centroid is the true balance center of the closed polygon bounded by vertices $V_1 \dots V_n$.
                    Rather than an arbitrary point, the system applies the exact mathematical shoelace formula:
                  </p>
                  <div style={{ 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    fontFamily: 'monospace', 
                    fontSize: '12px',
                    color: '#1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span>Area A = 0.5 · Σ (xi · yi+1 - xi+1 · yi)</span>
                    <span>Cx = (1 / 6A) · Σ (xi + xi+1)(xi · yi+1 - xi+1 · yi)</span>
                    <span>Cy = (1 / 6A) · Σ (yi + yi+1)(xi · yi+1 - xi+1 · yi)</span>
                  </div>
                  <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    For Plot 42/1, the calculated center point is <strong>Latitude 18.520430, Longitude 73.856744</strong>. This point is strictly invariant to rotation or scale.
                  </p>
                </div>
              )}

              {activeTab === 'vertices' && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Node ID</th>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Latitude (°N)</th>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Longitude (°E)</th>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPlot.vertices.map((v, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px', fontWeight: 600, color: '#0f172a' }}>{v.label || `Node ${i + 1}`}</td>
                          <td style={{ padding: '8px', fontFamily: 'monospace', color: '#0284c7', fontWeight: 600 }}>{v.lat.toFixed(6)}</td>
                          <td style={{ padding: '8px', fontFamily: 'monospace', color: '#0284c7', fontWeight: 600 }}>{v.lon.toFixed(6)}</td>
                          <td style={{ padding: '8px', color: '#64748b' }}>WGS84 EPSG:4326</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'registry' && (
                <div>
                  {stampedRegistry.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                      No parcels stamped in this session yet. Click "Generate 14-Digit ULPIN" to stamp.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Plot</th>
                          <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Survey</th>
                          <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>14-Digit ULPIN</th>
                          <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Timestamp</th>
                          <th style={{ padding: '8px', textAlign: 'left', color: '#475569' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stampedRegistry.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px', fontWeight: 600, color: '#0f172a' }}>{item.plotNumber}</td>
                            <td style={{ padding: '8px', color: '#64748b' }}>{item.surveyNumber}</td>
                            <td style={{ padding: '8px', fontFamily: 'monospace', fontWeight: 800, color: '#15803d' }}>
                              {item.ulpin}
                            </td>
                            <td style={{ padding: '8px', color: '#64748b' }}>{item.timestamp}</td>
                            <td style={{ padding: '8px' }}>
                              <span style={{ 
                                backgroundColor: '#dcfce7', 
                                color: '#166534', 
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700
                              }}>
                                STAMPED
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3-Step Technological Pipeline & Digital RoR Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Stamped RoR Preview Card with PDF download */}
          <DigitalRorPreviewCard
            plot={selectedPlot}
            ulpinResult={ulpinResult}
            onGenerateClick={handleGenerateUlpin}
            isGenerating={isGenerating}
          />

          {/* 3-Step Technological Architecture Breakdown */}
          <TechnologicalProcessPipeline
            plot={selectedPlot}
            result={ulpinResult}
            isGenerating={isGenerating}
          />
        </div>

      </main>

      {/* 5. IMPORT MODAL */}
      {showImportModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Import Cadastral Shapefile / GeoJSON
              </h3>
              <button 
                onClick={() => setShowImportModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '12.5px', color: '#475569' }}>
              Paste a GeoJSON Polygon Feature or coordinates array `[[lon, lat], [lon, lat], ...]`. BhuNaksha will compute its closed boundaries, vertices, and mathematical centroid automatically.
            </p>

            <textarea
              rows={6}
              value={importedGeoJson}
              onChange={(e) => setImportedGeoJson(e.target.value)}
              placeholder={`{\n  "type": "Polygon",\n  "coordinates": [\n    [[73.8559, 18.5212], [73.8574, 18.5213], [73.8576, 18.5198], [73.8560, 18.5194], [73.8559, 18.5212]]\n  ]\n}`}
              style={{
                width: '100%',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {importError && (
              <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>
                {importError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowImportModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleImportCoordinates}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#1e40af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Load Plot to Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. OFFICIAL FOOTER */}
      <footer 
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>© 2026 National Informatics Centre (NIC), Ministry of Electronics & IT</span>
          <span>•</span>
          <span>Department of Land Resources (DoLR), Government of India</span>
        </div>
        <div>
          <span>Unique Land Parcel Identification Number (ULPIN) Standard v2.4</span>
        </div>
      </footer>
    </div>
  );
};

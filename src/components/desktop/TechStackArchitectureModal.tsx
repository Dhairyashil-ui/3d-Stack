import React, { useState } from 'react';
import {
  X,
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  Box,
  FileCode,
  HardDrive,
  Activity,
  ArrowRight,
  Server,
  Zap,
  Terminal,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface TechStackArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechStackArchitectureModal: React.FC<TechStackArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'detection' | 'validation' | 'packages' | 'stack'>(
    'pipeline'
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 15, 29, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  NAKSHA 2.0 System Architecture & Final Tech Stack
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  Locked Stack
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '3px 0 0 0' }}>
                End-to-End Pipeline: Raw Multi-Source Survey Ingest → Automated Detection → Validation → Standardized Packages → 3D Spatial Units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #1e293b',
            backgroundColor: '#0a0f1d',
            padding: '0 20px',
            gap: '8px'
          }}
        >
          {[
            { id: 'pipeline', label: '1. Architecture & Pipeline', icon: Activity },
            { id: 'detection', label: '2. Auto Data-Type Detection', icon: Zap },
            { id: 'validation', label: '3. Data Validation Engines', icon: ShieldCheck },
            { id: 'packages', label: '4. Standard Packages (manifest.json)', icon: Box },
            { id: 'stack', label: '5. Locked Tech Stack Matrix', icon: Code2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid #38bdf8' : '2px solid transparent',
                  color: active ? '#38bdf8' : '#94a3b8',
                  fontWeight: active ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 160px)' }}>
          {/* TAB 1: PIPELINE & FLOW */}
          {activeTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: '#0a0f1d',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '20px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#38bdf8',
                  overflowX: 'auto'
                }}
              >
                <div style={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}>
                  // PRODUCTION DATA FLOW PIPELINE ARCHITECTURE
                </div>
                <pre style={{ margin: 0 }}>
{`ANY ARBITRARY SURVEY INPUT (Drone TIF/TBK, GIS GDB/SHP, LiDAR LAZ/LAS, BIM IFC/GLB)
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  FASTAPI UPLOAD API + MINIO OBJECT STORAGE (Chunked Resumable Upload)  │
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  AUTOMATIC DATA-TYPE DETECTION (Python + libmagic + GDAL + PDAL + IFC) │
│  Asks: "What is this data?" (Not "Which package did user select?")     │
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  MULTI-STREAM VALIDATION (CRS • Topology • Density • Geometry • QA)    │
│  GDAL/OGR (GIS) • PDAL (LiDAR) • Rasterio (Imagery) • IfcOpenShell     │
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  FOUR STANDARDIZED PACKAGES WITH CANONICAL FILES + MANIFEST.JSON       │
│  PACKAGE 01: ORI    │ PACKAGE 02: GIS │ PACKAGE 03: 3D │ PACKAGE 04: BIM│
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  CELERY WORKER QUEUE (Redis Broker) → GEOSPATIAL + 3D DATA FUSION      │
│  Georeferencing → Alignment (Open3D) → Reconstruction (COLMAP)         │
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  AI SEMANTIC EXTRACTION (PyTorch + OpenCV + IfcSpace Segmentation)     │
│  Building → Floor → Flat / Unit → Room                                │
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  3D SPATIAL UNIT VOLUMETRIC COMPLETION (0% → 100% Weighted Metric)     │
│  Survey Control (15%) + Exterior (20%) + Floors (20%) +                │
│  Apartment Geometry (20%) + Interior Rooms (20%) + GIS Linkage (5%)    │
└────────────────────────────────────────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────────────────────────────────┐
│  THREE.JS INTERACTIVE 3D VIEWER + WATER-FILL LIQUID METAPHOR           │
└────────────────────────────────────────────────────────────────────────┘`}
                </pre>
              </div>

              {/* Pipeline summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#38bdf8' }}>
                    <Server size={18} />
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Resumable Multipart Upload</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    Raw drone orthomosaics and LiDAR point clouds frequently exceed hundreds of MB or several GB. FastAPI streams binary chunks directly to S3-compatible MinIO object storage with automatic checksum validation.
                  </p>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#4ade80' }}>
                    <Cpu size={18} />
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Asynchronous Celery Workers</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    Heavy compute (point cloud octrees, mesh decimation, AI semantic wall extraction) runs asynchronously via Celery worker pools backed by Redis. Real-time progress broadcasts via WebSocket to the React frontend.
                  </p>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f59e0b' }}>
                    <Database size={18} />
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>PostgreSQL + PostGIS Persistence</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    All topological geometries, CRS definitions, polygon boundaries, building heights, apartment ownerships, and 3D spatial unit hashes are indexed in PostGIS with 3D coordinate support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTO DATA-TYPE DETECTION */}
          {activeTab === 'detection' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderRadius: '10px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
                  Intelligent Data-Type Detection Engine
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                  The ingest portal does <strong>not</strong> force the user to pick a target package manually. Instead, it inspects raw file binary signatures, internal headers, and container metadata to deduce the data type automatically:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '14px' }}>
                {/* Example 1 */}
                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f43f5e', fontSize: '13px' }}>
                      building_scan.laz
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>
                      Tool: PDAL
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>1. PDAL inspects LAS/LAZ binary headers, point count, and VLR projection records.</div>
                    <div>2. Detects: <strong>Dense LiDAR / Point Cloud Dataset</strong> (CRS: UTM 43N).</div>
                    <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                      → Automatically mapped to <strong>PACKAGE 03 — 3D SURVEY</strong>.
                    </div>
                  </div>
                </div>

                {/* Example 2 */}
                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#3b82f6', fontSize: '13px' }}>
                      parcel_data.zip
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>
                      Tool: libmagic + GDAL/OGR
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>1. ZIP archive decompressed into memory; discovers internal <code>.gdb</code> directory table.</div>
                    <div>2. Detects: <strong>2D Cadastral Vector Parcel Topology</strong> (Polygons & Lines).</div>
                    <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                      → Automatically mapped to <strong>PACKAGE 02 — 2D GIS</strong>.
                    </div>
                  </div>
                </div>

                {/* Example 3 */}
                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10b981', fontSize: '13px' }}>
                      building.ifc
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>
                      Tool: IfcOpenShell
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>1. IfcOpenShell parses STEP ISO-10303 schema; extracts IfcBuildingStorey & IfcSpace entities.</div>
                    <div>2. Detects: <strong>BIM Building Geometry & Vertical Apartment Tiers</strong>.</div>
                    <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                      → Automatically mapped to <strong>PACKAGE 04 — VERTICAL PROPERTY</strong>.
                    </div>
                  </div>
                </div>

                {/* Example 4 */}
                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a855f7', fontSize: '13px' }}>
                      drone_survey.tbk / .tif
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>
                      Tool: GDAL + Rasterio
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>1. GDAL inspects TIFF geokeys, affine geotransform matrix, and nodata mask.</div>
                    <div>2. Detects: <strong>Orthorectified Aerial Survey Imagery</strong> (Ground Resolution: 3.5cm).</div>
                    <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                      → Automatically mapped to <strong>PACKAGE 01 — ORI & IMAGERY</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA VALIDATION ENGINES */}
          {activeTab === 'validation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderRadius: '10px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
                  Automated Data Validation Criteria
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                  Each detected stream is put through strict validation pipelines before being permitted into the canonical package structures:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#38bdf8', marginBottom: '8px' }}>
                    1. GIS Cadastre Validation
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                    Engine: GDAL / OGR + PostGIS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li>CRS conformance (EPSG:4326 / UTM 43N)</li>
                    <li>Polygon self-intersection & slivers</li>
                    <li>Topological closure & gaps</li>
                    <li>Schema & attribute table integrity</li>
                    <li>Coordinate range sanity checks</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#4ade80', marginBottom: '8px' }}>
                    2. LiDAR Point Cloud QA
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                    Engine: PDAL Pipeline
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li>Valid X/Y/Z coordinate ranges</li>
                    <li>Point density thresholds (≥ 15 pts/m²)</li>
                    <li>Noise & corrupted point filtering</li>
                    <li>Bounding box containment</li>
                    <li>Classification codes (Ground, Building)</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#f59e0b', marginBottom: '8px' }}>
                    3. Imagery Georeferencing
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                    Engine: GDAL + Rasterio
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li>Georeferencing affine transform</li>
                    <li>Pixel resolution & GSD accuracy</li>
                    <li>Raster dimension conformity</li>
                    <li>Missing tiles / nodata boundary checks</li>
                    <li>Band count & radiometric depth</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#ec4899', marginBottom: '8px' }}>
                    4. BIM & Vertical Geometry
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                    Engine: IfcOpenShell + Python
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li>Building exterior envelope geometry</li>
                    <li>Floor storeys elevation continuity</li>
                    <li>Room spaces (IfcSpace) volumetric watertightness</li>
                    <li>Apartment boundary unit mapping</li>
                    <li>Metadata properties (Flat No, Owner)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STANDARD PACKAGES & MANIFEST.JSON */}
          {activeTab === 'packages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderRadius: '10px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px' }}>
                  <Box size={18} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                    Technically Defensible Canonical Package Architecture
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                  <strong>Critical Architectural Rule:</strong> Do not merge incompatible binary files into an arbitrary single file. Instead, the system produces four standardized, self-contained packages containing appropriate canonical files and an authoritative <code>manifest.json</code>:
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#0a0f1d',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '20px',
                  fontFamily: 'monospace',
                  fontSize: '12.5px',
                  lineHeight: '1.7',
                  color: '#e2e8f0'
                }}
              >
                <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>PROJECT_PMRDA_HINJAWADI_04/</div>
                <div style={{ color: '#94a3b8' }}>│</div>
                <div>├── <strong style={{ color: '#38bdf8' }}>PACKAGE_01_ORI/</strong> <span style={{ color: '#64748b' }}>// Drone Orthomosaic</span></div>
                <div>│   ├── <span style={{ color: '#4ade80' }}>orthophoto.tif</span> <span style={{ color: '#64748b' }}>[GeoTIFF / TPK]</span></div>
                <div>│   └── <span style={{ color: '#f59e0b' }}>manifest.json</span></div>
                <div style={{ color: '#94a3b8' }}>│</div>
                <div>├── <strong style={{ color: '#38bdf8' }}>PACKAGE_02_GIS/</strong> <span style={{ color: '#64748b' }}>// 2D Cadastre</span></div>
                <div>│   ├── <span style={{ color: '#4ade80' }}>parcels.gpkg</span> <span style={{ color: '#64748b' }}>[GeoPackage / GDB]</span></div>
                <div>│   └── <span style={{ color: '#f59e0b' }}>manifest.json</span></div>
                <div style={{ color: '#94a3b8' }}>│</div>
                <div>├── <strong style={{ color: '#38bdf8' }}>PACKAGE_03_SURVEY/</strong> <span style={{ color: '#64748b' }}>// 3D LiDAR</span></div>
                <div>│   ├── <span style={{ color: '#4ade80' }}>pointcloud.laz</span> <span style={{ color: '#64748b' }}>[LAZ / LAS Point Cloud]</span></div>
                <div>│   └── <span style={{ color: '#f59e0b' }}>manifest.json</span></div>
                <div style={{ color: '#94a3b8' }}>│</div>
                <div>└── <strong style={{ color: '#38bdf8' }}>PACKAGE_04_VERTICAL/</strong> <span style={{ color: '#64748b' }}>// Vertical BIM & Apartment Spaces</span></div>
                <div>    ├── <span style={{ color: '#4ade80' }}>building.ifc</span> <span style={{ color: '#64748b' }}>[IFC4 Architecture]</span></div>
                <div>    ├── <span style={{ color: '#4ade80' }}>rooms.glb</span> <span style={{ color: '#64748b' }}>[GLTF Binary Three.js Mesh]</span></div>
                <div>    └── <span style={{ color: '#f59e0b' }}>manifest.json</span></div>
              </div>

              {/* Sample manifest.json */}
              <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                  Sample Canonical manifest.json Structure:
                </div>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', overflowX: 'auto' }}>
{`{
  "packageId": "PACKAGE_04_VERTICAL",
  "version": "2.4.0",
  "standard": "DoLR-3D-CADASTRE-SPEC-2026",
  "crs": "EPSG:4326 / Height-Datum: EGM2008",
  "boundingExtent": [18.5201, 73.8562, 18.5208, 73.8572],
  "canonicalFiles": [
    { "name": "building.ifc", "sizeBytes": 4210940, "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
    { "name": "rooms.glb", "sizeBytes": 1845120, "sha256": "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb" }
  ],
  "spatialHierarchy": {
    "buildingStoreys": 6,
    "totalUnits": 45,
    "targetUnit": "UNIT-302-3RD-FLOOR",
    "volumetricAreaM3": 285.4
  },
  "validationReport": {
    "status": "PASS",
    "engine": "IfcOpenShell v0.7.0",
    "checks": { "geometryConsistency": true, "metadataAttributes": true }
  }
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: LOCKED TECH STACK MATRIX */}
          {activeTab === 'stack' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderRadius: '10px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
                  Locked Production Technology Stack
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                  Every layer of the prototype has been selected for rigorous technical defense and SIH national evaluation:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                {[
                  { layer: 'Frontend UI', tech: 'React 19 + TypeScript + Tailwind CSS', desc: 'Drag & drop, multi-stream ingestion, real-time classifier logs, completion HUD' },
                  { layer: '3D Visualization', tech: 'Three.js WebGL', desc: 'Real-time 3D apartment volumetric viewer and dynamic water/liquid completion animation' },
                  { layer: 'API Layer', tech: 'FastAPI (Python)', desc: 'High-performance async REST & WebSocket endpoints with resumable chunked upload support' },
                  { layer: 'Object Storage', tech: 'MinIO (S3 Compatible)', desc: 'Stores heavy drone rasters, LiDAR point clouds, and raw survey packages' },
                  { layer: 'Spatial Database', tech: 'PostgreSQL + PostGIS', desc: 'Stores projects, parcels, floor topologies, CRS coordinates, and unit ownerships' },
                  { layer: 'Task Queue & Broker', tech: 'Redis + Celery', desc: 'Asynchronous distributed background processing for compute-heavy geospatial workloads' },
                  { layer: 'GIS Processing', tech: 'GDAL / OGR + Rasterio', desc: 'Geospatial format conversion, CRS reprojection, raster analysis, vector topology QA' },
                  { layer: 'Point Cloud Engine', tech: 'PDAL + Open3D', desc: 'LiDAR filtering, point density estimation, ground classification, octree meshing' },
                  { layer: 'Photogrammetry', tech: 'COLMAP', desc: 'Structure-from-Motion (SfM) and Multi-View Stereo (MVS) 3D mesh reconstruction' },
                  { layer: 'BIM & Vertical Cadastre', tech: 'IfcOpenShell', desc: 'Parses IFC building models, extracts building storeys, floor plans, and room spaces' },
                  { layer: 'AI Semantic Extraction', tech: 'PyTorch + OpenCV', desc: 'Neural boundary extraction and room semantic segmentations from multi-floor plans' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#0a0f1d',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                        {item.layer}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                      {item.tech}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.4' }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0a0f1d'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            Smart India Hackathon (SIH) Prototype • National Cadastre Modernization Standard
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#1b539c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};

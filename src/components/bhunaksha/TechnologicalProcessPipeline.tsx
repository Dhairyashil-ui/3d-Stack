import React from 'react';
import { 
  Cpu, 
  MapPin, 
  Binary, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Fingerprint,
  Compass,
  FileCheck2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CadastralPlot, UlpinComputationResult } from '../../utils/ulpinEngine';

interface TechnologicalProcessPipelineProps {
  plot: CadastralPlot;
  result: UlpinComputationResult | null;
  isGenerating: boolean;
}

export const TechnologicalProcessPipeline: React.FC<TechnologicalProcessPipelineProps> = ({
  plot,
  result,
  isGenerating
}) => {
  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header Banner */}
      <div 
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="#1e40af" />
          <div>
            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
              Step-by-Step Technological Generation Architecture
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Department of Land Resources (DoLR) • OGC & ECCMA International Coding Standard
            </span>
          </div>
        </div>

        <div style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: '#0369a1',
          backgroundColor: '#e0f2fe',
          padding: '3px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>Deterministic Spatial Conversion</span>
        </div>
      </div>

      {/* Quote / Doctrine Banner */}
      <div 
        style={{
          padding: '10px 18px',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '11.5px',
          color: '#334155',
          fontStyle: 'italic',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Fingerprint size={16} color="#0284c7" />
        <span>
          "The system does not issue numbers randomly; it converts physical spatial geography directly into text using international coding standards." — <strong>IMPRI & DoLR Land Survey Norms</strong>
        </span>
      </div>

      {/* 3 Step Pipeline Cards */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* STEP 1: Processing the Survey Map (Polygon & Centroid) */}
        <div 
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            backgroundColor: isGenerating ? '#f0fdf4' : '#ffffff',
            padding: '14px 16px',
            transition: 'background-color 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: '#1e40af', 
                color: '#ffffff', 
                fontSize: '12px', 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                1
              </div>
              <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                Step 1: Processing the Survey Map (Polygon & Centroid)
              </h5>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              {plot.vertices.length} Geo-Vertices Identified
            </span>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
            BhuNaksha reads the imported shapefile plot as a closed polygon, identifies all corner geodetic coordinates, and calculates the exact mathematical centroid inside those boundaries.
          </p>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px', 
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                CALCULATED MATHEMATICAL CENTROID (6 DECIMALS):
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '3px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>
                  Latitude: {result ? result.centroidLatFormatted : '18.520430'}° N
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>
                  Longitude: {result ? result.centroidLonFormatted : '73.856744'}° E
                </span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'right' }}>
              <span>Method: Finite Shoelace Formula</span>
              <br />
              <span style={{ fontFamily: 'monospace', color: '#0284c7' }}>Cx = (1/6A)·Σ(xi+xi+1)(xi·yi+1 - xi+1·yi)</span>
            </div>
          </div>
        </div>

        {/* STEP 2: The Two-Part Data Structure */}
        <div 
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            padding: '14px 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: '#1e40af', 
                color: '#ffffff', 
                fontSize: '12px', 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                2
              </div>
              <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                Step 2: The Two-Part Data Structure
              </h5>
            </div>
            <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 700 }}>
              6 Digits Admin + 8 Digits Spatial = 14 Total
            </span>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
            DoLR structures the 14-digit alphanumeric code by blending administrative hierarchy data with precise geo-coordinates:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Part A Box */}
            <div style={{ 
              border: '1px solid #bfdbfe', 
              borderRadius: '8px', 
              backgroundColor: '#eff6ff', 
              padding: '12px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
                  Part A: Administrative Hierarchy (6 Digits)
                </span>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '13px', 
                  fontWeight: 900, 
                  color: '#1e40af', 
                  backgroundColor: '#ffffff', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  border: '1px solid #bfdbfe'
                }}>
                  {result ? result.partAAdminPrefix : 'MH27B4'}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#334155', lineHeight: 1.6 }}>
                <li>State Code (2): <strong>{plot.adminHierarchy.stateCode}</strong> ({plot.adminHierarchy.stateName})</li>
                <li>District Code (2): <strong>{plot.adminHierarchy.districtCode}</strong> ({plot.adminHierarchy.districtName})</li>
                <li>Sub-district / Taluka (1): <strong>{plot.adminHierarchy.talukaCode}</strong> ({plot.adminHierarchy.talukaName})</li>
                <li>Village Code (1): <strong>{plot.adminHierarchy.villageCode}</strong> ({plot.adminHierarchy.villageName})</li>
              </ul>
            </div>

            {/* Part B Box */}
            <div style={{ 
              border: '1px solid #bbf7d0', 
              borderRadius: '8px', 
              backgroundColor: '#f0fdf4', 
              padding: '12px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                  Part B: Spatial Identifier (8 Digits)
                </span>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '13px', 
                  fontWeight: 900, 
                  color: '#166534', 
                  backgroundColor: '#ffffff', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  border: '1px solid #bbf7d0'
                }}>
                  {result ? result.partBSpatialCode : 'X79K2N1P'}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#334155', lineHeight: 1.6 }}>
                <li>ECCMA & OGC Global Mapping Standard</li>
                <li>Centroid coordinates rounded to 6 decimal places</li>
                <li><strong>Base-14 Alpha-numeric Compression</strong> transforms coordinate values into short, unrepeatable text</li>
              </ul>
            </div>
          </div>
        </div>

        {/* STEP 3: Stamping and Final Generation */}
        <div 
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            padding: '14px 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: '#16a34a', 
                color: '#ffffff', 
                fontSize: '12px', 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </div>
              <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                Step 3: Stamping & Central RoR Integration
              </h5>
            </div>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
              Live Digital Stamping
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            fontFamily: 'monospace',
            fontSize: '14px',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#1e40af', fontWeight: 700, backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>
              [{result ? result.partAAdminPrefix : 'MH27B4'}]
            </span>
            <span style={{ color: '#64748b', fontWeight: 900 }}>+</span>
            <span style={{ color: '#166534', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '3px 8px', borderRadius: '4px' }}>
              [{result ? result.partBSpatialCode : 'X79K2N1P'}]
            </span>
            <span style={{ color: '#64748b', fontWeight: 900 }}>=</span>
            <span style={{ 
              color: '#0f172a', 
              fontWeight: 900, 
              fontSize: '18px', 
              letterSpacing: '2px', 
              backgroundColor: '#fef08a', 
              padding: '4px 12px', 
              borderRadius: '6px',
              border: '1px solid #facc15'
            }}>
              {result ? result.ulpin14 : 'MH27B4X79K2N1P'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '11.5px', color: '#475569' }}>
            <span>• Saved directly into the State Central Cadastral Database</span>
            <span>• Stamped at the top of the official 7/12 Extract as permanent identifier</span>
          </div>
        </div>

      </div>
    </div>
  );
};

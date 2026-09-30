import React from 'react';
import { Building2, Layers, MapPin, CheckCircle2, ShieldCheck, Box, Info } from 'lucide-react';

interface SectionFinalPropertyIdentityProps {
  buildingName?: string;
  floorLabel?: string;
  unitLabel?: string;
  spatialUnitId?: string;
  coordX?: string;
  coordY?: string;
  coordZ?: string;
  areaStr?: string;
  surveyStatus?: string;
  validationStatus?: string;
}

export const SectionFinalPropertyIdentity: React.FC<SectionFinalPropertyIdentityProps> = ({
  buildingName = 'Pralhad P. Chhabria Research Center (PPCRC - Building 0089)',
  floorLabel = 'Level 1 (Ground Atrium Floor 01)',
  unitLabel = 'Unit A-101 / A-119 (High-Performance Computing Research Lab)',
  spatialUnitId = '0089-01-01-101',
  coordX = '73.856744° E (UTM 43N: 379412.8 m E)',
  coordY = '18.520430° N (UTM 43N: 2048190.2 m N)',
  coordZ = '568.20 m MSL (Ceiling: 571.60 m MSL)',
  areaStr = '68.50 m² / 737.3 sq.ft (Volume: 232.9 m³)',
  surveyStatus = 'Field Verified (DGPS RTK Fixed, ±0.012m accuracy)',
  validationStatus = 'Passed 6/6 Geospatial Standards'
}) => {
  return (
    <section id="section-final-identity" style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px 24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header bar */}
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
            backgroundColor: '#0f2a4a',
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
            3D PROPERTY SPACE READY
          </h2>
          <span style={{
            fontSize: '11px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 700,
            marginLeft: '6px'
          }}>
            Spatial Boundary Established
          </span>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <CheckCircle2 size={14} color="#1d4ed8" />
          <span>✓ 3D spatial unit ready for report generation</span>
        </div>
      </div>

      {/* Grid of 10 Required Attributes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* 1. Building */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Building
          </span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', marginTop: '2px' }}>
            {buildingName}
          </div>
        </div>

        {/* 2. Floor */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Floor
          </span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', marginTop: '2px' }}>
            {floorLabel}
          </div>
        </div>

        {/* 3. Apartment / Unit */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Apartment / Unit
          </span>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>
            {unitLabel}
          </div>
        </div>

        {/* 4. Spatial Unit ID */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Spatial Unit ID
          </span>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f2a4a', fontFamily: 'monospace', marginTop: '2px' }}>
            {spatialUnitId}
          </div>
        </div>

        {/* 5. X */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            X (Longitude / Easting)
          </span>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0f2a4a', fontFamily: 'monospace', marginTop: '2px' }}>
            {coordX}
          </div>
        </div>

        {/* 6. Y */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Y (Latitude / Northing)
          </span>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0f2a4a', fontFamily: 'monospace', marginTop: '2px' }}>
            {coordY}
          </div>
        </div>

        {/* 7. Z */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Z (MSL Datum Height)
          </span>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0f2a4a', fontFamily: 'monospace', marginTop: '2px' }}>
            {coordZ}
          </div>
        </div>

        {/* 8. Area */}
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Area & Volume
          </span>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0f2a4a', marginTop: '2px' }}>
            {areaStr}
          </div>
        </div>
      </div>

      {/* Footer Status Indicators & ULPIN Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        backgroundColor: '#f1f5f9',
        borderRadius: '6px',
        fontSize: '11.5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Survey Status: </span>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>{surveyStatus}</span>
          </div>
          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Validation Status: </span>
            <span style={{ color: '#0284c7', fontWeight: 700 }}>{validationStatus}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>
          <Info size={13} color="#64748b" />
          <span>Note: Authoritative ULPIN is generated only following Bhu-Naksha submission.</span>
        </div>
      </div>
    </section>
  );
};

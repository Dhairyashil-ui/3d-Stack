import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface ValidationItem {
  id: string;
  name: string;
  status: 'VALID' | 'WARNING';
  reason?: string;
  detail: string;
}

interface SectionValidationProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const SectionValidation: React.FC<SectionValidationProps> = ({ onValidationChange }) => {
  const [testFailureMode, setTestFailureMode] = useState<boolean>(false);

  // Exact validation items specified in requirements
  const validationItems: ValidationItem[] = [
    {
      id: 'v-geom',
      name: 'Geometry',
      status: testFailureMode ? 'WARNING' : 'VALID',
      reason: testFailureMode ? 'Self-intersecting face detected at stairwell vertex V-14' : undefined,
      detail: 'Closed 2-manifold solid, non-self-intersecting, zero non-planar skew'
    },
    {
      id: 'v-topo',
      name: 'Topology',
      status: 'VALID',
      detail: 'Shared face planar adjacency confirmed, zero volume intersection with adjacent units'
    },
    {
      id: 'v-crs',
      name: 'Coordinate Reference',
      status: 'VALID',
      detail: 'EPSG:4326 (WGS 84) / UTM Zone 43N, MSL elevation datum 568.20m calibrated'
    },
    {
      id: 'v-parcel',
      name: 'Parcel Relationship',
      status: 'VALID',
      detail: '100% building footprint contained within Cadastral Plot B-7 boundary polygon'
    },
    {
      id: 'v-coverage',
      name: 'Survey Coverage',
      status: 'VALID',
      detail: 'LiDAR point density 82 pts/m², drone GSD 0.035m, RTK DGPS PDOP 0.82'
    },
    {
      id: 'v-record',
      name: 'Property Record',
      status: 'VALID',
      detail: 'Khata No. KH-8841/2026, PMRDA registered cadastral leasehold deed confirmed'
    }
  ];

  return (
    <section id="section-validation" style={{
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
        marginBottom: '14px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '4px',
            height: '18px',
            backgroundColor: '#16a34a', // Green
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
            3D PROPERTY VALIDATION
          </h2>
          <span style={{
            fontSize: '11px',
            backgroundColor: testFailureMode ? '#fef3c7' : '#ecfdf5',
            color: testFailureMode ? '#b45309' : '#15803d',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 700,
            marginLeft: '6px'
          }}>
            {testFailureMode ? '5/6 Valid (1 Needs Correction)' : '6/6 Checkpoints Verified'}
          </span>
        </div>

        {/* Interactive toggle to test failure handling */}
        <button
          onClick={() => setTestFailureMode(!testFailureMode)}
          style={{
            fontSize: '11px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '3px 8px',
            cursor: 'pointer',
            color: '#475569'
          }}
        >
          {testFailureMode ? 'Restore All Valid' : 'Simulate Geometry Anomaly'}
        </button>
      </div>

      {/* Validation Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {validationItems.map(item => {
          const isWarning = item.status === 'WARNING';
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: isWarning ? '#fffbeb' : '#f8fafc',
                border: isWarning ? '1px solid #fde68a' : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f2a4a' }}>
                  {item.name}
                </span>
                {isWarning ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#d97706',
                    fontWeight: 700,
                    fontSize: '11.5px'
                  }}>
                    <AlertTriangle size={13} color="#d97706" />
                    ⚠ Needs correction
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#16a34a',
                    fontWeight: 700,
                    fontSize: '11.5px'
                  }}>
                    <CheckCircle2 size={13} color="#16a34a" />
                    ✓ Valid
                  </span>
                )}
              </div>

              {isWarning ? (
                <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
                  Reason: {item.reason}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

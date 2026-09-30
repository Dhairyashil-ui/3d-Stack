import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Printer,
  Download,
  Eye,
  ShieldCheck,
  Building2,
  MapPin,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PreconditionCheck {
  id: string;
  label: string;
  isMet: boolean;
}

interface SectionGenerateReportProps {
  onReportGenerated?: (reportId: string) => void;
  surveyUnitCode?: string;
  aoiName?: string;
  assignedTeamName?: string;
}

export const SectionGenerateReport: React.FC<SectionGenerateReportProps> = ({
  onReportGenerated,
  surveyUnitCode = 'SU-HINJ-01 (348671)',
  aoiName = 'Hinjawadi Phase 1, PMRDA Pune, Maharashtra',
  assignedTeamName = 'PMRDA Cadastral Survey Team 01'
}) => {
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Exact 7 preconditions required
  const preconditions: PreconditionCheck[] = [
    { id: 'p-1', label: 'Survey data processed', isMet: true },
    { id: 'p-2', label: 'Point clouds generated', isMet: true },
    { id: 'p-3', label: 'Point clouds fused', isMet: true },
    { id: 'p-4', label: 'Property segmented', isMet: true },
    { id: 'p-5', label: 'Record matched', isMet: true },
    { id: 'p-6', label: '3D spatial unit created', isMet: true },
    { id: 'p-7', label: 'Validation completed', isMet: true }
  ];

  const allMet = preconditions.every(p => p.isMet);

  const reportId = 'REP-PMRDA-2026-SU01-3D-9481';
  const integrityHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleGenerate = () => {
    if (!allMet) return;
    setIsReportGenerated(true);
    setIsReportOpen(true);
    if (onReportGenerated) {
      onReportGenerated(reportId);
    }
  };

  return (
    <section id="section-generate-report" style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px 24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Preconditions Checklist Bar */}
      <div style={{
        marginBottom: '16px',
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px'
        }}>
          Preconditions for Final Survey Report
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          fontSize: '11.5px'
        }}>
          {preconditions.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600 }}>
              <CheckCircle2 size={14} color="#16a34a" />
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Button & Status Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          {isReportGenerated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#10b981" />
                REPORT GENERATED
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0284c7' }}>
                ✓ Ready for Bhu-Naksha submission
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              All 7 verification milestones complete. Click to compile official survey dossier.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isReportGenerated && (
            <button
              onClick={() => setIsReportOpen(!isReportOpen)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0f2a4a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Eye size={15} color="#0284c7" />
              {isReportOpen ? 'Hide Structured Report' : 'Inspect Structured Report'}
            </button>
          )}

          {/* Large Primary Button */}
          <button
            onClick={handleGenerate}
            disabled={!allMet}
            style={{
              backgroundColor: allMet ? '#0f2a4a' : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              cursor: allMet ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: allMet ? '0 2px 6px rgba(15, 42, 74, 0.25)' : 'none',
              transition: 'background-color 0.15s ease'
            }}
          >
            <FileText size={16} color="#ffffff" />
            GENERATE FINAL SURVEY REPORT
          </button>
        </div>
      </div>

      {/* Structured Final Survey Report Modal / Expandable View */}
      {isReportGenerated && isReportOpen && (
        <div style={{
          marginTop: '20px',
          border: '1.5px solid #0f2a4a',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }}>
          {/* Government Document Header */}
          <div style={{
            backgroundColor: '#0f2a4a',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.8px' }}>
                GOVERNMENT OF INDIA • MINISTRY OF RURAL DEVELOPMENT • PMRDA PUNE
              </div>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: 800 }}>
                FINAL VERIFIED SURVEY & 3D PROPERTY RECONSTRUCTION DOSSIER
              </h3>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', fontFamily: 'monospace' }}>
              <div>Report ID: {reportId}</div>
              <div style={{ color: '#94a3b8' }}>Date: 21 Sep 2026, 16:00 IST</div>
            </div>
          </div>

          {/* 15 Structured Report Sections */}
          <div style={{ padding: '20px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>1. Survey Unit</label>
                <div style={{ fontWeight: 700, color: '#0f2a4a' }}>{surveyUnitCode}</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>2. AOI</label>
                <div style={{ fontWeight: 700, color: '#0f2a4a' }}>{aoiName}</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>3. Survey Team</label>
                <div style={{ fontWeight: 700, color: '#0f2a4a' }}>{assignedTeamName} (Lead: Er. Rajeshwar Deshmukh)</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>4. Source Data</label>
                <div style={{ color: '#0f2a4a' }}>5 Packages Ingested (ORI .tbk, LiDAR .laz, Parcel .gdb, RTK .csv, BIM IFC)</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>5. Processing Summary</label>
                <div style={{ color: '#0f2a4a' }}>37.2M Multi-sensor points co-registered (RMSE ±0.008m)</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>6. Photogrammetry Result</label>
                <div style={{ color: '#0f2a4a' }}>0.035m GSD, 418 aerial frames orthorectified</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>7. LiDAR Result</label>
                <div style={{ color: '#0f2a4a' }}>82 pts/m², classified ground datum 568.20m MSL</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>8. Fused Point Cloud</label>
                <div style={{ color: '#0f2a4a' }}>Unified XYZ Coordinate Cloud (EPSG:4326 UTM 43N)</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>9. 3D Property</label>
                <div style={{ color: '#0f2a4a' }}>PPCRC Building G+5, 18.50m total height, 6,029 m² built-up</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>10. Spatial Unit</label>
                <div style={{ color: '#0284c7', fontWeight: 700 }}>Unit 0089-01-01-101 (68.50 m² HPC Lab)</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>11. GIS Relationship</label>
                <div style={{ color: '#0f2a4a' }}>Cadastral Plot B-7 (Survey No. 88), Mulshi, Pune</div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>12. Validation Results</label>
                <div style={{ color: '#16a34a', fontWeight: 700 }}>✓ All 6 Geometry & Topology Checks Passed</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>13. Coordinates</label>
                <div style={{ fontFamily: 'monospace', color: '#0f2a4a' }}>
                  Lat: 18.520430° N • Lng: 73.856744° E • Elevation: 568.20m MSL
                </div>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>14. Metadata</label>
                <div style={{ color: '#0f2a4a' }}>ISO 19115 Geospatial Metadata • DILRMP 2026 Compliant</div>
              </div>
            </div>

            {/* 15. Integrity Hash */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                15. Cryptographic Integrity Hash (SHA-256)
              </label>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0f2a4a', wordBreak: 'break-all', marginTop: '2px' }}>
                {integrityHash}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '12px'
            }}>
              <button
                onClick={() => window.print()}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={13} />
                Print Dossier
              </button>
              <button
                onClick={() => alert(`Official Survey Dossier ${reportId} exported for Bhu-Naksha transmission.`)}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={13} />
                Export Survey Package
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

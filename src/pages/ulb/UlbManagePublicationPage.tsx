import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  FileCheck, 
  FileSpreadsheet, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Download, 
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Award
} from 'lucide-react';
import { PpcrcPipelineService, PpcrcPipelineState } from '../../services/ppcrcPipelineService';
import { PRECONFIGURED_CADASTRAL_PLOTS, generateUlpinForPlot } from '../../utils/ulpinEngine';
import { downloadOfficialRorPdf } from '../../utils/downloadRorPdf';

export const UlbManagePublicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineState, setPipelineState] = useState<PpcrcPipelineState>(PpcrcPipelineService.getState());
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Sync state on focus or event
  useEffect(() => {
    const handleUpdate = () => {
      setPipelineState(PpcrcPipelineService.getState());
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Primary plot: PPCRC Building
  const ppcrcPlot = PRECONFIGURED_CADASTRAL_PLOTS[0];

  const [isSentToBhunaksha, setIsSentToBhunaksha] = useState(
    pipelineState.stage === 'ULB_SUBMITTED_TO_BHUNAKSHA' ||
    pipelineState.stage === 'BHUNAKSHA_ULPIN_ASSIGNED' ||
    pipelineState.stage === 'PROPERTY_CARD_GENERATED'
  );

  // Submit to BhuNaksha handler (Does not redirect; just indicates sent)
  const handleSubmitToBhunaksha = () => {
    const updated = PpcrcPipelineService.forwardToBhunaksha();
    setPipelineState(updated);
    setIsSentToBhunaksha(true);
  };

  // Generate & Download Property Card PDF handler
  const handleGeneratePropertyCard = async () => {
    setIsDownloadingPdf(true);
    try {
      const pdfUrl = '/PPCRC_3D_Urban_Property_Card_UPC_22Sep2026.pdf';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'PPCRC_3D_Urban_Property_Card_UPC_22Sep2026.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.open(pdfUrl, '_blank');
      PpcrcPipelineService.markPropertyCardGenerated();
    } catch (e) {
      console.error('Error generating Property Card PDF:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Reset demo pipeline
  const handleResetDemo = () => {
    const reset = PpcrcPipelineService.resetPipeline();
    setPipelineState(reset);
  };

  const isPropertyCardAssigned = pipelineState.status === 'PROPERTY_CARD_ASSIGNED';

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', cursor: 'pointer' }} onClick={() => navigate('/ulb/dashboard')}>Home</span>
        <span>›</span>
        <span>Urban Survey Activities</span>
        <span>›</span>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>Manage Publication</span>
      </div>

      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Manage Urban Survey Publication
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Authority: Pune Metropolitan Region Development Authority (PMRDA) • SU-HINJ-01 Cadastral Ward
          </p>
        </div>

        {/* Demo reset control */}
        <button
          onClick={handleResetDemo}
          title="Reset pipeline state to start over"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={13} />
          <span>Reset Pipeline Demo</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.5fr 2fr 1.5fr auto auto',
          gap: '14px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              District
            </label>
            <input
              type="text"
              readOnly
              value="Pune (27)"
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Urban Local Body (ULB)
            </label>
            <input
              type="text"
              readOnly
              value="PMRDA Pune - 270410"
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Ward / Village / Colony
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff', fontWeight: 600 }}
            >
              <option value="All">Ward 12 - Hinjawadi Phase 1 (Infotech Park)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Survey Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff', fontWeight: 600 }}
            >
              <option value="All">Survey Unit 1 (SU-HINJ-01)</option>
            </select>
          </div>

          <button
            style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 24px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Search
          </button>

          <button
            onClick={() => { setSelectedWard('All'); setSelectedUnit('All'); }}
            style={{
              backgroundColor: '#cbd5e1',
              color: '#334155',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Sent to BhuNaksha Notification Banner */}
      {isSentToBhunaksha && !isPropertyCardAssigned && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #6ee7b7',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#065f46' }}>
              Sent to BhuNaksha Portal!
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
              Ground-truthing records, 3D building model, and boundary coordinates for Plot P-14/1 have been sent to BhuNaksha for 14-digit ULPIN stamping.
            </div>
          </div>
        </div>
      )}

      {/* PUBLICATION REGISTRY TABLE - PPCRC BUILDING SPECIFIC (Old dummy data completely removed) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Table Top Context Banner */}
        <div style={{
          padding: '12px 18px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="#1b539c" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
              Authoritative Cadastral Survey Unit Register — SU-HINJ-01
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            Ground Rover Verified • WGS84 Georeferenced
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e40af', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Plot & Structure</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Village & Survey Unit</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Survey/Gat</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Total Area</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Verified Sign</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Case Number</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
                {/* 1. Plot & Structure */}
                <td style={{ padding: '16px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e40af',
                      flexShrink: 0
                    }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>
                        Plot P-14/1 — PPCRC Building
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                        Pralhad P. Chhabria Research Center (I²IT Campus)
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#0369a1', marginTop: '2px', fontWeight: 600 }}>
                        G+4 Floors • Advanced HPC Supercomputing Lab A-101
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Village & Survey Unit */}
                <td style={{ padding: '16px 14px' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>
                    Hinjawadi Phase 1
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#1b539c', fontWeight: 600, marginTop: '2px' }}>
                    Survey Unit 1 (SU-HINJ-01)
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                    Mulshi Taluka, Pune
                  </div>
                </td>

                {/* 3. Survey / Gat */}
                <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                  <span style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    backgroundColor: '#f1f5f9', 
                    padding: '3px 8px', 
                    borderRadius: '4px' 
                  }}>
                    42/1
                  </span>
                </td>

                {/* 4. Total Area */}
                <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>
                    1.425 Ha
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    (14,250.75 m²)
                  </div>
                </td>

                {/* 5. VERIFIED SIGN OF THAT PLOT (As explicitly required) */}
                <td style={{ padding: '16px 14px' }}>
                  <div style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: '3px',
                    padding: '6px 10px',
                    backgroundColor: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#15803d', fontWeight: 800, fontSize: '11.5px' }}>
                      <CheckCircle2 size={15} color="#15803d" />
                      <span>✓ VERIFIED SIGN OF PLOT</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#334155' }}>
                      Chief Surveyor: {pipelineState.verifiedOfficer}
                    </span>
                    <span style={{ fontSize: '9.5px', color: '#64748b' }}>
                      Endorsement Reg: {pipelineState.surveyorReg}
                    </span>
                  </div>
                </td>

                {/* 6. Case Number */}
                <td style={{ padding: '16px 14px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
                    PMRDA/HINJ/2026/P-14-1
                  </span>
                </td>

                {/* 7. STATUS */}
                <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                  {isPropertyCardAssigned ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid #86efac'
                      }}>
                        <Award size={13} />
                        <span>Property Card Assigned</span>
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                        2D: {pipelineState.ulpin2D || '27250401420089'}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '10.5px', fontWeight: 700, color: '#0369a1' }}>
                        3D: {pipelineState.ulpin3D || '0089-01-01-101'}
                      </span>
                    </div>
                  ) : isSentToBhunaksha ? (
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: '1px solid #bfdbfe'
                    }}>
                      Sent to BhuNaksha (Stamping)
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: '1px solid #bfdbfe'
                    }}>
                      Verified - Ready for ULPIN
                    </span>
                  )}
                </td>

                {/* 8. ACTION BUTTON (SUBMIT TO BHUNAKSHA OR VIEW PROPERTY CARD PDF) */}
                <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                  {isPropertyCardAssigned ? (
                    /* When sent to ULB, status is Property Card Assigned -> Generate Property Card button */
                    <button
                      onClick={handleGeneratePropertyCard}
                      disabled={isDownloadingPdf}
                      style={{
                        backgroundColor: '#15803d',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '9px 18px',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: isDownloadingPdf ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(21, 128, 61, 0.3)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Download size={15} />
                      <span>{isDownloadingPdf ? 'Generating Property Card...' : 'Generate Property Card (PDF)'}</span>
                    </button>
                  ) : isSentToBhunaksha ? (
                    /* After clicking Submit to BhuNaksha, do not redirect, just tell sent */
                    <div
                      style={{
                        backgroundColor: '#ecfdf5',
                        border: '1.5px solid #34d399',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#065f46',
                        fontSize: '12px',
                        fontWeight: 800
                      }}
                    >
                      <CheckCircle2 size={15} color="#059669" />
                      <span>✓ Sent to BhuNaksha</span>
                    </div>
                  ) : (
                    /* Initial state: Submit button to send details to BhuNaksha */
                    <button
                      onClick={handleSubmitToBhunaksha}
                      style={{
                        backgroundColor: '#1b539c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 18px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(27, 83, 156, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Send size={13} />
                      <span>Submit to BhuNaksha →</span>
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Summary Strip */}
        <div style={{
          padding: '12px 18px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span>Target Property: <strong>Pralhad P. Chhabria Research Center (PPCRC / I²IT)</strong></span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>Plot: <strong>P-14/1</strong></span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>Centroid: <strong>18.520430° N, 73.856744° E</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: isPropertyCardAssigned ? '#15803d' : '#0369a1', fontWeight: 700 }}>
              {isPropertyCardAssigned 
                ? '✓ 14-Digit ULPIN Stamped on Property Card' 
                : '1 Plot Verified — Ready for BhuNaksha'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

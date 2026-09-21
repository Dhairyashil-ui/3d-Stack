import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import {
  PpcrcPipelineService,
  PpcrcPipelineState,
  DEFAULT_OFFLINE_CHECKPOINTS,
  OfflineCheckpoint
} from '../../services/ppcrcPipelineService';
import {
  Users,
  Building2,
  FileCheck2,
  CheckCircle2,
  CheckSquare,
  Square,
  Send,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Box,
  Layers,
  ChevronRight,
  Phone,
  Sparkles,
  Eye,
  Activity
} from 'lucide-react';

export const MapImageVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineState, setPipelineState] = useState<PpcrcPipelineState>(PpcrcPipelineService.getState());
  const [checkpoints, setCheckpoints] = useState<OfflineCheckpoint[]>(
    pipelineState.offlineCheckpoints || DEFAULT_OFFLINE_CHECKPOINTS
  );
  const [isSubmittingToUlb, setIsSubmittingToUlb] = useState(false);
  const [submittedToUlb, setSubmittedToUlb] = useState(
    pipelineState.stage === 'SURVEYOR_VERIFIED' ||
    pipelineState.stage === 'ULB_SUBMITTED_TO_BHUNAKSHA' ||
    pipelineState.stage === 'BHUNAKSHA_ULPIN_ASSIGNED'
  );

  useEffect(() => {
    const handleUpdate = () => {
      const state = PpcrcPipelineService.getState();
      setPipelineState(state);
      setCheckpoints(state.offlineCheckpoints || DEFAULT_OFFLINE_CHECKPOINTS);
      if (
        state.stage === 'SURVEYOR_VERIFIED' ||
        state.stage === 'ULB_SUBMITTED_TO_BHUNAKSHA' ||
        state.stage === 'BHUNAKSHA_ULPIN_ASSIGNED'
      ) {
        setSubmittedToUlb(true);
      }
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  // Toggle single checkpoint
  const toggleCheckpoint = (id: string) => {
    setCheckpoints(prev =>
      prev.map(chk => (chk.id === id ? { ...chk, verified: !chk.verified } : chk))
    );
  };

  // Toggle all checkpoints
  const handleVerifyAll = () => {
    setCheckpoints(prev => prev.map(chk => ({ ...chk, verified: true })));
  };

  // Submit to ULB (Manage Publication)
  const handleSubmitToUlb = () => {
    setIsSubmittingToUlb(true);
    setTimeout(() => {
      PpcrcPipelineService.submitSurveyorVerification(checkpoints);
      setIsSubmittingToUlb(false);
      setSubmittedToUlb(true);
    }, 600);
  };

  const allVerified = checkpoints.every(c => c.verified);
  const verifiedCount = checkpoints.filter(c => c.verified).length;

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        items={[
          { label: 'Home', link: '/surveyor/home' },
          { label: 'Survey Activities', link: '/surveyor/survey-activities' },
          { label: 'Offline Ground-Truthing & Verification' }
        ]}
      />

      {/* 2. HEADER MISSION BANNER */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#1e40af',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Survey Activities: PPCRC Building Field Ground-Truthing
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                MISSION ACTIVE
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
              Target: <strong>Pralhad P. Chhabria Research Center (PPCRC)</strong> • Plot B-7 / Survey No. 88, Hinjawadi Phase 1, Pune
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/surveyor/three-d-viewer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#f8fafc',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Eye size={14} />
            <span>Open 3D Digital Twin Viewer</span>
          </button>
        </div>
      </div>

      {/* 3. SECTION 1: ASSIGNED TEAM DETAILS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#1b539c" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
              1. Assigned Survey Team Details (from ULB Admin)
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
            Lead Officer: Er. Rajeshwar D. Deshmukh
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {pipelineState.surveyTeam.map(member => (
            <div
              key={member.id}
              style={{
                backgroundColor: member.isMainOfficer ? '#f0fdf4' : '#f8fafc',
                border: member.isMainOfficer ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                  {member.name}
                </span>
                {member.isMainOfficer && (
                  <span
                    style={{
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Main Officer
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11.5px', color: '#1e40af', fontWeight: 600 }}>
                {member.role}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Reg: {member.licenseOrReg} • {member.contact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION 2: RECEIVED FILES DETAILS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={18} color="#1b539c" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
              2. Received Package Files for PPCRC Building (Ready for Ground Truthing)
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            All 4 Packages Ingested & Calibrated
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {pipelineState.desktopPackages.map(pkg => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>
                  {pkg.name}
                </span>
                <code style={{ fontSize: '11px', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '1px 6px', borderRadius: '4px' }}>
                  {pkg.extension}
                </code>
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', fontFamily: 'monospace' }}>
                {pkg.fileName}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Size: {pkg.fileSize}</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Verified Ingest</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SECTION 3: CHECKPOINTS FOR OFFLINE VERIFICATIONS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #cbd5e1',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              3. Mandatory Checkpoints for Offline Ground-Truthing
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b' }}>
              Field Surveyor Er. Rajeshwar D. Deshmukh must certify all 5 inspection points against physical site conditions.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: allVerified ? '#15803d' : '#d97706' }}>
              {verifiedCount} of 5 Checkpoints Certified
            </span>
            {!allVerified && (
              <button
                onClick={handleVerifyAll}
                style={{
                  padding: '7px 14px',
                  backgroundColor: '#f1f5f9',
                  color: '#1e40af',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Certify All Checkpoints
              </button>
            )}
          </div>
        </div>

        {/* Checkbox List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {checkpoints.map((chk) => (
            <div
              key={chk.id}
              onClick={() => toggleCheckpoint(chk.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 18px',
                backgroundColor: chk.verified ? '#f0fdf4' : '#ffffff',
                border: chk.verified ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ marginTop: '2px', color: chk.verified ? '#16a34a' : '#94a3b8' }}>
                {chk.verified ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {chk.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '3px', lineHeight: '1.4' }}>
                  {chk.description}
                </div>
                <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '4px', fontWeight: 600 }}>
                  Standard Compliance: {chk.standard}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D BUILDING FILE & TRANSMISSION SECTION */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box size={22} color="#0284c7" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                3D Building Digital Twin Model: <code>final_full_building.glb</code> (7.56 MB)
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                RCC G+5 Floors • 45 Research Units • Room A-119 HPC Lab • Centroid 18.520430, 73.856744
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitToUlb}
            disabled={!allVerified || isSubmittingToUlb}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: allVerified ? '#16a34a' : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: allVerified && !isSubmittingToUlb ? 'pointer' : 'not-allowed',
              boxShadow: allVerified ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={16} />
            <span>
              {isSubmittingToUlb ? 'Transmitting to ULB...' : 'Submit to ULB (Manage Publication) →'}
            </span>
          </button>
        </div>

        {/* SUCCESS CONFIRMATION MODAL / BANNER */}
        {submittedToUlb && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #34d399',
              borderRadius: '8px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="#059669" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#065f46' }}>
                  Ground-Truthing & 3D Building Successfully Submitted to ULB!
                </div>
                <div style={{ fontSize: '12.5px', color: '#047857' }}>
                  Results of the 5 offline checkpoints and 3D digital model are now verified and sealed for PMRDA Urban Survey Publication.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

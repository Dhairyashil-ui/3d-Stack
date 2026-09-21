import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Play,
  Send,
  ChevronRight,
  HardDrive,
  FileCheck,
  Clock,
  Sparkles,
  Layers,
  Box
} from 'lucide-react';
import {
  PpcrcPipelineService,
  DEFAULT_DESKTOP_PACKAGES,
  DesktopPackageItem
} from '../../services/ppcrcPipelineService';

export const DesktopAppPage: React.FC = () => {
  const navigate = useNavigate();

  // Fresh unverified state on mount/refresh as requested by user
  const [packages, setPackages] = useState<DesktopPackageItem[]>(() =>
    DEFAULT_DESKTOP_PACKAGES.map(p => ({
      ...p,
      verified: false,
      verifiedTimestamp: undefined
    }))
  );

  const [activeVerifyingIndex, setActiveVerifyingIndex] = useState<number | null>(null);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const [submittedToUlb, setSubmittedToUlb] = useState(false);
  const [receipt, setReceipt] = useState<{ txId: string; timestamp: string } | null>(null);

  // Sequential one-by-one verification starter
  const handleStartSequentialVerification = () => {
    setIsAutoVerifying(true);
    let currentIndex = 0;

    const runNext = () => {
      if (currentIndex >= packages.length) {
        setIsAutoVerifying(false);
        setActiveVerifyingIndex(null);
        return;
      }

      setActiveVerifyingIndex(currentIndex);

      setTimeout(() => {
        setPackages(prev =>
          prev.map((pkg, idx) =>
            idx === currentIndex
              ? {
                  ...pkg,
                  verified: true,
                  verifiedTimestamp: new Date().toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })
                }
              : pkg
          )
        );

        currentIndex++;
        runNext();
      }, 750);
    };

    runNext();
  };

  // Individual manual verification button per package
  const handleVerifySingle = (id: string, index: number) => {
    setActiveVerifyingIndex(index);
    setTimeout(() => {
      setPackages(prev =>
        prev.map(pkg =>
          pkg.id === id
            ? {
                ...pkg,
                verified: true,
                verifiedTimestamp: new Date().toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })
              }
            : pkg
        )
      );
      setActiveVerifyingIndex(null);
    }, 600);
  };

  // Manual reset cycle
  const handleResetCycle = () => {
    setPackages(
      DEFAULT_DESKTOP_PACKAGES.map(p => ({
        ...p,
        verified: false,
        verifiedTimestamp: undefined
      }))
    );
    setActiveVerifyingIndex(null);
    setIsAutoVerifying(false);
    setSubmittedToUlb(false);
    setReceipt(null);
  };

  // Submit to ULB Admin
  const handleSubmitToUlb = () => {
    PpcrcPipelineService.submitDesktopPackages(packages);
    setReceipt({
      txId: `PMRDA-DESK-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
    setSubmittedToUlb(true);
  };

  const verifiedCount = packages.filter(p => p.verified).length;
  const allVerified = verifiedCount === packages.length;
  const progressPercent = (verifiedCount / packages.length) * 100;

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
      {/* 1. TRICOLOR TOP STRIP (MATCHING GOVERNMENT PORTAL STANDARD) */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)' }} />

      {/* 2. OFFICIAL TOP BANNER */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '8px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#475569'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/assets/bharat-sarkar.svg"
              alt="National Emblem"
              style={{ height: '26px', width: 'auto' }}
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
              भारत सरकार | Government of India
            </span>
          </div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontWeight: 600 }}>Department of Land Resources (DoLR)</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ color: '#0369a1', fontWeight: 600 }}>NAKSHA Desktop Data Processing Center</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleResetCycle}
            title="Reset verification demo cycle"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '11px',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset Cycle</span>
          </button>
          <button
            onClick={() => navigate('/ulb/committee-formation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#e0f2fe',
              border: '1px solid #bae6fd',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '11px',
              color: '#0369a1',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>ULB Admin Panel</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* 3. MAIN HEADER BAR */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #1b539c',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              backgroundColor: '#1b539c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '20px'
            }}
          >
            3D
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                NAKSHA 3D Desktop Suite — Processing Center
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#1b539c',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}
              >
                PRO V2.0
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Pre-Processing Deliverables Ingest, Package Integrity Verification & ULB Transmission
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleStartSequentialVerification}
            disabled={isAutoVerifying || allVerified}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: allVerified ? '#15803d' : '#1b539c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: isAutoVerifying || allVerified ? 'default' : 'pointer',
              boxShadow: '0 2px 6px rgba(27, 83, 156, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {isAutoVerifying ? (
              <>
                <RotateCcw size={15} className="animate-spin" />
                <span>Verifying Package {activeVerifyingIndex !== null ? activeVerifyingIndex + 1 : ''} of 4...</span>
              </>
            ) : allVerified ? (
              <>
                <CheckCircle2 size={16} />
                <span>All 4 Packages Verified ✓</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>Start Package Verification Pipeline</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 4. TARGET PROPERTY IDENTITY CARD */}
      <div style={{ maxWidth: '1240px', width: '100%', margin: '20px auto 0', padding: '0 20px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#1b539c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  Target Property: Pralhad P. Chhabria Research Center (PPCRC)
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px' }}>
                  Survey No. 88, Plot B-7
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Hinjawadi Phase 1, Mulshi, Pune - 411057 • Jurisdiction: PMRDA Urban Cadastral Unit (SU-HINJ-01)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                VERIFICATION PROGRESS
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: allVerified ? '#15803d' : '#0284c7' }}>
                {verifiedCount} of 4 Packages Verified ({progressPercent.toFixed(0)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: allVerified ? '#16a34a' : '#0284c7',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* 5. MAIN CONTENT - EXACTLY THE 4 PACKAGES */}
      <main
        style={{
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Mandatory Deliverable Packages (4 Ingest Streams)
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Each package undergoes strict checksum, CRS transformation, and boundary topology verification.
            </p>
          </div>

          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Status:{' '}
            <strong style={{ color: allVerified ? '#15803d' : '#d97706' }}>
              {allVerified ? '✓ All 4 Packages Ready for ULB Dispatch' : 'Awaiting Full Pipeline Verification'}
            </strong>
          </div>
        </div>

        {/* THE 4 CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {packages.map((pkg, idx) => {
            const isCurrentlyChecking = activeVerifyingIndex === idx;

            return (
              <div
                key={pkg.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: pkg.verified
                    ? '1.5px solid #22c55e'
                    : isCurrentlyChecking
                    ? '1.5px solid #0284c7'
                    : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: pkg.verified
                    ? '0 3px 12px rgba(34, 197, 94, 0.1)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Card Header Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: '#f1f5f9',
                        color: '#1b539c',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      PACKAGE 0{idx + 1}
                    </span>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: pkg.verified
                          ? '#dcfce7'
                          : isCurrentlyChecking
                          ? '#e0f2fe'
                          : '#fef3c7',
                        color: pkg.verified
                          ? '#15803d'
                          : isCurrentlyChecking
                          ? '#0369a1'
                          : '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {pkg.verified ? (
                        <>
                          <Check size={12} />
                          <span>Verified ✓</span>
                        </>
                      ) : isCurrentlyChecking ? (
                        <>
                          <RotateCcw size={11} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Clock size={11} />
                          <span>Pending</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Format */}
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {pkg.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', marginBottom: '12px' }}>
                    File Extension: <code style={{ color: '#1b539c', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '1px 4px', borderRadius: '3px' }}>{pkg.extension}</code>
                  </div>

                  {/* File Metadata Box */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      fontSize: '11.5px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>File:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pkg.fileName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Size:</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{pkg.fileSize}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>CRS:</span>
                      <span style={{ fontWeight: 600, color: '#0284c7' }}>EPSG:4326</span>
                    </div>
                    {pkg.verified && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803d', fontWeight: 600, borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginTop: '2px' }}>
                        <span>Status:</span>
                        <span>Sealed at {pkg.verifiedTimestamp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Action Button */}
                <div>
                  <button
                    onClick={() => handleVerifySingle(pkg.id, idx)}
                    disabled={pkg.verified || isCurrentlyChecking || isAutoVerifying}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: pkg.verified
                        ? '#15803d'
                        : isCurrentlyChecking
                        ? '#0284c7'
                        : '#1b539c',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: pkg.verified || isCurrentlyChecking || isAutoVerifying ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isCurrentlyChecking ? (
                      <>
                        <RotateCcw size={13} className="animate-spin" />
                        <span>Verifying Package...</span>
                      </>
                    ) : pkg.verified ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Package Verified ✓</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        <span>Verify Package ({pkg.extension})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. SUBMISSION TO ULB ADMIN */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#0f172a' }}>
              Official Ingestion Dispatch: Submit to ULB Admin Panel
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
              {allVerified
                ? 'All 4 packages verified. Ready to transmit to Pune Metropolitan Region Development Authority (PMRDA).'
                : 'Click "Start Package Verification Pipeline" above to verify all 4 packages before submitting.'}
            </div>
          </div>

          <button
            onClick={handleSubmitToUlb}
            disabled={!allVerified || submittedToUlb}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              backgroundColor: submittedToUlb
                ? '#15803d'
                : allVerified
                ? '#16a34a'
                : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: allVerified && !submittedToUlb ? 'pointer' : 'default',
              boxShadow: allVerified && !submittedToUlb ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {submittedToUlb ? (
              <>
                <CheckCircle2 size={16} />
                <span>Submitted to ULB Admin ✓</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit Verified Packages to ULB Admin →</span>
              </>
            )}
          </button>
        </div>

        {/* 7. TRANSMISSION CONFIRMATION CARD */}
        {submittedToUlb && receipt && (
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '10px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              animation: 'fadeIn 0.2s ease',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="#15803d" />
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#14532d' }}>
                  Successfully Transmitted to ULB Admin Panel!
                </div>
                <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '2px' }}>
                  Ref: <strong>{receipt.txId}</strong> • Timestamp: {receipt.timestamp} • Target: PMRDA Pune
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/ulb/committee-formation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                backgroundColor: '#15803d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
              }}
            >
              <span>Proceed to ULB Package Reception & Survey Assignment</span>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

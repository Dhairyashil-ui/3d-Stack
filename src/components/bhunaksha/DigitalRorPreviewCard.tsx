import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  QrCode, 
  ExternalLink,
  Award,
  Sparkles,
  Building,
  CheckCircle2,
  Calendar,
  Hash
} from 'lucide-react';
import { CadastralPlot, UlpinComputationResult } from '../../utils/ulpinEngine';
import { downloadOfficialRorPdf } from '../../utils/downloadRorPdf';

interface DigitalRorPreviewCardProps {
  plot: CadastralPlot;
  ulpinResult: UlpinComputationResult | null;
  onGenerateClick: () => void;
  isGenerating: boolean;
}

export const DigitalRorPreviewCard: React.FC<DigitalRorPreviewCardProps> = ({
  plot,
  ulpinResult,
  onGenerateClick,
  isGenerating
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!ulpinResult) return;
    navigator.clipboard.writeText(ulpinResult.ulpin14);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!ulpinResult) return;
    downloadOfficialRorPdf(plot, ulpinResult);
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
          <FileText size={18} color="#1e40af" />
          <div>
            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
              Digital Record of Rights (Village Form VII-XII)
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              State Central Cadastral Server • Maharashtra Land Revenue Code §148A
            </span>
          </div>
        </div>

        {ulpinResult ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: copied ? '#16a34a' : '#475569',
                backgroundColor: copied ? '#f0fdf4' : '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied!' : 'Copy ULPIN'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#15803d',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(21, 128, 61, 0.2)'
              }}
            >
              <Download size={14} />
              <span>Download RoR (PDF)</span>
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '11.5px', color: '#dc2626', fontWeight: 600 }}>
            • Pending 1-Click Generation
          </span>
        )}
      </div>

      {/* Main Document Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Tricolor Bar */}
        <div style={{ display: 'flex', height: '3px', width: '100%', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ flex: 1, backgroundColor: '#ff9933' }} />
          <div style={{ flex: 1, backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }} />
          <div style={{ flex: 1, backgroundColor: '#138808' }} />
        </div>

        {/* STAMPED 14-DIGIT ULPIN HERO BANNER */}
        {ulpinResult ? (
          <div 
            style={{
              border: '2px solid #16a34a',
              borderRadius: '10px',
              backgroundColor: '#f0fdf4',
              padding: '16px',
              position: 'relative',
              boxShadow: '0 2px 10px rgba(22, 163, 74, 0.08)'
            }}
          >
            {/* Top Seal Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#15803d" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  PERMANENT 14-DIGIT BHU-AADHAAR (ULPIN)
                </span>
              </div>
              <span style={{ 
                fontSize: '10.5px', 
                fontWeight: 700, 
                color: '#ffffff', 
                backgroundColor: '#16a34a', 
                padding: '2px 8px', 
                borderRadius: '12px' 
              }}>
                OFFICIALLY STAMPED
              </span>
            </div>

            {/* Huge 14-Digit Code Box */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '10px 16px',
              marginTop: '4px'
            }}>
              <div>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '24px', 
                  fontWeight: 900, 
                  letterSpacing: '3px', 
                  color: '#0f172a' 
                }}>
                  {ulpinResult.ulpin14}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '12px' }}>
                  <span>Part A (Admin): <strong style={{ color: '#0284c7' }}>{ulpinResult.partAAdminPrefix}</strong></span>
                  <span>Part B (Spatial): <strong style={{ color: '#16a34a' }}>{ulpinResult.partBSpatialCode}</strong></span>
                </div>
              </div>

              {/* QR Representation */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '2px',
                padding: '6px 8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px'
              }}>
                <QrCode size={30} color="#0f172a" />
                <span style={{ fontSize: '8px', fontWeight: 600, color: '#64748b' }}>VERIFIED</span>
              </div>
            </div>

            {/* Metadata Footer */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginTop: '10px',
              fontSize: '11px',
              color: '#475569'
            }}>
              <span>
                Centroid: <strong style={{ color: '#0f172a' }}>{ulpinResult.centroidLatFormatted}° N, {ulpinResult.centroidLonFormatted}° E</strong>
              </span>
              <span>
                Hash: <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{ulpinResult.registryHash}</span>
              </span>
            </div>
          </div>
        ) : (
          /* Unstamped Placeholder CTA */
          <div 
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              backgroundColor: '#e0f2fe', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#0284c7'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                14-Digit ULPIN Not Yet Assigned
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', maxWidth: '420px' }}>
                Click below to calculate plot centroid coordinates, apply Part A & Part B international coding standards, and stamp this 7/12 extract in one click.
              </p>
            </div>
            <button
              onClick={onGenerateClick}
              disabled={isGenerating}
              style={{
                marginTop: '6px',
                padding: '10px 24px',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: isGenerating ? '#94a3b8' : '#1e40af',
                border: 'none',
                borderRadius: '8px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)'
              }}
            >
              <Sparkles size={16} />
              <span>{isGenerating ? 'Processing Cadastral Map...' : '⚡ Generate 14-Digit ULPIN in 1-Click'}</span>
            </button>
          </div>
        )}

        {/* Section 1: Geodetic & Cadastral Attributes */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#334155' }}>
            PARCEL & CADASTRAL SPECIFICATIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Survey / Gat</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{plot.surveyNumber}</div>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Hissa / Plot</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{plot.hissaNumber}</div>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Area</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{plot.areaHectares} Ha ({plot.areaSqm.toLocaleString()} m²)</div>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Land Classification</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{plot.category}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Khatadar / Ownership */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#334155' }}>
            KHATADAR (REGISTERED OWNER / OCCUPANT)
          </div>
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{plot.ownerName}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Khata Account: <strong>{plot.khataNumber}</strong> • Rights: <strong>Sole Freehold</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assessment</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>₹ 185.50 / year</div>
            </div>
          </div>
        </div>

        {/* Bottom Official Seal Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '11px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={14} color="#15803d" />
            <span>Authenticated by Revenue Divisional Officer (PMRDA Cadastre)</span>
          </div>
          <span>Digital India Land Records Modernization Programme (DILRMP)</span>
        </div>

      </div>
    </div>
  );
};

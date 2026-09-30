import React from 'react';
import { X, Download, ShieldCheck, Printer, CheckCircle2, QrCode, Building2, MapPin } from 'lucide-react';

interface UrbanPropertyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  ulpin?: string;
  unitName?: string;
  buildingName?: string;
  surveyorName?: string;
}

export const UrbanPropertyCardModal: React.FC<UrbanPropertyCardModalProps> = ({
  isOpen,
  onClose,
  ulpin = 'MH-27-0410-0088-0007-A302',
  unitName = 'Unit A-302 (Floor 03)',
  buildingName = 'Pralhad P. Chhabria Research Center (PCCRC)',
  surveyorName = 'Dhairyashil'
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#22c55e" />
            <span style={{ fontWeight: 800, fontSize: '13.5px' }}>
              Official 3D Cadastral Property Card (Akarnibandh / 3D Sanad)
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '2px 6px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tricolor Strip */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)' }} />

        {/* Scrollable Document Area */}
        <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #1b539c', paddingBottom: '14px', marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase' }}>
              Government of Maharashtra &bull; Revenue & Forest Department
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Pune Metropolitan Region Development Authority (PMRDA) &bull; Survey of India
            </div>
            <h3 style={{ margin: '8px 0 2px 0', fontSize: '18px', fontWeight: 900, color: '#1b539c', letterSpacing: '0.02em' }}>
              URBAN PROPERTY CARD (3D SPATIAL UNIT SANAD)
            </h3>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
              Form 1-C Under Section 20(2) of Maharashtra Land Revenue Code, 1966 & 3D Cadastre Rules
            </div>
          </div>

          {/* Key Reference Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>CARD ID</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>PR-PMRDA-2026-00302</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>ULPIN</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>{ulpin}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>DISTRICT / TALUKA</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Pune / Mulshi</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>STATUS</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>✓ Final E-Signed</div>
            </div>
          </div>

          {/* Spatial Attributes Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '18px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600, width: '38%' }}>Parent Cadastral Parcel:</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>Survey No. 88, Plot B-7, Hinjawadi Phase 1</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>Building Identification:</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>{buildingName}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>Floor & Spatial Unit:</td>
                <td style={{ padding: '8px 10px', fontWeight: 800, color: '#1d4ed8' }}>{unitName}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>3D Volumetric Bounds:</td>
                <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#334155' }}>
                  Z = 571.20m to 574.60m MSL (Storey Height: 3.4m)
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>Floor Carpet Area & Volume:</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#059669' }}>
                  84.2 sq. meters &bull; 112.5 cubic meters volume
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>Registered Property Holder:</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                  Smt. Radhika P. Chhabria / Co-owner: Dr. P. P. Chhabria (Demo Data)
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>Sub-Registrar Doc Ref:</td>
                <td style={{ padding: '8px 10px', color: '#475569' }}>
                  Haveli-Pune Doc #2026-8841-PUN &bull; Municipal Assessment #PMRDA-HINJ-2026-0302
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>Certifying Cadastral Officer:</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                  {surveyorName} (Lead Cadastral Surveyor, Survey of India / PMRDA)
                </td>
              </tr>
            </tbody>
          </table>

          {/* Attestation & QR Seal Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={24} color="#15803d" />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#14532d' }}>
                  Cryptographically Verified Digital Twin Record
                </div>
                <div style={{ fontSize: '11px', color: '#166534' }}>
                  Hash: SHA-256: d8a74e... &bull; Bhu-Naksha Digital Twin Link Active
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '9px', color: '#64748b' }}>
              <div style={{ border: '1px dashed #cbd5e1', padding: '4px', borderRadius: '4px', backgroundColor: '#ffffff' }}>
                [ QR Code: {ulpin} ]
              </div>
              <div style={{ marginTop: '2px' }}>Scan for Geo-Verification</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Generated via NAKSHA 2.0 3D Cadastral Digital Twin System
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              onClick={() => {
                alert('Property Card PDF download initiated: ' + ulpin + '.pdf');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#1b539c',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

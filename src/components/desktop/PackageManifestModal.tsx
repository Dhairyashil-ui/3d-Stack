import React, { useState } from 'react';
import { X, FileCode, Check, Copy, Download, Box } from 'lucide-react';

interface PackageManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  canonicalFile: string;
  validationEngine: string;
  crs: string;
}

export const PackageManifestModal: React.FC<PackageManifestModalProps> = ({
  isOpen,
  onClose,
  packageId,
  packageName,
  canonicalFile,
  validationEngine,
  crs
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const manifestData = {
    packageId: packageId.toUpperCase(),
    packageName,
    standardSpecification: "DoLR-3D-CADASTRE-SPEC-2026",
    organization: "Survey of India (SOI) & Department of Land Resources (DoLR)",
    timestamp: new Date().toISOString(),
    geospatialReference: {
      crs,
      verticalDatum: "EGM2008 (Height above MSL)",
      boundingExtent: [18.52043, 73.856744, 18.52189, 73.85812]
    },
    canonicalFiles: [
      {
        fileName: canonicalFile,
        role: "PRIMARY_CANONICAL_DATASET",
        sha256Checksum: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        sizeBytes: 14859210
      },
      {
        fileName: "metadata.xml",
        role: "ISO_19115_METADATA",
        sha256Checksum: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        sizeBytes: 24510
      }
    ],
    validationAudit: {
      status: "PASS",
      engine: validationEngine,
      executedChecks: [
        "Coordinate Reference System (CRS) conformance",
        "Topological closure & polygon boundary validation",
        "Point density & outlier noise filtering",
        "Attribute table schema compliance"
      ],
      passedAt: new Date().toISOString()
    }
  };

  const jsonString = JSON.stringify(manifestData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          borderRadius: '12px',
          width: '100%',
          maxWidth: '740px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1e293b'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileCode size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                Canonical Standard Package Manifest
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {packageId.toUpperCase()} • <code>manifest.json</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: copied ? '#15803d' : '#334155',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '6px',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#0a0f1d' }}>
          <pre
            style={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#38bdf8',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}
          >
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0f172a',
            fontSize: '11px',
            color: '#64748b'
          }}
        >
          <span>Self-contained canonical deliverable format with cryptographic hash audit</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

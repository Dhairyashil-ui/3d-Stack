import React from 'react';
import {
  X,
  Download,
  Monitor,
  HardDrive,
  Cpu,
  ShieldCheck,
  FileText,
  ExternalLink,
  CheckCircle2,
  FolderArchive,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DesktopDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopDownloadModal: React.FC<DesktopDownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #cbd5e1',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0a192f 0%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '22px 28px',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Monitor size={24} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd' }}>
                  Standalone Offline Utility
                </span>
                <span style={{ backgroundColor: '#22c55e', color: '#064e3b', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                  v2.4.0 (x64)
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0 0', color: '#ffffff' }}>
                NAKSHA 3D Desktop Workstation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Important Notice Callout */}
          <div
            style={{
              backgroundColor: '#f0f9ff',
              border: '1.5px solid #bae6fd',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              marginBottom: '22px'
            }}
          >
            <ShieldCheck size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12.5px', color: '#0369a1', lineHeight: '1.55' }}>
              <strong>NAKSHA 2.0 Native 3D Workstation:</strong> High-performance 64-bit client workstation engineered for GPU-accelerated volumetric 3D cadastral rendering, sub-centimeter RTK rover GNSS control, and local offline tile caching for seamless field and workstation operations.
            </div>
          </div>

          {/* Download Options Grid */}
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Download Package (Windows 64-bit)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {/* 1. Windows Setup Installer (.exe) */}
            <a
              href="/downloads/Naksha%202.0_2.0.0_x64-setup.exe"
              download="Naksha 2.0_2.0.0_x64-setup.exe"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #2563eb',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                    <Monitor size={20} color="#2563eb" />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px' }}>
                    Setup .EXE (2.8 MB)
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Windows Installer Setup
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Recommended installer with Desktop shortcut and Start Menu integration.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <Download size={14} />
                <span>Download Setup (.exe)</span>
              </div>
            </a>

            {/* 2. Standalone Portable .EXE */}
            <a
              href="/downloads/Naksha%202.0.exe"
              download="Naksha 2.0.exe"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '8px' }}>
                    <Zap size={20} color="#16a34a" />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px' }}>
                    Standalone (9.0 MB)
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Standalone Portable (.exe)
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Zero-installation executable. Double-click to launch the 3D workstation immediately.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <Download size={14} />
                <span>Download Portable .EXE</span>
              </div>
            </a>

            {/* 3. Windows MSI Package */}
            <a
              href="/downloads/Naksha%202.0_2.0.0_x64_en-US.msi"
              download="Naksha 2.0_2.0.0_x64_en-US.msi"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                    <ShieldCheck size={20} color="#0f172a" />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '10px' }}>
                    MSI Package (3.9 MB)
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Windows Installer (.msi)
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Standard Windows Installer package for institutional and enterprise administration.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#0f172a',
                  color: '#38bdf8',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <Download size={14} />
                <span>Download .MSI Package</span>
              </div>
            </a>

            {/* 4. Complete Portable ZIP Archive */}
            <a
              href="/downloads/Naksha-2.0-Windows-x64.zip"
              download="Naksha-2.0-Windows-x64.zip"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                    <FolderArchive size={20} color="#475569" />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>10.2 MB</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Complete ZIP Archive
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Full portable suite with all libraries, assets, and documentation included.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #cbd5e1',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <Download size={14} />
                <span>Download .ZIP</span>
              </div>
            </a>

            {/* 3. User Manual PDF */}
            <a
              href="/downloads/NAKSHA_Desktop_User_Manual.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="NAKSHA_Desktop_User_Manual.pdf"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#fef2f2', padding: '8px', borderRadius: '8px' }}>
                    <FileText size={20} color="#dc2626" />
                  </div>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>Official PDF</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Desktop User Manual
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Official 8-page step-by-step documentation for GDB/TPK uploads and 3D cadastre workflow.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <FileText size={14} />
                <span>Download Manual (PDF)</span>
              </div>
            </a>
          </div>

          {/* Footer Actions: Web Preview Simulator & Close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link
                to="/desktop-app"
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  textDecoration: 'none'
                }}
              >
                <span>Launch Web Simulator / Preview</span>
                <ExternalLink size={12} />
              </Link>

              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

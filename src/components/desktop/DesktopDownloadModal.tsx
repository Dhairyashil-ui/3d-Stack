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
  Terminal
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
              <strong>Offline Desktop Architecture:</strong> The NAKSHA Desktop Application is a standalone client software designed for survey agencies (such as <b>Survey of India</b> and empaneled drone operators). As specified in the official operating manual, high-capacity <b>.tpk</b> orthorectified imagery and <b>.gdb</b> geodatabase packages are processed and validated natively on the local workstation before transmission to the WebGIS server.
            </div>
          </div>

          {/* Download Options Grid */}
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Download Package
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {/* 1. Direct .EXE Launcher */}
            <a
              href="/downloads/NAKSHA_Desktop_Launcher.exe"
              download="NAKSHA_Desktop_Launcher.exe"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #2563eb',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                    <Monitor size={20} color="#2563eb" />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px' }}>
                    Direct .EXE
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Desktop Launcher (.exe)
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Direct executable: Double-click to immediately launch the desktop workstation link.
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
                <span>Download .EXE Launcher</span>
              </div>
            </a>

            {/* 2. Direct Native Electron Run */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                    <Terminal size={20} color="#0f172a" />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '10px' }}>
                    Native Desktop
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Native Desktop Window
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Runs as an independent software window on your desktop (not in web browser).
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
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              >
                <span>npm run desktop</span>
              </div>
            </div>

            {/* 3. Safe Windows ZIP Package */}
            <a
              href="/downloads/NAKSHA_Desktop_v2.4_Windows_x64.zip"
              download="NAKSHA_Desktop_v2.4_Windows_x64.zip"
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
                  <span style={{ fontSize: '11px', color: '#64748b' }}>6.9 MB</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Complete Package (.zip)
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Contains .exe launcher, batch files, config, and complete user manual.
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
                  Official 8-page DoLR/MPSEDC step-by-step documentation for GDB/TPK uploads.
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

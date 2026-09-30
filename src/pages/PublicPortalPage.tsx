import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DesktopDownloadModal } from '../components/desktop/DesktopDownloadModal';
import {
  Download,
  Monitor,
  Layers,
  Box,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Zap,
  CheckCircle2,
  Lock,
  Globe,
  Database
} from 'lucide-react';

export const PublicPortalPage: React.FC = () => {
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#0a0f1d',
        color: '#f1f5f9',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP SIH INNOVATION RIBBON                                              */}
      {/* ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e1b4b 0%, #0c4a6e 50%, #1e1b4b 100%)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '8px 20px',
          fontSize: '12.5px',
          color: '#e0f2fe',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '10.5px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              boxShadow: '0 0 10px rgba(2, 132, 199, 0.5)'
            }}
          >
            SIH Prototype
          </span>
          <span style={{ fontWeight: 600 }}>
            Smart India Hackathon Project — Proposed Next-Gen NAKSHA 2.0 Architecture for Government of India
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setDesktopModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Download size={13} />
            <span>Download Desktop App</span>
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <Link
            to="/login"
            style={{
              color: '#cbd5e1',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Lock size={12} color="#38bdf8" />
            <span>Portal Login</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVIGATION BAR                                                    */}
      {/* ========================================================================= */}
      <header
        style={{
          backgroundColor: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/assets/naksha_2_logo.png"
              alt="NAKSHA 2.0"
              style={{ height: '48px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  NAKSHA
                </span>
                <span
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  2.0
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.4px' }}>
                3D CADASTRAL INTELLIGENCE
              </div>
            </div>
          </Link>
        </div>

        {/* Center Quick Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a
            href="#desktop-showcase"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500 }}
          >
            Desktop App
          </a>
          <a
            href="#innovations"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500 }}
          >
            3D Innovations
          </a>
          <Link
            to="/surveyor/3d-intelligence"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500 }}
          >
            Surveyor Workstation
          </Link>
          <Link
            to="/bhunaksha"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500 }}
          >
            3D ULPIN Engine
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setDesktopModalOpen(true)}
            id="nav-desktop-download-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
          >
            <Download size={15} />
            <span>Download Desktop App</span>
          </button>

          <Link
            to="/login"
            id="nav-login-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <span>Sign In</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Minimal Words, Maximum Visual Impact)                    */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '70px 24px 80px 24px',
          maxWidth: '1320px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '48px',
          alignItems: 'center'
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '30%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Left Column: Mission & Call To Action */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#38bdf8',
              marginBottom: '20px'
            }}
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>SIH INNOVATION • PROPOSED NEXT NAKSHA PROJECT</span>
          </div>

          <h1
            style={{
              fontSize: '48px',
              lineHeight: '1.15',
              fontWeight: 900,
              margin: '0 0 20px 0',
              color: '#ffffff',
              letterSpacing: '-1px'
            }}
          >
            We Are <span style={{ color: '#38bdf8' }}>NAKSHA 2.0</span>.
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              India’s 3D Urban Cadastre.
            </span>
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#94a3b8',
              margin: '0 0 32px 0',
              maxWidth: '560px'
            }}
          >
            Moving beyond flat 2D maps. A groundbreaking Smart India Hackathon system bringing
            volumetric parcels, Drone LiDAR, and floor-wise 3D ULPIN to modern multi-story urban habitations.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
            <button
              onClick={() => setDesktopModalOpen(true)}
              id="hero-download-app-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
            >
              <Download size={18} />
              <span>Download Desktop App to See in 3D</span>
            </button>

            <Link
              to="/surveyor/3d-intelligence"
              id="hero-open-workstation-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <Compass size={16} color="#38bdf8" />
              <span>Launch 3D Workstation</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>3D Strata</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Vertical Floor Parcels</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>±2 mm</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>RTK GNSS Precision</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>1-Click</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>3D ULPIN Generation</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Cadastral Card Showcase */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '16px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(2, 132, 199, 0.15)'
            }}
          >
            {/* Window bar */}
            <div
              style={{
                backgroundColor: '#0f172a',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                  NAKSHA 2.0 • 3D Volumetric Digital Twin
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}
              >
                RTK LOCKED
              </span>
            </div>

            {/* 3D Plan Graphic Preview */}
            <div style={{ position: 'relative', backgroundColor: '#030712', textAlign: 'center', padding: '16px' }}>
              <img
                src="/assets/3d plan.png"
                alt="NAKSHA 2.0 3D Cadastral Digital Twin"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '340px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/poster_02_naksha2.png';
                }}
              />

              {/* Floating Telemetry Pills */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Survey Parcel
                </div>
                <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 700 }}>
                  MH-PUN-HAV-142/B
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  textAlign: 'right'
                }}
              >
                <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  ULPIN 3D Format
                </div>
                <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 700 }}>
                  27-7354-9102-F04
                </div>
              </div>
            </div>

            {/* Bottom prompt inside preview card */}
            <div
              style={{
                backgroundColor: '#0f172a',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                Full interactive 3D rotation, mesh & point clouds run in our Desktop App.
              </div>
              <button
                onClick={() => setDesktopModalOpen(true)}
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Monitor size={13} />
                <span>Open in Desktop</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEDICATED DESKTOP APP SECTION ("DOWNLOAD TO SEE IN 3D")                */}
      {/* ========================================================================= */}
      <section
        id="desktop-showcase"
        style={{
          backgroundColor: '#0f172a',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '80px 24px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '20px',
              padding: '48px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 35px rgba(2, 132, 199, 0.12)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  marginBottom: '14px'
                }}
              >
                <Monitor size={15} />
                <span>Heavy-Duty 3D Workstation</span>
              </div>

              <h2
                style={{
                  fontSize: '34px',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: '1.25',
                  margin: '0 0 16px 0'
                }}
              >
                To Experience Interactive 3D Spatial Models,
                <br />
                <span style={{ color: '#38bdf8' }}>Download the NAKSHA 2.0 Desktop App</span>
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '1.65',
                  color: '#94a3b8',
                  margin: '0 0 28px 0'
                }}
              >
                Massive LiDAR point clouds, 3D textured reality meshes, and offline cadastral
                boundaries require direct GPU hardware acceleration. Our Windows 64-bit Desktop Application
                delivers instant, zero-lag 3D exploration and field verification.
              </p>

              {/* Feature Checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={16} color="#38bdf8" />
                  <span>Interactive 3D Cadastre & Meshes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={16} color="#38bdf8" />
                  <span>Drone LiDAR Point Cloud Viewer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={16} color="#38bdf8" />
                  <span>Zero-Loss Offline Field Mode</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={16} color="#38bdf8" />
                  <span>1-Click 3D ULPIN Generator</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setDesktopModalOpen(true)}
                  id="section-desktop-download-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '13px 24px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
                >
                  <Download size={17} />
                  <span>Download for Windows (x64)</span>
                </button>

                <Link
                  to="/desktop"
                  style={{
                    color: '#cbd5e1',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Open Web Desktop Suite</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Card: Spec & Specs Badge */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>NAKSHA Desktop Suite</span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  v2.4.0 (Windows)
                </span>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Includes Sample 3D Datasets</div>
                <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>
                  PMRDA Pune & Hinjawadi IT Park volumetric parcels
                </div>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Rendering Engine</div>
                <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>
                  Cesium 3D Tiles 1.1 + Three.js WebGL/WebGPU
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Cadastral File Ingestion</div>
                <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>
                  LAS/LAZ, GeoTIFF, SHP, GeoJSON & CityGML
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR 4 CORE PROJECT INNOVATIONS (Minimal Words, Maximum Clarity)        */}
      {/* ========================================================================= */}
      <section id="innovations" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            OUR SIH BREAKTHROUGHS
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            What Makes <span style={{ color: '#38bdf8' }}>NAKSHA 2.0</span> Different
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '10px' }}>
            Transforming conventional 2D cadastral surveys into multi-dimensional spatial intelligence.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Innovation 1: 3D Volumetric Parcels */}
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <Box size={24} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
              3D Volumetric Parcels
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94a3b8', margin: 0, flex: 1 }}>
              Legal demarcation for apartments, basements, and elevated transit corridors. Eliminates ownership
              ambiguity in vertical cities.
            </p>
          </div>

          {/* Innovation 2: Drone LiDAR & RTK GNSS */}
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <Zap size={24} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
              Drone LiDAR Pipeline
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94a3b8', margin: 0, flex: 1 }}>
              High-density aerial point clouds paired with millimeter RTK ground control for survey-grade
              accuracy across entire urban centers.
            </p>
          </div>

          {/* Innovation 3: 1-Click 3D ULPIN */}
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <Layers size={24} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
              1-Click 3D ULPIN
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94a3b8', margin: 0, flex: 1 }}>
              Algorithmic vertical PIN generation assigning unique ISO/OGC geospatial identifiers to individual
              floors and apartment units.
            </p>
          </div>

          {/* Innovation 4: Surveyor 3D Intelligence */}
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <Cpu size={24} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
              Surveyor AI Station
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94a3b8', margin: 0, flex: 1 }}>
              Comprehensive digital workbench allowing field surveyors to verify cadastral boundaries, detect overlap
              disputes, and publish approved cards.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LIVE PROJECT MODULES & ACCESS PORTALS                                  */}
      {/* ========================================================================= */}
      <section style={{ backgroundColor: '#070b14', padding: '70px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
              Explore Our Live Platform Modules
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Direct access into every functional layer built by Team NAKSHA 2.0.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Card 1: 3D Surveyor Workstation */}
            <Link
              to="/surveyor/3d-intelligence"
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '22px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>🛰️</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Surveyor 3D Workstation
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
                  Interactive 3D GIS verification and volumetric parcel analysis.
                </div>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>
                <span>Launch Workstation</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 2: BhuNaksha 3D ULPIN */}
            <Link
              to="/bhunaksha"
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '22px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>🗺️</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  BhuNaksha 3D Engine
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
                  Generate 1-click vertical property pins for cadastral maps.
                </div>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>
                <span>Open BhuNaksha</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 3: Desktop App Suite */}
            <div
              onClick={() => setDesktopModalOpen(true)}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '22px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>💻</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Desktop Workstation
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
                  Download Windows 64-bit app for GPU LiDAR rendering.
                </div>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>
                <span>Download Installer</span>
                <Download size={14} />
              </div>
            </div>

            {/* Card 4: Official Login Portal */}
            <Link
              to="/login"
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '22px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>🔐</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Admin & Surveyor Login
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
                  Role-based authentication for state and district GIS officers.
                </div>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>
                <span>Access Portal</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#050811',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '30px 24px',
          color: '#64748b',
          fontSize: '12.5px'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>NAKSHA 2.0</span>
            <span>•</span>
            <span>Smart India Hackathon (SIH) Prototype Architecture</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setDesktopModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontSize: '12.5px' }}
            >
              Download Desktop App
            </button>
            <Link to="/surveyor/3d-intelligence" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Surveyor 3D
            </Link>
            <Link to="/bhunaksha" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              BhuNaksha 3D
            </Link>
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Login
            </Link>
          </div>
        </div>
      </footer>

      {/* Standalone Desktop App Download Modal */}
      <DesktopDownloadModal
        isOpen={desktopModalOpen}
        onClose={() => setDesktopModalOpen(false)}
      />
    </div>
  );
};

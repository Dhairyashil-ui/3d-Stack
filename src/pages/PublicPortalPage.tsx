import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DesktopDownloadModal } from '../components/desktop/DesktopDownloadModal';
import {
  Download,
  Monitor,
  ArrowRight,
  Layers,
  Box,
  ShieldCheck,
  Sparkles,
  Compass,
  Cpu,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Zap,
  Building2,
  Database,
  Eye,
  FileCheck
} from 'lucide-react';

export const PublicPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#0a0f1d',
        color: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}
    >
      {/* ========================================================================= */}
      {/* 1. SIH INNOVATION RIBBON                                                  */}
      {/* ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)',
          borderBottom: '1px solid rgba(147, 197, 253, 0.15)',
          padding: '8px 24px',
          fontSize: '12.5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.5px'
            }}
          >
            SIH 2026 PROTOTYPE
          </span>
          <span style={{ color: '#cbd5e1' }}>
            Smart India Hackathon Project — Proposed Future <strong>NAKSHA 2.0</strong> 3D Cadastral Architecture for Government of India
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setDesktopModalOpen(true)}
            id="top-sih-download-btn"
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Download size={13} />
            <span>Download Desktop App</span>
          </button>
          <span style={{ color: '#475569' }}>|</span>
          <Link
            to="/login"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Sign In</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODERN MINIMALIST HEADER                                               */}
      {/* ========================================================================= */}
      <header
        style={{
          backgroundColor: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 36px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Brand Logo & Title */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/assets/naksha_2_logo.png"
            alt="NAKSHA 2.0"
            style={{ height: '48px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                NAKSHA
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}
              >
                2.0
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.4px', marginTop: '1px' }}>
              3D Urban Cadastre & Volumetric Land Intelligence
            </div>
          </div>
        </Link>

        {/* Quick Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a
            href="#innovations"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Core Innovations
          </a>
          <a
            href="#desktop-showcase"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Desktop Workstation
          </a>
          <a
            href="#pipeline"
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13.5px', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            3D Pipeline
          </a>
          <Link
            to="/bhunaksha"
            style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>BhuNaksha ULPIN</span>
            <ExternalLink size={12} />
          </Link>
        </nav>

        {/* Primary Header CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setDesktopModalOpen(true)}
            id="header-download-btn"
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
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
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
            id="header-login-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          >
            <span>Portal Login</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Minimal Words, Maximum Visual Quality)                   */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '70px 24px 60px 24px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Glow backdrop effects */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* SIH Pill Tag */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '24px',
            padding: '6px 16px',
            marginBottom: '22px'
          }}
        >
          <Sparkles size={15} color="#38bdf8" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.3px' }}>
            Smart India Hackathon (SIH) Prototype • The Proposed Next NAKSHA Project
          </span>
        </div>

        {/* Hero Headline */}
        <h1
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
            color: '#ffffff',
            maxWidth: '920px',
            margin: '0 0 20px 0'
          }}
        >
          India’s Cadastre in{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Full 3D Intelligence
          </span>
        </h1>

        {/* Minimal Subhead */}
        <p
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '17px',
            lineHeight: '1.6',
            color: '#94a3b8',
            maxWidth: '720px',
            margin: '0 0 34px 0'
          }}
        >
          <strong>NAKSHA 2.0</strong> extends cadastral mapping from flat 2D maps into volumetric, multi-story property digital twins. Built with millimeter RTK GNSS control, floor-wise 3D ULPIN, and native desktop GPU acceleration.
        </p>

        {/* Primary Action Buttons */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {/* Main Desktop App Download Button */}
          <button
            onClick={() => setDesktopModalOpen(true)}
            id="hero-main-download-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0369a1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0284c7';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download size={18} />
            <span>Download Desktop App (Windows)</span>
          </button>

          {/* Surveyor Workstation Link */}
          <Link
            to="/surveyor/3d-intelligence"
            id="hero-3d-station-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              borderRadius: '10px',
              padding: '14px 26px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Monitor size={18} />
            <span>Launch 3D Surveyor Station</span>
          </Link>

          {/* Portal Login */}
          <Link
            to="/login"
            id="hero-login-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              padding: '14px 24px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
          >
            <span>Sign In</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Evaluator Callout Notice */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '14px 24px',
            maxWidth: '780px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <span style={{ fontSize: '24px' }}>💻</span>
            <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
              <strong style={{ color: '#38bdf8' }}>Interactive 3D Notice:</strong> To interact with high-resolution 3D volumetric parcels, drone point clouds, and mesh models, <strong style={{ color: '#ffffff' }}>download our native Windows Desktop Application</strong>.
            </div>
          </div>
          <button
            onClick={() => setDesktopModalOpen(true)}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            Get Desktop App
          </button>
        </div>

        {/* 3D Showcase Preview Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: '48px',
            width: '100%',
            maxWidth: '1060px',
            borderRadius: '20px',
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(30, 58, 138, 0.15) 50%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.1)'
          }}
        >
          <div
            style={{
              backgroundColor: '#070d19',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Window Top Controls Header */}
            <div
              style={{
                backgroundColor: '#0f172a',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '12px', fontFamily: 'monospace' }}>
                  NAKSHA 2.0 • 3D Volumetric Cadastral Model (LoD-3 Multi-Story Demarcation)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  LIVE VOLUMETRIC PARCEL
                </span>
              </div>
            </div>

            {/* 3D Plan Graphic Showcase */}
            <div
              style={{
                position: 'relative',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #0f223d 0%, #070d19 80%)'
              }}
            >
              <img
                src="/assets/3d plan.png"
                alt="NAKSHA 2.0 3D Cadastral Digital Twin"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '440px',
                  borderRadius: '12px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/poster_02_naksha2.png';
                }}
              />

              {/* Floating Overlay Pill Badges */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '36px',
                  left: '36px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Box size={20} color="#38bdf8" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Vertical Structure</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Floor-wise 3D ULPIN</div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '36px',
                  right: '36px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <ShieldCheck size={20} color="#f59e0b" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Accuracy Standard</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>±5mm RTK GNSS</div>
                </div>
              </div>
            </div>

            {/* Bottom Showcase Bar with Desktop App Trigger */}
            <div
              style={{
                backgroundColor: '#0a1424',
                padding: '16px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Looking to inspect real-time 3D models with high FPS and local cache?
              </div>
              <button
                onClick={() => setDesktopModalOpen(true)}
                id="showcase-download-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Download Desktop App to See in 3D</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE INNOVATIONS (Our Project Features Only)                          */}
      {/* ========================================================================= */}
      <section
        id="innovations"
        style={{
          padding: '80px 24px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-block',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            NAKSHA 2.0 PILLARS
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            What We Built: The Next-Gen 3D Cadastre
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '640px', margin: '12px auto 0 auto' }}>
            Built specifically to solve India’s urban vertical property demarcation challenges.
          </p>
        </div>

        {/* 4 Grid Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Feature 1: 3D Volumetric Parcels */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Box size={24} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
                3D Volumetric Demarcation
              </h3>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
                Traditional cadastre only tracks X/Y land surface. NAKSHA 2.0 creates 3D bounded bounding volumes for multi-story towers, individual flats, basements, and podium parking.
              </p>
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
              ✓ Solves vertical ownership disputes
            </div>
          </div>

          {/* Feature 2: Floor-wise 3D ULPIN */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Layers size={24} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
                Floor-wise 3D ULPIN Engine
              </h3>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
                Generates a unique 14-digit standardized geospatial identifier for every floor and individual apartment unit, compliant with international OGC Land Administration standards.
              </p>
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
              ✓ 1-Click ULPIN generation pipeline
            </div>
          </div>

          {/* Feature 3: Drone LiDAR & RTK GNSS */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Compass size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
                Drone LiDAR & Field Rovers
              </h3>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
                Direct ingestion of Ortho-Rectified Images (ORI), elevation DEM models, and centimeter-precision Ground Control Points (GCPs) from field rovers across urban survey units.
              </p>
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
              ✓ Automated spatial alignment
            </div>
          </div>

          {/* Feature 4: Automated AI ROR Verification */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(192, 132, 252, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Cpu size={24} color="#c084fc" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
                Automated AI ROR Tagging
              </h3>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
                Instant matching between physical survey polygons and land revenue records (ROR). AI flags area discrepancies, boundary encroachments, and owner mismatches instantly.
              </p>
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: '#c084fc' }}>
              ✓ Transparent property card generation
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DEDICATED DESKTOP WORKSTATION SHOWCASE SECTION                         */}
      {/* ========================================================================= */}
      <section
        id="desktop-showcase"
        style={{
          backgroundColor: '#070c18',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '80px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '50px',
            alignItems: 'center'
          }}
        >
          {/* Left Text */}
          <div>
            <div
              style={{
                backgroundColor: 'rgba(2, 132, 199, 0.15)',
                color: '#38bdf8',
                fontSize: '12px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'inline-block',
                marginBottom: '14px'
              }}
            >
              HEAVY-DUTY DESKTOP APPLICATION
            </div>
            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', lineHeight: '1.2', margin: '0 0 18px 0' }}>
              Why We Built a Standalone Desktop App
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.7', margin: '0 0 24px 0' }}>
              Browser engines struggle with gigabytes of photogrammetric mesh tiles and massive LiDAR point clouds. That's why our team created the <strong>NAKSHA 2.0 Desktop Workstation for Windows</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Direct GPU acceleration with Vulkan & DirectX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Full offline GIS tile caching for field operations</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Sub-centimeter 3D parcel volumetric editing tools</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Encrypted direct sync with government cadastral databases</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDesktopModalOpen(true)}
                id="section-desktop-download-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px 26px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Download size={16} />
                <span>Download Desktop Workstation (.exe)</span>
              </button>

              <Link
                to="/desktop"
                style={{
                  color: '#38bdf8',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Or explore Web Desktop Preview</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Card / Graphic */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Monitor size={28} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  NAKSHA 2.0 Desktop Workstation
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  Build 2026.4.1 • 64-bit Windows Ready
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#070c18',
                borderRadius: '12px',
                padding: '18px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#cbd5e1'
              }}
            >
              "To evaluate our 3D volumetric parcels and high-resolution LiDAR drone platform, please launch our desktop application. It provides the full native 60 FPS spatial experience."
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Supported OS</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Windows 10 / 11 (x64)</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Rendering API</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>DirectX 12 / Vulkan</div>
              </div>
            </div>

            <button
              onClick={() => setDesktopModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} />
              <span>Download Desktop App to See Live 3D</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. END-TO-END 3D PIPELINE                                                 */}
      {/* ========================================================================= */}
      <section
        id="pipeline"
        style={{
          padding: '80px 24px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              color: '#f59e0b',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            TECHNICAL ARCHITECTURE
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            The 5-Stage Cadastral Workflow
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '12px auto 0 auto' }}>
            From drone platform flight to issuing citizen 3D property cards.
          </p>
        </div>

        {/* 5 Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          {[
            { step: '01', title: 'Drone Survey', desc: 'LiDAR & high-res optical imagery captured by drone platforms.' },
            { step: '02', title: 'RTK Ground Control', desc: 'Centimeter CORS rover points ensure sub-millimeter geo-referencing.' },
            { step: '03', title: 'AI 3D Reconstruction', desc: 'Photogrammetric point clouds transformed into volumetric building LoD-3 models.' },
            { step: '04', title: 'Floor-wise ULPIN', desc: 'Automated 14-digit geospatial coding assigned to every apartment unit.' },
            { step: '05', title: '3D Property Card', desc: 'Citizens and local authorities access verifiable digital ownership deeds.' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px 20px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: 'rgba(56, 189, 248, 0.3)',
                  marginBottom: '10px'
                }}
              >
                {item.step}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SIH IMPACT STATEMENT BANNER                                            */}
      {/* ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderTop: '1px solid rgba(147, 197, 253, 0.2)',
          borderBottom: '1px solid rgba(147, 197, 253, 0.2)',
          padding: '60px 24px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '16px'
            }}
          >
            SMART INDIA HACKATHON 2026 INITIATIVE
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
            Built to be the Next Official NAKSHA Platform
          </h2>
          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 28px 0' }}>
            This project is developed as an innovation entry for the <strong>Smart India Hackathon (SIH)</strong>. It provides the technological foundation that could power the Government of India’s next official NAKSHA 2.0 urban land records modernization across 152+ Indian cities.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDesktopModalOpen(true)}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Download Windows App
            </button>
            <Link
              to="/login"
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Surveyor Portal Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MINIMAL CLEAN FOOTER                                                   */}
      {/* ========================================================================= */}
      <footer
        style={{
          backgroundColor: '#050914',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 36px',
          marginTop: 'auto'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>NAKSHA 2.0</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>• Smart India Hackathon Prototype</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Designed & Engineered for 3D Urban Cadastral Intelligence
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px' }}>
            <button
              onClick={() => setDesktopModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            >
              Download Desktop App
            </button>
            <Link to="/surveyor/3d-intelligence" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              3D Surveyor Station
            </Link>
            <Link to="/bhunaksha" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              BhuNaksha Generator
            </Link>
            <Link to="/login" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>
              Portal Login
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

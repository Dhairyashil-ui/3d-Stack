import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DesktopDownloadModal } from '../components/desktop/DesktopDownloadModal';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X,
  Play,
  Volume2,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Download,
  Smartphone,
  Monitor,
  Eye,
  Check,
  FileText
} from 'lucide-react';

interface StateData {
  name: string;
  pilotUlbs: string;
  ulbOnboarded: string;
  surveyUsers: string;
  suCreated: string;
  oriUploaded: string;
  feUploaded: string;
  gtCompleted: string;
  rorTagged: string;
  activeRovers: string;
}

const stateMetricsDatabase: Record<string, StateData> = {
  'Maharashtra': {
    name: 'Maharashtra',
    pilotUlbs: '18',
    ulbOnboarded: '15',
    surveyUsers: '342',
    suCreated: '1420/15',
    oriUploaded: '1280/15',
    feUploaded: '1150/15',
    gtCompleted: '68210/14',
    rorTagged: '42890/12',
    activeRovers: '54/15'
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    pilotUlbs: '10',
    ulbOnboarded: '7',
    surveyUsers: '0',
    suCreated: '0/0',
    oriUploaded: '0/0',
    feUploaded: '0/0',
    gtCompleted: '0/0',
    rorTagged: '0/0',
    activeRovers: '0/0'
  },
  'Odisha': {
    name: 'Odisha',
    pilotUlbs: '12',
    ulbOnboarded: '10',
    surveyUsers: '185',
    suCreated: '920/10',
    oriUploaded: '810/10',
    feUploaded: '740/10',
    gtCompleted: '34500/9',
    rorTagged: '21400/8',
    activeRovers: '36/10'
  },
  'Karnataka': {
    name: 'Karnataka',
    pilotUlbs: '14',
    ulbOnboarded: '12',
    surveyUsers: '210',
    suCreated: '1100/12',
    oriUploaded: '980/12',
    feUploaded: '910/12',
    gtCompleted: '48900/11',
    rorTagged: '31200/10',
    activeRovers: '42/12'
  },
  'Rajasthan': {
    name: 'Rajasthan',
    pilotUlbs: '11',
    ulbOnboarded: '9',
    surveyUsers: '160',
    suCreated: '780/9',
    oriUploaded: '690/9',
    feUploaded: '620/9',
    gtCompleted: '29800/8',
    rorTagged: '18500/7',
    activeRovers: '28/9'
  },
  'Punjab': {
    name: 'Punjab',
    pilotUlbs: '8',
    ulbOnboarded: '7',
    surveyUsers: '120',
    suCreated: '540/7',
    oriUploaded: '480/7',
    feUploaded: '430/7',
    gtCompleted: '19400/6',
    rorTagged: '12100/5',
    activeRovers: '20/7'
  },
  'Gujarat': {
    name: 'Gujarat',
    pilotUlbs: '16',
    ulbOnboarded: '14',
    surveyUsers: '280',
    suCreated: '1310/14',
    oriUploaded: '1190/14',
    feUploaded: '1080/14',
    gtCompleted: '56400/13',
    rorTagged: '38900/11',
    activeRovers: '48/14'
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    pilotUlbs: '22',
    ulbOnboarded: '18',
    surveyUsers: '410',
    suCreated: '1850/18',
    oriUploaded: '1620/18',
    feUploaded: '1490/18',
    gtCompleted: '84200/16',
    rorTagged: '54800/14',
    activeRovers: '65/18'
  },
  'Jammu And Kashmir': {
    name: 'Jammu And Kashmir',
    pilotUlbs: '6',
    ulbOnboarded: '5',
    surveyUsers: '85',
    suCreated: '360/5',
    oriUploaded: '310/5',
    feUploaded: '280/5',
    gtCompleted: '11500/4',
    rorTagged: '7200/4',
    activeRovers: '14/5'
  },
  'Telangana': {
    name: 'Telangana',
    pilotUlbs: '9',
    ulbOnboarded: '8',
    surveyUsers: '145',
    suCreated: '690/8',
    oriUploaded: '620/8',
    feUploaded: '570/8',
    gtCompleted: '26400/7',
    rorTagged: '16800/6',
    activeRovers: '24/8'
  }
};

export const PublicPortalPage: React.FC = () => {
  const navigate = useNavigate();

  // Top Bar & Theme State
  const [activeTheme, setActiveTheme] = useState<'old' | 'new'>('old');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  // Popups & Dropdowns
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [translateDropdownOpen, setTranslateDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);

  // State Specific Section - Maharashtra selected by default
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');

  // Modals (Photo Lightbox / Desktop Download)
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; title: string } | null>(null);
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);

  // Back to Top Button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Dropdown click outside listeners
  const topBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel Auto-play (Pass one by one to left animation every 2 seconds)
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const handleTransitionEnd = () => {
    if (currentSlide >= 2) {
      setIsTransitioning(false);
      setCurrentSlide(0);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topBarRef.current && !topBarRef.current.contains(e.target as Node)) {
        setSocialDropdownOpen(false);
        setTranslateDropdownOpen(false);
        setActiveNavDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStateMetrics = stateMetricsDatabase[selectedState] || stateMetricsDatabase['Maharashtra'];

  // Font scale multiplier
  const fontScale = fontSize === 'normal' ? 1 : fontSize === 'large' ? 1.08 : 1.16;

  return (
    <div
      style={{
        backgroundColor: highContrast ? '#050b14' : '#f5f7fd',
        color: highContrast ? '#ffffff' : '#2a2f5b',
        fontFamily: "'Noto Sans', 'Lato', sans-serif",
        fontSize: `${14 * fontScale}px`,
        lineHeight: 1.5,
        minHeight: '100vh',
        position: 'relative',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {/* Responsive Styles for Mobile Compatibility */}
      <style>{`
        @media (max-width: 992px) {
          .portal-top-bar {
            padding: 8px 16px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .portal-top-bar-right {
            width: 100% !important;
            justify-content: space-between !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
          .portal-header-wrap {
            padding: 14px 16px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
          .portal-header-cta {
            width: 100% !important;
          }
          .portal-header-cta button {
            width: 100% !important;
            justify-content: center !important;
          }
          .portal-nav-bar {
            padding: 0 12px !important;
            justify-content: flex-start !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
          }
          .portal-nav-bar::-webkit-scrollbar {
            display: none !important;
          }
          .portal-nav-track {
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
          }
          .portal-hero-slider {
            min-height: 200px !important;
          }
          .portal-milestones-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .portal-state-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .portal-state-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .portal-about-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .portal-circle-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .portal-photo-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
          .portal-three-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .portal-announcements-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .portal-footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }

        @media (max-width: 600px) {
          .portal-top-bar {
            padding: 8px 12px !important;
          }
          .portal-top-bar-right {
            gap: 8px !important;
          }
          .portal-header-title {
            font-size: 19px !important;
          }
          .portal-header-sub {
            font-size: 11.5px !important;
          }
          .portal-header-tagline {
            display: none !important;
          }
          .portal-hero-slider {
            min-height: 160px !important;
            max-height: 220px !important;
          }
          .portal-announcements-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .portal-milestones-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .portal-state-metrics-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .portal-circle-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .portal-photo-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .portal-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .portal-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Government of India, Themes, Accessibility, Translate) */}
      {/* ========================================================================= */}
      <div
        ref={topBarRef}
        className="portal-top-bar"
        style={{
          backgroundColor: highContrast ? '#0f172a' : '#f4f6fa',
          borderBottom: '1px solid #e2e8f0',
          padding: '8px 32px',
          fontSize: '13.5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: 700, fontSize: '13px' }}>
          <span>NAKSHA 2.0 • Smart India Hackathon (SIH 2026) Innovation</span>
        </div>

        <div className="portal-top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Theme Selector Pill (Old Theme / New Theme) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e2e8f0',
              borderRadius: '20px',
              padding: '3px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <button
              onClick={() => setActiveTheme('old')}
              style={{
                backgroundColor: activeTheme === 'old' ? '#8cb8d0' : 'transparent',
                color: activeTheme === 'old' ? '#0b2e54' : '#475569',
                border: 'none',
                borderRadius: '16px',
                padding: '4px 14px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              Old Theme
            </button>
            <button
              onClick={() => setActiveTheme('new')}
              style={{
                backgroundColor: activeTheme === 'new' ? '#005cbb' : '#ffffff',
                color: activeTheme === 'new' ? '#ffffff' : '#334155',
                border: 'none',
                borderRadius: '16px',
                padding: '4px 14px',
                cursor: 'pointer',
                fontWeight: activeTheme === 'new' ? 600 : 500,
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              New Theme
            </button>
          </div>

          {/* Social Media Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSocialDropdownOpen(!socialDropdownOpen);
                setTranslateDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: '#1e293b',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '5px 8px',
                borderRadius: '4px'
              }}
            >
              <img
                src="/assets/socialmedia-icon.svg"
                alt=""
                style={{ width: '16px', height: '16px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span>Social Media</span>
              <ChevronDown size={13} color="#64748b" />
            </button>

            {socialDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  gap: '14px',
                  zIndex: 200,
                  border: '1px solid #e2e8f0',
                  alignItems: 'center'
                }}
              >
                {/* Instagram */}
                <a
                  href="#social"
                  title="Follow NAKSHA 2.0"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                    color: '#fff',
                    textDecoration: 'none'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#social"
                  title="NAKSHA 2.0 Channel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ff0000',
                    color: '#fff',
                    textDecoration: 'none'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Accessibility Button */}
          <button
            onClick={() => setAccessibilityModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#1e293b',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '5px 8px',
              borderRadius: '4px'
            }}
          >
            <img
              src="/assets/accessibility-icontop.svg"
              alt=""
              style={{ width: '16px', height: '16px' }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span>Accessibility</span>
          </button>

          {/* Translate Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTranslateDropdownOpen(!translateDropdownOpen);
                setSocialDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#1e293b',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '5px 8px',
                borderRadius: '4px'
              }}
            >
              <img
                src="/assets/language-icon.svg"
                alt=""
                style={{ width: '16px', height: '16px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span>Translate</span>
              <ChevronDown size={13} color="#64748b" />
            </button>

            {translateDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  padding: '6px 0',
                  minWidth: '150px',
                  zIndex: 200,
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ padding: '4px 12px', fontSize: '10.5px', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>
                  BHASHINI TRANSLATE
                </div>
                {[
                  'English',
                  'हिन्दी (Hindi)',
                  'मराठी (Marathi)',
                  'ગુજરાતી (Gujarati)',
                  'தமிழ் (Tamil)',
                  'తెలుగు (Telugu)',
                  'বাংলা (Bengali)',
                  'ಕನ್ನಡ (Kannada)'
                ].map((lang) => {
                  const name = lang.split(' ')[0];
                  return (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLanguage(name);
                        setTranslateDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 14px',
                        background: currentLanguage === name ? '#f1f5f9' : 'none',
                        border: 'none',
                        fontSize: '12px',
                        color: currentLanguage === name ? '#005cbb' : '#1e293b',
                        fontWeight: currentLanguage === name ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{lang}</span>
                      {currentLanguage === name && <Check size={14} color="#005cbb" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop App Download Button */}
          <button
            onClick={() => setDesktopModalOpen(true)}
            id="top-desktop-download-btn"
            title="Download NAKSHA 2.0 3D Desktop Workstation Application"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#005cbb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '12.5px',
              padding: '5px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,92,187,0.25)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00448a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#005cbb')}
          >
            <Monitor size={14} />
            <span>🖥️ Desktop 3D App</span>
          </button>

          {/* Login Link with user icon */}
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#005cbb',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '13px',
              padding: '5px 8px',
              borderRadius: '4px'
            }}
          >
            <img
              src="/assets/user-icontop.svg"
              alt=""
              style={{ width: '15px', height: '15px' }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span>Login</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BRAND HEADER SECTION (NAKSHA 2.0 Identity & Desktop App Download CTA) */}
      {/* ========================================================================= */}
      <header
        className="portal-header-wrap"
        style={{
          backgroundColor: '#ffffff',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eef2f6',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <img
              src="/assets/naksha_2_logo.png"
              alt="NAKSHA 2.0 Logo"
              style={{ height: '68px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.src = '/assets/app-logo.png';
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="portal-header-title" style={{ fontSize: '24px', fontWeight: 900, color: '#0f2b5c', letterSpacing: '-0.5px' }}>
                  NAKSHA <span style={{ color: '#0284c7' }}>2.0</span>
                </span>
                <span
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    letterSpacing: '0.4px'
                  }}
                >
                  SIH 2026 PROTOTYPE
                </span>
              </div>
              <div className="portal-header-sub" style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7', marginTop: '2px', letterSpacing: '0.2px' }}>
                Next-Generation 3D Cadastral & Urban Habitation Digital Twin
              </div>
              <div className="portal-header-tagline" style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
                Volumetric Multi-Floor Stratification • Automated Drone Mesh • Sub-Centimeter RTK GNSS
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop App Download CTA */}
        <div className="portal-header-cta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setDesktopModalOpen(true)}
            id="brand-header-desktop-download"
            title="Download Standalone Desktop Application"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #005cbb 0%, #0284c7 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,92,187,0.3)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,92,187,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,92,187,0.3)';
            }}
          >
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bae6fd', fontWeight: 800 }}>
                Offline Workstation v2.0
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Download Desktop App</span>
                <Download size={15} />
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. PRIMARY NAVIGATION BAR (Centered menu with dropdowns)                   */}
      {/* ========================================================================= */}
      <nav
        className="portal-nav-bar"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}
      >
        <div className="portal-nav-track" style={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
          {/* Home */}
          <Link
            to="/"
            style={{
              padding: '12px 16px',
              color: '#212529',
              fontWeight: 600,
              fontSize: '13.5px',
              textDecoration: 'none'
            }}
          >
            Home
          </Link>

          {/* About Us */}
          <a
            href="#about-section"
            style={{
              padding: '12px 16px',
              color: '#334155',
              fontWeight: 500,
              fontSize: '13.5px',
              textDecoration: 'none'
            }}
          >
            About Us
          </a>

          {/* Training Materials Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveNavDropdown('training')}
            onMouseLeave={() => setActiveNavDropdown(null)}
          >
            <button
              onClick={() => setActiveNavDropdown(activeNavDropdown === 'training' ? null : 'training')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 16px',
                color: activeNavDropdown === 'training' ? '#005cbb' : '#334155',
                background: 'none',
                border: 'none',
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              <span>Training Materials</span>
              <ChevronDown size={14} />
            </button>
            {activeNavDropdown === 'training' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  minWidth: '180px',
                  padding: '6px 0',
                  zIndex: 250,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Link
                  to="/ulb/home"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Video Tutorials
                </Link>
                <a
                  href="#circulars-section"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Training Manuals
                </a>
              </div>
            )}
          </div>

          {/* Documents Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveNavDropdown('documents')}
            onMouseLeave={() => setActiveNavDropdown(null)}
          >
            <button
              onClick={() => setActiveNavDropdown(activeNavDropdown === 'documents' ? null : 'documents')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 16px',
                color: activeNavDropdown === 'documents' ? '#005cbb' : '#334155',
                background: 'none',
                border: 'none',
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              <span>Documents</span>
              <ChevronDown size={14} />
            </button>
            {activeNavDropdown === 'documents' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  minWidth: '180px',
                  padding: '6px 0',
                  zIndex: 250,
                  border: '1px solid #e2e8f0'
                }}
              >
                <a
                  href="#circulars-section"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  SOP
                </a>
                <a
                  href="#circulars-section"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Booklet
                </a>
                <a
                  href="#circulars-section"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Other Documents
                </a>
              </div>
            )}
          </div>

          {/* Citizen Centric Services Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveNavDropdown('services')}
            onMouseLeave={() => setActiveNavDropdown(null)}
          >
            <button
              onClick={() => setActiveNavDropdown(activeNavDropdown === 'services' ? null : 'services')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 16px',
                color: activeNavDropdown === 'services' ? '#005cbb' : '#334155',
                background: 'none',
                border: 'none',
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              <span>Citizen Centric Services</span>
              <ChevronDown size={14} />
            </button>
            {activeNavDropdown === 'services' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  minWidth: '200px',
                  padding: '6px 0',
                  zIndex: 250,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Link
                  to="/ulb/claim-redressal"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Claim & Redressal
                </Link>
                <Link
                  to="/surveyor/property-search"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Tracking
                </Link>
              </div>
            )}
          </div>

          {/* Dashboard Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveNavDropdown('dashboard')}
            onMouseLeave={() => setActiveNavDropdown(null)}
          >
            <button
              onClick={() => setActiveNavDropdown(activeNavDropdown === 'dashboard' ? null : 'dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 16px',
                color: activeNavDropdown === 'dashboard' ? '#005cbb' : '#334155',
                background: 'none',
                border: 'none',
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              <span>Dashboard</span>
              <ChevronDown size={14} />
            </button>
            {activeNavDropdown === 'dashboard' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  minWidth: '160px',
                  padding: '6px 0',
                  zIndex: 250,
                  border: '1px solid #e2e8f0'
                }}
              >
                <a
                  href="#milestones-section"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Power BI
                </a>
              </div>
            )}
          </div>

          {/* Downloads Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveNavDropdown('downloads')}
            onMouseLeave={() => setActiveNavDropdown(null)}
          >
            <button
              onClick={() => setActiveNavDropdown(activeNavDropdown === 'downloads' ? null : 'downloads')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 16px',
                color: activeNavDropdown === 'downloads' ? '#005cbb' : '#334155',
                background: 'none',
                border: 'none',
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              <span>Downloads</span>
              <ChevronDown size={14} />
            </button>
            {activeNavDropdown === 'downloads' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  minWidth: '190px',
                  padding: '6px 0',
                  zIndex: 250,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Link
                  to="/desktop"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Desktop Utility (SOI)
                </Link>
                <a
                  href="#downloads-section"
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#1e293b',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Android App
                </a>
                <button
                  onClick={() => {
                    setDesktopModalOpen(true);
                    setActiveNavDropdown(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 16px',
                    color: '#005cbb',
                    fontWeight: 600,
                    fontSize: '13px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>Windows 3D App (.exe)</span>
                  <Download size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Events */}
          <a
            href="#events-section"
            style={{
              padding: '12px 16px',
              color: '#334155',
              fontWeight: 500,
              fontSize: '13.5px',
              textDecoration: 'none'
            }}
          >
            Events
          </a>

          {/* Media */}
          <a
            href="#gallery-section"
            style={{
              padding: '12px 16px',
              color: '#334155',
              fontWeight: 500,
              fontSize: '13.5px',
              textDecoration: 'none'
            }}
          >
            Media
          </a>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 4. HERO BANNER & CAROUSEL SECTION (Interactive Slider)                    */}
      {/* ========================================================================= */}
      <div
        className="portal-hero-slider"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2268 / 527',
          maxHeight: '440px',
          overflow: 'hidden',
          backgroundColor: '#0a1d37'
        }}
      >
        {/* Horizontal sliding track that passes posters one by one to the left */}
        <div
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          {/* Poster 1: Device Ecosystem Banner */}
          <div
            style={{
              flex: '0 0 100%',
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/assets/image.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center'
            }}
          />

          {/* Poster 2: City Skyline Cadastre Drone Banner */}
          <div
            style={{
              flex: '0 0 100%',
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/assets/banner_01.jpg)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center'
            }}
          />

          {/* Seamless loop clone of Poster 1 */}
          <div
            style={{
              flex: '0 0 100%',
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/assets/image.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center'
            }}
          />
        </div>

        {/* Previous Chevron Button */}
        <button
          onClick={() => {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev <= 0 ? 1 : prev - 1));
          }}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            color: '#ffffff',
            border: 'none',
            width: '40px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 30,
            opacity: 0.8,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={36} strokeWidth={1.5} />
        </button>

        {/* Next Chevron Button */}
        <button
          onClick={() => {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev >= 1 ? 0 : prev + 1));
          }}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            color: '#ffffff',
            border: 'none',
            width: '40px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 30,
            opacity: 0.85,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          aria-label="Next Slide"
        >
          <ChevronRight size={36} strokeWidth={1.5} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. ANNOUNCEMENTS MARQUEE & CIRCULARS CARD SECTION                         */}
      {/* ========================================================================= */}
      <div
        id="circulars-section"
        className="portal-announcements-grid"
        style={{
          maxWidth: '1360px',
          margin: '28px auto 0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Side: Announcements Header + Marquee Box */}
        <div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#0f3b6c',
              marginBottom: '14px'
            }}
          >
            Announcements
          </h2>

          <div
            style={{
              backgroundColor: '#e9f0f8',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #dbeafe'
            }}
          >
            {/* Loudspeaker Megaphone Icon Box */}
            <div
              style={{
                backgroundColor: '#005cbb',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Volume2 size={22} color="#ffffff" />
            </div>

            {/* Seamless Ticker Content */}
            <div
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                flex: 1,
                padding: '0 16px',
                fontSize: '13.5px',
                color: '#1e293b'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  animation: 'marquee 19s linear infinite'
                }}
              >
                🚀 Welcome to NAKSHA 2.0 (Smart India Hackathon 2026 Prototype) — Next-Gen 3D Cadastral Digital Twin & Volumetric Land Governance! 📥 Download the Standalone 3D Desktop Application for offline GPU-accelerated volumetric survey processing, floor-wise property cards & sub-centimeter RTK integration!
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. MILESTONES COVERED TOWARDS NATION-BUILDING (8 Colorful Cards Grid)     */}
          {/* ========================================================================= */}
          <div id="milestones-section" style={{ marginTop: '36px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f3b6c',
                marginBottom: '16px'
              }}
            >
              Milestones Covered Towards Nation-Building
            </h2>

            <div
              className="portal-milestones-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px'
              }}
            >
              {/* Card 1: NAKSHA 2.0 Pilot ULBs */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1d74d4 0%, #3b9af4 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(29, 116, 212, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>NAKSHA 2.0 Pilot ULBs</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(ULB/State)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    150/29
                  </div>
                </div>
                <img src="/assets/Vector_01.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 2: District Onboarded */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0ba29d 0%, #20c5ba 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(11, 162, 157, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>District Onboarded</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(District/State)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    99/26
                  </div>
                </div>
                <img src="/assets/Vector_02.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 3: ULB Onboarded */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>ULB Onboarded</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(ULB/District)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    104/99
                  </div>
                </div>
                <img src="/assets/Vector_03.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 4: Survey User Onboarded */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>Survey User</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Onboarded</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    1490
                  </div>
                </div>
                <img src="/assets/Vector_04.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 5: Survey Unit Created */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e60d5 0%, #498ff7 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(30, 96, 213, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>Survey Unit Created</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(SU/ULB)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    10237/104
                  </div>
                </div>
                <img src="/assets/VectorSUC_04.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 6: Map Uploaded */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(13, 148, 136, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>Map Uploaded</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(SU/ULB)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    8771/101
                  </div>
                </div>
                <img src="/assets/Vector_05.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 7: GT Completed */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>GT Completed</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(Plots/ULB)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    423719/92
                  </div>
                </div>
                <img src="/assets/VectorGT_07.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>

              {/* Card 8: ROR Tagged */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600 }}>ROR Tagged</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>(Plots/ULB)</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', letterSpacing: '-0.5px' }}>
                    219353/86
                  </div>
                </div>
                <img src="/assets/Vector_08.svg" alt="" style={{ width: '42px', height: '42px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Circulars Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '20px 22px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            position: 'relative'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0f3b6c',
              margin: '0 0 16px 0'
            }}
          >
            Circulars
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Item 1 */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: '1.4' }}>
                  NAKSHA 2.0 (SIH 2026) 3D Cadastral Digital Twin & Volumetric Land Governance Prototype
                </span>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                >
                  New
                </span>
              </div>
            </div>

            {/* Item 2 */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: '1.4' }}>
                OM dated 02.01.2024 – Save Paper Campaign
              </span>
            </div>

            {/* Item 3 */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: '1.4' }}>
                  Observing National Cyber Security Awareness Month (NCSAM)001
                </span>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                >
                  New
                </span>
              </div>
            </div>

            {/* Item 4 */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: '1.4' }}>
                  Advisory on switching-off personal computer while leaving office
                </span>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                >
                  New
                </span>
              </div>
            </div>

            {/* Item 5 */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: '1.4' }}>
                Re-advertisement for the post of DC and AC on deputation
              </span>
            </div>

            {/* Item 6 */}
            <div style={{ paddingBottom: '4px' }}>
              <span style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: '1.4' }}>
                Circular regarding Rashtriya Ekta Diwas on 31 Oct 2023
              </span>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a
              href="#circulars-section"
              style={{
                color: '#005cbb',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              See More
            </a>

            {/* Subtle watermark document icon */}
            <FileText size={24} color="#cbd5e1" style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. NAKSHA AT A GLANCE - STATE SPECIFIC (Map, State Dropdown & 9 Metrics)   */}
      {/* ========================================================================= */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '50px auto 0 auto',
          padding: '0 24px'
        }}
      >
        <div
          className="portal-state-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
            gap: '36px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Interactive India Map with Legend */}
          <div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <img
                src="/assets/india map.png"
                alt="NAKSHA India State Map"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '440px',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Map Legend */}
            <div
              style={{
                marginTop: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12.5px',
                color: '#334155'
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Legend</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1d74d4' }} />
                <span>Onboarded State/UT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
                <span>API State</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span>Other State/UT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f97316' }} />
                <span>Selection Indicator</span>
              </div>
            </div>
          </div>

          {/* Right Column: State Dropdown & 9 Metric Cards */}
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f3b6c',
                marginBottom: '16px'
              }}
            >
              NAKSHA 2.0 at a Glance - State Specific
            </h2>

            {/* State Selector Dropdown */}
            <div style={{ marginBottom: '20px' }}>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  color: '#1e293b',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                {Object.keys(stateMetricsDatabase).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 9 State Metric Cards (3x3 Grid) */}
            <div
              className="portal-state-metrics-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}
            >
              {/* 1. NAKSHA 2.0 Pilot ULBs */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>NAKSHA 2.0 Pilot</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>ULBs</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.pilotUlbs}
                  </div>
                </div>
                {/* SVG Outline Icon */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
              </div>

              {/* 2. ULB Onboarded */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>ULB Onboarded</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Cities</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.ulbOnboarded}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                </svg>
              </div>

              {/* 3. Survey User Onboarded */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>Survey User</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Onboarded</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.surveyUsers}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              </div>

              {/* 4. Survey Unit Created (SU/ULB) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>Survey Unit Created</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>(SU/ULB)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.suCreated}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeDasharray="3 3" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>

              {/* 5. ORI (TPK) Uploaded */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>ORI (TPK) Uploaded</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>(SU/ULB)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.oriUploaded}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M9 15l3-3 3 3" />
                </svg>
              </div>

              {/* 6. FE (GDB) Uploaded */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>FE (GDB) Uploaded</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>(SU/ULB)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.feUploaded}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              {/* 7. Ground Truthing Completed */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>Ground Truthing Completed</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>(Plots/ULB)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.gtCompleted}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <circle cx="12" cy="7" r="3" />
                  <path d="M7 21v-4a5 5 0 0 1 10 0v4" />
                  <line x1="19" y1="7" x2="22" y2="7" />
                </svg>
              </div>

              {/* 8. ROR Tagged */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>ROR Tagged</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>(Plots/ULB)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.rorTagged}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>

              {/* 9. Active Rover Status */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f3b6c' }}>Active Rover Status</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>(Rovers/ULB)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {currentStateMetrics.activeRovers}
                  </div>
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v14" />
                  <path d="M8 11a5 5 0 0 1 8 0" />
                  <path d="M5 8a9 9 0 0 1 14 0" />
                </svg>
              </div>
            </div>

            {/* Union Territories of India Reference */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f3b6c', marginBottom: '10px' }}>
                Union Territories of India
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '6px 20px',
                  fontSize: '12.5px',
                  color: '#005cbb'
                }}
              >
                <span>Andaman & Nicobar Islands</span>
                <span>Jammu And Kashmir</span>
                <span>Chandigarh</span>
                <span>Lakshadweep</span>
                <span>Delhi</span>
                <span>Ladakh</span>
                <span>Dadra & Nagar Haveli & Daman & Diu</span>
                <span>Puducherry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. WHAT IS NAKSHA 2.0 & OUR MISSION SECTION (3D Parcel + Desktop App CTA)  */}
      {/* ========================================================================= */}
      <div
        id="about-section"
        style={{
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: '50px 24px',
          marginTop: '60px'
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div
            className="portal-about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Graphic: 3D Isometric Grass Land Parcel with Drone */}
            <div style={{ textAlign: 'center' }}>
              <img
                src="/assets/extracted/3d_parcel.png"
                alt="NAKSHA 2.0 3D Cadastral Land Survey Parcel"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '320px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/about-bg-img.png';
                }}
              />
            </div>

            {/* Right Text: What is NAKSHA 2.0 & Our Mission? */}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f3b6c', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Smart India Hackathon 2026 Innovation
              </div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#005cbb',
                  marginBottom: '14px'
                }}
              >
                What is NAKSHA 2.0 & Our Mission?
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.75',
                  color: '#334155',
                  textAlign: 'justify',
                  margin: '0 0 20px 0'
                }}
              >
                <strong>NAKSHA 2.0</strong> is an advanced 3D Cadastral Intelligence and Urban Digital Twin prototype engineered for the <strong>Smart India Hackathon (SIH 2026)</strong>. While legacy cadastral surveys map only two-dimensional surface parcels, NAKSHA 2.0 introduces volumetric 3D modeling tailored for high-density multi-storey urban habitations. Our mission is to empower citizens and government administrations with sub-centimeter RTK GNSS geospatial accuracy, automated 3D mesh reconstruction from drone photogrammetry and LiDAR point clouds, floor-wise vertical ULPIN demarcation, and instant Urban Property Card (UPC) verification.
              </p>

              {/* Download Desktop App CTA Banner */}
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af' }}>
                    🖥️ Experience Full 3D Modeling on Desktop Workstation
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                    Download the standalone Windows app for offline GPU-accelerated volumetric rendering and RTK field survey tools.
                  </div>
                </div>

                <button
                  onClick={() => setDesktopModalOpen(true)}
                  id="about-desktop-download-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                  <Download size={15} />
                  <span>Download Desktop App</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Circular Feature Badges */}
          <div
            className="portal-circle-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginTop: '48px'
            }}
          >
            {/* Objective 1 */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="/assets/extracted/obj_circle_1.png"
                  alt="Automated 3D Cadastral Twin"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f3b6c', padding: '0 10px' }}>
                Automated 3D Cadastral Digital Twin
              </div>
            </div>

            {/* Objective 2 */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="/assets/extracted/obj_circle_2.png"
                  alt="Multi-Floor Vertical ULPIN Demarcation"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f3b6c', padding: '0 10px' }}>
                Multi-Floor Vertical ULPIN Demarcation
              </div>
            </div>

            {/* Objective 3 */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="/assets/extracted/obj_circle_3.png"
                  alt="Sub-Centimeter RTK GNSS Accuracy"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f3b6c', padding: '0 10px' }}>
                Sub-Centimeter RTK GNSS Field Accuracy
              </div>
            </div>

            {/* Objective 4 */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="/assets/extracted/obj_circle_4.png"
                  alt="Standalone GPU Desktop 3D Workstation"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f3b6c', padding: '0 10px' }}>
                Standalone GPU Desktop 3D Workstation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. NAKSHA SUPPORTING PARTNERS (Government State Seals Banner)              */}
      {/* ========================================================================= */}
      <div style={{ backgroundColor: '#ffffff', padding: '40px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#0f3b6c',
              marginBottom: '24px'
            }}
          >
            NAKSHA 2.0 Ecosystem & Supporting Partners
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}
          >
            <img
              src="/assets/extracted/partners_banner.png"
              alt="NAKSHA State Government Supporting Partners: Nagaland, Odisha, Puducherry, Punjab, Rajasthan, Sikkim, Jammu and Kashmir, Karnataka, Telangana"
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '65px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 10. PHOTO GALLERY (Field Drone Surveys & Innovation Milestones)           */}
      {/* ========================================================================= */}
      <div
        id="gallery-section"
        style={{
          maxWidth: '1360px',
          margin: '50px auto 0 auto',
          padding: '0 24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#0f3b6c',
                margin: 0
              }}
            >
              Photo Gallery & Field Survey Impressions
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              High-resolution drone surveys, 3D cadastral ground truthing, and stakeholder consultations.
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#005cbb' }}>
            5 Field Photographs
          </span>
        </div>

        {/* Responsive Photo Grid */}
        <div
          className="portal-photo-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {[
            {
              src: '/assets/photo-img01.png',
              title: 'National Launch of City Survey Programme - Dignitaries on Stage'
            },
            {
              src: '/assets/photo-img02.png',
              title: 'Dignitaries Inspecting Survey Drone Technology & Sensors'
            },
            {
              src: '/assets/photo-img03.png',
              title: 'Memento Presentation at NAKSHA Mission Gathering'
            },
            {
              src: '/assets/photo-img04.png',
              title: 'Field Surveyors & Officials at Regional Convention'
            },
            {
              src: '/assets/photo-img05.png',
              title: 'Citizens and Beneficiaries Gathering & Property Card Distribution'
            }
          ].map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                aspectRatio: '16/11',
                position: 'relative',
                backgroundColor: '#e2e8f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px 12px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  lineHeight: '1.3'
                }}
              >
                {photo.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11. THREE DARK BLUE CARDS (Notification, Tender, Events)                  */}
      {/* ========================================================================= */}
      <div
        id="events-section"
        style={{
          maxWidth: '1360px',
          margin: '50px auto 0 auto',
          padding: '0 24px'
        }}
      >
        <div
          className="portal-three-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          {/* Card 1: Notification */}
          <div
            style={{
              backgroundColor: '#1b3b6f',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)'
            }}
          >
            {/* Calendar Star Watermark */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.18 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polygon points="12 13 13 15 15 15 13.5 16.5 14 19 12 17.5 10 19 10.5 16.5 9 15 11 15 12 13" />
              </svg>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Latest Announcements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12.5px', lineHeight: '1.5', opacity: 0.95 }}>
                <p style={{ margin: 0 }}>
                  🚀 <strong>NAKSHA 2.0 Desktop Workstation (v2.0.0):</strong> Standalone 64-bit release available for Windows with offline GPU volumetric 3D cadastre rendering.
                </p>
                <p style={{ margin: 0 }}>
                  🏢 <strong>Smart India Hackathon 2026:</strong> Automated multi-floor apartment vertical ULPIN demarcation successfully validated on pilot drone point clouds.
                </p>
                <p style={{ margin: 0 }}>
                  🛰️ <strong>RTK GNSS Integration:</strong> High-precision sub-centimeter field boundary calibration now enabled across all pilot survey units.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setDesktopModalOpen(true)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={13} />
                <span>Get Desktop Workstation</span>
              </button>
            </div>
          </div>

          {/* Card 2: Innovation Highlights */}
          <div
            style={{
              backgroundColor: '#1b3b6f',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)'
            }}
          >
            {/* Gavel / Tech Watermark */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.18 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                <path d="M14 13l-7.5 7.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8L11.2 10.2" />
                <path d="M16 16l6-6" />
                <path d="M8 8l6-6" />
                <path d="M9 7l8 8" />
                <path d="M21 11l-8-8" />
              </svg>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>SIH 2026 Core Tech</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', opacity: 0.95 }}>
                <div>• Automated 3D building reconstruction from 2D aerial tiles</div>
                <div>• Floor-wise 3D apartment bounding boxes & clearance verification</div>
                <div>• Tamper-proof 3D Urban Property Cards (UPC) with SHA-256 verification</div>
                <div>• Sub-centimeter RTK rover live correction telemetry via NTRIP</div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <span style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 600 }}>NAKSHA 2.0 Innovation Architecture</span>
            </div>
          </div>

          {/* Card 3: Events */}
          <div
            style={{
              backgroundColor: '#1b3b6f',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)'
            }}
          >
            {/* Bell Watermark */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.18 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Project Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Event 1 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src="/assets/photo-img01.png"
                    alt="Event 1"
                    style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                  />
                  <div style={{ fontSize: '11px', lineHeight: '1.4', opacity: 0.95 }}>
                    Smart India Hackathon 2026 Showcase: Demonstration of NAKSHA 2.0 3D Cadastral Digital Twin System.
                  </div>
                </div>

                {/* Event 2 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src="/assets/photo-img04.png"
                    alt="Event 2"
                    style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                  />
                  <div style={{ fontSize: '11px', lineHeight: '1.4', opacity: 0.95 }}>
                    Technical Workshop: Volumetric 3D Property Cards, BIM integration, and RTK field rover synchronization.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <a href="#events-section" style={{ color: '#93c5fd', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}>
                See More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 12. FOOTER SECTION & BOTTOM BAR                                           */}
      {/* ========================================================================= */}
      <footer
        id="downloads-section"
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          marginTop: '60px',
          padding: '48px 24px 0 24px'
        }}
      >
        <div
          className="portal-footer-grid"
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr 1fr 1.3fr',
            gap: '36px',
            paddingBottom: '40px'
          }}
        >
          {/* Column 1: QR Code & Downloads */}
          <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src="/assets/android-app-qr.svg"
                alt="NAKSHA App QR Code"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  padding: '4px',
                  backgroundColor: '#ffffff'
                }}
              />
              <div>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                  And Continue to Contribute Towards Building a New India on the Move
                </p>
              </div>
            </div>

            {/* App Download Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDesktopModalOpen(true)}
                id="footer-desktop-download-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#005cbb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  boxShadow: '0 2px 8px rgba(0,92,187,0.2)'
                }}
              >
                <Monitor size={15} />
                <span>Download Desktop 3D App</span>
                <Download size={13} />
              </button>
            </div>
          </div>

          {/* Column 2: Related Initiatives */}
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#005cbb', marginBottom: '14px' }}>
              Related Initiatives
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <li>
                <a href="https://sih.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>
                  Smart India Hackathon (SIH 2026)
                </a>
              </li>
              <li>
                <a href="https://surveyofindia.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>
                  Survey of India (SOI)
                </a>
              </li>
              <li>
                <a href="https://dilrmp.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>
                  DILRMP Modernization Portal
                </a>
              </li>
              <li>
                <a href="https://nic.in" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>
                  National Informatics Centre (NIC)
                </a>
              </li>
              <li>
                <a href="https://mohua.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>
                  Ministry of Housing & Urban Affairs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful links */}
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#005cbb', marginBottom: '14px' }}>
              Useful links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <li>
                <a href="#milestones-section" style={{ color: '#475569', textDecoration: 'none' }}>
                  Power BI Dashboard
                </a>
              </li>
              <li>
                <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>
                  State Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/ulb/claim-redressal" style={{ color: '#475569', textDecoration: 'none' }}>
                  Citizen Grievance & Claims
                </Link>
              </li>
              <li>
                <a href="#circulars-section" style={{ color: '#475569', textDecoration: 'none' }}>
                  Standard Operating Procedures
                </a>
              </li>
              <li>
                <Link to="/desktop" style={{ color: '#475569', textDecoration: 'none' }}>
                  Desktop Utility Manual
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#005cbb', marginBottom: '14px' }}>
              Contact Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#64748b" />
                <span>+91-11-24011525</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#64748b" />
                <span>contact@naksha2.gov.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
                <MapPin size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Kartavya Bhavan-03, Ground Floor, Kartavya Path, Rajpath Area, Central Secretariat, New Delhi, Delhi 110001, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Absolute Bottom Dark Navy Bar */}
        <div
          className="portal-bottom-bar"
          style={{
            backgroundColor: '#071428',
            color: '#94a3b8',
            padding: '14px 24px',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Left: NAKSHA 2.0 SIH branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>NAKSHA 2.0 • Smart India Hackathon (SIH 2026) Innovation Prototype • 3D Cadastral Digital Twin</span>
          </div>

          {/* Center: Timestamp & Visitor Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={13} color="#94a3b8" />
              <span>Last Updated : <strong>16/09/2026</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={13} color="#94a3b8" />
              <span>Visitor Count : <strong style={{ color: '#ffffff' }}>36795</strong></span>
            </div>
          </div>

          {/* Right: Terms & Privacy */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <a href="#terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="#privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 13. FLOATING BACK TO TOP BUTTON (Cyan circular FAB)                       */}
      {/* ========================================================================= */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#00a8e8',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 4px 14px rgba(0,168,232,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300,
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          aria-label="Back to Top"
        >
          <ArrowUp size={22} />
        </button>
      )}

      {/* ========================================================================= */}
      {/* 14. ACCESSIBILITY MODAL                                                   */}
      {/* ========================================================================= */}
      {accessibilityModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setAccessibilityModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '440px',
              width: '90%',
              boxShadow: '0 20px 35px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f3b6c' }}>
                Accessibility Settings
              </h3>
              <button
                onClick={() => setAccessibilityModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Text Size Adjustment
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setFontSize('normal')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: fontSize === 'normal' ? '2px solid #005cbb' : '1px solid #cbd5e1',
                      background: fontSize === 'normal' ? '#eff6ff' : '#ffffff',
                      color: fontSize === 'normal' ? '#005cbb' : '#334155',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    A- (Default)
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: fontSize === 'large' ? '2px solid #005cbb' : '1px solid #cbd5e1',
                      background: fontSize === 'large' ? '#eff6ff' : '#ffffff',
                      color: fontSize === 'large' ? '#005cbb' : '#334155',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    A (Large)
                  </button>
                  <button
                    onClick={() => setFontSize('larger')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: fontSize === 'larger' ? '2px solid #005cbb' : '1px solid #cbd5e1',
                      background: fontSize === 'larger' ? '#eff6ff' : '#ffffff',
                      color: fontSize === 'larger' ? '#005cbb' : '#334155',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    A+ (Larger)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Contrast Mode
                </label>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: highContrast ? '#0f172a' : '#f8fafc',
                    color: highContrast ? '#ffffff' : '#1e293b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{highContrast ? 'Switch to Standard Theme' : 'Enable High Contrast Mode'}</span>
                </button>
              </div>

              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                This portal follows the Guidelines for Indian Government Websites (GIGW) and Web Content Accessibility Guidelines (WCAG) 2.0 level AA standard.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. PHOTO LIGHTBOX MODAL                                                  */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              backgroundColor: '#000000',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <div style={{ padding: '12px 16px', color: '#ffffff', fontSize: '13px', backgroundColor: '#111827' }}>
              {selectedPhoto.title}
            </div>
          </div>
        </div>
      )}


      {/* Standalone Desktop 3D App Download Modal */}
      <DesktopDownloadModal
        isOpen={desktopModalOpen}
        onClose={() => setDesktopModalOpen(false)}
      />
    </div>
  );
};

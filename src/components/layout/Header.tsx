import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut, Shield, ExternalLink, RefreshCw, Monitor, Building2, Sparkles, MapPin, Download } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { mockStore } from '../../data/mockStore';
import { DesktopDownloadModal } from '../desktop/DesktopDownloadModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = mockStore.getAuthUser();

  const isSurveyorMode = location.pathname.startsWith('/surveyor') || authUser.portalMode === 'surveyor';
  const isUlbMode = !isSurveyorMode && (location.pathname.startsWith('/ulb') || authUser.portalMode === 'ulb');
  const isStateMode = !isSurveyorMode && !isUlbMode && (authUser.portalMode === 'state' || location.pathname.startsWith('/state'));
  const isDistrictMode = !isSurveyorMode && !isUlbMode && !isStateMode;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langHindi, setLangHindi] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const switchRole = (role: 'state' | 'district' | 'ulb' | 'surveyor') => {
    mockStore.switchPortalRole(role);
    setRoleMenuOpen(false);
    if (role === 'state') {
      navigate('/state/home');
    } else if (role === 'district') {
      navigate('/portal/home');
    } else if (role === 'surveyor') {
      navigate('/surveyor/dashboard');
    } else {
      navigate('/ulb/home');
    }
  };

  const getHomeLink = () => {
    if (isSurveyorMode) return '/surveyor/home';
    if (isUlbMode) return '/ulb/home';
    if (isStateMode) return '/state/home';
    return '/portal/home';
  };

  return (
    <header className="naksha-admin-header" style={{ width: '100%', flexShrink: 0, zIndex: 40 }}>
      {/* Top Gov of India Accessibility Strip */}
      <div style={{
        backgroundColor: '#0f2b5c',
        color: '#e2e8f0',
        padding: '4px 24px',
        fontSize: '11.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600 }}>भारत सरकार | Government of India</span>
          <span style={{ color: '#93c5fd', marginLeft: '6px' }}>• Department of Land Resources</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => setDownloadModalOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 700,
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '4px'
            }}
            title="Download NAKSHA Desktop Application (Windows 64-bit)"
          >
            <Download size={12} />
            <span>Download Desktop App</span>
          </button>
          <Link to="/" style={{ color: '#93c5fd', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Public Portal</span>
            <ExternalLink size={11} />
          </Link>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', padding: '0 4px' }}>A-</span>
            <span style={{ cursor: 'pointer', padding: '0 4px', fontWeight: 'bold' }}>A</span>
            <span style={{ cursor: 'pointer', padding: '0 4px' }}>A+</span>
          </div>
          {/* Authentic Accessibility Icon & Text */}
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11.5px',
              cursor: 'pointer'
            }}
            title="Accessibility Options"
          >
            <span style={{ fontSize: '13px' }}>♿</span>
            <span>{langHindi ? 'सुलभता' : 'Accessibility'}</span>
          </button>
          {/* Authentic Language Switch Button (अ / A) */}
          <button
            onClick={() => setLangHindi(!langHindi)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Toggle Language / भाषा बदलें"
          >
            <span>अ</span>
            <span>/</span>
            <span>A</span>
          </button>
        </div>
      </div>

      {/* Main White Header Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        height: '62px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}>
        {/* Left: NAKSHA Official Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to={getHomeLink()} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/assets/naksha_2_logo.png"
              alt="NAKSHA 2.0"
              title="NAKSHA 2.0 - National Geospatial Knowledge-based Land Survey of Urban Habitations"
              style={{ height: '42px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          {isUlbMode && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#eff6ff',
              color: '#1b539c',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid #bfdbfe'
            }}>
              <Building2 size={13} />
              <span>ULB 3D LAND INTELLIGENCE</span>
            </div>
          )}
        </div>

        {/* Right: Badges & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* 3-Way Role Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              title="Switch between State Admin, District Admin, and ULB Admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isUlbMode ? '#f0fdf4' : isStateMode ? '#eff6ff' : '#f8fafc',
                color: isUlbMode ? '#16a34a' : isStateMode ? '#1b539c' : '#334155',
                border: isUlbMode ? '1.5px solid #bbf7d0' : isStateMode ? '1.5px solid #bfdbfe' : '1.5px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={12} />
              <span>
                Role: {isUlbMode ? 'ULB Admin' : isStateMode ? 'State Admin' : 'District Admin'}
              </span>
              <ChevronDown size={13} />
            </button>

            {roleMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '230px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                padding: '6px 0',
                zIndex: 100
              }}>
                <div style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Select Operating Role
                </div>

                {/* ULB Admin Option */}
                <button
                  onClick={() => switchRole('ulb')}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    border: 'none',
                    background: isUlbMode ? '#f0fdf4' : 'none',
                    color: isUlbMode ? '#16a34a' : '#1e293b',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    fontWeight: isUlbMode ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Building2 size={14} color="#16a34a" />
                  <div>
                    <div>ULB Admin (PMRDA Pune)</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>2D→3D Land Intelligence</div>
                  </div>
                </button>

                {/* District Admin Option */}
                <button
                  onClick={() => switchRole('district')}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    border: 'none',
                    background: isDistrictMode ? '#eff6ff' : 'none',
                    color: isDistrictMode ? '#1b539c' : '#1e293b',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    fontWeight: isDistrictMode ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Shield size={14} color="#1b539c" />
                  <div>
                    <div>District Admin (Pune DM / Collector)</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>Survey & Final Publication</div>
                  </div>
                </button>

                {/* State Admin Option */}
                <button
                  onClick={() => switchRole('state')}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    border: 'none',
                    background: isStateMode ? '#eff6ff' : 'none',
                    color: isStateMode ? '#1b539c' : '#1e293b',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    fontWeight: isStateMode ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <User size={14} color="#0f766e" />
                  <div>
                    <div>State Admin (Maharashtra / CM)</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>Statewide Governance • Mantralaya</div>
                  </div>
                </button>

                {/* Surveyor MAP-2 Option */}
                <button
                  onClick={() => switchRole('surveyor')}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    border: 'none',
                    background: isSurveyorMode ? '#eff6ff' : 'none',
                    color: isSurveyorMode ? '#1e88e5' : '#1e293b',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    fontWeight: isSurveyorMode ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <MapPin size={14} color="#1e88e5" />
                  <div>
                    <div>Surveyor Pune (Hinjawadi IT Park)</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>Field Survey & 3D Intelligence</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mode Badges */}
          {isDistrictMode && (
            <>
              <div style={{
                background: '#eff6ff',
                color: '#1b539c',
                border: '1.5px solid #bfdbfe',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Shield size={12} color="#1b539c" />
                <span>GIS DM</span>
              </div>
              <div style={{
                background: '#1b539c',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                EIA
              </div>
            </>
          )}

          {isUlbMode && (
            <>
              <div style={{
                background: '#eff6ff',
                color: '#1b539c',
                border: '1.5px solid #bfdbfe',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Building2 size={12} color="#1b539c" />
                <span>ULB PMRDA</span>
              </div>
              <div style={{
                background: '#1b539c',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                3D-GIS
              </div>
            </>
          )}

          {isSurveyorMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                {langHindi ? 'सर्वेक्षक पुणे' : 'Surveyor Pune'}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                fontSize: '12.5px',
                color: '#1e293b',
                fontWeight: 600,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                <span>{langHindi ? 'सर्वेक्षक _ पुणे (हिंजवडी)' : 'Surveyor_Pune (Hinjawadi)'}</span>
                <ChevronDown size={14} color="#64748b" />
              </div>
            </div>
          )}

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                position: 'relative',
                background: isSurveyorMode ? '#eff6ff' : '#f8fafc',
                border: isSurveyorMode ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1b539c'
              }}
            >
              <Bell size={17} />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '16px',
                height: '16px',
                padding: '0 4px',
                backgroundColor: '#1e88e5',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                4
              </span>
            </button>

            {notifOpen && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '320px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                padding: '12px',
                zIndex: 100
              }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  Notifications ({isSurveyorMode ? 'Surveyor Pune (Hinjawadi)' : isUlbMode ? 'ULB PMRDA' : isStateMode ? 'State Maharashtra' : 'Pune District'})
                </div>
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isSurveyorMode ? (
                    <>
                      <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #16a34a' }}>
                        <b>3D Spatial Model Ready:</b> I²IT Main Academic Complex (Plot P-14) 3D volumes reconstructed with 98.2% confidence.
                      </div>
                      <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #2563eb' }}>
                        <b>GT Point Verified:</b> DGPS RTK Fix approved for SU-HINJ-01.
                      </div>
                      <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #d97706' }}>
                        <b>RoR Entry Action:</b> Plot P-14 Hinjawadi Phase 1 pending field verification review.
                      </div>
                    </>
                  ) : isUlbMode ? (
                    <>
                      <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #dc2626' }}>
                        <b>3D Digital Twin Synchronized:</b> Rajiv Gandhi Infotech Park Phase 1 layer linked.
                      </div>
                      <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #16a34a' }}>
                        <b>Publication Handoff:</b> Hinjawadi Ward 12 ready for District forwarding.
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #22c55e' }}>
                        <b>Onboarding Status:</b> 36 Districts registered under NAKSHA Maharashtra portal.
                      </div>
                      <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #3b82f6' }}>
                        <b>Survey Progress:</b> 2,140 Active Surveyors operating state-wide.
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '24px',
                padding: '4px 12px 4px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isSurveyorMode ? '#1e88e5' : isStateMode ? '#0f766e' : '#1b539c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '13px'
              }}>
                <User size={16} />
              </div>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                  {isSurveyorMode ? (langHindi ? 'सर्वेक्षक पुणे' : 'Surveyor Pune') : isUlbMode ? 'ULB Pune Admin' : isStateMode ? 'Maharashtra State (CM)' : 'Pune DM / Collector'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                  {isSurveyorMode ? (langHindi ? 'महाराष्ट्र' : 'Maharashtra') : isUlbMode ? 'PMRDA Pune (270410)' : 'Maharashtra'}
                </div>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '260px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0',
                padding: '6px 0',
                zIndex: 100
              }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                    Active Role: {isSurveyorMode ? 'Surveyor (Pune Hinjawadi)' : isUlbMode ? 'ULB Admin (PMRDA Pune)' : isStateMode ? 'State Admin (Maharashtra)' : 'District Admin (Pune DM)'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {isSurveyorMode ? 'surveyor.pune@maharashtra.gov.in' : isUlbMode ? 'pune_ulb@maharashtra.gov.in' : isStateMode ? 'cm.office@maharashtra.gov.in' : 'collector.pune@maharashtra.gov.in'}
                  </div>
                </div>

                {/* Profile Link matching video 10:15 */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(isUlbMode ? '/ulb/profile' : '/ulb/profile');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <User size={14} color="#1b539c" /> View Profile
                </button>

                {/* Change Password Link matching video 10:35 */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(isUlbMode ? '/ulb/change-password' : '/ulb/change-password');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Shield size={14} color="#0f766e" /> Change Password
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    switchRole(isUlbMode ? 'district' : isDistrictMode ? 'state' : 'ulb');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#1b539c',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    borderTop: '1px solid #f1f5f9'
                  }}
                >
                  <RefreshCw size={14} />
                  Cycle to Next Role
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DesktopDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </header>
  );
};

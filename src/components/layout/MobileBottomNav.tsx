import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Box,
  Map,
  LayoutDashboard,
  Download
} from 'lucide-react';
import { DesktopDownloadModal } from '../desktop/DesktopDownloadModal';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 768 : true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;

  const isHomeActive = location.pathname === '/';
  const is3DActive = location.pathname.includes('3d') || location.pathname.includes('viewer');
  const isBhuNakshaActive = location.pathname.includes('bhunaksha');
  const isPortalActive = location.pathname.startsWith('/portal') || location.pathname.startsWith('/ulb') || location.pathname.startsWith('/state') || location.pathname.startsWith('/surveyor');

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      isActive: isHomeActive
    },
    {
      to: '/surveyor/three-d-viewer',
      label: '3D Twin',
      icon: Box,
      isActive: is3DActive,
      badge: '3D'
    },
    {
      to: '/bhunaksha',
      label: 'BhuNaksha',
      icon: Map,
      isActive: isBhuNakshaActive
    },
    {
      to: '/portal/home',
      label: 'Portal',
      icon: LayoutDashboard,
      isActive: isPortalActive && !is3DActive
    }
  ];

  return (
    <>
      <nav
        aria-label="Mobile Navigation Bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(56, 189, 248, 0.28)',
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 890,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                textDecoration: 'none',
                flex: 1,
                padding: '6px 0',
                position: 'relative',
                transition: 'all 0.2s ease',
                color: active ? '#38bdf8' : '#94a3b8'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: active ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={19} color={active ? '#38bdf8' : '#94a3b8'} />
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      backgroundColor: '#22c55e',
                      color: '#022c22',
                      fontSize: '8.5px',
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: '6px',
                      lineHeight: 1
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.2px',
                  color: active ? '#38bdf8' : '#94a3b8'
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* 5th Action: Desktop App Download Modal Trigger */}
        <button
          onClick={() => setDownloadModalOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            flex: 1,
            padding: '6px 0',
            cursor: 'pointer',
            color: '#a7f3d0'
          }}
          title="Download Desktop App"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: 'rgba(34, 197, 94, 0.14)'
            }}
          >
            <Download size={18} color="#4ade80" />
          </div>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.2px',
              color: '#4ade80'
            }}
          >
            App .EXE
          </span>
        </button>
      </nav>

      {/* Standalone Desktop 3D App Download Modal */}
      <DesktopDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
};

export default MobileBottomNav;

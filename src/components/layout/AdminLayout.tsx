import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { MoreVertical, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const isThreeDViewerPage = location.pathname.includes('3d-') || location.pathname.includes('three-d-viewer');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="naksha-portal-layout" style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f1f5f9',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* 1. Persistent Left Sidebar (Visible on desktop when NOT on full-screen 3D viewer) */}
      {!isThreeDViewerPage && (
        <div className="desktop-only-sidebar" style={{ height: '100%', flexShrink: 0 }}>
          <Sidebar />
        </div>
      )}

      {/* 2. Slide-out Mobile & 3D Drawer */}
      {drawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              cursor: 'pointer'
            }}
          />

          {/* Drawer Sidebar */}
          <div style={{
            position: 'relative',
            zIndex: 10000,
            width: '280px',
            maxWidth: '82vw',
            height: '100%',
            boxShadow: '4px 0 25px rgba(0, 0, 0, 0.45)',
            animation: 'slideInLeft 0.25s ease-out'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '-42px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                zIndex: 10001
              }}
              title="Close Menu"
              aria-label="Close Navigation Menu"
            >
              <X size={18} />
            </button>
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        position: 'relative'
      }}>
        {/* Top Header with Hamburger callback */}
        <Header onToggleSidebar={() => setDrawerOpen(!drawerOpen)} />

        {/* 3-Dot Floating Navigation Button on 3D Property Intelligence */}
        {isThreeDViewerPage && !isMobile && (
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              position: 'absolute',
              top: '58px',
              left: '16px',
              zIndex: 100,
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            title="Open NAKSHA Navigation Menu"
          >
            <MoreVertical size={16} color="#38bdf8" />
            <span style={{ color: '#f8fafc', fontSize: '11px' }}>Menu</span>
          </button>
        )}

        {/* Dynamic Page Outlet */}
        <main 
          className="admin-main-viewport"
          style={{
            flex: 1,
            overflowY: isThreeDViewerPage ? 'hidden' : 'auto',
            padding: isThreeDViewerPage ? '0' : (isMobile ? '12px 12px 76px 12px' : '20px 28px'),
            backgroundColor: isThreeDViewerPage ? '#020617' : '#f8fafc'
          }}
        >
          <Outlet />
        </main>

        {/* Official NAKSHA UAT Ticker Banner (Hidden on 3D viewer & small mobile to free vertical room) */}
        {!isThreeDViewerPage && !isMobile && (
          <footer style={{
            backgroundColor: '#ef4444',
            color: '#ffffff',
            padding: '3px 20px',
            fontSize: '10.5px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexShrink: 0,
            textAlign: 'center',
            letterSpacing: '0.2px'
          }}>
            *This is a User Acceptance Testing (UAT) version of the website. All data displayed here is dummy/test data.*
          </footer>
        )}

        {/* Mobile Persistent Bottom App Bar Dock */}
        <MobileBottomNav />
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (max-width: 768px) {
          .desktop-only-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

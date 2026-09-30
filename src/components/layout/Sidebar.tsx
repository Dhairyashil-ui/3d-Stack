import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Map,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Users,
  Activity,
  BarChart3,
  Bell,
  Clock,
  AlertCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building2,
  Scale,
  AlertTriangle,
  FileCheck2,
  Send,
  AlertOctagon,
  Layers,
  Search,
  Box,
  CheckSquare,
  Scissors,
  Split,
  Eye,
  Camera,
  Layers2,
  CheckCircle2,
  Inbox,
  X
} from 'lucide-react';
import { mockStore } from '../../data/mockStore';

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = mockStore.getAuthUser();

  const isSurveyorMode = location.pathname.startsWith('/surveyor') || authUser.portalMode === 'surveyor';
  const isUlbMode = !isSurveyorMode && (location.pathname.startsWith('/ulb') || authUser.portalMode === 'ulb');
  const isStateMode = !isSurveyorMode && !isUlbMode && (authUser.portalMode === 'state' || location.pathname.startsWith('/state'));
  const basePath = isStateMode ? '/state' : '/portal';

  const isUserMgmtActive = location.pathname.includes('/user-management');
  const isSurveyActActive = location.pathname.includes('/survey-activities') || (isSurveyorMode && (
    location.pathname.includes('/map-image-verification') ||
    location.pathname.includes('/gt-points') ||
    location.pathname.includes('/merge-split') ||
    location.pathname.includes('/plot-verification') ||
    location.pathname.includes('/ror-entry') ||
    location.pathname.includes('/3d-intelligence')
  ));
  const isPropIntelActive = isSurveyorMode && (
    location.pathname.includes('/property-search') ||
    location.pathname.includes('/property/') ||
    location.pathname.includes('/2d-map') ||
    location.pathname.includes('/3d-viewer') ||
    location.pathname.includes('/building-records') ||
    location.pathname.includes('/floor-unit-records') ||
    location.pathname.includes('/evidence') ||
    location.pathname.includes('/comparison') ||
    location.pathname.includes('/verification-queue')
  );

  const [userMgmtOpen, setUserMgmtOpen] = useState<boolean>(true);
  const [surveyActOpen, setSurveyActOpen] = useState<boolean>(true);
  const [surveyorActOpen, setSurveyorActOpen] = useState<boolean>(true);
  const [surveyorPropIntelOpen, setSurveyorPropIntelOpen] = useState<boolean>(true);

  const openAnomaliesCount = mockStore.getAnomalies().filter(a => a.status === 'Open').length;

  const handleSignOut = () => {
    navigate('/login');
  };

  const getLinkStyle = (isActive: boolean) => {
    if (isSurveyorMode) {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '9px 18px',
        margin: '2px 8px',
        color: isActive ? '#1976d2' : '#ffffff',
        backgroundColor: isActive ? '#ffffff' : 'transparent',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: isActive ? 700 : 500,
        boxShadow: isActive ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s ease'
      };
    }
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 20px',
      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
      borderLeft: isActive ? '4px solid #ffffff' : '4px solid transparent',
      textDecoration: 'none',
      fontSize: '13.5px',
      fontWeight: isActive ? 600 : 500,
      transition: 'all 0.15s ease'
    };
  };

  return (
    <aside
      className="naksha-sidebar"
      style={{
        width: collapsed ? '68px' : '260px',
        backgroundColor: isSurveyorMode ? '#1e88e5' : '#1b539c',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        boxShadow: '2px 0 8px rgba(0,0,0,0.12)',
        zIndex: 50,
        overflowY: 'auto'
      }}
    >
      {/* Sidebar Header Title Banner matching State and District structure */}
      {!collapsed && (
        <div style={{
          padding: '16px 16px 10px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div>
            <div style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#93c5fd', fontWeight: 700 }}>
              {isSurveyorMode ? 'FIELD SURVEY & GROUND TRUTHING' : isUlbMode ? 'URBAN LOCAL BODY (PMRDA / PMC)' : isStateMode ? 'STATE ADMINISTRATION' : 'DISTRICT ADMINISTRATION'}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {isSurveyorMode ? 'Surveyor Pune (Hinjawadi IT Park)' : isUlbMode ? 'ULB Pune Admin (270410)' : isStateMode ? 'Maharashtra State Portal' : 'Pune District GIS'}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title="Close Menu"
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {/* =========================================================================
            SURVEYOR MAP-2 & 3D PROPERTY INTELLIGENCE NAVIGATION BRANCH
            ========================================================================= */}
        {isSurveyorMode ? (
          <>
            {/* 1. Home */}
            <NavLink
              to="/surveyor/home"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Home size={18} />
              {!collapsed && <span>Home</span>}
            </NavLink>

            {/* 2. Dashboard */}
            <NavLink
              to="/surveyor/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            {/* 3. Survey Unit Details */}
            <NavLink
              to="/surveyor/survey-units"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <FileSpreadsheet size={18} />
              {!collapsed && <span>Survey Unit Details</span>}
            </NavLink>

            {/* 4. Survey Activities Accordion */}
            <div>
              <button
                onClick={() => setSurveyorActOpen(!surveyorActOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 18px',
                  margin: '2px 8px',
                  width: 'calc(100% - 16px)',
                  color: isSurveyActActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: isSurveyActActive ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Activity size={18} />
                  {!collapsed && <span>Survey Activities</span>}
                </div>
                {!collapsed && (surveyorActOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
              </button>

              {surveyorActOpen && !collapsed && (
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)', padding: '4px 0', margin: '2px 8px', borderRadius: '6px' }}>
                  <NavLink
                    to="/surveyor/map-image-verification"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Map & Image Verification
                  </NavLink>
                  <NavLink
                    to="/surveyor/gt-points"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Upload GT Points
                  </NavLink>
                  <NavLink
                    to="/surveyor/merge-split"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Merge & Split
                  </NavLink>
                  <NavLink
                    to="/surveyor/plot-verification"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Plot Verification
                  </NavLink>
                  <NavLink
                    to="/surveyor/ror-entry"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    ROR Entry
                  </NavLink>
                  <NavLink
                    to="/surveyor/3d-intelligence"
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#93c5fd',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 600
                    })}
                  >
                    <span>3D Property Intelligence</span>
                    <span style={{ fontSize: '9.5px', backgroundColor: '#3b82f6', color: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>NEW</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* 5. Property Intelligence Accordion [NEW] */}
            <div>
              <button
                onClick={() => setSurveyorPropIntelOpen(!surveyorPropIntelOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 18px',
                  margin: '2px 8px',
                  width: 'calc(100% - 16px)',
                  color: isPropIntelActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: isPropIntelActive ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Box size={18} />
                  {!collapsed && <span>Property Intelligence</span>}
                </div>
                {!collapsed && (surveyorPropIntelOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
              </button>

              {surveyorPropIntelOpen && !collapsed && (
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)', padding: '4px 0', margin: '2px 8px', borderRadius: '6px' }}>
                  <NavLink
                    to="/surveyor/property-search"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Property Search
                  </NavLink>
                  <NavLink
                    to="/surveyor/2d-map"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    2D GIS Map
                  </NavLink>
                  <NavLink
                    to="/surveyor/3d-viewer"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    3D GIS Viewer
                  </NavLink>
                  <NavLink
                    to="/surveyor/building-records"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Building Records
                  </NavLink>
                  <NavLink
                    to="/surveyor/floor-unit-records"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Floor / Unit Records
                  </NavLink>
                  <NavLink
                    to="/surveyor/evidence"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Evidence Vault
                  </NavLink>
                  <NavLink
                    to="/surveyor/comparison"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Plan Comparison
                  </NavLink>
                  <NavLink
                    to="/surveyor/verification-queue"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 16px 7px 36px',
                      color: isActive ? '#1976d2' : '#ffffff',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 400
                    })}
                  >
                    Verification Queue
                  </NavLink>
                </div>
              )}
            </div>

            {/* 6. Manage Publication */}
            <NavLink
              to="/surveyor/manage-publication"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Send size={18} />
              {!collapsed && <span>Manage Publication</span>}
            </NavLink>

            {/* 7. Claim & Redressal */}
            <NavLink
              to="/surveyor/claims-redressal"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <AlertOctagon size={18} />
              {!collapsed && <span>Claim & Redressal</span>}
            </NavLink>

            {/* 8. Report */}
            <NavLink
              to="/surveyor/reports"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <BarChart3 size={18} />
              {!collapsed && <span>Report</span>}
            </NavLink>

            {/* 9. Notification */}
            <NavLink
              to="/surveyor/notifications"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Bell size={18} />
              {!collapsed && <span>Notification</span>}
            </NavLink>

            {/* 10. Manage Log */}
            <NavLink
              to="/surveyor/logs"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Clock size={18} />
              {!collapsed && <span>Manage Log</span>}
            </NavLink>
          </>
        ) : isUlbMode ? (
          <>
            {/* 1. Home */}
            <NavLink
              to="/ulb/home"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Home size={18} />
              {!collapsed && <span>Home</span>}
            </NavLink>

            {/* 2. Dashboard */}
            <NavLink
              to="/ulb/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            {/* 3. Package Reception & Survey Assignment (Replaced Create Committee) */}
            <NavLink
              to="/ulb/committee-formation"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Inbox size={18} />
              {!collapsed && <span>Package Reception & Survey Team</span>}
            </NavLink>

            {/* 4. Create Survey Unit */}
            <NavLink
              to="/ulb/create-survey-unit"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <FileSpreadsheet size={18} />
              {!collapsed && <span>Create Survey Unit</span>}
            </NavLink>

            {/* 5. User Management Accordion */}
            <div>
              <button
                onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 20px',
                  color: isUserMgmtActive ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
                  backgroundColor: isUserMgmtActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 'none',
                  borderLeft: isUserMgmtActive ? '4px solid #ffffff' : '4px solid transparent',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Users size={18} />
                  {!collapsed && <span>User Management</span>}
                </div>
                {!collapsed && (userMgmtOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
              </button>

              {userMgmtOpen && !collapsed && (
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.14)', padding: '4px 0' }}>
                  <NavLink
                    to="/ulb/master/manage-departmentrole"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Create/Manage Department
                  </NavLink>
                  <NavLink
                    to="/ulb/master/manage-designation"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Create/Manage Designation
                  </NavLink>
                  <NavLink
                    to="/ulb/master/manage-role-permission"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Create/Manage Role
                  </NavLink>
                  <NavLink
                    to="/ulb/master/manage-user"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Create/Manage User
                  </NavLink>
                  <NavLink
                    to="/ulb/master/manage-user-role"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Assign Role To User
                  </NavLink>
                  <NavLink
                    to="/ulb/master/manage-area-location"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Assign Area To User
                  </NavLink>
                </div>
              )}
            </div>

            {/* 6. Survey Unit Details */}
            <NavLink
              to="/ulb/survey-units-details"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <FileSpreadsheet size={18} />
              {!collapsed && <span>Survey Unit Details</span>}
            </NavLink>

            {/* 7. Survey Activities Accordion */}
            <div>
              <button
                onClick={() => setSurveyActOpen(!surveyActOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 20px',
                  color: isSurveyActActive ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
                  backgroundColor: isSurveyActActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 'none',
                  borderLeft: isSurveyActActive ? '4px solid #ffffff' : '4px solid transparent',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Activity size={18} />
                  {!collapsed && <span>Survey Activities</span>}
                </div>
                {!collapsed && (surveyActOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
              </button>

              {surveyActOpen && !collapsed && (
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.14)', padding: '4px 0' }}>
                  <NavLink
                    to="/ulb/urban-survey-publication"
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '7px 20px 7px 48px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400
                    })}
                  >
                    Manage Publication
                  </NavLink>
                </div>
              )}
            </div>

            {/* 8. Claim & Redressal */}
            <NavLink
              to="/ulb/claim-redressal"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <AlertOctagon size={18} />
              {!collapsed && <span>Claim & Redressal</span>}
            </NavLink>

            {/* 9. Report */}
            <NavLink
              to="/ulb/reports"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <FileText size={18} />
              {!collapsed && <span>Report</span>}
            </NavLink>

            {/* 10. Notification */}
            <NavLink
              to="/ulb/notifications"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Bell size={18} />
              {!collapsed && <span>Notification</span>}
            </NavLink>

            {/* 11. Manage Log */}
            <NavLink
              to="/ulb/manage-log"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Clock size={18} />
              {!collapsed && <span>Manage Log</span>}
            </NavLink>

            {/* 12. Sign Out */}
            <NavLink
              to="/login"
              className="sidebar-link"
              style={getLinkStyle(false)}
            >
              <LogOut size={18} />
              {!collapsed && <span>Sign Out</span>}
            </NavLink>
          </>
        ) : (
          /* =========================================================================
             STATE & DISTRICT ADMIN NAVIGATION BRANCH
             ========================================================================= */
          <>
            {/* 1. Home */}
            <NavLink
              to={`${basePath}/home`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Home size={18} />
              {!collapsed && <span>Home</span>}
            </NavLink>

            {/* 2. Dashboard */}
            <NavLink
              to={`${basePath}/dashboard`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            {/* DISTRICT ADMIN SPECIFIC MODULES */}
            {!isStateMode && (
              <>
                <NavLink
                  to="/portal/survey-units"
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => getLinkStyle(isActive)}
                >
                  <FileSpreadsheet size={18} />
                  {!collapsed && <span>Survey Unit Details</span>}
                </NavLink>

                <NavLink
                  to="/portal/case-entry"
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => getLinkStyle(isActive)}
                >
                  <FileText size={18} />
                  {!collapsed && <span>Case Entry/Manage</span>}
                </NavLink>
              </>
            )}

            {/* User Management (State Admin only) */}
            {isStateMode && (
              <NavLink
                to={`${basePath}/user-management`}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => getLinkStyle(isActive)}
              >
                <Users size={18} />
                {!collapsed && <span>User Management</span>}
              </NavLink>
            )}

            {/* Survey Activities (District Admin only) */}
            {!isStateMode && (
              <div>
                <button
                  onClick={() => setSurveyActOpen(!surveyActOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 20px',
                    color: isSurveyActActive ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
                    backgroundColor: isSurveyActActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderLeft: isSurveyActActive ? '4px solid #ffffff' : '4px solid transparent',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity size={18} />
                    {!collapsed && <span>Survey Activities</span>}
                  </div>
                  {!collapsed && (surveyActOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
                </button>

                {surveyActOpen && !collapsed && (
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.14)', padding: '4px 0' }}>
                    <NavLink
                      to="/portal/survey-activities/manage-publication"
                      style={({ isActive }) => ({
                        display: 'block',
                        padding: '7px 20px 7px 48px',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                        textDecoration: 'none',
                        fontSize: '12.5px',
                        fontWeight: isActive ? 600 : 400
                      })}
                    >
                      Manage Publication
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Reports */}
            <NavLink
              to={`${basePath}/reports`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <BarChart3 size={18} />
              {!collapsed && <span>Report</span>}
            </NavLink>

            {/* Notifications */}
            <NavLink
              to={`${basePath}/notifications`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Bell size={18} />
              {!collapsed && <span>Notification</span>}
            </NavLink>

            {/* Manage Log */}
            <NavLink
              to={`${basePath}/logs`}
              style={({ isActive }) => getLinkStyle(isActive)}
            >
              <Clock size={18} />
              {!collapsed && <span>Manage Log</span>}
            </NavLink>

            {/* Complaints (District) */}
            {!isStateMode && (
              <NavLink
                to="/portal/complaints"
                style={({ isActive }) => getLinkStyle(isActive)}
              >
                <AlertCircle size={18} />
                {!collapsed && <span>Raise a complaint</span>}
              </NavLink>
            )}
          </>
        )}

        {/* Separator */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '8px 16px' }} />

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            color: 'rgba(255, 255, 255, 0.82)',
            backgroundColor: 'transparent',
            border: 'none',
            borderLeft: '4px solid transparent',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </nav>
    </aside>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Database,
  Box,
  Layers,
  Link2,
  ShieldCheck,
  Award,
  ChevronRight,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface SurveyorLeftSidebarProps {
  currentSurveyUnitCode: string;
  propertyName: string;
  assignedTeamName: string;
  statusText?: string;
  activeNavItem?: number;
  onNavigateSection?: (sectionId: string) => void;
}

export const SurveyorLeftSidebar: React.FC<SurveyorLeftSidebarProps> = ({
  currentSurveyUnitCode,
  propertyName,
  assignedTeamName,
  statusText = 'In Progress',
  activeNavItem = 3,
  onNavigateSection
}) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 1, label: '1. Survey Assignment', sectionId: 'section-assignment', route: '/surveyor/survey-units', icon: Users },
    { id: 2, label: '2. Survey Data', sectionId: 'section-survey-data', icon: Database },
    { id: 3, label: '3. 3D Intelligence', sectionId: 'section-process-pipeline', isHighlighted: true, icon: Box },
    { id: 4, label: '4. Property Reconstruction', sectionId: 'section-3d-construction', icon: Layers },
    { id: 5, label: '5. Record Matching', sectionId: 'stage-05-matching', icon: Link2 },
    { id: 6, label: '6. Validation', sectionId: 'section-validation', icon: ShieldCheck },
    { id: 7, label: '7. ULPIN Generation', sectionId: 'section-bhunaksha-ulpin', icon: Award }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.route && item.id === 1) {
      navigate(item.route);
      return;
    }
    if (onNavigateSection && item.sectionId) {
      onNavigateSection(item.sectionId);
    }
  };

  return (
    <aside style={{
      width: '270px',
      minWidth: '270px',
      maxWidth: '270px',
      height: '100%',
      backgroundColor: '#0f2238', // Deep Navy Blue government GIS tone
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e3a5f',
      boxShadow: '2px 0 12px rgba(15, 34, 56, 0.25)',
      zIndex: 50,
      userSelect: 'none'
    }}>
      {/* 1. Header / NAKSHA 2.0 Logo */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid #1e3a5f',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#0b1a2d'
      }}>
        <img
          src="/assets/naksha_2_logo.png"
          alt="NAKSHA 2.0 Logo"
          style={{ width: '42px', height: '42px', objectFit: 'contain' }}
          onError={(e) => {
            // Failsafe fallback icon
            e.currentTarget.style.display = 'none';
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.8px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            NAKSHA 2.0
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '1px 6px',
              borderRadius: '3px',
              letterSpacing: '0.5px'
            }}>
              DESKTOP
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.3px', marginTop: '1px' }}>
            Survey Team Workstation
          </span>
        </div>
      </div>

      {/* 2. Navigation Items (1 to 7 with 3 highlighted) */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          padding: '0 8px 8px 8px'
        }}>
          Survey Workflow Stages
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isHighlighted || item.id === activeNavItem;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '6px',
                border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                backgroundColor: isActive ? 'rgba(2, 132, 199, 0.22)' : 'transparent',
                color: isActive ? '#ffffff' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                width: '100%',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12.5px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#cbd5e1';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon
                  size={16}
                  color={isActive ? '#38bdf8' : '#94a3b8'}
                  style={{ flexShrink: 0 }}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                  boxShadow: '0 0 8px #38bdf8'
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Bottom Assigned Context Info Box */}
      <div style={{
        padding: '16px',
        backgroundColor: '#0a1626',
        borderTop: '1px solid #1e3a5f',
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>
          <div style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '3px'
          }}>
            CURRENT SURVEY UNIT
          </div>
          <div style={{
            fontWeight: 700,
            color: '#38bdf8',
            fontFamily: 'monospace',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <MapPin size={12} color="#38bdf8" />
            {currentSurveyUnitCode}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '3px'
          }}>
            PROPERTY
          </div>
          <div style={{
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.3,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}>
            <Building2 size={12} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{propertyName}</span>
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '3px'
          }}>
            TEAM
          </div>
          <div style={{
            fontWeight: 600,
            color: '#e2e8f0',
            lineHeight: 1.3,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}>
            <Users size={12} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{assignedTeamName}</span>
          </div>
        </div>

        <div style={{
          paddingTop: '6px',
          borderTop: '1px dashed #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            STATUS
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            color: '#22c55e',
            fontWeight: 700,
            fontSize: '11px'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'inline-block'
            }} />
            {statusText}
          </span>
        </div>
      </div>
    </aside>
  );
};

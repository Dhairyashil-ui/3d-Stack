import React from 'react';
import { MapPin, Building2, Users, Layers, ShieldCheck, RefreshCw } from 'lucide-react';

interface SurveyorTopHeaderProps {
  surveyUnitCode: string;
  aoiName: string;
  propertyName: string;
  assignedTeamName: string;
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export const SurveyorTopHeader: React.FC<SurveyorTopHeaderProps> = ({
  surveyUnitCode,
  aoiName,
  propertyName,
  assignedTeamName,
  onRefresh,
  isSyncing = false
}) => {
  return (
    <header style={{
      height: '70px',
      minHeight: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      zIndex: 40,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left: Title & Subtitle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 800,
            color: '#0f2a4a', // Navy blue
            letterSpacing: '0.5px'
          }}>
            3D INTELLIGENCE
          </h1>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 700,
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #bae6fd'
          }}>
            TECHNICAL WORKSPACE
          </span>
        </div>
        <p style={{
          margin: '2px 0 0 0',
          fontSize: '12px',
          color: '#64748b',
          fontWeight: 400
        }}>
          Convert survey data into a validated 3D property and prepare it for ULPIN generation.
        </p>
      </div>

      {/* Right Side: Real Database Values */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Metric 1: Survey Unit */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '4px 12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px'
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Survey Unit
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f2a4a', fontFamily: 'monospace' }}>
            {surveyUnitCode}
          </span>
        </div>

        {/* Metric 2: AOI */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '4px 12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          maxWidth: '220px'
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AOI
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#0f2a4a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }} title={aoiName}>
            {aoiName}
          </span>
        </div>

        {/* Metric 3: Property */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '4px 12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          maxWidth: '220px'
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Property
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#0284c7',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }} title={propertyName}>
            {propertyName}
          </span>
        </div>

        {/* Metric 4: Assigned Team */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '4px 12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          maxWidth: '210px'
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Assigned Team
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#0f2a4a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '190px'
          }} title={assignedTeamName}>
            {assignedTeamName}
          </span>
        </div>

        {/* Refresh / Sync Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Sync with authoritative database"
          >
            <RefreshCw
              size={15}
              style={{
                animation: isSyncing ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </button>
        )}
      </div>
    </header>
  );
};

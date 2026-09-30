import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { GisMap } from '../../components/common/GisMap';
import { mockStore } from '../../data/mockStore';
import { Hash, Users, UserX, CheckCircle, ShieldCheck } from 'lucide-react';

export const StateDashboardPage: React.FC = () => {
  const metrics = mockStore.getStateMetrics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* State Admin Welcome Banner Matching Manual Page 7 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: '160px',
        position: 'relative',
        background: 'linear-gradient(105deg, #1e3a8a 0%, #1b539c 60%, #2563eb 100%)',
        color: '#ffffff'
      }}>
        {/* Left Art Illustration Container */}
        <div style={{
          flex: '1 1 340px',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Surveyor Artwork Silhouette */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.3)',
            flexShrink: 0
          }}>
            <img
              src="/assets/extracted/3d_parcel.png"
              alt="Surveyor"
              style={{ width: '70px', height: '70px', objectFit: 'contain' }}
              onError={(e) => (e.currentTarget.src = '/assets/Vector_04.svg')}
            />
          </div>

          <div>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 10px',
              borderRadius: '12px',
              marginBottom: '6px',
              textTransform: 'uppercase'
            }}>
              State Administrative Head
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
              Welcome Maharashtra
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#bfdbfe' }}>
              Real-time monitoring across 52 districts, 104 ULBs, and 1,481 field survey users.
            </p>
          </div>
        </div>

        {/* Right Metric Quick Badges */}
        <div style={{
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          borderLeft: '1px solid rgba(255,255,255,0.15)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>Districts</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{metrics.registeredDistricts}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>ULBs</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{metrics.onboardedUlbs}</div>
          </div>
        </div>
      </div>

      {/* 3 Coloured Statistics Cards Matching Manual Page 7 (Yellow, Green, Red) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: Total Users (Yellow) */}
        <div id="stat-total-users" style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #fef08a',
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(234, 179, 8, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            backgroundColor: '#eab308'
          }} />
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            backgroundColor: '#fef9c3',
            color: '#ca8a04',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Hash size={26} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Total Users</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, margin: '2px 0' }}>
              {metrics.totalUsers}
            </div>
            <div style={{ fontSize: '11.5px', color: '#854d0e', fontWeight: 500 }}>
              Registered personnel across all districts
            </div>
          </div>
        </div>

        {/* Card 2: Active Users (Green) */}
        <div id="stat-active-users" style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #bbf7d0',
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            backgroundColor: '#22c55e'
          }} />
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Active Users</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, margin: '2px 0' }}>
              {metrics.activeUsers}
            </div>
            <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 500 }}>
              Surveyors & admins currently active
            </div>
          </div>
        </div>

        {/* Card 3: Inactive Users (Red) */}
        <div id="stat-inactive-users" style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #fecaca',
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            backgroundColor: '#ef4444'
          }} />
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UserX size={26} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Inactive Users</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, margin: '2px 0' }}>
              {metrics.inactiveUsers}
            </div>
            <div style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 500 }}>
              Onboarding pending / dormant accounts
            </div>
          </div>
        </div>
      </div>

      {/* State-wide Geospatial Map Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1b539c', margin: 0 }}>
              Maharashtra State Cadastral & District Oversight
            </h3>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
              High-resolution drone mapping coverage (UTM Zone 44N) across pilot districts
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
              ● 52/52 Districts Online
            </span>
          </div>
        </div>

        <GisMap
          height="520px"
          showAoi={true}
          showCadastral={true}
          showTaxPoints={true}
          showBuildings={true}
          showDronePath={true}
          title="State Geospatial Command Center • Maharashtra"
        />
      </div>
    </div>
  );
};

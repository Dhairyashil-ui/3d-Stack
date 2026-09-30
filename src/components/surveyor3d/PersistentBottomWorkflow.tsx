import React from 'react';
import { Check, Circle, CheckCircle2 } from 'lucide-react';

interface PersistentBottomWorkflowProps {
  currentStep?: number; // 1 to 11
  onStepClick?: (stepIndex: number) => void;
  bhunakshaSubmitted?: boolean;
  ulpinReceived?: boolean;
}

export const PersistentBottomWorkflow: React.FC<PersistentBottomWorkflowProps> = ({
  currentStep = 9,
  onStepClick,
  bhunakshaSubmitted = false,
  ulpinReceived = false
}) => {
  // Exact 11 items requested:
  // DATA RECEIVED, PHOTOGRAMMETRY, LiDAR, FUSION, SEGMENTATION, RECORD MATCH, 3D VALIDATION, REPORT, BHUNAKSHA, ULPIN, PROPERTY CARD
  const steps = [
    { id: 1, name: 'DATA RECEIVED', status: 'COMPLETED', sectionId: 'section-survey-data' },
    { id: 2, name: 'PHOTOGRAMMETRY', status: 'COMPLETED', sectionId: 'section-process-pipeline' },
    { id: 3, name: 'LiDAR', status: 'COMPLETED', sectionId: 'section-process-pipeline' },
    { id: 4, name: 'FUSION', status: 'COMPLETED', sectionId: 'section-process-pipeline' },
    { id: 5, name: 'SEGMENTATION', status: 'COMPLETED', sectionId: 'section-process-pipeline' },
    { id: 6, name: 'RECORD MATCH', status: 'COMPLETED', sectionId: 'stage-05-matching' },
    { id: 7, name: '3D VALIDATION', status: 'COMPLETED', sectionId: 'section-validation' },
    { id: 8, name: 'REPORT', status: 'COMPLETED', sectionId: 'section-generate-report' },
    {
      id: 9,
      name: 'BHUNAKSHA',
      status: bhunakshaSubmitted ? 'COMPLETED' : 'ACTIVE',
      sectionId: 'section-bhunaksha-ulpin'
    },
    {
      id: 10,
      name: 'ULPIN',
      status: ulpinReceived ? 'COMPLETED' : bhunakshaSubmitted ? 'ACTIVE' : 'PENDING',
      sectionId: 'section-bhunaksha-ulpin'
    },
    {
      id: 11,
      name: 'PROPERTY CARD',
      status: ulpinReceived ? 'COMPLETED' : 'PENDING',
      sectionId: 'section-bhunaksha-ulpin'
    }
  ];

  const handleStepClick = (step: typeof steps[0]) => {
    if (onStepClick) {
      onStepClick(step.id);
    }
    const el = document.getElementById(step.sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '270px', // aligned with left sidebar
      right: 0,
      height: '62px',
      backgroundColor: '#ffffff',
      borderTop: '1.5px solid #cbd5e1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      zIndex: 60,
      userSelect: 'none',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 800,
        color: '#0f2a4a',
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        marginRight: '12px',
        whiteSpace: 'nowrap'
      }}>
        WORKFLOW TRACKER
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px',
        overflowX: 'auto'
      }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'COMPLETED';
          const isActive = step.status === 'ACTIVE';

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => handleStepClick(step)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: isCompleted ? '#0f2a4a' : isActive ? '#0284c7' : '#94a3b8',
                  letterSpacing: '0.4px',
                  whiteSpace: 'nowrap'
                }}>
                  {step.name}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px'
                }}>
                  {isCompleted ? (
                    <span style={{ color: '#16a34a', fontWeight: 900, fontSize: '12px' }}>✓</span>
                  ) : isActive ? (
                    <span style={{ color: '#d97706', fontWeight: 900, fontSize: '14px' }}>●</span>
                  ) : (
                    <span style={{ color: '#cbd5e1', fontWeight: 900, fontSize: '14px' }}>○</span>
                  )}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div style={{
                  height: '1.5px',
                  flex: 1,
                  backgroundColor: isCompleted ? '#16a34a' : '#e2e8f0',
                  minWidth: '8px',
                  maxWidth: '30px'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

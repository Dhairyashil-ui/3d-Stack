import React, { useState, useEffect } from 'react';
import { SurveyorLeftSidebar } from '../../components/surveyor3d/SurveyorLeftSidebar';
import { SurveyorTopHeader } from '../../components/surveyor3d/SurveyorTopHeader';
import { SectionSurveyDataReceived } from '../../components/surveyor3d/SectionSurveyDataReceived';
import { SectionProcessPipeline } from '../../components/surveyor3d/SectionProcessPipeline';
import { Section3DPropertyConstruction } from '../../components/surveyor3d/Section3DPropertyConstruction';
import { SectionValidation } from '../../components/surveyor3d/SectionValidation';
import { SectionFinalPropertyIdentity } from '../../components/surveyor3d/SectionFinalPropertyIdentity';
import { SectionGenerateReport } from '../../components/surveyor3d/SectionGenerateReport';
import { SectionBhunakshaAndUlpin } from '../../components/surveyor3d/SectionBhunakshaAndUlpin';
import { PersistentBottomWorkflow } from '../../components/surveyor3d/PersistentBottomWorkflow';
import { PpcrcPipelineService, PpcrcPipelineState } from '../../services/ppcrcPipelineService';

export const Surveyor3DIntelligencePage: React.FC = () => {
  // Real authoritative pipeline state from shared service
  const [pipelineState, setPipelineState] = useState<PpcrcPipelineState>(() => PpcrcPipelineService.getState());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [bhunakshaSubmitted, setBhunakshaSubmitted] = useState<boolean>(false);
  const [ulpinReceived, setUlpinReceived] = useState<boolean>(false);

  // Sync state on event changes
  useEffect(() => {
    const handleUpdate = () => {
      setPipelineState(PpcrcPipelineService.getState());
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  const handleRefresh = async () => {
    setIsSyncing(true);
    try {
      const refreshed = PpcrcPipelineService.getState();
      setPipelineState(refreshed);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const surveyUnitCode = 'SU-HINJ-01 (348671)';
  const aoiName = 'Hinjawadi Phase 1, PMRDA Pune, Maharashtra';
  const propertyName = pipelineState.targetProperty?.name || 'Pralhad P. Chhabria Research Center (PPCRC)';
  const assignedTeamName = 'PMRDA Cadastral Survey Team 01';

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 1. Clean Vertical Left Sidebar */}
      <SurveyorLeftSidebar
        currentSurveyUnitCode={surveyUnitCode}
        propertyName={propertyName}
        assignedTeamName={assignedTeamName}
        statusText="In Progress"
        activeNavItem={3}
        onNavigateSection={handleNavigateSection}
      />

      {/* 2. Main Workstation Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        minWidth: 0,
        position: 'relative'
      }}>
        {/* Top Header */}
        <SurveyorTopHeader
          surveyUnitCode={surveyUnitCode}
          aoiName={aoiName}
          propertyName={propertyName}
          assignedTeamName={assignedTeamName}
          onRefresh={handleRefresh}
          isSyncing={isSyncing}
        />

        {/* Scrollable Main Workspace Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px 84px 28px', // extra bottom padding for persistent workflow tracker
          backgroundColor: '#f8fafc'
        }}>
          {/* Section 1: SURVEY DATA RECEIVED */}
          <SectionSurveyDataReceived packages={pipelineState.desktopPackages} />

          {/* Section 2: MAIN PROCESS PIPELINE (Stages 01 to 05) */}
          <SectionProcessPipeline />

          {/* Section 3: 3D PROPERTY CONSTRUCTION & 3D SPACE COMPLETION */}
          <Section3DPropertyConstruction />

          {/* Section 4: 3D PROPERTY VALIDATION */}
          <SectionValidation />

          {/* Section 5: FINAL 3D PROPERTY IDENTITY */}
          <SectionFinalPropertyIdentity
            buildingName="Pralhad P. Chhabria Research Center (PPCRC - BLD 0089)"
            floorLabel="Level 1 (Ground Atrium Floor 01)"
            unitLabel="Unit A-101 / A-119 (High-Performance Computing Research Lab)"
            spatialUnitId="0089-01-01-101"
          />

          {/* Section 6: GENERATE FINAL SURVEY REPORT */}
          <SectionGenerateReport
            surveyUnitCode={surveyUnitCode}
            aoiName={aoiName}
            assignedTeamName={assignedTeamName}
            onReportGenerated={() => {
              // Smooth scroll toward Bhu-Naksha section
              setTimeout(() => handleNavigateSection('section-bhunaksha-ulpin'), 300);
            }}
          />

          {/* Section 7 & 8: BHUNAKSHA SUBMISSION & ULPIN RESULT */}
          <SectionBhunakshaAndUlpin
            surveyUnitCode={surveyUnitCode}
            propertyName={propertyName}
            spatialUnitId="0089-01-01-101"
            onUlpinGenerated={() => {
              setBhunakshaSubmitted(true);
              setUlpinReceived(true);
            }}
          />
        </main>

        {/* Persistent Bottom Workflow Tracker */}
        <PersistentBottomWorkflow
          currentStep={ulpinReceived ? 11 : bhunakshaSubmitted ? 10 : 9}
          bhunakshaSubmitted={bhunakshaSubmitted}
          ulpinReceived={ulpinReceived}
        />
      </div>
    </div>
  );
};

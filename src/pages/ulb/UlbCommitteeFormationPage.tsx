import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  CheckCircle2,
  Users,
  Send,
  Building2,
  Shield,
  ChevronRight,
  Phone,
  Sparkles,
  UserCheck,
  Check,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import {
  PpcrcPipelineService,
  PpcrcPipelineState,
  SurveyTeamMember,
  DEFAULT_SURVEY_TEAM
} from '../../services/ppcrcPipelineService';

// Available Licensed Personnel for Selection
const AVAILABLE_MAIN_OFFICERS = [
  {
    name: 'Er. Rajeshwar D. Deshmukh',
    role: 'Chief Cadastral Surveyor & Land Records Officer (Main Officer)',
    licenseOrReg: 'MH-SLR-PUNE-0081',
    contact: '+91 98220 14592 | r.deshmukh@pmrda.gov.in'
  },
  {
    name: 'Er. Sanjay K. Kulkarni',
    role: 'Senior Superintending Land Records Officer',
    licenseOrReg: 'MH-SLR-PUNE-0045',
    contact: '+91 94220 55102 | s.kulkarni@pmrda.gov.in'
  },
  {
    name: 'Er. Nitin S. Pawar',
    role: 'Lead Cadastral Inspection Officer',
    licenseOrReg: 'MH-SLR-PUNE-0099',
    contact: '+91 98231 44091 | n.pawar@pmrda.gov.in'
  }
];

const AVAILABLE_DRONE_PILOTS = [
  {
    name: 'Smt. Ananya K. Sharma',
    role: 'Lead Drone Pilot & Photogrammetrist',
    licenseOrReg: 'DGCA-RPA-9914/2024',
    contact: '+91 98450 78210'
  },
  {
    name: 'Shri Rohan V. Joshi',
    role: 'Certified UAV Mapping Specialist',
    licenseOrReg: 'DGCA-RPA-8821/2023',
    contact: '+91 97654 33219'
  }
];

const AVAILABLE_GNSS_SURVEYORS = [
  {
    name: 'Shri Amit V. Patil',
    role: 'Cadastral Surveyor (GNSS / RTK DGPS)',
    licenseOrReg: 'MH-PMRDA-CAD-402',
    contact: '+91 97631 88921'
  },
  {
    name: 'Shri Amit Ghorpade',
    role: 'DGPS Geodetic Baseline Surveyor',
    licenseOrReg: 'MH-PMRDA-CAD-109',
    contact: '+91 98221 77650'
  }
];

const AVAILABLE_GIS_ANALYSTS = [
  {
    name: 'Er. Vikramaditya Joshi',
    role: '3D GIS & LiDAR Point Cloud Analyst',
    licenseOrReg: 'GIS-BIM-CERT-7731',
    contact: '+91 99230 45112'
  },
  {
    name: 'Er. Pradeep R. Rao',
    role: '3D Spatial Modeling & Mesh Specialist',
    licenseOrReg: 'GIS-BIM-CERT-4412',
    contact: '+91 98501 22910'
  }
];

const AVAILABLE_ULB_REPRESENTATIVES = [
  {
    name: 'Shri Sunil M. Kulkarni',
    role: 'ULB / PMRDA Town Planning Representative',
    licenseOrReg: 'PMRDA-TPD-2022',
    contact: '+91 94220 33410'
  },
  {
    name: 'Smt. Meena P. Deshpande',
    role: 'PMRDA Urban Development Officer',
    licenseOrReg: 'PMRDA-TPD-2019',
    contact: '+91 94221 66781'
  }
];

export const UlbCommitteeFormationPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineState, setPipelineState] = useState<PpcrcPipelineState>(PpcrcPipelineService.getState());

  // Show selection mode when "Assign Survey Team" is clicked
  const [showAssignSelector, setShowAssignSelector] = useState<boolean>(() => {
    return (
      pipelineState.stage === 'ULB_TEAM_ASSIGNED' ||
      pipelineState.stage === 'SURVEYOR_VERIFIED' ||
      pipelineState.stage === 'ULB_SUBMITTED_TO_BHUNAKSHA' ||
      pipelineState.stage === 'BHUNAKSHA_ULPIN_ASSIGNED'
    );
  });

  // Selected members in selecting way
  const [selectedMainOfficer, setSelectedMainOfficer] = useState(AVAILABLE_MAIN_OFFICERS[0].name);
  const [selectedDronePilot, setSelectedDronePilot] = useState(AVAILABLE_DRONE_PILOTS[0].name);
  const [selectedGnssSurveyor, setSelectedGnssSurveyor] = useState(AVAILABLE_GNSS_SURVEYORS[0].name);
  const [selectedGisAnalyst, setSelectedGisAnalyst] = useState(AVAILABLE_GIS_ANALYSTS[0].name);
  const [selectedUlbRep, setSelectedUlbRep] = useState(AVAILABLE_ULB_REPRESENTATIVES[0].name);

  const [submittedToSurveyor, setSubmittedToSurveyor] = useState(
    pipelineState.stage === 'ULB_TEAM_ASSIGNED' ||
    pipelineState.stage === 'SURVEYOR_VERIFIED' ||
    pipelineState.stage === 'ULB_SUBMITTED_TO_BHUNAKSHA' ||
    pipelineState.stage === 'BHUNAKSHA_ULPIN_ASSIGNED'
  );

  useEffect(() => {
    const handleUpdate = () => {
      const state = PpcrcPipelineService.getState();
      setPipelineState(state);
      if (
        state.stage === 'ULB_TEAM_ASSIGNED' ||
        state.stage === 'SURVEYOR_VERIFIED' ||
        state.stage === 'ULB_SUBMITTED_TO_BHUNAKSHA' ||
        state.stage === 'BHUNAKSHA_ULPIN_ASSIGNED'
      ) {
        setShowAssignSelector(true);
        setSubmittedToSurveyor(true);
      }
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  // Action: Open Selecting Way
  const handleOpenAssignTeam = () => {
    setShowAssignSelector(true);
  };

  // Action: Autofill Recommended Members
  const handleAutofillMembers = () => {
    setSelectedMainOfficer(AVAILABLE_MAIN_OFFICERS[0].name);
    setSelectedDronePilot(AVAILABLE_DRONE_PILOTS[0].name);
    setSelectedGnssSurveyor(AVAILABLE_GNSS_SURVEYORS[0].name);
    setSelectedGisAnalyst(AVAILABLE_GIS_ANALYSTS[0].name);
    setSelectedUlbRep(AVAILABLE_ULB_REPRESENTATIVES[0].name);
  };

  // Build active team list from user selections
  const mainOff = AVAILABLE_MAIN_OFFICERS.find(o => o.name === selectedMainOfficer) || AVAILABLE_MAIN_OFFICERS[0];
  const dronePil = AVAILABLE_DRONE_PILOTS.find(d => d.name === selectedDronePilot) || AVAILABLE_DRONE_PILOTS[0];
  const gnssSurv = AVAILABLE_GNSS_SURVEYORS.find(g => g.name === selectedGnssSurveyor) || AVAILABLE_GNSS_SURVEYORS[0];
  const gisAna = AVAILABLE_GIS_ANALYSTS.find(a => a.name === selectedGisAnalyst) || AVAILABLE_GIS_ANALYSTS[0];
  const ulbRep = AVAILABLE_ULB_REPRESENTATIVES.find(u => u.name === selectedUlbRep) || AVAILABLE_ULB_REPRESENTATIVES[0];

  const currentConstructedTeam: SurveyTeamMember[] = [
    {
      id: 'tm-1',
      name: mainOff.name,
      role: mainOff.role,
      licenseOrReg: mainOff.licenseOrReg,
      isMainOfficer: true,
      contact: mainOff.contact
    },
    {
      id: 'tm-2',
      name: dronePil.name,
      role: dronePil.role,
      licenseOrReg: dronePil.licenseOrReg,
      isMainOfficer: false,
      contact: dronePil.contact
    },
    {
      id: 'tm-3',
      name: gnssSurv.name,
      role: gnssSurv.role,
      licenseOrReg: gnssSurv.licenseOrReg,
      isMainOfficer: false,
      contact: gnssSurv.contact
    },
    {
      id: 'tm-4',
      name: gisAna.name,
      role: gisAna.role,
      licenseOrReg: gisAna.licenseOrReg,
      isMainOfficer: false,
      contact: gisAna.contact
    },
    {
      id: 'tm-5',
      name: ulbRep.name,
      role: ulbRep.role,
      licenseOrReg: ulbRep.licenseOrReg,
      isMainOfficer: false,
      contact: ulbRep.contact
    }
  ];

  // Action: Submit & Dispatch to Surveyor Portal
  const handleSubmitToSurveyor = () => {
    PpcrcPipelineService.assignSurveyTeam(currentConstructedTeam);
    setSubmittedToSurveyor(true);
  };

  return (
    <div
      style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* 1. BREADCRUMB */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', cursor: 'pointer' }} onClick={() => navigate('/ulb/dashboard')}>
          Home
        </span>
        <span>›</span>
        <span>Urban Local Body (ULB)</span>
        <span>›</span>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          Received Packages & Survey Team Assignment
        </span>
      </div>

      {/* 2. HEADER BANNER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#1b539c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Inbox size={18} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Package Reception & Survey Team Assignment
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 40px', fontSize: '13px', color: '#64748b' }}>
            Authority: Pune Metropolitan Region Development Authority (PMRDA) • SU-HINJ-01 Cadastral Ward
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={14} />
            <span>4 Packages Ingested from Desktop</span>
          </span>
        </div>
      </div>

      {/* 3. SECTION 1: RECEIVED PACKAGES DETAILS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
              1. Received Geospatial Packages for PPCRC Building
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Transmitted from NAKSHA 3D Desktop Suite with SHA-256 integrity seal
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>
            Property: PPCRC Building (Plot B-7 / Survey No. 88, Hinjawadi Phase 1)
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Package Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Format</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>File Identifier</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Size</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Coordinate Reference (CRS)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pipelineState.desktopPackages.map((pkg, i) => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#0284c7', fontWeight: 800 }}>0{i + 1}.</span>
                      <span>{pkg.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#0369a1', fontWeight: 600 }}>
                    <code>{pkg.extension}</code>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontFamily: 'monospace', fontSize: '12px' }}>
                    {pkg.fileName}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1e293b' }}>
                    {pkg.fileSize}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>
                    {pkg.crs}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>Verified & Ingested</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SECTION 2: ASSIGN SURVEY TEAM IN SELECTING WAY */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#1e293b' }}>
              2. Field Survey Team Assignment (Selecting Mode)
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Select licensed officers for ground-truthing or click Autofill to populate the official cadre.
            </div>
          </div>

          {!showAssignSelector ? (
            <button
              onClick={handleOpenAssignTeam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(27, 83, 156, 0.25)'
              }}
            >
              <Users size={16} />
              <span>Assign Survey Team</span>
            </button>
          ) : (
            <button
              onClick={handleAutofillMembers}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                border: '1.5px solid #86efac',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} />
              <span>Autofill Official Members</span>
            </button>
          )}
        </div>

        {/* IF NOT OPEN YET */}
        {!showAssignSelector && (
          <div
            style={{
              padding: '32px 20px',
              backgroundColor: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Users size={32} color="#94a3b8" />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
              No Survey Team Assigned to PPCRC Building Yet
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '460px' }}>
              Click the <strong>"Assign Survey Team"</strong> button to open the member selection dropdowns and assign the Chief Survey Officer.
            </div>
            <button
              onClick={handleOpenAssignTeam}
              style={{
                marginTop: '6px',
                padding: '8px 18px',
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              + Assign Survey Team
            </button>
          </div>
        )}

        {/* SELECTING WAY: 5 INTERACTIVE SELECTION BOXES */}
        {showAssignSelector && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 5 Selection Boxes Grid */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '18px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px'
              }}
            >
              {/* 1. Main Officer Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>1. Main Officer / Lead Surveyor</span>
                  <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedMainOfficer}
                  onChange={(e) => setSelectedMainOfficer(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #16a34a',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_MAIN_OFFICERS.map(officer => (
                    <option key={officer.name} value={officer.name}>
                      {officer.name} ({officer.licenseOrReg})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                  Chief Signatory for Plot Certification
                </span>
              </div>

              {/* 2. Drone Pilot Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                  2. Drone Pilot / Photogrammetry
                </label>
                <select
                  value={selectedDronePilot}
                  onChange={(e) => setSelectedDronePilot(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_DRONE_PILOTS.map(pilot => (
                    <option key={pilot.name} value={pilot.name}>
                      {pilot.name} ({pilot.licenseOrReg})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  DGCA Licensed Drone Operator
                </span>
              </div>

              {/* 3. GNSS / RTK Surveyor Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                  3. Cadastral Surveyor (GNSS / RTK)
                </label>
                <select
                  value={selectedGnssSurveyor}
                  onChange={(e) => setSelectedGnssSurveyor(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_GNSS_SURVEYORS.map(gnss => (
                    <option key={gnss.name} value={gnss.name}>
                      {gnss.name} ({gnss.licenseOrReg})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Ground Control & Vertex Verification
                </span>
              </div>

              {/* 4. 3D GIS Analyst Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                  4. 3D GIS & LiDAR Analyst
                </label>
                <select
                  value={selectedGisAnalyst}
                  onChange={(e) => setSelectedGisAnalyst(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_GIS_ANALYSTS.map(gis => (
                    <option key={gis.name} value={gis.name}>
                      {gis.name} ({gis.licenseOrReg})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  BIM / Point Cloud Segmentation
                </span>
              </div>

              {/* 5. ULB Representative Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                  5. ULB / PMRDA Representative
                </label>
                <select
                  value={selectedUlbRep}
                  onChange={(e) => setSelectedUlbRep(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_ULB_REPRESENTATIVES.map(rep => (
                    <option key={rep.name} value={rep.name}>
                      {rep.name} ({rep.licenseOrReg})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Town Planning Endorsement
                </span>
              </div>
            </div>

            {/* Selected Team Members Cards Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                Assigned Team Roster (Reflecting Active Selections):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {currentConstructedTeam.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      backgroundColor: member.isMainOfficer ? '#f0fdf4' : '#ffffff',
                      border: member.isMainOfficer ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Reg: {member.licenseOrReg}
                        </div>
                      </div>

                      {member.isMainOfficer && (
                        <span
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            fontSize: '9.5px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px'
                          }}
                        >
                          Main Officer
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#1e40af', fontWeight: 600 }}>
                      {member.role}
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={11} />
                      <span>{member.contact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit & Dispatch Action Row */}
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '12.5px', color: '#475569' }}>
                Selected Main Officer: <strong>{mainOff.name}</strong> • Ready to be dispatched to Field Surveyor Portal.
              </div>

              <button
                onClick={handleSubmitToSurveyor}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 22px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                }}
              >
                <Send size={15} />
                <span>Submit & Dispatch to Surveyor Portal (/surveyor) →</span>
              </button>
            </div>

            {/* Confirmation Banner */}
            {submittedToSurveyor && (
              <div
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #34d399',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#065f46' }}>
                    Successfully Dispatched to Surveyor Portal!
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#047857', marginTop: '2px' }}>
                    The assigned cadre with Main Officer <strong>{mainOff.name}</strong> is now active in the Survey Activities section for field ground-truthing.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

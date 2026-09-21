import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Permissive CORS for Vercel and local development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// ==========================================
// PPCRC Authoritative Pipeline Server State
// ==========================================
interface DesktopPackageItem {
  id: string;
  name: string;
  type: string;
  extension: string;
  fileName: string;
  fileSize: string;
  verified: boolean;
  verifiedTimestamp?: string;
  crs: string;
  sha256: string;
}

interface SurveyTeamMember {
  id: string;
  name: string;
  role: string;
  licenseOrReg: string;
  isMainOfficer?: boolean;
}

interface OfflineCheckpoint {
  id: string;
  title: string;
  description: string;
  verified: boolean;
  standard: string;
}

interface PpcrcPipelineState {
  stage: 'DESKTOP_READY' | 'DESKTOP_SUBMITTED' | 'ULB_TEAM_ASSIGNED' | 'SURVEYOR_VERIFIED' | 'ULB_SUBMITTED_TO_BHUNAKSHA' | 'BHUNAKSHA_ULPIN_ASSIGNED' | 'PROPERTY_CARD_GENERATED';
  status: 'AWAITING_DESKTOP_UPLOAD' | 'DESKTOP_PACKAGES_VERIFIED' | 'SURVEY_TEAM_ACTIVE' | 'VERIFIED_READY' | 'PROPERTY_CARD_ASSIGNED';
  targetProperty: {
    name: string;
    address: string;
    surveyNo: string;
    plotNo: string;
    village: string;
    taluka: string;
    district: string;
    state: string;
    owner: string;
    khataNo: string;
    totalFloors: number;
    heightM: number;
    builtUpAreaSqm: number;
    footprintAreaSqm: number;
  };
  desktopPackages: DesktopPackageItem[];
  surveyTeam: SurveyTeamMember[];
  offlineCheckpoints: OfflineCheckpoint[];
  ulpin: string;
  ulpin2D: string;
  ulpin3D: string;
  assignedTimestamp: string;
  verifiedOfficer: string;
  surveyorReg: string;
  propertyCardGenerated: boolean;
  lastUpdated: string;
}

const DEFAULT_DESKTOP_PACKAGES: DesktopPackageItem[] = [
  {
    id: 'pkg-1',
    name: 'ORI and Package Imagery',
    type: 'Orthorectified Aerial & Drone Imagery',
    extension: '.tbk',
    fileName: 'PPCRC_Hinjawadi_Orthorectified_Imagery_0.05m.tbk',
    fileSize: '418.6 MB',
    verified: true,
    verifiedTimestamp: '21 Sep 2026, 14:10 IST',
    crs: 'EPSG:4326 (WGS 84) / UTM Zone 43N',
    sha256: '9f83a0e1c2b5d4e8a716c903b4e78a62f5d1e4c8'
  },
  {
    id: 'pkg-2',
    name: '2D GIS Package',
    type: 'Cadastral Boundary & Parcel Vector Topology',
    extension: '.gib, .zip',
    fileName: 'PPCRC_Plot_B7_Cadastral_Boundary.gib.zip',
    fileSize: '28.4 MB',
    verified: true,
    verifiedTimestamp: '21 Sep 2026, 14:15 IST',
    crs: 'EPSG:4326 (WGS 84) Polygon Centroid 18.520430, 73.856744',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678'
  },
  {
    id: 'pkg-3',
    name: '3D Survey Package',
    type: 'LiDAR Dense Point Cloud & Textured Mesh',
    extension: '.zip',
    fileName: 'PPCRC_Full_LiDAR_Mesh_Pointcloud_LOD3.zip',
    fileSize: '842.1 MB',
    verified: true,
    verifiedTimestamp: '21 Sep 2026, 14:22 IST',
    crs: 'UTM Zone 43N / Elevation MSL 568.20m',
    sha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
  },
  {
    id: 'pkg-4',
    name: 'Vertical Property Package',
    type: 'BIM Multi-Floor Segmentation & Unit Topology',
    extension: '.zip',
    fileName: 'PPCRC_Vertical_BIM_Floor_Segmentation_G5.zip',
    fileSize: '156.8 MB',
    verified: true,
    verifiedTimestamp: '21 Sep 2026, 14:30 IST',
    crs: '3D Floor Tier Levels Z0–Z5 (Ground + 5 Floors, 45 Units)',
    sha256: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f'
  }
];

const DEFAULT_SURVEY_TEAM: SurveyTeamMember[] = [
  {
    id: 'tm-1',
    name: 'Er. Rajeshwar D. Deshmukh',
    role: 'Chief Cadastral Surveyor & Land Records Officer (Main Officer)',
    licenseOrReg: 'MH-SLR-PUNE-0081',
    isMainOfficer: true
  },
  {
    id: 'tm-2',
    name: 'Dr. Meera K. Kulkarni',
    role: 'GIS & Remote Sensing Specialist (Photogrammetry Lead)',
    licenseOrReg: 'ISRS-2023-F-4109'
  },
  {
    id: 'tm-3',
    name: 'Shri Vikram S. Shinde',
    role: 'DGPS Ground Rover & Total Station Field Operator',
    licenseOrReg: 'PMRDA-SURV-2024-884'
  },
  {
    id: 'tm-4',
    name: 'Er. Ananya R. Joshi',
    role: '3D LiDAR & BIM Structural Modeler (LOD-350 Auditor)',
    licenseOrReg: 'COA-IND-2022-79102'
  },
  {
    id: 'tm-5',
    name: 'Adv. Suresh M. Pawar',
    role: 'Revenue & Title Settlement Legal Officer',
    licenseOrReg: 'BCMH-2015-ADV-1194'
  }
];

const DEFAULT_OFFLINE_CHECKPOINTS: OfflineCheckpoint[] = [
  {
    id: 'chk-1',
    title: '1. Boundary Pillars & Geodetic Monuments Verification',
    description: 'All 5 boundary vertices checked with dual-frequency RTK DGPS against Survey No. 88 (Plot P-14/1).',
    verified: true,
    standard: 'Survey of India (SoI) CORS Network Reference'
  },
  {
    id: 'chk-2',
    title: '2. Ground Truth Parcel Geometry & Centroid Alignment',
    description: 'Physical perimeter confirmed within ±12mm spatial tolerance of 2D GIS vector layer.',
    verified: true,
    standard: 'DILRMP Technical Specifications 2024'
  },
  {
    id: 'chk-3',
    title: '3. Vertical Building Heights & Elevation Verification',
    description: 'RCC G+5 structural framework measured at 18.50 meters total height with 4.20 m clear floor-to-floor spacing.',
    verified: true,
    standard: 'National Building Code (NBC) Part 4 Fire & Life Safety Standards'
  },
  {
    id: 'chk-4',
    title: '4. Interior Unit & Corridor Cadastre Verification (Room A-101)',
    description: 'Level 1 Atrium and Room A-101 (High-Performance Computing Lab, 737 sq.ft / 68.5 m²) verified against 3D digital model.',
    verified: true,
    standard: 'BIM LOD-350 As-Built Spatial Dimensional Compliance'
  },
  {
    id: 'chk-5',
    title: '5. Non-Encroachment & Clean Title Certification',
    description: 'Zero overlap with adjacent road easements or MIDC parcel boundaries; verified clear title of PPCRC Technologies Pvt Ltd.',
    verified: true,
    standard: 'PMRDA Unified Development Control and Promotion Regulations (UDCPR)'
  }
];

const INITIAL_PIPELINE_STATE: PpcrcPipelineState = {
  stage: 'DESKTOP_SUBMITTED',
  status: 'VERIFIED_READY',
  targetProperty: {
    name: 'Pralhad P. Chhabria Research Center (PPCRC)',
    address: 'Survey No. 88, Plot B-7, Hinjawadi Phase 1, Pune - 411057',
    surveyNo: '88',
    plotNo: 'Plot B-7 (Plot P-14/1)',
    village: 'Hinjawadi',
    taluka: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    owner: 'PPCRC TECHNOLOGIES PVT LTD',
    khataNo: 'KH-8841/2026',
    totalFloors: 5,
    heightM: 18.50,
    builtUpAreaSqm: 6029.00,
    footprintAreaSqm: 1205.80
  },
  desktopPackages: DEFAULT_DESKTOP_PACKAGES,
  surveyTeam: DEFAULT_SURVEY_TEAM,
  offlineCheckpoints: DEFAULT_OFFLINE_CHECKPOINTS,
  ulpin: 'MH27B423070N97',
  ulpin2D: '27250401420089',
  ulpin3D: '0089-01-01-101',
  assignedTimestamp: '21 Sep 2026, 15:30 IST',
  verifiedOfficer: 'Er. Rajeshwar D. Deshmukh (Chief Cadastral Surveyor, PMRDA Pune)',
  surveyorReg: 'MH-SLR-PUNE-0081',
  propertyCardGenerated: false,
  lastUpdated: new Date().toISOString()
};

// In-memory persistent state on server
let currentPipelineState: PpcrcPipelineState = { ...INITIAL_PIPELINE_STATE };

// ==========================================
// REST API Endpoints
// ==========================================

// 1. Health Check (for Render zero-downtime monitoring)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'NAKSHA V2.0 Spatial API & PPCRC Pipeline Server',
    studyArea: 'Pune (Hinjawadi Phase 1) - PMRDA Special Planning Area, Maharashtra',
    stage: currentPipelineState.stage,
    statusState: currentPipelineState.status,
    timestamp: new Date().toISOString()
  });
});

// 2. Get Pipeline State
app.get('/api/pipeline/state', (req, res) => {
  res.json({
    success: true,
    data: currentPipelineState
  });
});

// 3. Reset Pipeline State
app.post('/api/pipeline/reset', (req, res) => {
  currentPipelineState = { 
    ...INITIAL_PIPELINE_STATE,
    lastUpdated: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Pipeline state reset to initial baseline',
    data: currentPipelineState
  });
});

// 4. Desktop: Submit Verified Packages
app.post('/api/pipeline/desktop/submit', (req, res) => {
  const { packages } = req.body;
  currentPipelineState = {
    ...currentPipelineState,
    stage: 'DESKTOP_SUBMITTED',
    status: 'DESKTOP_PACKAGES_VERIFIED',
    desktopPackages: packages || currentPipelineState.desktopPackages,
    lastUpdated: new Date().toISOString()
  };
  res.json({
    success: true,
    message: '4 Desktop packages submitted to ULB Admin successfully',
    data: currentPipelineState
  });
});

// 5. ULB: Assign Survey Team
app.post('/api/pipeline/ulb/assign-team', (req, res) => {
  const { team } = req.body;
  const assigned = team || DEFAULT_SURVEY_TEAM;
  const mainOfficer = assigned.find((t: SurveyTeamMember) => t.isMainOfficer)?.name || currentPipelineState.verifiedOfficer;
  const reg = assigned.find((t: SurveyTeamMember) => t.isMainOfficer)?.licenseOrReg || currentPipelineState.surveyorReg;

  currentPipelineState = {
    ...currentPipelineState,
    stage: 'ULB_TEAM_ASSIGNED',
    status: 'SURVEY_TEAM_ACTIVE',
    surveyTeam: assigned,
    verifiedOfficer: mainOfficer,
    surveyorReg: reg,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Survey Team assigned and dispatched to Surveyor Portal',
    data: currentPipelineState
  });
});

// 6. Surveyor: Submit Offline Verification & 3D Model
app.post('/api/pipeline/surveyor/verify', (req, res) => {
  const { checkpoints } = req.body;
  currentPipelineState = {
    ...currentPipelineState,
    stage: 'SURVEYOR_VERIFIED',
    status: 'VERIFIED_READY',
    offlineCheckpoints: checkpoints || currentPipelineState.offlineCheckpoints,
    lastUpdated: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Field ground-truthing and 3D building verified and submitted to ULB',
    data: currentPipelineState
  });
});

// 7. ULB: Forward to BhuNaksha
app.post('/api/pipeline/ulb/forward-bhunaksha', (req, res) => {
  currentPipelineState = {
    ...currentPipelineState,
    stage: 'ULB_SUBMITTED_TO_BHUNAKSHA',
    lastUpdated: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Plot P-14/1 records sent to BhuNaksha for ULPIN stamping',
    data: currentPipelineState
  });
});

// 8. BhuNaksha: Assign ULPIN (2D & 3D)
app.post('/api/pipeline/bhunaksha/assign-card', (req, res) => {
  const { ulpin, ulpin2D, ulpin3D } = req.body;
  currentPipelineState = {
    ...currentPipelineState,
    stage: 'BHUNAKSHA_ULPIN_ASSIGNED',
    status: 'PROPERTY_CARD_ASSIGNED',
    ulpin: ulpin || 'MH27B423070N97',
    ulpin2D: ulpin2D || '27250401420089',
    ulpin3D: ulpin3D || '0089-01-01-101',
    assignedTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    lastUpdated: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Authoritative ULPIN assigned and transmitted to ULB',
    data: currentPipelineState
  });
});

// 9. ULB: Mark Property Card Generated
app.post('/api/pipeline/ulb/generate-card', (req, res) => {
  currentPipelineState = {
    ...currentPipelineState,
    stage: 'PROPERTY_CARD_GENERATED',
    propertyCardGenerated: true,
    lastUpdated: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Property Card generated and stamped',
    data: currentPipelineState
  });
});

// 10. PPCRC Cadastral Reference API
app.get('/api/cadastre/ppcrc', (req, res) => {
  res.json({
    success: true,
    property: currentPipelineState.targetProperty,
    ulpin2D: currentPipelineState.ulpin2D,
    ulpin3D: currentPipelineState.ulpin3D,
    bhuAadhaar: currentPipelineState.ulpin,
    centroid: {
      latitude: 18.520430,
      longitude: 73.856744,
      elevationMsl: 568.20,
      crs: 'EPSG:4326 (WGS 84) / UTM Zone 43N'
    },
    room101: {
      unitId: '0089-01-01-101',
      roomCode: 'A-101',
      floor: 1,
      area: 1,
      roomNumber: 101,
      name: 'High-Performance Computing Research Lab (Room 101)',
      carpetAreaSqFt: 737,
      carpetAreaSqM: 68.5,
      ceilingHeightM: 3.40
    }
  });
});

// Start listening if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[NAKSHA V2 Spatial API Server] running on http://localhost:${PORT}`);
    console.log(`[Health Endpoint] http://localhost:${PORT}/api/health`);
    console.log(`[Pipeline State] http://localhost:${PORT}/api/pipeline/state`);
  });
}

export default app;

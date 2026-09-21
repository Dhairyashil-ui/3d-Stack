/**
 * NAKSHA V2.0 - Unified End-to-End PPCRC Building Pipeline Service
 * Manages synchronized state across:
 * 1. Desktop Processing Portal (/desktop) -> 4 Package Uploads & Verification
 * 2. ULB Panel (/ulb/committee-formation) -> Package Reception & Survey Team Assignment
 * 3. Surveyor Portal (/surveyor/survey-activities) -> Team Details, Package Details, 5 Checkpoints & 3D Model Submission
 * 4. ULB Manage Publication (/ulb/urban-survey-publication) -> Plot Verification & Forwarding to BhuNaksha
 * 5. BhuNaksha Portal (/bhunaksha) -> 5 Selection Boxes -> ULPIN Details Card -> Generate ULPIN -> Send to ULB
 * 6. ULB Final Property Card Generation -> Generate Property Card (PPCRC_3D_Urban_Property_Card_UPC_22Sep2026.pdf)
 */

const STORAGE_KEY = 'naksha_ppcrc_pipeline_state_v2';

export interface DesktopPackageItem {
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

export interface SurveyTeamMember {
  id: string;
  name: string;
  role: string;
  licenseOrReg: string;
  isMainOfficer: boolean;
  contact: string;
}

export interface OfflineCheckpoint {
  id: string;
  title: string;
  description: string;
  verified: boolean;
  standard: string;
}

export type PipelineStage =
  | 'DESKTOP_READY'
  | 'DESKTOP_SUBMITTED'
  | 'ULB_TEAM_ASSIGNED'
  | 'SURVEYOR_VERIFIED'
  | 'ULB_SUBMITTED_TO_BHUNAKSHA'
  | 'BHUNAKSHA_ULPIN_ASSIGNED'
  | 'PROPERTY_CARD_GENERATED';

export interface PpcrcPipelineState {
  stage: PipelineStage;
  status: 'PENDING_SURVEY' | 'VERIFIED_READY' | 'PROPERTY_CARD_ASSIGNED';
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
  ulpin2D?: string;
  ulpin3D?: string;
  assignedTimestamp: string;
  verifiedOfficer: string;
  surveyorReg: string;
  propertyCardGenerated: boolean;
  lastUpdated: string;
}

export const DEFAULT_DESKTOP_PACKAGES: DesktopPackageItem[] = [
  {
    id: 'pkg-1',
    name: 'ORI and Package Imagery',
    type: 'Orthorectified Aerial & Drone Imagery',
    extension: '.tbk',
    fileName: 'PPCRC_Hinjawadi_Orthorectified_Imagery_0.05m.tbk',
    fileSize: '418.6 MB',
    verified: false,
    verifiedTimestamp: undefined,
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
    verified: false,
    verifiedTimestamp: undefined,
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
    verified: false,
    verifiedTimestamp: undefined,
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
    verified: false,
    verifiedTimestamp: undefined,
    crs: '3D Floor Tier Levels Z0–Z5 (Ground + 5 Floors, 45 Units)',
    sha256: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f'
  }
];

export const DEFAULT_SURVEY_TEAM: SurveyTeamMember[] = [
  {
    id: 'tm-1',
    name: 'Er. Rajeshwar D. Deshmukh',
    role: 'Chief Cadastral Surveyor & Land Records Officer (Main Officer)',
    licenseOrReg: 'MH-SLR-PUNE-0081',
    isMainOfficer: true,
    contact: '+91 98220 14592 | r.deshmukh@pmrda.gov.in'
  },
  {
    id: 'tm-2',
    name: 'Smt. Ananya K. Sharma',
    role: 'Lead Drone Pilot & Photogrammetrist',
    licenseOrReg: 'DGCA-RPA-9914/2024',
    isMainOfficer: false,
    contact: '+91 98450 78210'
  },
  {
    id: 'tm-3',
    name: 'Shri Amit V. Patil',
    role: 'Cadastral Surveyor (GNSS / RTK DGPS)',
    licenseOrReg: 'MH-PMRDA-CAD-402',
    isMainOfficer: false,
    contact: '+91 97631 88921'
  },
  {
    id: 'tm-4',
    name: 'Er. Vikramaditya Joshi',
    role: '3D GIS & LiDAR Point Cloud Analyst',
    licenseOrReg: 'GIS-BIM-CERT-7731',
    isMainOfficer: false,
    contact: '+91 99230 45112'
  },
  {
    id: 'tm-5',
    name: 'Shri Sunil M. Kulkarni',
    role: 'ULB / PMRDA Town Planning Representative',
    licenseOrReg: 'PMRDA-TPD-2022',
    isMainOfficer: false,
    contact: '+91 94220 33410'
  }
];

export const DEFAULT_OFFLINE_CHECKPOINTS: OfflineCheckpoint[] = [
  {
    id: 'chk-1',
    title: '1. Ground Control Point (GCP) & RTK GNSS Benchmark',
    description: 'Ground baseline verified against Base Station PMRDA-01 with horizontal accuracy ±0.012 m and PDOP 0.82.',
    verified: true,
    standard: 'Survey of India (SoI) National Geodetic Benchmark Specification'
  },
  {
    id: 'chk-2',
    title: '2. Physical Cadastral Boundary & Pillar Demarcation',
    description: 'Corner vertices V1–V5 match physical perimeter fencing at Survey No. 88, Plot B-7 (Pachpir Road / MIDC Phase 1).',
    verified: true,
    standard: 'Maharashtra Land Revenue Code (MLRC) 1966 Sec 135'
  },
  {
    id: 'chk-3',
    title: '3. Vertical Extent & Total Building Height Verification',
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

const DEFAULT_STATE: PpcrcPipelineState = {
  stage: 'DESKTOP_SUBMITTED', // Set by default so pipeline is immediately live and testable
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

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL 
  ? (import.meta as any).env.VITE_API_URL.replace(/\/$/, '') 
  : '';

// Helper to push state update to backend asynchronously (Render)
async function syncToBackend(endpoint: string, body?: any) {
  if (!API_BASE_URL) return;
  try {
    await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (err) {
    // Non-blocking: failsafe offline fallback to local state
    console.debug('[Backend Sync Notice] Render API:', err);
  }
}

// Initial remote fetch on client startup if VITE_API_URL is configured
if (typeof window !== 'undefined' && API_BASE_URL) {
  fetch(`${API_BASE_URL}/api/pipeline/state`)
    .then(res => res.json())
    .then(data => {
      if (data?.success && data?.data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        window.dispatchEvent(new Event('ppcrc_pipeline_updated'));
      }
    })
    .catch(() => {
      // Seamlessly falls back to local storage if Render server is cold-starting
    });
}

export const PpcrcPipelineService = {
  getState(): PpcrcPipelineState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          targetProperty: { ...DEFAULT_STATE.targetProperty, ...(parsed.targetProperty || {}) }
        };
      }
    } catch (e) {
      console.warn('Error reading PPCRC pipeline state from localStorage:', e);
    }
    return DEFAULT_STATE;
  },

  saveState(state: PpcrcPipelineState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event('ppcrc_pipeline_updated'));
    } catch (e) {
      console.warn('Error saving PPCRC pipeline state:', e);
    }
  },

  // 1. Desktop: Submit Verified 4 Packages to ULB Admin
  submitDesktopPackages(packages: DesktopPackageItem[]): PpcrcPipelineState {
    const current = this.getState();
    const updated: PpcrcPipelineState = {
      ...current,
      stage: 'DESKTOP_SUBMITTED',
      desktopPackages: packages,
      lastUpdated: new Date().toISOString()
    };
    this.saveState(updated);
    syncToBackend('/api/pipeline/desktop/submit', { packages });
    return updated;
  },

  // 2. ULB: Assign Survey Team & Dispatch to Surveyor
  assignSurveyTeam(team: SurveyTeamMember[] = DEFAULT_SURVEY_TEAM): PpcrcPipelineState {
    const current = this.getState();
    const updated: PpcrcPipelineState = {
      ...current,
      stage: 'ULB_TEAM_ASSIGNED',
      surveyTeam: team,
      verifiedOfficer: team.find(t => t.isMainOfficer)?.name || current.verifiedOfficer,
      surveyorReg: team.find(t => t.isMainOfficer)?.licenseOrReg || current.surveyorReg,
      lastUpdated: new Date().toISOString()
    };
    this.saveState(updated);
    syncToBackend('/api/pipeline/ulb/assign-team', { team });
    return updated;
  },

  // 3. Surveyor: Submit Offline Checkpoints & 3D Building Model to ULB
  submitSurveyorVerification(checkpoints: OfflineCheckpoint[] = DEFAULT_OFFLINE_CHECKPOINTS): PpcrcPipelineState {
    const current = this.getState();
    const updated: PpcrcPipelineState = {
      ...current,
      stage: 'SURVEYOR_VERIFIED',
      status: 'VERIFIED_READY',
      offlineCheckpoints: checkpoints,
      lastUpdated: new Date().toISOString()
    };
    this.saveState(updated);
    syncToBackend('/api/pipeline/surveyor/verify', { checkpoints });
    return updated;
  },

  // 4. ULB Manage Publication: Forward Verified Plot to BhuNaksha
  forwardToBhunaksha(): PpcrcPipelineState {
    const current = this.getState();
    const updated: PpcrcPipelineState = {
      ...current,
      stage: 'ULB_SUBMITTED_TO_BHUNAKSHA',
      lastUpdated: new Date().toISOString()
    };
    this.saveState(updated);
    syncToBackend('/api/pipeline/ulb/forward-bhunaksha');
    return updated;
  },

  // 5. BhuNaksha: Assign ULPIN and Send Back to ULB
  assignPropertyCard(
    ulpin: string = 'MH27B423070N97',
    ulpin2D: string = '27250401420089',
    ulpin3D: string = '0089-01-01-101'
  ): PpcrcPipelineState {
    const current = this.getState();
    const updated: PpcrcPipelineState = {
      ...current,
      stage: 'BHUNAKSHA_ULPIN_ASSIGNED',
      status: 'PROPERTY_CARD_ASSIGNED',
      ulpin,
      ulpin2D,
      ulpin3D,
      assignedTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      lastUpdated: new Date().toISOString()
    };
    this.saveState(updated);
    syncToBackend('/api/pipeline/bhunaksha/assign-card', { ulpin, ulpin2D, ulpin3D });
    return updated;
  },

  // 6. ULB: Mark Property Card Generated
  markPropertyCardGenerated(): PpcrcPipelineState {
    const current = this.getState();
    const updated: PpcrcPipelineState = {
      ...current,
      stage: 'PROPERTY_CARD_GENERATED',
      propertyCardGenerated: true,
      lastUpdated: new Date().toISOString()
    };
    this.saveState(updated);
    syncToBackend('/api/pipeline/ulb/generate-card');
    return updated;
  },

  // Reset demo pipeline
  resetPipeline(): PpcrcPipelineState {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      window.dispatchEvent(new Event('ppcrc_pipeline_updated'));
      syncToBackend('/api/pipeline/reset');
    } catch (e) {
      console.warn('Error resetting PPCRC pipeline state:', e);
    }
    return DEFAULT_STATE;
  }
};

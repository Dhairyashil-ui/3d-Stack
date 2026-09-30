// Reactive Data Store for NAKSHA Portal District Admin System
import {
  Building3DModel,
  VerificationAnomaly,
  UlbPublicationRecord,
  SAMPLE_BUILDINGS,
  INITIAL_ANOMALIES,
  INITIAL_ULB_PUBLICATIONS
} from './ulbData';

export interface Department {
  id: string;
  sNo: number;
  name: string;
  description: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

export interface Designation {
  id: string;
  sNo: number;
  name: string;
  department: string;
  description: string;
  createdBy: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

export interface PermissionRow {
  sNo: number;
  menuName: string;
  add: boolean;
  update: boolean;
  view: boolean;
}

export interface Role {
  id: string;
  sNo: number;
  name: string;
  description: string;
  createdBy: string;
  createdDate: string;
  permissions: PermissionRow[];
}

export interface PortalUser {
  id: string;
  sNo: number;
  district: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  roles: string[];
  actionDate: string;
  status: 'Active' | 'Inactive';
  remark?: string;
}

export interface AreaAssignment {
  id: string;
  sNo: number;
  userName: string;
  district: string;
  ulb: string;
  ward: string;
  assignedDate: string;
  status: 'Active' | 'Inactive';
  remark?: string;
}

export interface CaseRecord {
  id: string;
  sNo: number;
  district: string;
  ulb: string;
  caseNo: string;
  notificationNo: string;
  notificationDate: string;
  gazettePublicationDate: string;
  status: 'Ongoing' | 'Closed';
  enteredBy: string;
  entryDate: string;
  updatedDate: string;
  lgdCode?: string;
  caseDate?: string;
  applicantName?: string;
  nonApplicantName?: string;
  notificationDoc?: string;
  settlementDoc?: string;
  proceedingDetails?: string;
  closureDoc?: string;
}

export interface SurveyUnit {
  id: string;
  sNo: number;
  ulb: string;
  ward: string;
  surveyUnit: string;
  isAssigned: 'Yes' | 'No';
  assignedTo: string;
  isMapUploaded: 'Yes' | 'No';
  mapUploadedOn: string;
}

export interface PublicationRecord {
  id: string;
  sNo: number;
  district: string;
  ulb: string;
  ward: string;
  surveyUnit: string;
  totalPlots: number;
  gtCompleted: number;
  gtPending: number;
  rorCompleted: number;
  rorPending: number;
  casePending: number;
  status: 'Pending' | 'Final Published' | 'Rejected' | 'Draft';
  signOtpVerified?: boolean;
  eSignedBy?: string;
  eSignDate?: string;
  rejectionReason?: string;
}

export interface UploadedAoi {
  id: string;
  sNo: number;
  ulbName: string;
  ulbType: string;
  ulbCode: string;
  uploadedDate: string;
  createdBy: string;
  fileName: string;
  projection: string;
}

export interface UploadedLayer {
  id: string;
  sNo: number;
  district: string;
  ulbName: string;
  ulbType: string;
  layerType: 'Cadastral' | 'Property Tax Point' | 'Property Tax Polygon' | 'Building Footprint' | 'Layout Plan';
  uploadedDate: string;
  uploadedBy: string;
  fileName: string;
}

const STORAGE_KEYS = {
  DEPARTMENTS: 'naksha_departments',
  DESIGNATIONS: 'naksha_designations',
  ROLES: 'naksha_roles',
  USERS: 'naksha_users',
  AREA_ASSIGNMENTS: 'naksha_area_assignments',
  CASES: 'naksha_cases',
  SURVEY_UNITS: 'naksha_survey_units',
  PUBLICATIONS: 'naksha_publications',
  AOIS: 'naksha_aois',
  LAYERS: 'naksha_layers',
  AUTH: 'naksha_auth_user',
  BUILDINGS: 'naksha_ulb_buildings',
  ANOMALIES: 'naksha_ulb_anomalies',
  ULB_PUBLICATIONS: 'naksha_ulb_publications'
};

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP-1', sNo: 1, name: 'Revenue Department', description: 'Land revenue, cadastral surveys and records', createdBy: 'State Admin Madhya pradesh', createdOn: '23-07-2025', status: 'Active' },
  { id: 'DEP-2', sNo: 2, name: 'Pune_SedDA', description: 'District administration & geospatial coordination', createdBy: 'State Admin Madhya pradesh', createdOn: '27-06-2025', status: 'Active' },
  { id: 'DEP-3', sNo: 3, name: 'department_test2', description: 'Urban planning and land classification', createdBy: 'State Admin Madhya pradesh', createdOn: '17-07-2025', status: 'Active' },
  { id: 'DEP-4', sNo: 4, name: 'MPSEDC IT', description: 'Technical development and GIS mapping support', createdBy: 'Pune District Admin', createdOn: '29-07-2025', status: 'Active' },
  { id: 'DEP-5', sNo: 5, name: 'Town & Country Planning', description: 'Master plan verification and layout approvals', createdBy: 'Pune District Admin', createdOn: '04-08-2025', status: 'Active' },
];

const INITIAL_DESIGNATIONS: Designation[] = [
  { id: 'DES-1', sNo: 1, name: 'Collector & District Magistrate', department: 'Revenue Department', description: 'Chief Revenue Authority', createdBy: 'State Admin Madhya pradesh', createdDate: '23-07-2025', status: 'Active' },
  { id: 'DES-2', sNo: 2, name: 'DA Pune', department: 'Pune_SedDA', description: 'District Admin Officer', createdBy: 'State Admin Madhya pradesh', createdDate: '01-08-2025', status: 'Active' },
  { id: 'DES-3', sNo: 3, name: 'GIS Specialist', department: 'MPSEDC IT', description: 'Spatial analysis and raster/vector processing', createdBy: 'State Admin Madhya pradesh', createdDate: '27-06-2025', status: 'Active' },
  { id: 'DES-4', sNo: 4, name: 'Drone Pilot / Surveyor', department: 'Revenue Department', description: 'High-res aerial survey operations', createdBy: 'State Admin Madhya pradesh', createdDate: '24-06-2025', status: 'Active' },
  { id: 'DES-5', sNo: 5, name: 'Tehsildar / Revenue Inspector', department: 'Revenue Department', description: 'Ground truthing and RoR verification', createdBy: 'Pune District Admin', createdDate: '12-07-2025', status: 'Active' },
];

export const DEFAULT_PERMISSIONS: PermissionRow[] = [
  { sNo: 1, menuName: 'Home', add: true, update: true, view: true },
  { sNo: 2, menuName: 'Dashboard', add: true, update: true, view: true },
  { sNo: 3, menuName: 'Create/Manage Committee', add: true, update: true, view: true },
  { sNo: 4, menuName: 'Survey Unit Details', add: true, update: true, view: true },
  { sNo: 5, menuName: 'User Management', add: true, update: true, view: true },
  { sNo: 6, menuName: 'Survey Activities', add: true, update: true, view: true },
];

const INITIAL_ROLES: Role[] = [
  { id: 'ROL-1', sNo: 1, name: 'AgriRole_ULB', description: 'Agricultural perimeter validation role', createdBy: 'Pune DM', createdDate: '08-05-2025', permissions: DEFAULT_PERMISSIONS },
  { id: 'ROL-2', sNo: 2, name: 'Forest surveyor 1', description: 'Forest zone boundary tagging', createdBy: 'Pune DM', createdDate: '14-05-2025', permissions: DEFAULT_PERMISSIONS },
  { id: 'ROL-3', sNo: 3, name: 'GIS DM', description: 'Full district level admin GIS access', createdBy: 'Pune DM', createdDate: '08-05-2025', permissions: DEFAULT_PERMISSIONS },
  { id: 'ROL-4', sNo: 4, name: 'Manage Publication', description: 'RoR gazette publication and e-signing rights', createdBy: 'Pune DM', createdDate: '26-04-2025', permissions: DEFAULT_PERMISSIONS },
  { id: 'ROL-5', sNo: 5, name: 'ULB Admin', description: 'Urban Local Body administrative permissions', createdBy: 'Pune DM', createdDate: '20-05-2025', permissions: DEFAULT_PERMISSIONS },
];

const INITIAL_USERS: PortalUser[] = [
  { id: 'USR-ME', sNo: 1, district: 'Pune', firstName: 'Dhairyashil', lastName: '', name: 'Dhairyashil', email: 'dhairyashil@naksha.gov.in', mobile: '9699317520', department: 'Survey of India / PMRDA Cadastre Unit', designation: 'Lead Cadastral Surveyor & Drone Officer', roles: ['Lead Surveyor', '3D GIS Specialist', 'Desktop Ingest Officer'], actionDate: '29-09-2026', status: 'Active' },
  { id: 'USR-1', sNo: 2, district: 'Pune', firstName: 'Dhiren', lastName: 'Surveyor', name: 'Dhiren Surveyor', email: 'dhiren.survey@mp.gov.in', mobile: '9893044111', department: 'Revenue Department', designation: 'Drone Pilot / Surveyor', roles: ['ULB', 'Surveyor'], actionDate: '14-05-2025', status: 'Active' },
  { id: 'USR-2', sNo: 3, district: 'Pune', firstName: 'Pune', lastName: 'District Admin', name: 'Pune DM Test', email: 'pune_da@mh.gov.in', mobile: '7000573127', department: 'Pune_SedDA', designation: 'DA Pune', roles: ['GIS DM', 'Manage Publication'], actionDate: '24-05-2025', status: 'Active' },
  { id: 'USR-3', sNo: 4, district: 'Pune', firstName: 'Pawan', lastName: 'Verma', name: 'Pawan Verma', email: 'pawan.gis@mp.gov.in', mobile: '9425112233', department: 'MPSEDC IT', designation: 'GIS Specialist', roles: ['GIS DM'], actionDate: '09-05-2025', status: 'Active' },
  { id: 'USR-4', sNo: 5, district: 'Pune', firstName: 'Rajesh', lastName: 'Sharma', name: 'Rajesh Sharma', email: 'sharma.tehsil@mp.gov.in', mobile: '9826019944', department: 'Revenue Department', designation: 'Tehsildar / Revenue Inspector', roles: ['ULB Admin'], actionDate: '06-05-2025', status: 'Active' },
];

const INITIAL_AREA_ASSIGNMENTS: AreaAssignment[] = [
  { id: 'AREA-1', sNo: 1, userName: 'Pune District Admin', district: 'Pune', ulb: 'Pune-270410', ward: '1 - Manakna gaon/ward (12928)', assignedDate: '04-05-2025', status: 'Active' },
  { id: 'AREA-2', sNo: 2, userName: 'Dhiren Surveyor', district: 'Pune', ulb: 'Pune-270410', ward: '1 - Manakna gaon/ward (12928)', assignedDate: '24-05-2025', status: 'Active' },
  { id: 'AREA-3', sNo: 3, userName: 'Pawan Verma', district: 'Pune', ulb: 'Pune-270410', ward: '2 - Shahpura ward (12929)', assignedDate: '14-05-2025', status: 'Active' },
];

const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'CASE-1',
    sNo: 1,
    district: 'Pune',
    ulb: 'Pune (270410)',
    caseNo: 'CASE-2025-0012',
    notificationNo: 'NOTIF/BPL/2025/112',
    notificationDate: '28-05-2025',
    gazettePublicationDate: '28-05-2025',
    status: 'Ongoing',
    enteredBy: 'Pune District Admin',
    entryDate: '29-05-2025',
    updatedDate: '29-05-2025',
    lgdCode: '250946',
    caseDate: '28-05-2025',
    applicantName: 'Municipal Commissioner Pune',
    nonApplicantName: 'Ward 1 Landholders Association',
    proceedingDetails: 'Survey boundary re-verification ongoing for Sector 2B.'
  },
  {
    id: 'CASE-2',
    sNo: 2,
    district: 'Pune',
    ulb: 'Pune (270410)',
    caseNo: 'CASE-2025-0015',
    notificationNo: 'NOTIF/BPL/2025/115',
    notificationDate: '02-06-2025',
    gazettePublicationDate: '05-06-2025',
    status: 'Closed',
    enteredBy: 'Pune District Admin',
    entryDate: '02-06-2025',
    updatedDate: '10-06-2025',
    lgdCode: '250946',
    caseDate: '02-06-2025',
    applicantName: 'Director Land Records MP',
    nonApplicantName: 'Private Claimants Group',
    proceedingDetails: 'Settlement confirmed, parcel boundaries matched with drone ortho-mosaic.'
  },
  {
    id: 'CASE-3',
    sNo: 3,
    district: 'Pune',
    ulb: 'Berasia (250947)',
    caseNo: 'CASE-2025-0018',
    notificationNo: 'NOTIF/BER/2025/089',
    notificationDate: '12-06-2025',
    gazettePublicationDate: '15-06-2025',
    status: 'Ongoing',
    enteredBy: 'Pune District Admin',
    entryDate: '13-06-2025',
    updatedDate: '13-06-2025',
    lgdCode: '250947',
    caseDate: '12-06-2025',
    applicantName: 'Sub-Divisional Magistrate Berasia',
    nonApplicantName: 'Rural Habitation Council'
  }
];

const INITIAL_SURVEY_UNITS: SurveyUnit[] = [
  { id: 'SU-1', sNo: 1, ulb: 'PMRDA Pune (270410)', ward: 'Hinjawadi Village (411057)', surveyUnit: 'Survey Unit 01 - 348671', isAssigned: 'Yes', assignedTo: 'Surveyor Pune (Hinjawadi IT Park)', isMapUploaded: 'Yes', mapUploadedOn: '8/20/2026 09:30:00 AM' },
  { id: 'SU-2', sNo: 2, ulb: 'PMRDA Pune (270410)', ward: 'Hinjawadi Village (411057)', surveyUnit: 'Survey Unit 02 - 348672', isAssigned: 'Yes', assignedTo: 'Surveyor Field Team B', isMapUploaded: 'Yes', mapUploadedOn: '8/22/2026 10:15:20 AM' },
  { id: 'SU-3', sNo: 3, ulb: 'PMRDA Pune (270410)', ward: 'Hinjawadi Village (411057)', surveyUnit: 'Survey Unit 03 - 348673', isAssigned: 'Yes', assignedTo: 'Surveyor Field Team C', isMapUploaded: 'No', mapUploadedOn: '-' },
  { id: 'SU-4', sNo: 4, ulb: 'PMRDA Pune (270410)', ward: 'Wakad Ward 08 (411057)', surveyUnit: 'Survey Unit 01 - 348661', isAssigned: 'Yes', assignedTo: 'Senior Surveyor Pune', isMapUploaded: 'Yes', mapUploadedOn: '8/25/2026 4:40:12 PM' },
];

const INITIAL_PUBLICATIONS: PublicationRecord[] = [
  {
    id: 'PUB-1',
    sNo: 1,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Hinjawadi Village (411057)',
    surveyUnit: 'Survey Unit 01 - 348671',
    totalPlots: 46,
    gtCompleted: 46,
    gtPending: 0,
    rorCompleted: 46,
    rorPending: 0,
    casePending: 0,
    status: 'Pending'
  },
  {
    id: 'PUB-2',
    sNo: 2,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Hinjawadi Village (411057)',
    surveyUnit: 'Survey Unit 02 - 348672',
    totalPlots: 28,
    gtCompleted: 28,
    gtPending: 0,
    rorCompleted: 24,
    rorPending: 4,
    casePending: 1,
    status: 'Draft'
  },
  {
    id: 'PUB-3',
    sNo: 3,
    district: 'Pune',
    ulb: 'Pune (270410)',
    ward: '2 - Shahpura ward (12929)',
    surveyUnit: 'Survey Unit 1',
    totalPlots: 320,
    gtCompleted: 320,
    gtPending: 0,
    rorCompleted: 320,
    rorPending: 0,
    casePending: 0,
    status: 'Final Published',
    signOtpVerified: true,
    eSignedBy: 'Pune DM (MP-BPL-ADM-01)',
    eSignDate: '26-05-2025 11:20 AM'
  }
];

const INITIAL_AOIS: UploadedAoi[] = [
  { id: 'AOI-1', sNo: 1, ulbName: 'Pune', ulbType: 'municipality', ulbCode: '270410', uploadedDate: '5/23/2025', createdBy: 'Pune DM', fileName: 'pune_aoi_utm43n.shp', projection: 'UTM 44N' },
  { id: 'AOI-2', sNo: 2, ulbName: 'Pune', ulbType: 'municipality', ulbCode: '270410', uploadedDate: '5/23/2025', createdBy: 'Pune DM', fileName: 'pune_zone2_utm43n.shp', projection: 'UTM 44N' },
];

const INITIAL_LAYERS: UploadedLayer[] = [
  { id: 'LAY-1', sNo: 1, district: 'Maharashtra', ulbName: 'Pune', ulbType: 'municipality', layerType: 'Cadastral', uploadedDate: '2025-04-26', uploadedBy: 'Pune DM', fileName: 'cadastral_layer_utm44n.zip' },
  { id: 'LAY-2', sNo: 2, district: 'Maharashtra', ulbName: 'Pune', ulbType: 'municipality', layerType: 'Property Tax Point', uploadedDate: '2025-04-26', uploadedBy: 'Pune DM', fileName: 'property_tax_points.geojson' },
  { id: 'LAY-3', sNo: 3, district: 'Maharashtra', ulbName: 'Pune', ulbType: 'municipality', layerType: 'Building Footprint', uploadedDate: '2025-05-10', uploadedBy: 'Pune DM', fileName: 'pune_building_footprints.shp' },
];

// Helper to get or init localStorage
function getStored<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Mumbai City',
  'Mumbai Suburban',
  'Thane',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Solapur',
  'Kolhapur',
  'Amravati',
  'Nanded'
];
export const MP_DISTRICTS = MAHARASHTRA_DISTRICTS;

export const STATE_PERMISSION_MODULES = [
  'Home',
  'Dashboard',
  'Upload AOI',
  'Create/Manage Case',
  'User Management',
  'Report',
  'Notification',
  'Manage Log',
  'Grievance'
];

export const mockStore = {
  // Auth state
  getAuthUser() {
    return getStored(STORAGE_KEYS.AUTH, {
      name: 'Surveyor Pune (Hinjawadi)',
      role: 'Surveyor',
      portalMode: 'surveyor' as 'state' | 'district' | 'ulb' | 'surveyor',
      state: 'Maharashtra',
      district: 'Pune',
      ulbName: 'PMRDA Pune (270410)',
      ward: 'Ward 12 - Hinjawadi Phase 1 (411057)',
      surveyUnit: 'SU-HINJ-01 (I²IT Campus)',
      email: 'surveyor.pune@maharashtra.gov.in',
      isLoggedIn: true
    });
  },
  setAuthUser(user: any) {
    setStored(STORAGE_KEYS.AUTH, user);
  },
  switchPortalRole(mode: 'state' | 'district' | 'ulb' | 'surveyor') {
    const current = this.getAuthUser();
    if (mode === 'state') {
      this.setAuthUser({
        ...current,
        name: 'State Admin (Maharashtra)',
        role: 'State Admin',
        portalMode: 'state',
        state: 'Maharashtra',
        district: 'All Districts (Maharashtra)',
        email: 'cm.office@maharashtra.gov.in'
      });
    } else if (mode === 'district') {
      this.setAuthUser({
        ...current,
        name: 'Pune DM (Collector)',
        role: 'GIS DM',
        portalMode: 'district',
        state: 'Maharashtra',
        district: 'Pune',
        email: 'collector.pune@maharashtra.gov.in'
      });
    } else if (mode === 'surveyor') {
      this.setAuthUser({
        ...current,
        name: 'Surveyor Pune',
        role: 'Surveyor',
        portalMode: 'surveyor',
        state: 'Maharashtra',
        district: 'Pune',
        ulbName: 'PMRDA Pune - 270410',
        ward: 'Ward 12 - Hinjawadi Phase 1 (411057)',
        surveyUnit: 'SU-HINJ-01 (I²IT Campus)',
        email: 'surveyor.pune@maharashtra.gov.in'
      });
    } else {
      this.setAuthUser({
        ...current,
        name: 'PMRDA ULB Admin',
        role: 'ULB Admin',
        portalMode: 'ulb',
        state: 'Maharashtra',
        district: 'Pune',
        ulbName: 'Pune Metropolitan Region Development Authority',
        email: 'ulb.pmrda@maharashtra.gov.in'
      });
    }
  },
  getStateMetrics() {
    const users = this.getUsers();
    const active = users.filter(u => u.status === 'Active').length;
    return {
      totalUsers: 1481, // As per official national/state statistics
      activeUsers: 1420,
      inactiveUsers: 61,
      registeredDistricts: 52,
      onboardedUlbs: 104
    };
  },

  // Departments
  getDepartments(): Department[] {
    return getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },
  addDepartment(dept: Omit<Department, 'id' | 'sNo'>): Department {
    const list = this.getDepartments();
    const newDept: Department = {
      ...dept,
      id: `DEP-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newDept);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.DEPARTMENTS, list);
    return newDept;
  },

  // Designations
  getDesignations(): Designation[] {
    return getStored(STORAGE_KEYS.DESIGNATIONS, INITIAL_DESIGNATIONS);
  },
  addDesignation(desig: Omit<Designation, 'id' | 'sNo'>): Designation {
    const list = this.getDesignations();
    const newDesig: Designation = {
      ...desig,
      id: `DES-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newDesig);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.DESIGNATIONS, list);
    return newDesig;
  },

  // Roles
  getRoles(): Role[] {
    return getStored(STORAGE_KEYS.ROLES, INITIAL_ROLES);
  },
  addRole(role: Omit<Role, 'id' | 'sNo'>): Role {
    const list = this.getRoles();
    const newRole: Role = {
      ...role,
      id: `ROL-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newRole);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.ROLES, list);
    return newRole;
  },

  // Users
  getUsers(): PortalUser[] {
    return getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  addUser(user: Omit<PortalUser, 'id' | 'sNo'>): PortalUser {
    const list = this.getUsers();
    const newUser: PortalUser = {
      ...user,
      id: `USR-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newUser);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.USERS, list);
    return newUser;
  },
  updateUser(id: string, updates: Partial<PortalUser>): void {
    const list = this.getUsers().map(u => u.id === id ? { ...u, ...updates } : u);
    setStored(STORAGE_KEYS.USERS, list);
  },

  // Area Assignments
  getAreaAssignments(): AreaAssignment[] {
    return getStored(STORAGE_KEYS.AREA_ASSIGNMENTS, INITIAL_AREA_ASSIGNMENTS);
  },
  addAreaAssignment(area: Omit<AreaAssignment, 'id' | 'sNo'>): AreaAssignment {
    const list = this.getAreaAssignments();
    const newArea: AreaAssignment = {
      ...area,
      id: `AREA-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newArea);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.AREA_ASSIGNMENTS, list);
    return newArea;
  },

  // Cases
  getCases(): CaseRecord[] {
    return getStored(STORAGE_KEYS.CASES, INITIAL_CASES);
  },
  addCase(caseData: Omit<CaseRecord, 'id' | 'sNo'>): CaseRecord {
    const list = this.getCases();
    const newCase: CaseRecord = {
      ...caseData,
      id: `CASE-${Date.now()}`,
      sNo: list.length + 1
    };
    list.unshift(newCase);
    setStored(STORAGE_KEYS.CASES, list);
    return newCase;
  },
  closeCase(id: string, proceedingDetails: string, closureDoc?: string): void {
    const list = this.getCases().map(c => c.id === id ? {
      ...c,
      status: 'Closed' as const,
      proceedingDetails,
      closureDoc: closureDoc || 'Case_Proceedings_Order.pdf',
      updatedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
    } : c);
    setStored(STORAGE_KEYS.CASES, list);
  },

  // Survey Units
  getSurveyUnits(): SurveyUnit[] {
    return getStored(STORAGE_KEYS.SURVEY_UNITS, INITIAL_SURVEY_UNITS);
  },
  addSurveyUnit(unit: Omit<SurveyUnit, 'id' | 'sNo'>): SurveyUnit {
    const list = this.getSurveyUnits();
    const newUnit: SurveyUnit = {
      ...unit,
      id: `SU-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newUnit);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.SURVEY_UNITS, list);
    return newUnit;
  },

  // Publications
  getPublications(): PublicationRecord[] {
    return getStored(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
  },
  publishRoR(id: string, eSignedBy: string): void {
    const list = this.getPublications().map(p => p.id === id ? {
      ...p,
      status: 'Final Published' as const,
      signOtpVerified: true,
      eSignedBy,
      eSignDate: new Date().toLocaleString()
    } : p);
    setStored(STORAGE_KEYS.PUBLICATIONS, list);
  },
  rejectRoR(id: string, reason: string): void {
    const list = this.getPublications().map(p => p.id === id ? {
      ...p,
      status: 'Rejected' as const,
      rejectionReason: reason
    } : p);
    setStored(STORAGE_KEYS.PUBLICATIONS, list);
  },

  // AOIs
  getAOIs(): UploadedAoi[] {
    return getStored(STORAGE_KEYS.AOIS, INITIAL_AOIS);
  },
  addAOI(aoi: Omit<UploadedAoi, 'id' | 'sNo'>): UploadedAoi {
    const list = this.getAOIs();
    const newAOI: UploadedAoi = {
      ...aoi,
      id: `AOI-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newAOI);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.AOIS, list);
    return newAOI;
  },

  // Layers
  getLayers(): UploadedLayer[] {
    return getStored(STORAGE_KEYS.LAYERS, INITIAL_LAYERS);
  },
  addLayer(layer: Omit<UploadedLayer, 'id' | 'sNo'>): UploadedLayer {
    const list = this.getLayers();
    const newLayer: UploadedLayer = {
      ...layer,
      id: `LAY-${Date.now()}`,
      sNo: 1
    };
    list.unshift(newLayer);
    list.forEach((item, idx) => { item.sNo = idx + 1; });
    setStored(STORAGE_KEYS.LAYERS, list);
    return newLayer;
  },

  // 3D Buildings & ULB Workflows
  getBuildings(): Building3DModel[] {
    return getStored(STORAGE_KEYS.BUILDINGS, SAMPLE_BUILDINGS);
  },
  getBuildingByUlpin(ulpin: string): Building3DModel | undefined {
    return this.getBuildings().find(b => b.officialUlpin === ulpin);
  },
  getAnomalies(): VerificationAnomaly[] {
    return getStored(STORAGE_KEYS.ANOMALIES, INITIAL_ANOMALIES);
  },
  updateAnomalyStatus(id: string, status: VerificationAnomaly['status'], remarks?: string) {
    const list = this.getAnomalies().map(a => a.id === id ? {
      ...a,
      status,
      fieldRemarks: remarks || a.fieldRemarks
    } : a);
    setStored(STORAGE_KEYS.ANOMALIES, list);
  },
  getUlbPublications(): UlbPublicationRecord[] {
    return getStored(STORAGE_KEYS.ULB_PUBLICATIONS, INITIAL_ULB_PUBLICATIONS);
  },
  forwardUlbPublication(ulpin: string) {
    const list = this.getUlbPublications().map(p => p.ulpin === ulpin ? {
      ...p,
      ulbStatus: 'Forwarded to District' as const,
      forwardedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
    } : p);
    setStored(STORAGE_KEYS.ULB_PUBLICATIONS, list);

    // Also update building status
    const bldgs = this.getBuildings().map(b => b.officialUlpin === ulpin ? {
      ...b,
      overallStatus: 'Forwarded to District' as const
    } : b);
    setStored(STORAGE_KEYS.BUILDINGS, bldgs);
  },
  getUlbMetrics() {
    const bldgs = this.getBuildings();
    const anoms = this.getAnomalies();
    const pubs = this.getUlbPublications();
    return {
      totalBuildings: 842,
      verifiedUnits: 4320,
      anomaliesPending: anoms.filter(a => a.status === 'Open').length,
      readyForDistrict: pubs.filter(p => p.ulbStatus === 'Ready for ULB Review').length,
      forwardedToDistrict: pubs.filter(p => p.ulbStatus === 'Forwarded to District').length,
      totalFloorsMapped: 2540,
      totalArea3D: '1.82M m²'
    };
  }
};

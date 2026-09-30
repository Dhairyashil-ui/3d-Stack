import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  ShieldCheck,
  UserCheck,
  Plus,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';
import {
  mockStore,
  Department,
  Designation,
  Role,
  PortalUser,
  DEFAULT_PERMISSIONS,
  MAHARASHTRA_DISTRICTS
} from '../../data/mockStore';
import { Breadcrumb } from '../../components/common/Breadcrumb';

type ViewOption = 'department' | 'designation' | 'role' | 'officer';

export const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isStateMode = location.pathname.startsWith('/state');

  // Currently selected view option button below the 4 parallel boxes
  const [activeOption, setActiveOption] = useState<ViewOption>('officer');
  const [searchFilter, setSearchFilter] = useState('');

  // Mock store lists
  const [departments, setDepartments] = useState<Department[]>(() => mockStore.getDepartments());
  const [designations, setDesignations] = useState<Designation[]>(() => mockStore.getDesignations());
  const [roles, setRoles] = useState<Role[]>(() => mockStore.getRoles());
  const [users, setUsers] = useState<PortalUser[]>(() => mockStore.getUsers());

  // 2-second popup state
  const [toast, setToast] = useState<string | null>(null);

  // Form states - Box 1: Department
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // Form states - Box 2: Designation
  const [desigName, setDesigName] = useState('');
  const [desigDept, setDesigDept] = useState(() => mockStore.getDepartments()[0]?.name || '');
  const [desigDesc, setDesigDesc] = useState('');

  // Form states - Box 3: Role
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');

  // Form states - Box 4: Register Officer
  const [ofcFirstName, setOfcFirstName] = useState('');
  const [ofcLastName, setOfcLastName] = useState('');
  const [ofcEmail, setOfcEmail] = useState('');
  const [ofcMobile, setOfcMobile] = useState('');
  const [ofcDistrict, setOfcDistrict] = useState('Pune');
  const [ofcDept, setOfcDept] = useState(() => mockStore.getDepartments()[0]?.name || '');
  const [ofcDesig, setOfcDesig] = useState(() => mockStore.getDesignations()[0]?.name || '');
  const [ofcRole, setOfcRole] = useState(() => mockStore.getRoles()[0]?.name || '');

  // 10-Second Live Presentation States
  // 3s: Black screen showing state admin work only, no app
  // 5s: All 4 boxes (Dept, Desig, Role, Officer) fill in parallel, then clicks done
  // 2s: Tell that work is done for state admin
  const [presentationPhase, setPresentationPhase] = useState<'idle' | 'black_screen' | 'auto_fill' | 'completed'>('idle');
  const [blackScreenTimer, setBlackScreenTimer] = useState<number>(3);
  const [autoFillTimer, setAutoFillTimer] = useState<number>(5);
  const [completedTimer, setCompletedTimer] = useState<number>(2);
  const [isClickingDone, setIsClickingDone] = useState<boolean>(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  const presentationIntervalsRef = useRef<any[]>([]);

  const stopLivePresentation = () => {
    presentationIntervalsRef.current.forEach(t => clearInterval(t as any));
    presentationIntervalsRef.current = [];
    setPresentationPhase('idle');
    setIsClickingDone(false);
  };

  useEffect(() => {
    return () => {
      presentationIntervalsRef.current.forEach(t => clearInterval(t as any));
    };
  }, []);

  // Auto-start presentation if query param `presentation=true` is present
  useEffect(() => {
    if (searchParams.get('presentation') === 'true' || searchParams.get('autoplay') === 'true') {
      startLivePresentation();
    }
  }, [searchParams]);

  const refreshData = () => {
    setDepartments(mockStore.getDepartments());
    setDesignations(mockStore.getDesignations());
    setRoles(mockStore.getRoles());
    setUsers(mockStore.getUsers());
  };

  useEffect(() => {
    window.addEventListener('storage', refreshData);
    return () => window.removeEventListener('storage', refreshData);
  }, []);

  // Keep dropdown default values populated
  useEffect(() => {
    if (!desigDept && departments.length > 0) setDesigDept(departments[0].name);
    if (!ofcDept && departments.length > 0) setOfcDept(departments[0].name);
    if (!ofcDesig && designations.length > 0) setOfcDesig(designations[0].name);
    if (!ofcRole && roles.length > 0) setOfcRole(roles[0].name);
  }, [departments, designations, roles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  // Handler 1: Create Department
  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;
    if (departments.some(d => d.name.toLowerCase() === deptName.trim().toLowerCase())) {
      showToast('Department already exists.');
      return;
    }
    const newDept = mockStore.addDepartment({
      name: deptName.trim(),
      description: deptDesc.trim() || 'Statutory department',
      createdBy: isStateMode ? 'State Admin Maharashtra' : 'District Admin',
      createdOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active'
    });
    setNewlyCreatedId(newDept.id);
    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('Department created successfully (added at top)!');
    setDeptName('');
    setDeptDesc('');
    setActiveOption('department');
  };

  // Handler 2: Create Designation
  const handleCreateDesig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desigName.trim()) return;
    if (designations.some(d => d.name.toLowerCase() === desigName.trim().toLowerCase())) {
      showToast('Designation already exists.');
      return;
    }
    const newDesig = mockStore.addDesignation({
      name: desigName.trim(),
      department: desigDept || (departments[0]?.name ?? 'General'),
      description: desigDesc.trim() || 'Administrative post',
      createdBy: isStateMode ? 'State Admin Maharashtra' : 'District Admin',
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active'
    });
    setNewlyCreatedId(newDesig.id);
    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('Designation created successfully (added at top)!');
    setDesigName('');
    setDesigDesc('');
    setActiveOption('designation');
  };

  // Handler 3: Create Role
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    if (roles.some(r => r.name.toLowerCase() === roleName.trim().toLowerCase())) {
      showToast('Role already exists.');
      return;
    }
    const newRole = mockStore.addRole({
      name: roleName.trim(),
      description: roleDesc.trim() || 'Access role',
      createdBy: isStateMode ? 'State Admin Maharashtra' : 'District Admin',
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      permissions: DEFAULT_PERMISSIONS
    });
    setNewlyCreatedId(newRole.id);
    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('Role created successfully (added at top)!');
    setRoleName('');
    setRoleDesc('');
    setActiveOption('role');
  };

  // Handler 4: Register Officer
  const handleRegisterOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ofcFirstName.trim() || !ofcEmail.trim()) {
      showToast('First Name and Email are required.');
      return;
    }
    const fullName = (ofcFirstName.trim() + ' ' + ofcLastName.trim()).trim();
    const newUser = mockStore.addUser({
      district: ofcDistrict,
      firstName: ofcFirstName.trim(),
      lastName: ofcLastName.trim(),
      name: 'Er. ' + fullName,
      email: ofcEmail.trim(),
      mobile: ofcMobile.trim() || '—',
      department: ofcDept || (departments[0]?.name ?? 'General'),
      designation: ofcDesig || (designations[0]?.name ?? 'Officer'),
      roles: [ofcRole || (roles[0]?.name ?? 'General')],
      actionDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active',
      remark: 'Registered via User Management'
    });
    setNewlyCreatedId(newUser.id);
    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('Officer registered successfully (added at top)!');
    setOfcFirstName('');
    setOfcLastName('');
    setOfcEmail('');
    setOfcMobile('');
    setActiveOption('officer');
  };

  // ==========================================
  // EXACT 10-SECOND LIVE PRESENTATION ENGINE
  // 1. 3s: Black screen only showing State Admin Work, no app
  // 2. 5s: Dept, Desig, Role & Officer inputs fill in parallel, then clicks done
  // 3. 2s: Screen tells that work is done for state admin
  // ==========================================
  const startLivePresentation = () => {
    stopLivePresentation();

    // Reset inputs
    setDeptName('');
    setDeptDesc('');
    setDesigName('');
    setDesigDesc('');
    setRoleName('');
    setRoleDesc('');
    setOfcFirstName('');
    setOfcLastName('');
    setOfcEmail('');
    setOfcMobile('');
    setIsClickingDone(false);

    // Target data to stream in parallel
    const targetDeptName = 'Urban Land & Spatial Planning';
    const targetDeptDesc = 'Cadastral & 3D GIS Directorate for Urban Habitations';
    const targetDesigName = 'Chief Spatial Surveyor';
    const targetDesigDesc = 'Head of 3D Cadastral & Geo-Referencing Unit';
    const targetRoleName = 'State Cadastral Master';
    const targetRoleDesc = 'Full spatial, 3D Building models & drone parcel verification access';
    const targetOfcFirst = 'Vikram';
    const targetOfcLast = 'Deshmukh';
    const targetOfcEmail = 'v.deshmukh@spatial.mah.gov.in';
    const targetOfcMobile = '9823019842';

    // ------------------------------------------
    // PHASE 1: BLACK SCREEN FOR 3 SECONDS (0s - 3s)
    // ------------------------------------------
    setPresentationPhase('black_screen');
    setBlackScreenTimer(3);

    const blackStartTime = Date.now();
    const blackInterval = setInterval(() => {
      const elapsed = (Date.now() - blackStartTime) / 1000;
      const rem = Math.max(0, 3 - elapsed);
      setBlackScreenTimer(rem);
    }, 40);
    presentationIntervalsRef.current.push(blackInterval);

    // ------------------------------------------
    // PHASE 2: PARALLEL AUTO-FILL FOR 5 SECONDS (3s - 8s)
    // ------------------------------------------
    const phase2Timeout = setTimeout(() => {
      clearInterval(blackInterval as any);
      setPresentationPhase('auto_fill');
      setAutoFillTimer(5);

      const fillStartTime = Date.now();
      const typingDuration = 3800; // Finish typing across all inputs by 3.8s of the 5s phase

      const fillInterval = setInterval(() => {
        const elapsed = Date.now() - fillStartTime;
        const progress = Math.min(1, elapsed / typingDuration);
        const rem = Math.max(0, 5 - elapsed / 1000);
        setAutoFillTimer(rem);

        // Stream all 4 boxes in parallel!
        setDeptName(targetDeptName.slice(0, Math.ceil(progress * targetDeptName.length)));
        setDeptDesc(targetDeptDesc.slice(0, Math.ceil(progress * targetDeptDesc.length)));

        setDesigName(targetDesigName.slice(0, Math.ceil(progress * targetDesigName.length)));
        setDesigDesc(targetDesigDesc.slice(0, Math.ceil(progress * targetDesigDesc.length)));

        setRoleName(targetRoleName.slice(0, Math.ceil(progress * targetRoleName.length)));
        setRoleDesc(targetRoleDesc.slice(0, Math.ceil(progress * targetRoleDesc.length)));

        setOfcFirstName(targetOfcFirst.slice(0, Math.ceil(progress * targetOfcFirst.length)));
        setOfcLastName(targetOfcLast.slice(0, Math.ceil(progress * targetOfcLast.length)));
        setOfcEmail(targetOfcEmail.slice(0, Math.ceil(progress * targetOfcEmail.length)));
        setOfcMobile(targetOfcMobile.slice(0, Math.ceil(progress * targetOfcMobile.length)));
      }, 35);
      presentationIntervalsRef.current.push(fillInterval);

      // At ~4.0s of Phase 2: "Clicks Done" visual trigger
      const clickDoneTimeout = setTimeout(() => {
        setIsClickingDone(true);
      }, 4000);
      presentationIntervalsRef.current.push(clickDoneTimeout);

      // At ~4.3s of Phase 2: Actually create all 4 items into mockStore (unshifted to top!)
      const submitTimeout = setTimeout(() => {
        const ts = Date.now().toString().slice(-4);
        const uniqueDeptName = `${targetDeptName} #${ts}`;
        const uniqueDesigName = `${targetDesigName} #${ts}`;
        const uniqueRoleName = `${targetRoleName} #${ts}`;
        const uniqueEmail = `v.deshmukh.${ts}@spatial.mah.gov.in`;

        // 1. Create Department
        mockStore.addDepartment({
          name: uniqueDeptName,
          description: targetDeptDesc,
          createdBy: 'State Admin Maharashtra',
          createdOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          status: 'Active'
        });

        // 2. Create Designation
        mockStore.addDesignation({
          name: uniqueDesigName,
          department: uniqueDeptName,
          description: targetDesigDesc,
          createdBy: 'State Admin Maharashtra',
          createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          status: 'Active'
        });

        // 3. Create Role
        mockStore.addRole({
          name: uniqueRoleName,
          description: targetRoleDesc,
          createdBy: 'State Admin Maharashtra',
          createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          permissions: DEFAULT_PERMISSIONS
        });

        // 4. Register Officer
        const newOfficer = mockStore.addUser({
          district: 'Pune',
          firstName: targetOfcFirst,
          lastName: targetOfcLast,
          name: `Er. ${targetOfcFirst} ${targetOfcLast}`,
          email: uniqueEmail,
          mobile: targetOfcMobile,
          department: uniqueDeptName,
          designation: uniqueDesigName,
          roles: [uniqueRoleName],
          actionDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          status: 'Active',
          remark: 'Provisioned via 10s Live State Admin Presentation'
        });

        window.dispatchEvent(new Event('storage'));
        refreshData();
        setActiveOption('officer');
        setNewlyCreatedId(newOfficer.id);
      }, 4300);
      presentationIntervalsRef.current.push(submitTimeout);

      // ------------------------------------------
      // PHASE 3: WORK IS DONE FOR STATE ADMIN
      // Modal stays open with button to proceed to District Admin work
      // ------------------------------------------
      const phase3Timeout = setTimeout(() => {
        clearInterval(fillInterval as any);
        setIsClickingDone(false);
        setPresentationPhase('completed');
      }, 5000);
      presentationIntervalsRef.current.push(phase3Timeout);

    }, 3000);
    presentationIntervalsRef.current.push(phase2Timeout);
  };

  // UI Tokens & Helpers
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    border: presentationPhase === 'auto_fill' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '12.5px',
    backgroundColor: presentationPhase === 'auto_fill' ? '#f0f9ff' : '#ffffff',
    boxSizing: 'border-box',
    outline: 'none',
    color: '#0f172a',
    transition: 'all 0.15s ease',
    boxShadow: presentationPhase === 'auto_fill' ? '0 0 8px rgba(37, 99, 235, 0.2)' : 'none'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#475569',
    marginBottom: '4px'
  };

  const actionBtn = (bgColor: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    backgroundColor: isClickingDone ? '#15803d' : bgColor,
    color: '#ffffff',
    border: isClickingDone ? '2px solid #86efac' : 'none',
    padding: '9px 12px',
    borderRadius: '7px',
    fontWeight: 700,
    fontSize: '12.5px',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'all 0.15s ease',
    transform: isClickingDone ? 'scale(0.96)' : 'scale(1)',
    boxShadow: isClickingDone ? '0 0 16px rgba(34, 197, 94, 0.75)' : 'none'
  });

  const OPTIONS = [
    { key: 'department' as ViewOption, label: 'Departments', count: departments.length, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', Icon: Building2 },
    { key: 'designation' as ViewOption, label: 'Designations', count: designations.length, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', Icon: Briefcase },
    { key: 'role' as ViewOption, label: 'Roles', count: roles.length, color: '#d97706', bg: '#fffbeb', border: '#fde68a', Icon: ShieldCheck },
    { key: 'officer' as ViewOption, label: 'Registered Officers', count: users.length, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', Icon: Users }
  ];

  const currentOption = OPTIONS.find(o => o.key === activeOption)!;

  // Filtered items based on search filter
  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredDesignations = designations.filter(d =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.department?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.designation?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.district?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ padding: '20px 28px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <Breadcrumb items={[{ label: 'User Management' }]} />

      {/* PHASE 1: 3-SECOND BLACK SCREEN - ONLY STATE ADMIN WORK, NO APP */}
      {presentationPhase === 'black_screen' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          zIndex: 9999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          {/* Skip Button */}
          <button
            onClick={stopLivePresentation}
            style={{
              position: 'absolute',
              top: '24px',
              right: '32px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#94a3b8',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={14} /> Skip Demo
          </button>

          <div style={{
            maxWidth: '680px',
            width: '100%',
            textAlign: 'center'
          }}>
            {/* Header Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={14} />
              NAKSHA STATE PORTAL • 10-SECOND DEMO
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '36px',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              margin: '0 0 10px 0',
              color: '#ffffff'
            }}>
              STATE ADMIN WORK
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#94a3b8',
              margin: '0 0 28px 0',
              fontWeight: 500
            }}>
              Foundational governance charter for state-wide 3D cadastral land records:
            </p>

            {/* 4 Pillars - Shortest Way Possible */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Building2 size={16} color="#60a5fa" />
                  <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#93c5fd' }}>1. Departments</span>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Setup Urban & Revenue administrative directorates.
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Briefcase size={16} color="#c084fc" />
                  <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#d8b4fe' }}>2. Designations</span>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Define official posts, cadres, and supervisory ranks.
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldCheck size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#fde68a' }}>3. Role Matrix</span>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Configure 9-module security privileges (AOI, Cases, GIS).
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Users size={16} color="#4ade80" />
                  <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#86efac' }}>4. Register Officers</span>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Onboard officers and allocate districts across the state.
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar & Timer */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${((3 - blackScreenTimer) / 3) * 100}%`,
                  backgroundColor: '#38bdf8',
                  transition: 'width 0.05s linear',
                  boxShadow: '0 0 10px #38bdf8'
                }} />
              </div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', fontFamily: 'monospace' }}>
                Launching Parallel Auto-Fill in <strong style={{ color: '#38bdf8' }}>{blackScreenTimer.toFixed(1)}s</strong>...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: 2-SECOND COMPLETION BANNER - TELL THAT WORK IS DONE FOR STATE ADMIN */}
      {presentationPhase === 'completed' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '32px 36px',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34, 197, 94, 0.35)',
            position: 'relative'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#14532d',
              border: '3px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 20px #22c55e'
            }}>
              <CheckCircle2 size={36} color="#86efac" />
            </div>

            <h2 style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px'
            }}>
              Work is Done for State Admin
            </h2>

            <p style={{
              fontSize: '13.5px',
              color: '#86efac',
              margin: '0 0 20px 0',
              fontWeight: 600
            }}>
              ✓ All 4 Pillars Created & Added to the Top of the Registry!
            </p>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '20px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🏛️ Department:</span>
                <strong style={{ color: '#93c5fd' }}>Urban Land & Spatial Planning</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🎖️ Designation:</span>
                <strong style={{ color: '#d8b4fe' }}>Chief Spatial Surveyor</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🛡️ Role:</span>
                <strong style={{ color: '#fde68a' }}>State Cadastral Master</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>👤 Registered Officer:</span>
                <strong style={{ color: '#86efac' }}>Er. Vikram Deshmukh (Pune)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '22px' }}>
              <button
                id="btn-next-district-admin"
                onClick={() => {
                  stopLivePresentation();
                  setPresentationPhase('idle');
                  mockStore.switchPortalRole('district');
                  navigate('/portal/survey-units?presentation=true');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #16a34a 100%)',
                  color: '#ffffff',
                  border: '2px solid #86efac',
                  padding: '13px 22px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.45)',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>Next Step: District Admin Work</span>
                <ArrowRight size={19} />
              </button>

              <button
                onClick={() => {
                  stopLivePresentation();
                  setPresentationPhase('idle');
                  showToast('✨ Work is done for state admin! Newly created records are sitting at the top of the list.');
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close & View State Admin Records (Added at Top)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-SECOND FLOATING POPUP TOAST */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          backgroundColor: '#15803d',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 8px 30px rgba(0,0,0,0.22)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={19} />
          <span>{toast}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            User Management
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            Create departments, designations, roles, and register officers in parallel, then view created records below.
          </p>
        </div>
      </div>

      {/* PRESENTATION AUTO-FILL BANNER (PHASE 2 - 5s) */}
      {presentationPhase === 'auto_fill' && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 20px',
          borderRadius: '10px',
          background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1.5px solid #22c55e',
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.25)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 10px #ef4444'
            }} />
            <div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#ffffff' }}>
                🔴 LIVE PRESENTATION (5s):
              </span>
              <span style={{ fontSize: '13px', color: '#cbd5e1', marginLeft: '6px' }}>
                Department, Designation, Role & Officer filling in parallel...
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: isClickingDone ? '#15803d' : 'rgba(56, 189, 248, 0.2)',
              color: isClickingDone ? '#86efac' : '#38bdf8',
              border: '1px solid currentColor',
              fontFamily: 'monospace'
            }}>
              {isClickingDone ? 'CLICKS DONE ✓' : `Auto-Filling: ${autoFillTimer.toFixed(1)}s`}
            </span>
            <button
              onClick={stopLivePresentation}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 4 BOXES IN PARALLEL */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '16px',
        marginBottom: '32px',
        alignItems: 'stretch'
      }}>
        {/* BOX 1: DEPARTMENT */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #bfdbfe',
          boxShadow: '0 2px 8px rgba(29, 78, 216, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#eff6ff',
            padding: '12px 14px',
            borderBottom: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                backgroundColor: '#1d4ed8', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Building2 size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#1e3a8a' }}>1. Department</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 7px', borderRadius: '10px' }}>
              {departments.length}
            </span>
          </div>

          <form onSubmit={handleCreateDept} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div>
              <label style={labelStyle}>Department Name *</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. Revenue Dept"
                value={deptName}
                onChange={e => setDeptName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. Land revenue & records"
                value={deptDesc}
                onChange={e => setDeptDesc(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#1d4ed8')}>
                <Plus size={15} /> Create Department
              </button>
            </div>
          </form>
        </div>

        {/* BOX 2: DESIGNATION */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #ddd6fe',
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#f5f3ff',
            padding: '12px 14px',
            borderBottom: '1px solid #ddd6fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                backgroundColor: '#7c3aed', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Briefcase size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#5b21b6' }}>2. Designation</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed', padding: '2px 7px', borderRadius: '10px' }}>
              {designations.length}
            </span>
          </div>

          <form onSubmit={handleCreateDesig} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div>
              <label style={labelStyle}>Designation Name *</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. District Officer"
                value={desigName}
                onChange={e => setDesigName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Assign Department</label>
              <select
                style={inputStyle}
                value={desigDept}
                onChange={e => setDesigDept(e.target.value)}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. Administrative post"
                value={desigDesc}
                onChange={e => setDesigDesc(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#7c3aed')}>
                <Plus size={15} /> Create Designation
              </button>
            </div>
          </form>
        </div>

        {/* BOX 3: ROLE */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #fde68a',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#fffbeb',
            padding: '12px 14px',
            borderBottom: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                backgroundColor: '#d97706', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#92400e' }}>3. Role</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 7px', borderRadius: '10px' }}>
              {roles.length}
            </span>
          </div>

          <form onSubmit={handleCreateRole} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div>
              <label style={labelStyle}>Role Name *</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. GIS DM / Field Agent"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Scope & Description</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. Full spatial survey access"
                value={roleDesc}
                onChange={e => setRoleDesc(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#d97706')}>
                <Plus size={15} /> Create Role
              </button>
            </div>
          </form>
        </div>

        {/* BOX 4: REGISTER OFFICER */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #bbf7d0',
          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '12px 14px',
            borderBottom: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                backgroundColor: '#16a34a', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <UserCheck size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#166534' }}>4. Register Officer</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: '10px' }}>
              {users.length}
            </span>
          </div>

          <form onSubmit={handleRegisterOfficer} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="First name"
                  value={ofcFirstName}
                  onChange={e => setOfcFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Last name"
                  value={ofcLastName}
                  onChange={e => setOfcLastName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="officer@gov.in"
                  value={ofcEmail}
                  onChange={e => setOfcEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Mobile</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Mobile"
                  value={ofcMobile}
                  onChange={e => setOfcMobile(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>District</label>
                <select
                  style={inputStyle}
                  value={ofcDistrict}
                  onChange={e => setOfcDistrict(e.target.value)}
                >
                  {MAHARASHTRA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <select
                  style={inputStyle}
                  value={ofcDept}
                  onChange={e => setOfcDept(e.target.value)}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>Designation</label>
                <select
                  style={inputStyle}
                  value={ofcDesig}
                  onChange={e => setOfcDesig(e.target.value)}
                >
                  {designations.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select
                  style={inputStyle}
                  value={ofcRole}
                  onChange={e => setOfcRole(e.target.value)}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#16a34a')}>
                <CheckCircle2 size={15} /> Register Officer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 4 OPTIONS BUTTONS BELOW */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              RECORD DIRECTORY
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Select an option below to view real created records:
            </div>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search ${currentOption.label.toLowerCase()}...`}
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 30px',
                border: '1px solid #cbd5e1',
                borderRadius: '7px',
                fontSize: '12.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* THE 4 OPTION BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {OPTIONS.map(opt => {
            const OptIcon = opt.Icon;
            const isSelected = activeOption === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  setActiveOption(opt.key);
                  setSearchFilter('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid ' + (isSelected ? opt.color : '#e2e8f0'),
                  backgroundColor: isSelected ? opt.color : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  boxShadow: isSelected ? ('0 4px 14px ' + opt.color + '40') : '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <OptIcon size={18} color={isSelected ? '#ffffff' : opt.color} />
                  <span>{opt.label}</span>
                </div>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : opt.bg,
                  color: isSelected ? '#ffffff' : opt.color
                }}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECORDS DISPLAY FOR SELECTED OPTION */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        {/* VIEW 1: DEPARTMENTS */}
        {activeOption === 'department' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredDepartments.length} Department{filteredDepartments.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredDepartments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No departments found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredDepartments.map((d, index) => {
                  const isTopItem = index === 0 || d.id === newlyCreatedId;
                  return (
                    <div
                      key={d.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTopItem ? '#eff6ff' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTopItem ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                        boxShadow: isTopItem ? '0 2px 8px rgba(37, 99, 235, 0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '7px',
                          backgroundColor: '#eff6ff', color: '#1d4ed8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>{d.name}</span>
                            {isTopItem && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                backgroundColor: '#dbeafe',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Sparkles size={10} /> TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>{d.description || 'Statutory Department'} &bull; Created: {d.createdOn || 'Recent'}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11.5px',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontWeight: 700
                      }}>
                        Active
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: DESIGNATIONS */}
        {activeOption === 'designation' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredDesignations.length} Designation{filteredDesignations.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredDesignations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No designations found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredDesignations.map((d, index) => {
                  const isTopItem = index === 0 || d.id === newlyCreatedId;
                  return (
                    <div
                      key={d.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTopItem ? '#f5f3ff' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTopItem ? '1.5px solid #c4b5fd' : '1px solid #e2e8f0',
                        boxShadow: isTopItem ? '0 2px 8px rgba(124, 58, 237, 0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '7px',
                          backgroundColor: '#f5f3ff', color: '#7c3aed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>{d.name}</span>
                            {isTopItem && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                backgroundColor: '#ede9fe',
                                color: '#6d28d9',
                                border: '1px solid #ddd6fe',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Sparkles size={10} /> TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>{d.description || 'Administrative post'} &bull; Department: <strong style={{ color: '#5b21b6' }}>{d.department}</strong></div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11.5px',
                        backgroundColor: '#ede9fe',
                        color: '#6d28d9',
                        border: '1px solid #ddd6fe',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontWeight: 700
                      }}>
                        {d.department}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: ROLES */}
        {activeOption === 'role' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredRoles.length} Role{filteredRoles.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredRoles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No roles found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredRoles.map((r, index) => {
                  const isTopItem = index === 0 || r.id === newlyCreatedId;
                  return (
                    <div
                      key={r.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTopItem ? '#fffbeb' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTopItem ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                        boxShadow: isTopItem ? '0 2px 8px rgba(217, 119, 6, 0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '7px',
                          backgroundColor: '#fffbeb', color: '#d97706',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>{r.name}</span>
                            {isTopItem && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                backgroundColor: '#fef3c7',
                                color: '#b45309',
                                border: '1px solid #fde68a',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Sparkles size={10} /> TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>{r.description || 'Access role'} &bull; Permissions: {r.permissions?.length || 0} modules</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11.5px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontWeight: 700
                      }}>
                        Role Definition
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: REGISTERED OFFICERS */}
        {activeOption === 'officer' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredUsers.length} Registered Officer{filteredUsers.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No officers found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredUsers.map((u, index) => {
                  const isTopItem = index === 0 || u.id === newlyCreatedId;
                  return (
                    <div
                      key={u.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTopItem ? '#f0fdf4' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTopItem ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                        boxShadow: isTopItem ? '0 2px 8px rgba(22, 163, 74, 0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#1b539c',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '14px',
                          flexShrink: 0
                        }}>
                          {u.name.replace('Er. ', '').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>{u.name}</span>
                            {isTopItem && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                backgroundColor: '#dcfce7',
                                color: '#15803d',
                                border: '1px solid #bbf7d0',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Sparkles size={10} /> TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                            {u.email} &bull; {u.mobile} &bull; <strong style={{ color: '#0f172a' }}>{u.district}</strong>
                          </div>
                        </div>
                      </div>

                      {/* 3 Pills: Department, Designation, Role */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '11.5px',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 600
                        }}>
                          {u.department}
                        </span>
                        <span style={{
                          fontSize: '11.5px',
                          backgroundColor: '#f5f3ff',
                          color: '#6d28d9',
                          border: '1px solid #ddd6fe',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 600
                        }}>
                          {u.designation}
                        </span>
                        <span style={{
                          fontSize: '11.5px',
                          backgroundColor: '#fffbeb',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 600
                        }}>
                          {u.roles?.[0] || 'General'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

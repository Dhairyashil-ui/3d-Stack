import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { mockStore, Role, PermissionRow } from '../../data/mockStore';
import { Plus, ArrowLeft, Eye, CheckCircle2 } from 'lucide-react';

const MODULE_NAMES = [
  'Home',
  'Dashboard',
  'Create/Manage Committee',
  'Survey Unit Details',
  'User Management',
  'Survey Activities'
];

export const RolesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = mockStore.getAuthUser();
  const isStateMode = authUser.portalMode === 'state' || location.pathname.startsWith('/state');

  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [roles, setRoles] = useState<Role[]>(mockStore.getRoles());
  const [searchRole, setSearchRole] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setRoles(mockStore.getRoles());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Create Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [permissions, setPermissions] = useState<PermissionRow[]>(
    MODULE_NAMES.map((name, idx) => ({
      sNo: idx + 1,
      menuName: name,
      add: true,
      update: true,
      view: true
    }))
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // View Role Modal State
  const [viewRole, setViewRole] = useState<Role | null>(null);

  const handleSearch = () => {
    let filtered = mockStore.getRoles();
    if (searchRole) filtered = filtered.filter(r => r.name.toLowerCase().includes(searchRole.toLowerCase()));
    setRoles(filtered);
  };

  const handleClear = () => {
    setSearchRole('');
    setRoles(mockStore.getRoles());
  };

  const togglePermission = (index: number, field: 'add' | 'update' | 'view') => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    mockStore.addRole({
      name: newRoleName,
      description: newRoleDesc || 'Custom administrative role',
      createdBy: 'Pune DM',
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      permissions: permissions
    });

    setRoles(mockStore.getRoles());
    setSubmittedSuccess(true);
    setTimeout(() => {
      setViewMode('list');
      setSubmittedSuccess(false);
      setNewRoleName('');
      setNewRoleDesc('');
    }, 1200);
  };

  const columns: Column<Role>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'Role Name', accessor: 'name' },
    { header: 'Role Description', accessor: 'description' },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Created Date', accessor: 'createdDate' },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => setViewRole(row)}
          title="View Permissions"
          style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1b539c', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
        >
          <Eye size={14} /> View
        </button>
      ),
      align: 'center',
      width: '90px'
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'User Management' }, { label: 'Create/Manage Role' }]} />

      {/* VIEW 1: ROLE LIST (Manual Page 19 & 20) */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Create/Manage Role
            </h2>
            <button
              id="btn-create-role"
              onClick={() => {
                if (isStateMode) {
                  navigate('/state/user-management/roles/create');
                } else {
                  setViewMode('create');
                }
              }}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(27,83,156,0.2)'
              }}
            >
              <Plus size={16} />
              <span>Create Role</span>
            </button>
          </div>

          {/* Search Box matching Page 20 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', maxWidth: '600px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Role Name
                </label>
                <input
                  type="text"
                  placeholder="Search Role Name"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSearch}
                  style={{
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={roles}
            searchPlaceholder="Search Roles..."
          />

          {/* View Role Permissions Modal */}
          {viewRole && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '680px',
                padding: '24px',
                boxShadow: '0 20px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#1b539c', fontSize: '18px' }}>
                    Role: {viewRole.name}
                  </h3>
                  <button onClick={() => setViewRole(null)} style={{ border: 'none', background: 'none', fontSize: '16px', cursor: 'pointer' }}>✕</button>
                </div>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>{viewRole.description}</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#1b539c', color: '#fff' }}>
                      <th style={{ padding: '8px 12px' }}>S.No</th>
                      <th style={{ padding: '8px 12px' }}>Module Name</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Add</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Update</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewRole.permissions.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>{p.sNo}</td>
                        <td style={{ padding: '8px 12px' }}>{p.menuName}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>{p.add ? '✓' : '—'}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>{p.update ? '✓' : '—'}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>{p.view ? '✓' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    onClick={() => setViewRole(null)}
                    style={{ backgroundColor: '#1b539c', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CREATE ROLE & PERMISSIONS (Manual Page 21) */}
      {viewMode === 'create' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Create Role & Permissions
            </h2>
            <button
              onClick={() => setViewMode('list')}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            {submittedSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#16a34a',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}>
                <CheckCircle2 size={18} />
                <span>Role created successfully with assigned module permissions!</span>
              </div>
            )}

            {/* Inputs: State, Role Name, Description */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Select State <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value="Maharashtra"
                  disabled
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Role Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Role Name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Role Description"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>
            </div>

            {/* Permissions Assignment Table (Matching Screenshot Page 21) */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                Permissions Assignment Table
              </h3>
              <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1b539c', color: '#ffffff' }}>
                      <th style={{ padding: '10px 14px', width: '70px', textAlign: 'center' }}>S.No</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Menu Name</th>
                      <th style={{ padding: '10px 14px', width: '100px', textAlign: 'center' }}>Add</th>
                      <th style={{ padding: '10px 14px', width: '100px', textAlign: 'center' }}>Update</th>
                      <th style={{ padding: '10px 14px', width: '100px', textAlign: 'center' }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '9px 14px', textAlign: 'center' }}>{row.sNo}</td>
                        <td style={{ padding: '9px 14px', fontWeight: 600, color: '#1e293b' }}>{row.menuName}</td>
                        <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={row.add}
                            onChange={() => togglePermission(idx, 'add')}
                            style={{ width: '16px', height: '16px', accentColor: '#1b539c', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={row.update}
                            onChange={() => togglePermission(idx, 'update')}
                            style={{ width: '16px', height: '16px', accentColor: '#1b539c', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={row.view}
                            onChange={() => togglePermission(idx, 'view')}
                            style={{ width: '16px', height: '16px', accentColor: '#1b539c', cursor: 'pointer' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  backgroundColor: '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#1b539c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 24px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

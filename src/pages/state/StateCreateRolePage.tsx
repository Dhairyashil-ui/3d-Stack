import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { mockStore, PermissionRow } from '../../data/mockStore';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

const STATE_MODULES = [
  { sNo: 1, menuName: 'Home', hasSubmenu: false },
  { sNo: 2, menuName: 'Dashboard', hasSubmenu: false },
  { sNo: 3, menuName: 'Upload AOI', hasSubmenu: false },
  { sNo: 4, menuName: 'Create/Manage Case', hasSubmenu: false },
  { sNo: 5, menuName: 'User Management', hasSubmenu: true },
  { sNo: 6, menuName: 'Report', hasSubmenu: false },
  { sNo: 7, menuName: 'Notification', hasSubmenu: false },
  { sNo: 8, menuName: 'Manage Log', hasSubmenu: false },
  { sNo: 9, menuName: 'Grievance', hasSubmenu: false },
];

export const StateCreateRolePage: React.FC = () => {
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<PermissionRow[]>(
    STATE_MODULES.map((m) => ({
      sNo: m.sNo,
      menuName: m.menuName,
      add: true,
      update: true,
      view: true
    }))
  );
  const [success, setSuccess] = useState(false);

  const toggleAll = (checked: boolean) => {
    setPermissions(
      permissions.map((p) => ({
        ...p,
        add: checked,
        update: checked,
        view: checked
      }))
    );
  };

  const toggleSingle = (index: number, field: 'add' | 'update' | 'view') => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    mockStore.addRole({
      name: roleName,
      description: description || 'State Admin defined role',
      createdBy: 'State MP (State)',
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      permissions
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/state/user-management/roles');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb
        items={[
          { label: 'User Management', path: '/state/user-management/users' },
          { label: 'Create/Manage Role', path: '/state/user-management/roles' },
          { label: 'Create Role' }
        ]}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Create Role & Permissions
        </h2>
        <button
          onClick={() => navigate('/state/user-management/roles')}
          style={{
            backgroundColor: '#ea5455',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 18px',
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

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {success && (
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
            <span>Role created successfully with 9-module permissions configuration!</span>
          </div>
        )}

        {/* Inputs matching Manual Page 12 */}
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
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#64748b' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Role Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="input-role-name"
              type="text"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Description
            </label>
            <input
              id="input-role-desc"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>
        </div>

        {/* Exact 9-Module Permissions Assignment Table matching Screenshot Page 12 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1b539c', color: '#ffffff' }}>
                  <th style={{ padding: '10px 14px', width: '50px', textAlign: 'center' }}>
                    <input
                      id="chk-toggle-all-permissions"
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => toggleAll(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '10px 14px', width: '70px', textAlign: 'center' }}>S.No</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Menu Name</th>
                  <th style={{ padding: '10px 14px', width: '110px', textAlign: 'center' }}>Add</th>
                  <th style={{ padding: '10px 14px', width: '110px', textAlign: 'center' }}>Update</th>
                  <th style={{ padding: '10px 14px', width: '110px', textAlign: 'center' }}>View</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((row, idx) => {
                  const meta = STATE_MODULES[idx];
                  return (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: meta?.hasSubmenu ? '#f1f5f9' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc'),
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={row.add && row.update && row.view}
                          onChange={(e) => {
                            const val = e.target.checked;
                            const updated = [...permissions];
                            updated[idx].add = val;
                            updated[idx].update = val;
                            updated[idx].view = val;
                            setPermissions(updated);
                          }}
                          style={{ width: '15px', height: '15px', accentColor: '#1b539c', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>{row.sNo}</td>
                      <td style={{ padding: '9px 14px', fontWeight: meta?.hasSubmenu ? 700 : 500, color: meta?.hasSubmenu ? '#1b539c' : '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {meta?.hasSubmenu && <ChevronDown size={14} />}
                          <span>{row.menuName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={row.add}
                          onChange={() => toggleSingle(idx, 'add')}
                          style={{ width: '16px', height: '16px', accentColor: '#1b539c', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={row.update}
                          onChange={() => toggleSingle(idx, 'update')}
                          style={{ width: '16px', height: '16px', accentColor: '#1b539c', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={row.view}
                          onChange={() => toggleSingle(idx, 'view')}
                          style={{ width: '16px', height: '16px', accentColor: '#1b539c', cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="btn-submit-role"
            type="submit"
            style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 28px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

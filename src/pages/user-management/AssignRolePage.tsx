import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { mockStore, PortalUser } from '../../data/mockStore';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const AssignRolePage: React.FC = () => {
  const [users, setUsers] = useState<PortalUser[]>(mockStore.getUsers());
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setUsers(mockStore.getUsers());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);

  // Assign Form State
  const [targetUserId, setTargetUserId] = useState('');
  const [roleToAssign, setRoleToAssign] = useState('ULB');
  const [assignDesc, setAssignDesc] = useState('');

  // Edit Role State
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [newRoleInput, setNewRoleInput] = useState('Manage Publication');

  const handleSearch = () => {
    let filtered = mockStore.getUsers();
    if (searchName) filtered = filtered.filter(u => u.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchRole) filtered = filtered.filter(u => u.roles.some(r => r.toLowerCase().includes(searchRole.toLowerCase())));
    setUsers(filtered);
  };

  const handleClear = () => {
    setSearchName('');
    setSearchRole('');
    setUsers(mockStore.getUsers());
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) return;

    const user = users.find(u => u.id === targetUserId);
    if (user && !user.roles.includes(roleToAssign)) {
      mockStore.updateUser(targetUserId, {
        roles: [...user.roles, roleToAssign]
      });
      setUsers(mockStore.getUsers());
    }

    setAssignModalOpen(false);
    setTargetUserId('');
  };

  const handleEditRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    mockStore.updateUser(selectedUser.id, {
      roles: userRoles
    });

    setUsers(mockStore.getUsers());
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const removeRole = (indexToRemove: number) => {
    setUserRoles(userRoles.filter((_, idx) => idx !== indexToRemove));
  };

  const addRoleToUser = () => {
    if (newRoleInput && !userRoles.includes(newRoleInput)) {
      setUserRoles([...userRoles, newRoleInput]);
    }
  };

  const columns: Column<PortalUser>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'User Name', accessor: 'name' },
    {
      header: 'Roles',
      accessor: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {row.roles.map((r, i) => (
            <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 600 }}>
              {r}
            </span>
          ))}
        </div>
      )
    },
    { header: 'Created Date', accessor: 'actionDate' },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => {
            setSelectedUser(row);
            setUserRoles([...row.roles]);
            setEditModalOpen(true);
          }}
          title="Update User Role"
          style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1b539c', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Edit2 size={13} /> Edit
        </button>
      ),
      align: 'center',
      width: '100px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'User Management' }, { label: 'Assign Role to User' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Assign Role to User
        </h2>
        <button
          id="btn-assign-role"
          onClick={() => setAssignModalOpen(true)}
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
          <span>Assign Role To User</span>
        </button>
      </div>

      {/* Filter Box matching Manual Page 22 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Select State <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value="Maharashtra"
              disabled
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Name
            </label>
            <input
              type="text"
              placeholder="User Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Role
            </label>
            <select
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            >
              <option value="">Select Role</option>
              <option value="GIS DM">GIS DM</option>
              <option value="ULB">ULB</option>
              <option value="Manage Publication">Manage Publication</option>
              <option value="Surveyor">Surveyor</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSearch}
              style={{ flex: 1, backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
            <button
              onClick={handleClear}
              style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search User Roles..."
      />

      {/* ASSIGN ROLE MODAL (Matching Manual Page 23 & 24) */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Role To User"
        maxWidth="550px"
      >
        <form onSubmit={handleAssignSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              State <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value="Maharashtra"
              disabled
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Select Roles <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              id="select-assign-role"
              value={roleToAssign}
              onChange={(e) => setRoleToAssign(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            >
              <option value="District 3D Cadastral Admin">District 3D Cadastral Admin</option>
              <option value="ULB">ULB</option>
              <option value="GIS DM">GIS DM</option>
              <option value="Manage Publication">Manage Publication</option>
              <option value="Surveyor">Surveyor</option>
              <option value="AgriRole_ULB">AgriRole_ULB</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Users <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              id="select-assign-user"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            >
              <option value="">Select Users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Description
            </label>
            <input
              id="input-assign-desc"
              type="text"
              placeholder="Remarks regarding role assignment..."
              value={assignDesc}
              onChange={(e) => setAssignDesc(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
            >
              Close
            </button>
            <button
              id="btn-submit-assign"
              type="submit"
              style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* UPDATE USER ROLE MODAL (Matching Manual Page 24 & 25) */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update User Role"
        maxWidth="580px"
      >
        {selectedUser && (
          <form onSubmit={handleEditRoleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                  User Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  disabled
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
                />
              </div>
            </div>

            {/* Existing Assigned Roles List with Trash Removal */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Current Roles
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userRoles.map((role, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{role}</span>
                    <button
                      type="button"
                      onClick={() => removeRole(idx)}
                      title="Remove Role"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Role Control */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
              <select
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Manage Publication">Manage Publication</option>
                <option value="GIS DM">GIS DM</option>
                <option value="ULB">ULB</option>
                <option value="Surveyor">Surveyor</option>
              </select>
              <button
                type="button"
                onClick={addRoleToUser}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #1b539c',
                  color: '#1b539c',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                + Add Role
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
              >
                Update
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

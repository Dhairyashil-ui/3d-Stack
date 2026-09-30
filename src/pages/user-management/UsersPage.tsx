import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { mockStore, PortalUser } from '../../data/mockStore';
import { Plus, Eye, Edit2, CheckCircle2 } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<PortalUser[]>(mockStore.getUsers());
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchDesig, setSearchDesig] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setUsers(mockStore.getUsers());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    state: 'Maharashtra',
    district: 'Pune',
    department: 'Revenue Department',
    designation: 'Drone Pilot / Surveyor',
    remark: ''
  });

  const handleSearch = () => {
    let filtered = mockStore.getUsers();
    if (searchName) filtered = filtered.filter(u => u.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchDept) filtered = filtered.filter(u => u.department.toLowerCase().includes(searchDept.toLowerCase()));
    if (searchDesig) filtered = filtered.filter(u => u.designation.toLowerCase().includes(searchDesig.toLowerCase()));
    setUsers(filtered);
  };

  const handleClear = () => {
    setSearchName('');
    setSearchDept('');
    setSearchDesig('');
    setUsers(mockStore.getUsers());
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    mockStore.addUser({
      district: formData.district,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      mobile: formData.mobile,
      department: formData.department,
      designation: formData.designation,
      roles: ['ULB'],
      actionDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active',
      remark: formData.remark
    });

    setUsers(mockStore.getUsers());
    setCreateModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      state: 'Maharashtra',
      district: 'Pune',
      department: 'Revenue Department',
      designation: 'Drone Pilot / Surveyor',
      remark: ''
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    mockStore.updateUser(selectedUser.id, {
      department: formData.department,
      designation: formData.designation,
      mobile: formData.mobile,
      remark: formData.remark
    });

    setUsers(mockStore.getUsers());
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const columns: Column<PortalUser>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'District', accessor: 'district' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    {
      header: 'Roles',
      accessor: (row) => row.roles.join(', ')
    },
    { header: 'Action Date', accessor: 'actionDate' },
    {
      header: 'Status',
      accessor: (row) => (
        <span style={{
          backgroundColor: row.status === 'Active' ? '#dcfce7' : '#fee2e2',
          color: row.status === 'Active' ? '#15803d' : '#b91c1c',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {row.status}
        </span>
      ),
      align: 'center',
      width: '90px'
    },
    {
      header: 'Action',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              setSelectedUser(row);
              setViewModalOpen(true);
            }}
            title="View User"
            style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1b539c', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => {
              setSelectedUser(row);
              setFormData({
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                mobile: row.mobile,
                state: 'Maharashtra',
                district: row.district,
                department: row.department,
                designation: row.designation,
                remark: row.remark || ''
              });
              setEditModalOpen(true);
            }}
            title="Edit User"
            style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
      align: 'center',
      width: '90px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'User Management' }, { label: 'Create/Manage User' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Create/Manage User
        </h2>
        <button
          onClick={() => setCreateModalOpen(true)}
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
          <span>Create User</span>
        </button>
      </div>

      {/* Filter Box matching Manual Page 20 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Department
            </label>
            <select
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            >
              <option value="">Select Department</option>
              <option value="Revenue Department">Revenue Department</option>
              <option value="Pune_SedDA">Pune_SedDA</option>
              <option value="MPSEDC IT">MPSEDC IT</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Designation
            </label>
            <select
              value={searchDesig}
              onChange={(e) => setSearchDesig(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            >
              <option value="">Select Designation</option>
              <option value="Collector">Collector</option>
              <option value="DA Pune">DA Pune</option>
              <option value="GIS Specialist">GIS Specialist</option>
              <option value="Drone Pilot">Drone Pilot</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSearch}
              style={{
                flex: 1,
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 16px',
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
                flex: 1,
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '9px 16px',
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
        data={users}
        searchPlaceholder="Search Users..."
      />

      {/* CREATE USER MODAL (Matching Manual Page 21 & 22) */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create User"
        maxWidth="780px"
      >
        <form onSubmit={handleCreateSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                First Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Last Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Email Id <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="Email Id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Mobile Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select State <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                disabled
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select District <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.district}
                disabled
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select Department <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Revenue Department">Revenue Department</option>
                <option value="Pune_SedDA">Pune_SedDA</option>
                <option value="MPSEDC IT">MPSEDC IT</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select Designation <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Drone Pilot / Surveyor">Drone Pilot / Surveyor</option>
                <option value="GIS Specialist">GIS Specialist</option>
                <option value="DA Pune">DA Pune</option>
                <option value="Tehsildar / Revenue Inspector">Tehsildar / Revenue Inspector</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Remark
              </label>
              <input
                type="text"
                placeholder="Enter Remark"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW USER DETAILS MODAL */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`User Details: ${selectedUser?.name}`}
        maxWidth="550px"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div><b>Name:</b> {selectedUser.name}</div>
            <div><b>Email:</b> {selectedUser.email}</div>
            <div><b>Mobile:</b> {selectedUser.mobile}</div>
            <div><b>Department:</b> {selectedUser.department}</div>
            <div><b>Designation:</b> {selectedUser.designation}</div>
            <div><b>Assigned Roles:</b> {selectedUser.roles.join(', ')}</div>
            <div><b>District:</b> {selectedUser.district}</div>
            <div><b>Status:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{selectedUser.status}</span></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setViewModalOpen(false)}
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit User: ${selectedUser?.name}`}
        maxWidth="600px"
      >
        <form onSubmit={handleEditSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Revenue Department">Revenue Department</option>
                <option value="Pune_SedDA">Pune_SedDA</option>
                <option value="MPSEDC IT">MPSEDC IT</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Drone Pilot / Surveyor">Drone Pilot / Surveyor</option>
                <option value="GIS Specialist">GIS Specialist</option>
                <option value="DA Pune">DA Pune</option>
                <option value="Tehsildar / Revenue Inspector">Tehsildar / Revenue Inspector</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Mobile Number
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Remark
              </label>
              <input
                type="text"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

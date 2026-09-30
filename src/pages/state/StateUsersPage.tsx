import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { mockStore, PortalUser, MP_DISTRICTS } from '../../data/mockStore';
import { Plus, Edit2, Eye, CheckCircle2 } from 'lucide-react';

export const StateUsersPage: React.FC = () => {
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);

  // Form State matching Manual Page 13 & 14
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    state: 'Maharashtra',
    district: 'Pune',
    department: 'Revenue Department',
    designation: 'DA Pune',
    role: 'District Admin',
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
    if (!formData.firstName || !formData.email || !formData.district) return;

    mockStore.addUser({
      district: formData.district,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      mobile: formData.mobile,
      department: formData.department,
      designation: formData.designation,
      roles: [formData.role || 'District Admin'],
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
      designation: 'DA Pune',
      role: 'District Admin',
      remark: ''
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    mockStore.updateUser(selectedUser.id, {
      department: formData.department,
      designation: formData.designation,
      district: formData.district,
      mobile: formData.mobile,
      remark: formData.remark
    });

    setUsers(mockStore.getUsers());
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  // Columns matching State Admin Manual Page 12 Screenshot & OCR
  const columns: Column<PortalUser>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    {
      header: 'Role',
      accessor: (row) => row.roles.join(', ')
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Updated Date', accessor: 'actionDate' },
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
      width: '85px'
    },
    {
      header: 'District Name',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: '#1b539c' }}>
          {row.district}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (row) => (
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
              role: row.roles[0] || 'District Admin',
              remark: row.remark || ''
            });
            setEditModalOpen(true);
          }}
          title="Update User Details"
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1b539c',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px'
          }}
        >
          <Edit2 size={13} /> Update
        </button>
      ),
      align: 'center',
      width: '95px'
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
          id="btn-create-user"
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

      {/* Filter Box matching Manual Page 12 & 13 */}
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
              Select State
            </label>
            <input
              type="text"
              value="Maharashtra"
              disabled
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#64748b' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Department
            </label>
            <select
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
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
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
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
        searchPlaceholder="Search State Users..."
      />

      {/* CREATE USER MODAL (Matching Manual Page 13 & 14) */}
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
                id="input-user-first-name"
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
                id="input-user-last-name"
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
                Email ID <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="input-user-email"
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
                id="input-user-mobile"
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
                value="Maharashtra"
                disabled
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#64748b' }}
              />
            </div>

            {/* Select District Dropdown (Mandatory for State Admin!) */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select District <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                id="select-user-district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                {MP_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select Department <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                id="select-user-dept"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Revenue Department">Revenue Department</option>
                <option value="Dept of Land Records & 3D Cadastre">Dept of Land Records & 3D Cadastre</option>
                <option value="Pune_SedDA">Pune_SedDA</option>
                <option value="MPSEDC IT">MPSEDC IT</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select Designation <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                id="select-user-desig"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Collector">Collector</option>
                <option value="Chief 3D Cadastral Settlement Officer">Chief 3D Cadastral Settlement Officer</option>
                <option value="DA Pune">DA Pune</option>
                <option value="GIS Specialist">GIS Specialist</option>
                <option value="Drone Pilot / Surveyor">Drone Pilot / Surveyor</option>
                <option value="Tehsildar / Revenue Inspector">Tehsildar / Revenue Inspector</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Remark
              </label>
              <input
                id="input-user-remark"
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
              style={{ backgroundColor: '#ea5455', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              id="btn-submit-user"
              type="submit"
              style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '13.5px' }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Update User Details: ${selectedUser?.name}`}
        maxWidth="620px"
      >
        <form onSubmit={handleEditSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                District
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                {MP_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

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
                <option value="Collector">Collector</option>
                <option value="DA Pune">DA Pune</option>
                <option value="GIS Specialist">GIS Specialist</option>
                <option value="Drone Pilot / Surveyor">Drone Pilot / Surveyor</option>
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

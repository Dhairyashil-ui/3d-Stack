import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { mockStore, Department } from '../../data/mockStore';
import { Plus, Eye, Edit2, CheckCircle2 } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(mockStore.getDepartments());
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setDepartments(mockStore.getDepartments());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Add Department Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const [formState, setFormState] = useState({
    state: 'Maharashtra',
    departmentName: '',
    description: ''
  });

  const handleSearch = () => {
    let filtered = mockStore.getDepartments();
    if (searchName) {
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (searchStatus) {
      filtered = filtered.filter((d) => d.status === searchStatus);
    }
    setDepartments(filtered);
  };

  const handleClear = () => {
    setSearchName('');
    setSearchStatus('');
    setDepartments(mockStore.getDepartments());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.departmentName.trim()) return;

    mockStore.addDepartment({
      name: formState.departmentName,
      description: formState.description,
      createdBy: 'Pune District Admin',
      createdOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active'
    });

    setDepartments(mockStore.getDepartments());
    setModalOpen(false);
    setFormState({ state: 'Maharashtra', departmentName: '', description: '' });
  };

  const columns: Column<Department>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'Department', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Created On', accessor: 'createdOn' },
    {
      header: 'Status',
      accessor: (row) => (
        <span style={{
          backgroundColor: row.status === 'Active' ? '#dcfce7' : '#fee2e2',
          color: row.status === 'Active' ? '#15803d' : '#b91c1c',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {row.status}
        </span>
      ),
      align: 'center',
      width: '100px'
    },
    {
      header: 'Action',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              setSelectedDept(row);
              setIsViewMode(true);
              setModalOpen(true);
            }}
            title="View Department"
            style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1b539c', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
          >
            <Eye size={14} />
          </button>
        </div>
      ),
      align: 'center',
      width: '80px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'User Management' }, { label: 'Create/Manage Department' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Create/Manage Department
        </h2>
        <button
          id="btn-create-department"
          onClick={() => {
            setSelectedDept(null);
            setIsViewMode(false);
            setFormState({ state: 'Maharashtra', departmentName: '', description: '' });
            setModalOpen(true);
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
          <span>Create New Department</span>
        </button>
      </div>

      {/* Filter Card matching Manual Page 16 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr auto',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By Department Name
            </label>
            <input
              type="text"
              placeholder="Enter Department Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Select Status
            </label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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

      {/* Departments Table */}
      <DataTable
        columns={columns}
        data={departments}
        searchPlaceholder="Search Departments..."
      />

      {/* ADD / VIEW DEPARTMENT MODAL (Matching Manual Page 17) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isViewMode ? `Department: ${selectedDept?.name}` : 'Add Department'}
        maxWidth="620px"
      >
        {isViewMode && selectedDept ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
            <div><b>Department Name:</b> {selectedDept.name}</div>
            <div><b>Description:</b> {selectedDept.description}</div>
            <div><b>Created By:</b> {selectedDept.createdBy}</div>
            <div><b>Created On:</b> {selectedDept.createdOn}</div>
            <div><b>Status:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{selectedDept.status}</span></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Select State <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formState.state}
                  disabled
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Department <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  id="input-dept-name"
                  type="text"
                  placeholder="Enter Department Name"
                  value={formState.departmentName}
                  onChange={(e) => setFormState({ ...formState, departmentName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                id="input-dept-desc"
                rows={3}
                placeholder="Enter description..."
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                id="btn-submit-department"
                type="submit"
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

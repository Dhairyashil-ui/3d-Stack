import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { mockStore, Designation } from '../../data/mockStore';
import { Plus, Eye } from 'lucide-react';

export const DesignationsPage: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>(mockStore.getDesignations());
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setDesignations(mockStore.getDesignations());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDesig, setSelectedDesig] = useState<Designation | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const [formState, setFormState] = useState({
    state: 'Maharashtra',
    department: 'Revenue Department',
    designationName: '',
    description: ''
  });

  const handleSearch = () => {
    let filtered = mockStore.getDesignations();
    if (searchName) filtered = filtered.filter(d => d.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchDept) filtered = filtered.filter(d => d.department.toLowerCase().includes(searchDept.toLowerCase()));
    setDesignations(filtered);
  };

  const handleClear = () => {
    setSearchName('');
    setSearchDept('');
    setDesignations(mockStore.getDesignations());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.designationName.trim()) return;

    mockStore.addDesignation({
      name: formState.designationName,
      department: formState.department,
      description: formState.description || 'Assigned under District Admin framework',
      createdBy: 'Pune District Admin',
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active'
    });

    setDesignations(mockStore.getDesignations());
    setModalOpen(false);
    setFormState({ state: 'Maharashtra', department: 'Revenue Department', designationName: '', description: '' });
  };

  const columns: Column<Designation>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'Designation', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Description', accessor: 'description' },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Created Date', accessor: 'createdDate' },
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
        <button
          onClick={() => {
            setSelectedDesig(row);
            setIsViewMode(true);
            setModalOpen(true);
          }}
          title="View Details"
          style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1b539c', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
        >
          <Eye size={14} />
        </button>
      ),
      align: 'center',
      width: '80px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'User Management' }, { label: 'Create/Manage Designation' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Create/Manage Designation
        </h2>
        <button
          id="btn-create-designation"
          onClick={() => {
            setSelectedDesig(null);
            setIsViewMode(false);
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
          <span>Create Designation</span>
        </button>
      </div>

      {/* Filter Box matching Manual Page 18 */}
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
              Search By Designation Name
            </label>
            <input
              type="text"
              placeholder="Enter Designation"
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
              Department Name
            </label>
            <select
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
            >
              <option value="">Select Department</option>
              <option value="Revenue Department">Revenue Department</option>
              <option value="Pune_SedDA">Pune_SedDA</option>
              <option value="MPSEDC IT">MPSEDC IT</option>
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

      <DataTable
        columns={columns}
        data={designations}
        searchPlaceholder="Search Designations..."
      />

      {/* ADD / VIEW DESIGNATION MODAL (Matching Manual Page 19) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isViewMode ? `Designation: ${selectedDesig?.name}` : 'Add Designation'}
        maxWidth="620px"
      >
        {isViewMode && selectedDesig ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
            <div><b>Designation Name:</b> {selectedDesig.name}</div>
            <div><b>Department:</b> {selectedDesig.department}</div>
            <div><b>Description:</b> {selectedDesig.description}</div>
            <div><b>Created By:</b> {selectedDesig.createdBy}</div>
            <div><b>Created Date:</b> {selectedDesig.createdDate}</div>
            <div><b>Status:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{selectedDesig.status}</span></div>
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
                  Select Department <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  id="select-desig-dept"
                  value={formState.department}
                  onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Revenue Department">Revenue Department</option>
                  <option value="Dept of Land Records & 3D Cadastre">Dept of Land Records & 3D Cadastre</option>
                  <option value="Pune_SedDA">Pune_SedDA</option>
                  <option value="MPSEDC IT">MPSEDC IT</option>
                  <option value="Town & Country Planning">Town & Country Planning</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Designation <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="input-desig-name"
                type="text"
                placeholder="Enter Designation Name"
                value={formState.designationName}
                onChange={(e) => setFormState({ ...formState, designationName: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Description (Optional)
              </label>
              <textarea
                id="input-desig-desc"
                rows={3}
                placeholder="Provide a brief description..."
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
                id="btn-submit-designation"
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

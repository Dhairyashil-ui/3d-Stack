import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { mockStore, CaseRecord } from '../data/mockStore';
import { Plus, Eye, Lock, CheckCircle2, FileText, Upload } from 'lucide-react';

export const CaseEntryPage: React.FC = () => {
  const [casesList, setCasesList] = useState<CaseRecord[]>(mockStore.getCases());
  const [searchUlb, setSearchUlb] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setCasesList(mockStore.getCases());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);

  // Create Case Form State
  const [newCase, setNewCase] = useState({
    district: 'Pune',
    ulb: 'Pune (270410)',
    lgdCode: '250946',
    caseNo: `CASE-2025-00${Math.floor(Math.random() * 90 + 10)}`,
    caseDate: new Date().toISOString().split('T')[0],
    notificationNumber: 'NOTIF/BPL/2025/120',
    notificationDate: new Date().toISOString().split('T')[0],
    applicantName: '',
    nonApplicantName: '',
    gazettePublicationDate: new Date().toISOString().split('T')[0],
  });

  // Close Case Form State
  const [proceedingDetails, setProceedingDetails] = useState('');
  const [closureFileName, setClosureFileName] = useState('');

  const handleSearch = () => {
    let filtered = mockStore.getCases();
    if (searchUlb) {
      filtered = filtered.filter((c) => c.ulb.toLowerCase().includes(searchUlb.toLowerCase()));
    }
    setCasesList(filtered);
  };

  const handleClear = () => {
    setSearchUlb('');
    setCasesList(mockStore.getCases());
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.applicantName.trim()) return;

    mockStore.addCase({
      district: newCase.district,
      ulb: newCase.ulb,
      caseNo: newCase.caseNo,
      notificationNo: newCase.notificationNumber,
      notificationDate: newCase.notificationDate,
      gazettePublicationDate: newCase.gazettePublicationDate,
      status: 'Ongoing',
      enteredBy: 'Pune District Admin',
      entryDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      lgdCode: newCase.lgdCode,
      caseDate: newCase.caseDate,
      applicantName: newCase.applicantName,
      nonApplicantName: newCase.nonApplicantName
    });

    setCasesList(mockStore.getCases());
    setCreateModalOpen(false);
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    mockStore.closeCase(selectedCase.id, proceedingDetails, closureFileName);
    setCasesList(mockStore.getCases());
    setCloseModalOpen(false);
    setSelectedCase(null);
    setProceedingDetails('');
  };

  const columns: Column<CaseRecord>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'District', accessor: 'district' },
    { header: 'ULB', accessor: 'ulb' },
    { header: 'Case No', accessor: 'caseNo' },
    { header: 'Notification No.', accessor: 'notificationNo' },
    { header: 'Notification Date', accessor: 'notificationDate' },
    { header: 'Gazette Publication Date', accessor: 'gazettePublicationDate' },
    {
      header: 'Status',
      accessor: (row) => (
        <span style={{
          backgroundColor: row.status === 'Ongoing' ? '#fef3c7' : '#dcfce7',
          color: row.status === 'Ongoing' ? '#b45309' : '#15803d',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {row.status}
        </span>
      ),
      align: 'center'
    },
    { header: 'Entered By', accessor: 'enteredBy' },
    { header: 'Entry Date', accessor: 'entryDate' },
    { header: 'Updated Date', accessor: 'updatedDate' },
    {
      header: 'Action',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              setSelectedCase(row);
              setViewModalOpen(true);
            }}
            title="View Details"
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1b539c',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            <Eye size={14} />
          </button>
          {row.status === 'Ongoing' && (
            <button
              onClick={() => {
                setSelectedCase(row);
                setCloseModalOpen(true);
              }}
              title="Close Case"
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              <Lock size={14} />
            </button>
          )}
        </div>
      ),
      align: 'center'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Case Entry/Manage' }]} />

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Case Entry/Manage
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
          <span>Create Case</span>
        </button>
      </div>

      {/* Filter Card matching Manual Page 10 & 11 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              District
            </label>
            <input
              type="text"
              value="Pune"
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '13.5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By ULB
            </label>
            <select
              value={searchUlb}
              onChange={(e) => setSearchUlb(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
            >
              <option value="">Choose ULB</option>
              <option value="Pune (270410)">Pune (270410)</option>
              <option value="Berasia (250947)">Berasia (250947)</option>
              <option value="Kolar (250948)">Kolar (250948)</option>
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

      {/* Case Data Table */}
      <DataTable
        columns={columns}
        data={casesList}
        searchPlaceholder="Search Cases..."
      />

      {/* 6.1 CREATE CASE MODAL (Matching Manual Page 12 & 13) */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Case"
        maxWidth="820px"
      >
        <form onSubmit={handleCreateSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                District <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newCase.district}
                disabled
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                ULB <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={newCase.ulb}
                onChange={(e) => {
                  const ulb = e.target.value;
                  const lgd = ulb.includes('250947') ? '250947' : '250946';
                  setNewCase({ ...newCase, ulb, lgdCode: lgd });
                }}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Pune (270410)">Pune (270410)</option>
                <option value="Berasia (250947)">Berasia (250947)</option>
                <option value="Kolar (250948)">Kolar (250948)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                LGD Code <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newCase.lgdCode}
                disabled
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Case No. <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newCase.caseNo}
                onChange={(e) => setNewCase({ ...newCase, caseNo: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Case Date <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="date"
                value={newCase.caseDate}
                onChange={(e) => setNewCase({ ...newCase, caseDate: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Notification Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newCase.notificationNumber}
                onChange={(e) => setNewCase({ ...newCase, notificationNumber: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Notification Date <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="date"
                value={newCase.notificationDate}
                onChange={(e) => setNewCase({ ...newCase, notificationDate: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Applicant Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Applicant Name"
                value={newCase.applicantName}
                onChange={(e) => setNewCase({ ...newCase, applicantName: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Non-Applicant Name
              </label>
              <input
                type="text"
                placeholder="Non-Applicant Name"
                value={newCase.nonApplicantName}
                onChange={(e) => setNewCase({ ...newCase, nonApplicantName: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Gazette Publication Date <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="date"
                value={newCase.gazettePublicationDate}
                onChange={(e) => setNewCase({ ...newCase, gazettePublicationDate: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Upload Notification <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input type="file" accept=".pdf,.doc,.docx" style={{ width: '100%', fontSize: '12px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Upload Settlement <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input type="file" accept=".pdf,.doc,.docx" style={{ width: '100%', fontSize: '12px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              style={{
                backgroundColor: '#f87171',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
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
      </Modal>

      {/* 6.2 CLOSE A CASE MODAL (Matching Manual Page 13 & 14) */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title={`Close Case: ${selectedCase?.caseNo}`}
        maxWidth="600px"
      >
        <form onSubmit={handleCloseSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Case Proceeding Details <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide summary or official notes regarding the case proceedings before closing..."
              value={proceedingDetails}
              onChange={(e) => setProceedingDetails(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Upload Case Document <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setClosureFileName(e.target.files[0].name);
                }
              }}
              required
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setCloseModalOpen(false)}
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
              Cancel
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
      </Modal>

      {/* VIEW CASE DETAILS MODAL */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Case Record: ${selectedCase?.caseNo}`}
        maxWidth="640px"
      >
        {selectedCase && (
          <div style={{ fontSize: '13.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><b>District:</b> {selectedCase.district}</div>
              <div><b>ULB:</b> {selectedCase.ulb}</div>
              <div><b>Notification No:</b> {selectedCase.notificationNo}</div>
              <div><b>Notification Date:</b> {selectedCase.notificationDate}</div>
              <div><b>Gazette Date:</b> {selectedCase.gazettePublicationDate}</div>
              <div><b>Status:</b> <span style={{ fontWeight: 700, color: selectedCase.status === 'Ongoing' ? '#b45309' : '#15803d' }}>{selectedCase.status}</span></div>
              <div><b>Entered By:</b> {selectedCase.enteredBy}</div>
              <div><b>Entry Date:</b> {selectedCase.entryDate}</div>
            </div>
            {selectedCase.proceedingDetails && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
                <div style={{ fontWeight: 700, color: '#1b539c', marginBottom: '4px' }}>Proceeding Details / Closure Notes:</div>
                <div>{selectedCase.proceedingDetails}</div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setViewModalOpen(false)}
                style={{
                  backgroundColor: '#1b539c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

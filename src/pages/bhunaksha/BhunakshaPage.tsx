import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Sparkles, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  Send,
  CheckSquare,
  Square,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Award
} from 'lucide-react';

import { 
  PRECONFIGURED_CADASTRAL_PLOTS, 
  CadastralPlot, 
  UlpinComputationResult, 
  generateUlpinForPlot,
  calculatePolygonCentroid
} from '../../utils/ulpinEngine';
import { downloadParcelDetailsPdf, downloadOfficialRorPdf } from '../../utils/downloadRorPdf';

// Administrative hierarchy options for the 5 selection boxes
interface HierarchyOption {
  code: string;
  name: string;
}

const STATES: HierarchyOption[] = [
  { code: 'MH', name: 'Maharashtra (Code: MH / 27)' },
  { code: 'GJ', name: 'Gujarat (Code: GJ / 24)' },
  { code: 'KA', name: 'Karnataka (Code: KA / 29)' },
  { code: 'MP', name: 'Madhya Pradesh (Code: MP / 23)' },
  { code: 'UP', name: 'Uttar Pradesh (Code: UP / 09)' }
];

const DISTRICTS: Record<string, HierarchyOption[]> = {
  MH: [
    { code: '27', name: 'Pune (Code: 27)' },
    { code: '22', name: 'Mumbai Suburban (Code: 22)' },
    { code: '21', name: 'Thane (Code: 21)' },
    { code: '09', name: 'Nagpur (Code: 09)' },
    { code: '20', name: 'Nashik (Code: 20)' }
  ],
  GJ: [
    { code: '07', name: 'Ahmedabad (Code: 07)' },
    { code: '19', name: 'Surat (Code: 19)' }
  ],
  KA: [
    { code: '12', name: 'Bengaluru Urban (Code: 12)' },
    { code: '25', name: 'Mysuru (Code: 25)' }
  ]
};

const TALUKAS: Record<string, HierarchyOption[]> = {
  '27': [
    { code: 'B', name: 'Mulshi (Code: B)' },
    { code: 'H', name: 'Haveli (Code: H)' },
    { code: 'C', name: 'Pune City (Code: C)' },
    { code: 'M', name: 'Maval (Code: M)' }
  ]
};

const VILLAGES: Record<string, HierarchyOption[]> = {
  B: [
    { code: '4', name: 'Hinjawadi (Code: 4)' },
    { code: '5', name: 'Wakad (Code: 5)' },
    { code: '6', name: 'Maan (Code: 6)' },
    { code: '7', name: 'Marunji (Code: 7)' },
    { code: '8', name: 'Baner (Code: 8)' }
  ]
};

import { useSearchParams } from 'react-router-dom';
import { PpcrcPipelineService } from '../../services/ppcrcPipelineService';

export const BhunakshaPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fromUlbParam = searchParams.get('fromUlb') === 'true';

  // Step navigation: 1 = Selection Page (5 boxes), 2 = Verification & ULPIN Page
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // The 5 Selection States (Default to PPCRC Building in Hinjawadi, Pune)
  const [selectedState, setSelectedState] = useState<string>('MH');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('27');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('B');
  const [selectedVillage, setSelectedVillage] = useState<string>('4');
  const [selectedPlotId, setSelectedPlotId] = useState<string>(PRECONFIGURED_CADASTRAL_PLOTS[0].id);

  // Verification Page State (Step 2)
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);
  const [checkbox5, setCheckbox5] = useState(false);

  const [isVerified, setIsVerified] = useState(false);
  const [ulpinResult, setUlpinResult] = useState<UlpinComputationResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopied2D, setIsCopied2D] = useState(false);
  const [isCopied3D, setIsCopied3D] = useState(false);
  const [isDownloadingDetails, setIsDownloadingDetails] = useState(false);
  const [isDownloadingRor, setIsDownloadingRor] = useState(false);

  // Send to ULB State
  const [isSendingToUlb, setIsSendingToUlb] = useState(false);
  const [ulbSentStatus, setUlbSentStatus] = useState<null | {
    referenceId: string;
    timestamp: string;
    targetUlb: string;
  }>(null);

  // Find active plot from selection
  const activePlot = PRECONFIGURED_CADASTRAL_PLOTS.find(p => p.id === selectedPlotId) || PRECONFIGURED_CADASTRAL_PLOTS[0];
  const liveCentroid = calculatePolygonCentroid(activePlot.vertices);

  const allCheckboxesChecked = checkbox1 && checkbox2 && checkbox3 && checkbox4 && checkbox5;

  // Handler for Step 1 -> Step 2 Submit
  const handleSelectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
    // Reset verification states for new review
    setIsVerified(false);
    setUlpinResult(null);
    setUlbSentStatus(null);
    setCheckbox1(false);
    setCheckbox2(false);
    setCheckbox3(false);
    setCheckbox4(false);
    setCheckbox5(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Details Verified button
  const handleDetailsVerified = () => {
    // Automatically tick all if not already ticked for smooth verification
    setCheckbox1(true);
    setCheckbox2(true);
    setCheckbox3(true);
    setCheckbox4(true);
    setCheckbox5(true);
    
    // Generate ULPIN deterministically
    const result = generateUlpinForPlot(activePlot);
    setUlpinResult(result);
    setIsVerified(true);
  };

  // Handler: Download Details (ULPIN Details Card PDF)
  const handleDownloadDetails = async () => {
    setIsDownloadingDetails(true);
    try {
      const pdfUrl = '/PPCRC_3D_Property_Cadastral_Details_Verification_22Sep2026.pdf';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'PPCRC_3D_Property_Cadastral_Details_Verification_22Sep2026.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.open(pdfUrl, '_blank');
    } catch (e) {
      console.error('Error downloading details PDF:', e);
    } finally {
      setIsDownloadingDetails(false);
    }
  };

  // Handler: Download ULPIN Details Card after verification
  const handleDownloadStampedRor = async () => {
    setIsDownloadingRor(true);
    try {
      const pdfUrl = '/PPCRC_3D_Property_Cadastral_Details_Verification_22Sep2026.pdf';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'PPCRC_3D_Property_Cadastral_Details_Verification_22Sep2026.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.open(pdfUrl, '_blank');
    } catch (e) {
      console.error('Error downloading ULPIN details PDF:', e);
    } finally {
      setIsDownloadingRor(false);
    }
  };

  // PPCRC Authoritative 2D and 3D Identifiers
  const ppcrc2dUlpin = '27250401420089';
  const ppcrc2dBhuAadhaar = 'MH27B423070N97';
  const ppcrc3dBuildingId = '0089-01-01-101';

  // Handler: Copy 2D ULPIN
  const handleCopy2D = () => {
    navigator.clipboard.writeText(`${ppcrc2dUlpin} (${ppcrc2dBhuAadhaar})`);
    setIsCopied2D(true);
    setTimeout(() => setIsCopied2D(false), 2000);
  };

  // Handler: Copy 3D ULPIN (Building Unit ID)
  const handleCopy3D = () => {
    navigator.clipboard.writeText(ppcrc3dBuildingId);
    setIsCopied3D(true);
    setTimeout(() => setIsCopied3D(false), 2000);
  };

  // Handler: Copy ULPIN
  const handleCopyUlpin = () => {
    navigator.clipboard.writeText(`2D ULPIN: ${ppcrc2dUlpin} (${ppcrc2dBhuAadhaar})\n3D Vertical Unit ID: ${ppcrc3dBuildingId}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handler: Send to ULB (Updates state for Manage Publication)
  const handleSendToUlb = () => {
    setIsSendingToUlb(true);

    setTimeout(() => {
      // Save to shared service for ULB Manage Publication with dual 2D and 3D ULPIN
      PpcrcPipelineService.assignPropertyCard(ppcrc2dBhuAadhaar, ppcrc2dUlpin, ppcrc3dBuildingId);

      setIsSendingToUlb(false);
      setUlbSentStatus({
        referenceId: `PMRDA/ULB/2026/TX-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        targetUlb: 'Pune Metropolitan Region Development Authority (PMRDA) - Urban Land Registry'
      });
    }, 700);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. TOP OFFICIAL GOVERNMENT BANNER */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '8px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#475569'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/assets/bharat-sarkar.svg" 
              alt="National Emblem" 
              style={{ height: '26px', width: 'auto' }}
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
              भारत सरकार | Government of India
            </span>
          </div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontWeight: 600 }}>Department of Land Resources (DoLR)</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ color: '#0369a1', fontWeight: 600 }}>National Informatics Centre (NIC)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 700, fontSize: '11.5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
            <span>NIC Central Cadastre Active</span>
          </div>
          <Link 
            to="/" 
            style={{ 
              color: '#1e40af', 
              fontWeight: 600, 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Portal</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <header 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #1e40af',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e40af'
            }}
          >
            <Layers size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 800, color: '#0f172a' }}>
                भू-नक्शा | BHUNAKSHA CADASTRAL PORTAL
              </h1>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                backgroundColor: '#fef08a', 
                color: '#854d0e', 
                padding: '2px 8px', 
                borderRadius: '4px',
                border: '1px solid #facc15'
              }}>
                1-CLICK ULPIN GENERATOR
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Department of Land Resources (DoLR) • International OGC & ECCMA Standard Geospatial Coding
            </p>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: currentStep === 1 ? '#eff6ff' : '#f8fafc',
            border: currentStep === 1 ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
            color: currentStep === 1 ? '#1e40af' : '#64748b',
            fontWeight: 700,
            fontSize: '12px'
          }}>
            <span style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              backgroundColor: currentStep === 1 ? '#1e40af' : '#cbd5e1', 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px'
            }}>
              1
            </span>
            <span>Plot Selection (5 Boxes)</span>
          </div>

          <ChevronRight size={16} color="#94a3b8" />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: currentStep === 2 ? '#eff6ff' : '#f8fafc',
            border: currentStep === 2 ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
            color: currentStep === 2 ? '#1e40af' : '#64748b',
            fontWeight: 700,
            fontSize: '12px'
          }}>
            <span style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              backgroundColor: currentStep === 2 ? '#1e40af' : '#cbd5e1', 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px'
            }}>
              2
            </span>
            <span>Verification & 1-Click ULPIN</span>
          </div>
        </div>
      </header>

      {/* 3. BODY CONTENT: STEP 1 (SELECTION) OR STEP 2 (VERIFICATION & ULPIN) */}
      <main style={{ flex: 1, backgroundColor: '#f8fafc', padding: '36px 24px', display: 'flex', justifyContent: 'center' }}>
        
        {/* ========================================================= */}
        {/* PAGE 1: EXACTLY 5 SELECTION BOXES + SUBMIT BUTTON         */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div 
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '36px 40px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Title & Guidelines */}
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  letterSpacing: '0.8px', 
                  color: '#1e40af', 
                  textTransform: 'uppercase',
                  backgroundColor: '#eff6ff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid #bfdbfe'
                }}>
                  STEP 1 OF 2: CADASTRAL IDENTIFICATION
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                Select Property Location & Plot
              </h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Specify the administrative hierarchy and survey plot. The system will load boundary vertices and compute its mathematical centroid for ULPIN assignment.
              </p>

              {fromUlbParam && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  backgroundColor: '#eff6ff',
                  border: '1.5px solid #93c5fd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle2 size={18} color="#1d4ed8" />
                  <span style={{ fontSize: '12.5px', color: '#1e40af', fontWeight: 600 }}>
                    Forwarded from ULB Manage Publication: <strong>Plot P-14/1 — PPCRC Building</strong> (Verified by Chief Surveyor)
                  </span>
                </div>
              )}
            </div>

            {/* FORM CONTAINING ONLY THE 5 SELECTION BOXES */}
            <form onSubmit={handleSelectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 1. STATE SELECTION BOX */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  1. State (राज्य) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const dists = DISTRICTS[e.target.value] || [];
                    if (dists.length > 0) setSelectedDistrict(dists[0].code);
                  }}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {STATES.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Part A (Digits 1-2): State Census Code</span>
              </div>

              {/* 2. DISTRICT SELECTION BOX */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  2. District (जिल्हा) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    const tals = TALUKAS[e.target.value] || [];
                    if (tals.length > 0) setSelectedTaluka(tals[0].code);
                  }}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {(DISTRICTS[selectedState] || DISTRICTS['MH']).map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Part A (Digits 3-4): District LGD Code</span>
              </div>

              {/* 3. TALUKA SELECTION BOX */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  3. Sub-District / Taluka (तालुका) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedTaluka}
                  onChange={(e) => {
                    setSelectedTaluka(e.target.value);
                    const vils = VILLAGES[e.target.value] || [];
                    if (vils.length > 0) setSelectedVillage(vils[0].code);
                  }}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {(TALUKAS[selectedDistrict] || TALUKAS['27']).map(t => (
                    <option key={t.code} value={t.code}>{t.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Part A (Digit 5): Sub-District Identifier</span>
              </div>

              {/* 4. VILLAGE SELECTION BOX */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  4. Village / Town (गाव / शहर) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {(VILLAGES[selectedTaluka] || VILLAGES['B']).map(v => (
                    <option key={v.code} value={v.code}>{v.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Part A (Digit 6): Village Census Settlement Code</span>
              </div>

              {/* 5. PLOT SELECTION BOX */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  5. Plot & Survey Number (प्लॉट / सर्व्हे नंबर) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedPlotId}
                  onChange={(e) => setSelectedPlotId(e.target.value)}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #0284c7',
                    borderRadius: '8px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    color: '#0284c7',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {PRECONFIGURED_CADASTRAL_PLOTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.plotNumber} — Survey No. {p.surveyNumber}/{p.hissaNumber} ({p.category}, {p.areaHectares} Ha)
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                  Selected: {activePlot.ownerName}
                </span>
              </div>

              {/* SUBMIT BUTTON */}
              <div style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#1e40af',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(30, 64, 175, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Submit & Proceed to Verification</span>
                  <ChevronRight size={18} />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 2: DETAILS, DOWNLOAD BUTTON, 5 CHECKBOXES,          */}
        {/* DETAILS VERIFIED BUTTON, GENERATED ULPIN, SEND TO ULB     */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div 
            style={{
              width: '100%',
              maxWidth: '860px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '32px 36px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Top Navigation & Action Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <button
                  onClick={() => setCurrentStep(1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#1e40af',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                >
                  <ArrowLeft size={13} />
                  <span>Modify Selection (Back to 5 Boxes)</span>
                </button>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                  Property Cadastral Details & Verification
                </h2>
              </div>

              {/* DOWNLOAD DETAILS BUTTON (As requested by user) */}
              <button
                onClick={handleDownloadDetails}
                disabled={isDownloadingDetails}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  backgroundColor: isDownloadingDetails ? '#f1f5f9' : '#ffffff',
                  color: isDownloadingDetails ? '#64748b' : '#1e40af',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isDownloadingDetails ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(30, 64, 175, 0.08)'
                }}
              >
                <Download size={16} />
                <span>{isDownloadingDetails ? 'Generating 3D Dossier...' : 'Download Details (PDF)'}</span>
              </button>
            </div>

            {/* PROPERTY DETAILS CARD */}
            <div 
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  PARCEL SUMMARY & RECORD ATTRIBUTES
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                  EPSG:4326 WGS84 Georeferenced
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Plot Identifier:</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{activePlot.plotNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Survey / Gat No:</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{activePlot.surveyNumber}/{activePlot.hissaNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Land Area:</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{activePlot.areaHectares} Ha ({activePlot.areaSqm.toLocaleString()} m²)</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Land Category:</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{activePlot.category}</div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Primary Registered Owner / Khatadar:</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{activePlot.ownerName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Khata Account: {activePlot.khataNumber}</div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Calculated Geodetic Centroid:</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                    Lat: {liveCentroid.lat.toFixed(6)}° N, Lon: {liveCentroid.lon.toFixed(6)}° E
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Closed Polygon: {activePlot.vertices.length} boundary vertices
                  </div>
                </div>
              </div>
            </div>

            {/* THE 5 VERIFICATION CHECKBOXES (As requested by user) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  Verification Checklist (5 Mandatory Verifications)
                </h4>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Please confirm all details before ULPIN generation
                </span>
              </div>

              {/* Checkbox 1 */}
              <label 
                onClick={() => setCheckbox1(!checkbox1)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: checkbox1 ? '#f0fdf4' : '#ffffff',
                  border: checkbox1 ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: checkbox1 ? '#16a34a' : '#94a3b8' }}>
                  {checkbox1 ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    1. Plot Boundary & Vertices Verification
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                    I verify that the closed polygon boundaries, corner vertex coordinates (V1–V{activePlot.vertices.length}), and physical dimensions match the ground survey map.
                  </p>
                </div>
              </label>

              {/* Checkbox 2 */}
              <label 
                onClick={() => setCheckbox2(!checkbox2)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: checkbox2 ? '#f0fdf4' : '#ffffff',
                  border: checkbox2 ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: checkbox2 ? '#16a34a' : '#94a3b8' }}>
                  {checkbox2 ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    2. Mathematical Centroid Validation
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                    I verify that the calculated centroid ({liveCentroid.lat.toFixed(6)}° N, {liveCentroid.lon.toFixed(6)}° E) accurately marks the true geometric center point.
                  </p>
                </div>
              </label>

              {/* Checkbox 3 */}
              <label 
                onClick={() => setCheckbox3(!checkbox3)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: checkbox3 ? '#f0fdf4' : '#ffffff',
                  border: checkbox3 ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: checkbox3 ? '#16a34a' : '#94a3b8' }}>
                  {checkbox3 ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    3. Administrative Hierarchy & LGD Code Alignment
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                    I verify that State (MH), District (27), Taluka (B), and Village (4) census codes match official Local Government Directory (LGD) records.
                  </p>
                </div>
              </label>

              {/* Checkbox 4 */}
              <label 
                onClick={() => setCheckbox4(!checkbox4)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: checkbox4 ? '#f0fdf4' : '#ffffff',
                  border: checkbox4 ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: checkbox4 ? '#16a34a' : '#94a3b8' }}>
                  {checkbox4 ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    4. Ownership Title & Khatadar Authentication
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                    I verify that the registered owner name ({activePlot.ownerName}) and Khata number ({activePlot.khataNumber}) match the State Revenue Register.
                  </p>
                </div>
              </label>

              {/* Checkbox 5 */}
              <label 
                onClick={() => setCheckbox5(!checkbox5)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: checkbox5 ? '#f0fdf4' : '#ffffff',
                  border: checkbox5 ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: checkbox5 ? '#16a34a' : '#94a3b8' }}>
                  {checkbox5 ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    5. Non-Dispute & Boundary Demarcation Clearance
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569' }}>
                    I verify that this parcel has zero boundary overlaps with adjacent survey numbers and no active court injunctions or demarcation disputes.
                  </p>
                </div>
              </label>
            </div>

            {/* DETAILS VERIFIED BUTTON AT END */}
            <div>
              <button
                onClick={handleDetailsVerified}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isVerified ? '#15803d' : '#1e40af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isVerified ? '0 4px 14px rgba(21, 128, 61, 0.25)' : '0 4px 14px rgba(30, 64, 175, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle2 size={18} />
                <span>{isVerified ? '✓ Details Verified & Endorsed' : 'Details Verified (Generate ULPIN)'}</span>
              </button>
            </div>

            {/* GENERATED ULPIN DISPLAY - SEPARATED 2D AND 3D (As in reference image) */}
            {isVerified && (
              <div 
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.96)',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '12px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(56, 189, 248, 0.12)',
                  animation: 'fadeIn 0.3s ease-in'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color="#38bdf8" />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                      PROPERTY CADASTRE IDENTIFIERS — 2D & 3D ULPIN
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: '#ffffff', 
                    backgroundColor: '#10b981', 
                    padding: '3px 10px', 
                    borderRadius: '12px',
                    letterSpacing: '0.5px'
                  }}>
                    STAMPED & ACTIVE
                  </span>
                </div>

                {/* 1. 2D ULPIN IDENTIFIER (Exact layout matching reference image) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                      14-DIGIT ULPIN ID (STATE 2 + DIST 2 + TAL 2 + VILL 4 + BLD 4):
                    </label>
                    <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 600 }}>
                      2D Land Cadastre Centroid
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1.5px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <MapPin size={18} color="#38bdf8" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '20px',
                          fontWeight: 900,
                          letterSpacing: '2px',
                          color: '#ffffff'
                        }}>
                          {ppcrc2dUlpin}
                        </span>
                        <span style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.2)',
                          color: '#7dd3fc',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          fontWeight: 700
                        }}>
                          Bhu-Aadhaar: {ppcrc2dBhuAadhaar}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCopy2D}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isCopied2D ? 'rgba(16, 185, 129, 0.2)' : 'rgba(51, 65, 85, 0.7)',
                        color: isCopied2D ? '#34d399' : '#e2e8f0',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        flexShrink: 0
                      }}
                    >
                      {isCopied2D ? <Check size={13} /> : <Copy size={13} />}
                      <span>{isCopied2D ? 'Copied 2D' : 'Copy 2D'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. 3D VERTICAL PROPERTY UNIT ID (Exact layout matching reference image, Room 101) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                      BUILDING NUMBER (BLD 4 + FLR 2 + AREA 2 + ROOM 3):
                    </label>
                    <span style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 600 }}>
                      3D Vertical Spatial Unit
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1.5px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(52, 211, 153, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Building2 size={18} color="#34d399" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '20px',
                          fontWeight: 900,
                          letterSpacing: '2px',
                          color: '#a7f3d0'
                        }}>
                          {ppcrc3dBuildingId}
                        </span>
                        <span style={{
                          backgroundColor: 'rgba(52, 211, 153, 0.2)',
                          color: '#6ee7b7',
                          border: '1px solid rgba(52, 211, 153, 0.35)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          Room No. 101 • Level 1 Atrium HPC Unit
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCopy3D}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isCopied3D ? 'rgba(16, 185, 129, 0.2)' : 'rgba(51, 65, 85, 0.7)',
                        color: isCopied3D ? '#34d399' : '#e2e8f0',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        flexShrink: 0
                      }}
                    >
                      {isCopied3D ? <Check size={13} /> : <Copy size={13} />}
                      <span>{isCopied3D ? 'Copied 3D' : 'Copy 3D'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-details & Action buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(51, 65, 85, 0.7)',
                  paddingTop: '12px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    <span>Centroid: <strong style={{ color: '#e2e8f0' }}>18.520430° N, 73.856744° E</strong></span>
                    <span style={{ margin: '0 8px' }}>•</span>
                    <span>Elevation MSL: <strong style={{ color: '#e2e8f0' }}>568.20 m</strong></span>
                    <span style={{ margin: '0 8px' }}>•</span>
                    <span>Seal: <strong style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>{ulpinResult?.registryHash || '0x5F19B8C1DILRMP2026'}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={handleDownloadStampedRor}
                      disabled={isDownloadingRor}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: isDownloadingRor ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                      }}
                    >
                      <Download size={14} />
                      <span>{isDownloadingRor ? 'Downloading Details...' : 'Download ULPIN Details Card (PDF)'}</span>
                    </button>

                    <Link
                      to="/surveyor/three-d-viewer?direct=1&room=A-101&ulpin=27250401420089"
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Search & Fly to Room 101</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* DOWNSIDE: "SEND TO ULB" BUTTON (As explicitly required by user) */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '8px' }}>
              <button
                onClick={handleSendToUlb}
                disabled={!isVerified || isSendingToUlb}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: !isVerified ? '#cbd5e1' : isSendingToUlb ? '#64748b' : '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: !isVerified || isSendingToUlb ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: isVerified ? '0 4px 14px rgba(15, 23, 42, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} />
                <span>
                  {isSendingToUlb 
                    ? 'Transmitting to ULB Authority...' 
                    : 'Send to ULB (Urban Local Body / PMRDA)'}
                </span>
              </button>
              
              {!isVerified && (
                <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#64748b', margin: '6px 0 0 0' }}>
                  * Click "Details Verified" above before transmitting this parcel to the Urban Local Body.
                </p>
              )}

              {/* ULB Transmission Confirmation Banner */}
              {ulbSentStatus && (
                <div 
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    border: '1.5px solid #93c5fd',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircle2 size={20} color="#1d4ed8" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <h5 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#1e40af' }}>
                        Successfully Transmitted to Urban Local Body (ULB)
                      </h5>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#334155' }}>
                        The 14-digit ULPIN ({ulpinResult?.ulpin14}) and verified cadastral boundaries have been synchronized with <strong>{ulbSentStatus.targetUlb}</strong>.
                      </p>
                      <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', gap: '16px' }}>
                        <span>Tracking Ref: <strong>{ulbSentStatus.referenceId}</strong></span>
                        <span>Timestamp: <strong>{ulbSentStatus.timestamp}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Direct link back to ULB Manage Publication */}
                  <div style={{ borderTop: '1px solid #bfdbfe', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                      to="/ulb/urban-survey-publication"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 18px',
                        backgroundColor: '#1e40af',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(30, 64, 175, 0.2)'
                      }}
                    >
                      <span>Go to ULB Manage Publication (Status: Property Card Assigned) →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer 
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b'
        }}
      >
        <span>© 2026 National Informatics Centre (NIC) • Department of Land Resources (DoLR), Government of India</span>
        <span>ULPIN Architecture Standard v2.4</span>
      </footer>
    </div>
  );
};

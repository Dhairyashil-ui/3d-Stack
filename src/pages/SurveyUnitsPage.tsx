import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { GisMap } from '../components/common/GisMap';
import { Modal } from '../components/common/Modal';
import {
  mockStore,
  SurveyUnit,
  UploadedAoi,
  UploadedLayer
} from '../data/mockStore';
import {
  Map,
  Layers,
  FileSpreadsheet,
  Plus,
  Eye,
  CheckCircle2,
  MapPin,
  Search,
  UploadCloud,
  Check,
  UserCheck,
  Play,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

type DirectoryOption = 'aoi' | 'gis' | 'units';

export const SurveyUnitsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Directory option selected below the 3 parallel boxes
  const [activeOption, setActiveOption] = useState<DirectoryOption>('units');
  const [searchFilter, setSearchFilter] = useState('');

  // 2-second floating toast popup state
  const [toast, setToast] = useState<string | null>(null);

  // Store data lists
  const [aoiList, setAoiList] = useState<UploadedAoi[]>(() => mockStore.getAOIs());
  const [layerList, setLayerList] = useState<UploadedLayer[]>(() => mockStore.getLayers());
  const [unitsList, setUnitsList] = useState<SurveyUnit[]>(() => mockStore.getSurveyUnits());

  // Form states - Box 1: Manage AOI
  const [aoiUlb, setAoiUlb] = useState('Pune-270410');
  const [aoiFileName, setAoiFileName] = useState('');

  // Form states - Box 2: Upload GIS Layer
  const [layerUlb, setLayerUlb] = useState('Pune-270410');
  const [layerType, setLayerType] = useState<UploadedLayer['layerType']>('Cadastral');
  const [layerFileName, setLayerFileName] = useState('');

  // Form states - Box 3: Create & Assign Survey Unit
  const [unitUlb, setUnitUlb] = useState('PMRDA Pune (270410)');
  const [unitWard, setUnitWard] = useState('Hinjawadi Village (411057)');
  const [unitName, setUnitName] = useState('');
  const [assignedSurveyor, setAssignedSurveyor] = useState('Surveyor Pune (Hinjawadi IT Park)');

  // Map modals
  const [activeMapAoi, setActiveMapAoi] = useState<UploadedAoi | null>(null);
  const [inspectLayer, setInspectLayer] = useState<UploadedLayer | null>(null);
  const [activeUnitForMap, setActiveUnitForMap] = useState<SurveyUnit | null>(null);

  // ==========================================
  // EXACT 10-SECOND LIVE PRESENTATION ENGINE (DISTRICT ADMIN)
  // 1. 3s: Black screen only showing District Admin Work, no app
  // 2. 5s: AOI, GIS Layer, and Survey Unit fill in parallel, then clicks done
  // 3. Work is Done for District Admin screen
  // ==========================================
  const [presentationPhase, setPresentationPhase] = useState<'idle' | 'black_screen' | 'auto_fill' | 'completed'>('idle');
  const [blackScreenTimer, setBlackScreenTimer] = useState(3);
  const [autoFillTimer, setAutoFillTimer] = useState(5);
  const [isClickingDone, setIsClickingDone] = useState(false);
  const [newlyCreatedAoiId, setNewlyCreatedAoiId] = useState<string | null>(null);
  const [newlyCreatedLayerId, setNewlyCreatedLayerId] = useState<string | null>(null);
  const [newlyCreatedUnitId, setNewlyCreatedUnitId] = useState<string | null>(null);

  const presentationIntervalsRef = useRef<any[]>([]);

  const stopLivePresentation = () => {
    presentationIntervalsRef.current.forEach(timer => {
      clearInterval(timer);
      clearTimeout(timer);
    });
    presentationIntervalsRef.current = [];
  };

  useEffect(() => {
    return () => {
      stopLivePresentation();
    };
  }, []);

  const startLivePresentation = () => {
    stopLivePresentation();

    // Reset inputs
    setAoiFileName('');
    setLayerFileName('');
    setUnitName('');
    setIsClickingDone(false);

    const targetAoiFile = 'pune_urban_aoi_boundary_2026.shp';
    const targetLayerFile = 'pune_cadastral_layer_utm44n.zip';
    const targetUnitName = 'Survey Unit 05 - 348675 (Tech Hub)';

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

        // Fill all 3 boxes in parallel
        setAoiFileName(targetAoiFile.slice(0, Math.ceil(progress * targetAoiFile.length)));
        setLayerFileName(targetLayerFile.slice(0, Math.ceil(progress * targetLayerFile.length)));
        setUnitName(targetUnitName.slice(0, Math.ceil(progress * targetUnitName.length)));
      }, 35);
      presentationIntervalsRef.current.push(fillInterval);

      // At ~4.0s of Phase 2: "Clicks Done" visual trigger
      const clickDoneTimeout = setTimeout(() => {
        setIsClickingDone(true);
      }, 4000);
      presentationIntervalsRef.current.push(clickDoneTimeout);

      // At ~4.3s of Phase 2: Actually create all 3 items into mockStore (unshifted to top!)
      const submitTimeout = setTimeout(() => {
        const ts = Date.now().toString().slice(-4);
        const uniqueAoiFile = `pune_urban_aoi_boundary_${ts}.shp`;
        const uniqueLayerFile = `pune_cadastral_layer_${ts}.zip`;
        const uniqueUnit = `Survey Unit 05 - 348675 (Tech Hub #${ts})`;

        // 1. Create AOI
        const createdAoi = mockStore.addAOI({
          ulbName: 'Pune',
          ulbType: 'municipality',
          ulbCode: '270410',
          uploadedDate: new Date().toLocaleDateString('en-US'),
          createdBy: 'Pune District Admin',
          fileName: uniqueAoiFile,
          projection: 'UTM Zone 44N'
        });

        // 2. Create GIS Layer
        const createdLayer = mockStore.addLayer({
          district: 'Maharashtra',
          ulbName: 'Pune',
          ulbType: 'municipality',
          layerType: 'Cadastral',
          uploadedDate: new Date().toISOString().split('T')[0],
          uploadedBy: 'Pune District Admin',
          fileName: uniqueLayerFile
        });

        // 3. Create Survey Unit
        const createdUnit = mockStore.addSurveyUnit({
          ulb: 'PMRDA Pune (270410)',
          ward: 'Hinjawadi Village (411057)',
          surveyUnit: uniqueUnit,
          isAssigned: 'Yes',
          assignedTo: 'Surveyor Pune (Hinjawadi IT Park)',
          isMapUploaded: 'Yes',
          mapUploadedOn: new Date().toLocaleString()
        });

        setNewlyCreatedAoiId(createdAoi.id);
        setNewlyCreatedLayerId(createdLayer.id);
        setNewlyCreatedUnitId(createdUnit.id);
        window.dispatchEvent(new Event('storage'));
        refreshData();
        setActiveOption('units');
      }, 4300);
      presentationIntervalsRef.current.push(submitTimeout);

      // ------------------------------------------
      // PHASE 3: WORK IS DONE FOR DISTRICT ADMIN (8s onwards)
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

  // Trigger presentation if navigated with ?presentation=true
  useEffect(() => {
    if (searchParams.get('presentation') === 'true') {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete('presentation');
        return next;
      }, { replace: true });
      startLivePresentation();
    }
  }, [searchParams]);

  const refreshData = () => {
    setAoiList(mockStore.getAOIs());
    setLayerList(mockStore.getLayers());
    setUnitsList(mockStore.getSurveyUnits());
  };

  useEffect(() => {
    window.addEventListener('storage', refreshData);
    return () => window.removeEventListener('storage', refreshData);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  // Handler 1: Submit AOI (Box 1)
  const handleCreateAoi = (e: React.FormEvent) => {
    e.preventDefault();
    const ulbNamePart = aoiUlb.split('-')[0] || 'Pune';
    const ulbCodePart = aoiUlb.split('-')[1] || '270410';

    mockStore.addAOI({
      ulbName: ulbNamePart,
      ulbType: 'municipality',
      ulbCode: ulbCodePart,
      uploadedDate: new Date().toLocaleDateString('en-US'),
      createdBy: 'Pune District Admin',
      fileName: aoiFileName.trim() || `${ulbNamePart.toLowerCase()}_aoi_utm44n.shp`,
      projection: 'UTM Zone 44N'
    });

    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('AOI Boundary uploaded successfully!');
    setAoiFileName('');
    setActiveOption('aoi');
  };

  // Handler 2: Submit GIS Layer (Box 2)
  const handleCreateLayer = (e: React.FormEvent) => {
    e.preventDefault();
    const ulbNamePart = layerUlb.split('-')[0] || 'Pune';

    mockStore.addLayer({
      district: 'Maharashtra',
      ulbName: ulbNamePart,
      ulbType: 'municipality',
      layerType: layerType,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Pune District Admin',
      fileName: layerFileName.trim() || `${layerType.toLowerCase()}_layer_utm44n.zip`
    });

    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('GIS Layer uploaded successfully!');
    setLayerFileName('');
    setActiveOption('gis');
  };

  // Handler 3: Create & Assign Survey Unit (Box 3)
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnitName = unitName.trim() || `Survey Unit 0${unitsList.length + 1} - 34867${unitsList.length + 1}`;

    mockStore.addSurveyUnit({
      ulb: unitUlb,
      ward: unitWard,
      surveyUnit: finalUnitName,
      isAssigned: 'Yes',
      assignedTo: assignedSurveyor,
      isMapUploaded: 'Yes',
      mapUploadedOn: new Date().toLocaleString()
    });

    window.dispatchEvent(new Event('storage'));
    refreshData();
    showToast('Survey Unit created & assigned successfully!');
    setUnitName('');
    setActiveOption('units');
  };

  // Styling Helpers
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
    { key: 'aoi' as DirectoryOption, label: '1. Defined AOIs', count: aoiList.length, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: Map },
    { key: 'gis' as DirectoryOption, label: '2. Uploaded GIS Layers', count: layerList.length, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: Layers },
    { key: 'units' as DirectoryOption, label: '3. Survey Unit Details', count: unitsList.length, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: FileSpreadsheet }
  ];

  const currentOption = OPTIONS.find(o => o.key === activeOption)!;

  // Filtered lists for Directory
  const filteredAois = aoiList.filter(a =>
    a.ulbName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.fileName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.ulbCode.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredLayers = layerList.filter(l =>
    l.ulbName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.layerType.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.fileName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUnits = unitsList.filter(u =>
    u.surveyUnit.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.ward.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.assignedTo.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.ulb.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ padding: '20px 28px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <Breadcrumb items={[{ label: 'Survey Unit Details' }]} />

      {/* ========================================================================= */}
      {/* PHASE 1: BLACK SCREEN FOR 3 SECONDS - ONLY SHOW DISTRICT ADMIN WORK       */}
      {/* ========================================================================= */}
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
          fontFamily: 'Inter, sans-serif',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          {/* Glowing Ambient Halo */}
          <div style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />

          {/* Central Card */}
          <div style={{
            maxWidth: '680px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '24px',
            padding: '42px 36px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.25)',
            backdropFilter: 'blur(16px)'
          }}>
            {/* Top Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#6ee7b7',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <Sparkles size={14} color="#6ee7b7" />
              <span>District Admin Work • Spatial Pipeline</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '-0.8px',
              margin: '0 0 12px 0',
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #ffffff 40%, #86efac 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Survey Unit Details & GIS Data Setup
            </h1>

            <p style={{
              fontSize: '15px',
              color: '#94a3b8',
              margin: '0 0 28px 0',
              lineHeight: 1.5
            }}>
              Executing parallel multi-layer provisioning: AOI Boundary Definition, GIS Cadastral Layers, and Survey Unit Assignment.
            </p>

            {/* 3 Pipeline Pillars Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Map size={16} color="#60a5fa" />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase' }}>1. Manage AOI</span>
                </div>
                <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>Pune Boundary .shp</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Layers size={16} color="#c084fc" />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#d8b4fe', textTransform: 'uppercase' }}>2. GIS Layer</span>
                </div>
                <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>Cadastral UTM44N .zip</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <FileSpreadsheet size={16} color="#4ade80" />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#86efac', textTransform: 'uppercase' }}>3. Survey Unit</span>
                </div>
                <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>Unit 05 Assigned</div>
              </div>
            </div>

            {/* Countdown Timer with Progress Bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#6ee7b7',
                fontWeight: 700,
                fontFamily: 'monospace',
                marginBottom: '8px'
              }}>
                <span>Starting parallel auto-fill in:</span>
                <span>{blackScreenTimer.toFixed(1)}s</span>
              </div>
              <div style={{
                height: '6px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${((3 - blackScreenTimer) / 3) * 100}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                  transition: 'width 0.05s linear'
                }} />
              </div>
            </div>

            {/* Skip button */}
            <button
              onClick={() => {
                presentationIntervalsRef.current.forEach(timer => clearInterval(timer));
                setBlackScreenTimer(0);
                startLivePresentation();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Skip Intro &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: WORK IS DONE FOR DISTRICT ADMIN OVERLAY                          */}
      {/* ========================================================================= */}
      {presentationPhase === 'completed' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.82)',
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
            maxWidth: '580px',
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(34, 197, 94, 0.35)',
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
              Work is Done for District Admin
            </h2>

            <p style={{
              fontSize: '13.5px',
              color: '#86efac',
              margin: '0 0 20px 0',
              fontWeight: 600
            }}>
              ✓ Spatial Pipeline Provisioned & Added to the Top of the Registry!
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
                <span>🗺️ Defined AOI:</span>
                <strong style={{ color: '#93c5fd' }}>pune_urban_aoi_boundary_2026.shp (UTM 44N)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🌐 GIS Cadastral Layer:</span>
                <strong style={{ color: '#d8b4fe' }}>pune_cadastral_layer_utm44n.zip</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>📋 Survey Unit Details:</span>
                <strong style={{ color: '#86efac' }}>Survey Unit 05 - 348675 (Tech Hub)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>👤 Assigned Surveyor:</span>
                <strong style={{ color: '#fde68a' }}>Surveyor Pune (Hinjawadi IT Park)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                id="btn-view-survey-units"
                onClick={() => {
                  stopLivePresentation();
                  setPresentationPhase('idle');
                  setActiveOption('units');
                  showToast('✨ Work is done for District Admin! Survey Unit is at the top of the list.');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
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
              >
                <span>View Survey Units at Top (Upside)</span>
                <ArrowRight size={19} />
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    stopLivePresentation();
                    setPresentationPhase('idle');
                    setActiveOption('aoi');
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    backgroundColor: 'rgba(29, 78, 216, 0.2)',
                    color: '#93c5fd',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Defined AOIs
                </button>
                <button
                  onClick={() => {
                    stopLivePresentation();
                    setPresentationPhase('idle');
                    setActiveOption('gis');
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    color: '#d8b4fe',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View GIS Layers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* ========================================================================= */}
      {/* 3 PARALLEL INPUT BOXES (ALL VISIBLE SIDE-BY-SIDE IN PARALLEL)             */}
      {/* ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '16px',
        marginBottom: '28px',
        alignItems: 'stretch'
      }}>
        {/* BOX 1: MANAGE AOI */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: presentationPhase === 'auto_fill' ? '2px solid #2563eb' : '1.5px solid #bfdbfe',
          boxShadow: presentationPhase === 'auto_fill' ? '0 0 16px rgba(37, 99, 235, 0.25)' : '0 2px 8px rgba(29, 78, 216, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
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
                <Map size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#1e3a8a' }}>1. Manage AOI</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 7px', borderRadius: '10px' }}>
              {aoiList.length} AOIs
            </span>
          </div>

          <form onSubmit={handleCreateAoi} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div>
              <label style={labelStyle}>Select ULB / Region *</label>
              <select
                style={inputStyle}
                value={aoiUlb}
                onChange={e => setAoiUlb(e.target.value)}
              >
                <option value="Pune-270410">Pune Municipal Corp (270410)</option>
                <option value="PMRDA-270411">PMRDA Pune (270411)</option>
                <option value="Hinjawadi-270412">Hinjawadi SPA (270412)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Coordinate Reference System</label>
              <input
                style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#64748b' }}
                type="text"
                value="UTM Zone 44N (EPSG:32644)"
                disabled
              />
            </div>
            <div>
              <label style={labelStyle}>Boundary File Name (.shp, .kml, .geojson)</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. pune_aoi_boundary.shp"
                value={aoiFileName}
                onChange={e => setAoiFileName(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#1d4ed8')}>
                <Plus size={15} /> {isClickingDone ? '✓ Uploaded AOI!' : 'Upload AOI Boundary'}
              </button>
            </div>
          </form>
        </div>

        {/* BOX 2: UPLOAD GIS LAYER */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: presentationPhase === 'auto_fill' ? '2px solid #7c3aed' : '1.5px solid #ddd6fe',
          boxShadow: presentationPhase === 'auto_fill' ? '0 0 16px rgba(124, 58, 237, 0.25)' : '0 2px 8px rgba(124, 58, 237, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
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
                <Layers size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#5b21b6' }}>2. Upload GIS Layer</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed', padding: '2px 7px', borderRadius: '10px' }}>
              {layerList.length} Layers
            </span>
          </div>

          <form onSubmit={handleCreateLayer} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>Select ULB *</label>
                <select
                  style={inputStyle}
                  value={layerUlb}
                  onChange={e => setLayerUlb(e.target.value)}
                >
                  <option value="Pune-270410">Pune-270410</option>
                  <option value="PMRDA-270411">PMRDA-270411</option>
                  <option value="Hinjawadi-270412">Hinjawadi-270412</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>GIS Layer Type *</label>
                <select
                  style={inputStyle}
                  value={layerType}
                  onChange={e => setLayerType(e.target.value as any)}
                >
                  <option value="Cadastral">Cadastral Boundaries</option>
                  <option value="Building Footprint">Building Footprint</option>
                  <option value="Property Tax Point">Property Tax Point</option>
                  <option value="Others">GCPs / Other Layer</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>GIS File Name (.zip, .shp, .geojson)</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. cadastral_parcels.zip"
                value={layerFileName}
                onChange={e => setLayerFileName(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#7c3aed')}>
                <Plus size={15} /> {isClickingDone ? '✓ Uploaded GIS Layer!' : 'Upload GIS Layer'}
              </button>
            </div>
          </form>
        </div>

        {/* BOX 3: CREATE & ASSIGN SURVEY UNIT */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: presentationPhase === 'auto_fill' ? '2px solid #16a34a' : '1.5px solid #bbf7d0',
          boxShadow: presentationPhase === 'auto_fill' ? '0 0 16px rgba(22, 163, 74, 0.25)' : '0 2px 8px rgba(22, 163, 74, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
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
                <FileSpreadsheet size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#166534' }}>3. Survey Unit Details</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: '10px' }}>
              {unitsList.length} Units
            </span>
          </div>

          <form onSubmit={handleCreateUnit} style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>ULB *</label>
                <select
                  style={inputStyle}
                  value={unitUlb}
                  onChange={e => setUnitUlb(e.target.value)}
                >
                  <option value="PMRDA Pune (270410)">PMRDA Pune (270410)</option>
                  <option value="Pune Municipal Corp (270411)">Pune Municipal Corp (270411)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ward / Village *</label>
                <select
                  style={inputStyle}
                  value={unitWard}
                  onChange={e => setUnitWard(e.target.value)}
                >
                  <option value="Hinjawadi Village (411057)">Hinjawadi Village (411057)</option>
                  <option value="Maan Village (411058)">Maan Village (411058)</option>
                  <option value="Wakad Ward 08 (411057)">Wakad Ward 08 (411057)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Survey Unit Code/Name *</label>
              <input
                style={inputStyle}
                type="text"
                placeholder={`e.g. Survey Unit 0${unitsList.length + 1} - 34867${unitsList.length + 1}`}
                value={unitName}
                onChange={e => setUnitName(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Assign Field Surveyor *</label>
              <select
                style={inputStyle}
                value={assignedSurveyor}
                onChange={e => setAssignedSurveyor(e.target.value)}
              >
                <option value="Surveyor Pune (Hinjawadi IT Park)">Surveyor Pune (Hinjawadi IT Park)</option>
                <option value="Senior Surveyor Pune">Senior Surveyor Pune</option>
                <option value="Surveyor Field Team B">Surveyor Field Team B</option>
                <option value="Surveyor Field Team C">Surveyor Field Team C</option>
              </select>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <button type="submit" style={actionBtn('#16a34a')}>
                <Plus size={15} /> {isClickingDone ? '✓ Created & Assigned!' : 'Create & Assign Survey Unit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 OPTION BUTTONS DIRECTORY (EXACTLY LIKE USER MANAGEMENT)                  */}
      {/* ========================================================================= */}
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
          <div style={{ position: 'relative', width: '280px' }}>
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

        {/* THE 3 OPTION BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {OPTIONS.map(opt => {
            const OptIcon = opt.icon;
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
                  padding: '12px 18px',
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

      {/* ========================================================================= */}
      {/* RECORDS DISPLAY FOR SELECTED OPTION                                       */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>

        {/* VIEW 1: DEFINED AOIS */}
        {activeOption === 'aoi' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredAois.length} Defined Area of Interest (AOI){filteredAois.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredAois.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No AOIs found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredAois.map((a, idx) => {
                  const isTop = idx === 0 || newlyCreatedAoiId === a.id;
                  return (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTop ? '#eff6ff' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTop ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        boxShadow: isTop ? '0 2px 10px rgba(59, 130, 246, 0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '7px',
                          backgroundColor: '#eff6ff', color: '#1d4ed8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Map size={16} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                              #{a.sNo ?? idx + 1} &bull; {a.ulbName} ({a.ulbCode}) &bull; <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{a.fileName}</span>
                            </span>
                            {isTop && (
                              <span style={{
                                backgroundColor: '#15803d',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                letterSpacing: '0.4px',
                                boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                              }}>
                                ⭐ TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                            Uploaded Date: {a.uploadedDate} &bull; Uploaded By: {a.createdBy} &bull; Projection: <strong style={{ color: '#0f172a' }}>{a.projection || 'UTM 44N'}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11.5px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>
                          {a.projection || 'UTM 44N'}
                        </span>
                        <button
                          onClick={() => setActiveMapAoi(a)}
                          style={{
                            backgroundColor: '#1d4ed8',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={13} /> View Map
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: UPLOADED GIS LAYERS */}
        {activeOption === 'gis' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredLayers.length} Uploaded GIS Layer{filteredLayers.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredLayers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No GIS layers found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredLayers.map((l, idx) => {
                  const isTop = idx === 0 || newlyCreatedLayerId === l.id;
                  return (
                    <div
                      key={l.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTop ? '#f5f3ff' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTop ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                        boxShadow: isTop ? '0 2px 10px rgba(139, 92, 246, 0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '7px',
                          backgroundColor: '#f5f3ff', color: '#7c3aed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Layers size={16} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                              #{l.sNo ?? idx + 1} &bull; {l.ulbName} ({l.district}) &bull; <span style={{ color: '#7c3aed', fontWeight: 600 }}>{l.fileName}</span>
                            </span>
                            {isTop && (
                              <span style={{
                                backgroundColor: '#15803d',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                letterSpacing: '0.4px',
                                boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                              }}>
                                ⭐ TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                            Type: <strong style={{ color: '#5b21b6' }}>{l.layerType}</strong> &bull; Upload Date: {l.uploadedDate} &bull; Uploaded By: {l.uploadedBy}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '11.5px',
                          backgroundColor:
                            l.layerType === 'Cadastral' ? '#dcfce7' :
                            l.layerType === 'Property Tax Point' ? '#f3e8ff' :
                            l.layerType === 'Building Footprint' ? '#ffedd5' : '#e0f2fe',
                          color:
                            l.layerType === 'Cadastral' ? '#15803d' :
                            l.layerType === 'Property Tax Point' ? '#7e22ce' :
                            l.layerType === 'Building Footprint' ? '#c2410c' : '#0369a1',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontWeight: 700
                        }}>
                          {l.layerType}
                        </span>
                        <button
                          onClick={() => setInspectLayer(l)}
                          style={{
                            backgroundColor: '#7c3aed',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={13} /> Inspect Layer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SURVEY UNIT DETAILS */}
        {activeOption === 'units' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Showing {filteredUnits.length} Survey Unit{filteredUnits.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredUnits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '13.5px' }}>
                No survey units found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredUnits.map((u, idx) => {
                  const isTop = idx === 0 || newlyCreatedUnitId === u.id;
                  return (
                    <div
                      key={u.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: isTop ? '#f0fdf4' : '#f8fafc',
                        borderRadius: '8px',
                        border: isTop ? '2px solid #22c55e' : '1px solid #e2e8f0',
                        boxShadow: isTop ? '0 2px 10px rgba(34, 197, 94, 0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '14px',
                          flexShrink: 0
                        }}>
                          {u.surveyUnit.charAt(0)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                              #{u.sNo ?? idx + 1} &bull; {u.surveyUnit} &bull; <span style={{ color: '#15803d' }}>{u.ward}</span>
                            </span>
                            {isTop && (
                              <span style={{
                                backgroundColor: '#15803d',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                letterSpacing: '0.4px',
                                boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                              }}>
                                ⭐ TOP (UPSIDE)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                            ULB: {u.ulb} &bull; Assigned to: <strong style={{ color: '#0f172a' }}>{u.assignedTo}</strong> &bull; Uploaded: {u.mapUploadedOn || 'Verified'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '11.5px',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          border: '1px solid #bbf7d0',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 600
                        }}>
                          Assigned: {u.isAssigned}
                        </span>
                        <span style={{
                          fontSize: '11.5px',
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          border: '1px solid #bae6fd',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 600
                        }}>
                          Map: {u.isMapUploaded}
                        </span>
                        <button
                          onClick={() => setActiveUnitForMap(u)}
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <MapPin size={13} /> View Map
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* SATELLITE MAP MODAL FOR AOI (STEP 1) */}
      {activeMapAoi && (
        <Modal
          isOpen={true}
          onClose={() => setActiveMapAoi(null)}
          title={`AOI Boundary Inspection: ${activeMapAoi.ulbName} (${activeMapAoi.ulbCode})`}
          maxWidth="900px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #bfdbfe' }}>
              <div><strong>File:</strong> {activeMapAoi.fileName} | <strong>Uploaded:</strong> {activeMapAoi.uploadedDate}</div>
              <div><strong>Projection:</strong> <span style={{ color: '#1d4ed8', fontWeight: 700 }}>{activeMapAoi.projection || 'UTM 44N'}</span></div>
            </div>
            <GisMap height="460px" showAoi={true} showCadastral={true} />
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <button
                onClick={() => setActiveMapAoi(null)}
                style={{ padding: '8px 18px', backgroundColor: '#1b539c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Close Map Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SATELLITE MAP MODAL FOR GIS LAYER (STEP 2) */}
      {inspectLayer && (
        <Modal
          isOpen={true}
          onClose={() => setInspectLayer(null)}
          title={`GIS Layer Inspector: ${inspectLayer.layerType} - ${inspectLayer.ulbName}`}
          maxWidth="900px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f3ff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #ddd6fe' }}>
              <div><strong>Type:</strong> <span style={{ color: '#7c3aed', fontWeight: 700 }}>{inspectLayer.layerType}</span> | <strong>Source:</strong> {inspectLayer.fileName}</div>
              <div><strong>Uploaded:</strong> {inspectLayer.uploadedDate} by {inspectLayer.uploadedBy}</div>
            </div>
            <GisMap
              height="460px"
              showAoi={true}
              showCadastral={inspectLayer.layerType === 'Cadastral'}
              showTaxPoints={inspectLayer.layerType === 'Property Tax Point'}
              showBuildings={inspectLayer.layerType === 'Building Footprint'}
            />
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <button
                onClick={() => setInspectLayer(null)}
                style={{ padding: '8px 18px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Close Layer Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SATELLITE MAP MODAL FOR SURVEY UNIT (STEP 3) */}
      {activeUnitForMap && (
        <Modal
          isOpen={true}
          onClose={() => setActiveUnitForMap(null)}
          title={`Geospatial Cadastral Coverage: ${activeUnitForMap.surveyUnit} (${activeUnitForMap.ward})`}
          maxWidth="900px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #bbf7d0' }}>
              <div><strong>Unit:</strong> {activeUnitForMap.surveyUnit} | <strong>Assigned To:</strong> {activeUnitForMap.assignedTo}</div>
              <div><strong>Map Uploaded:</strong> <span style={{ color: '#15803d', fontWeight: 700 }}>{activeUnitForMap.mapUploadedOn || 'Verified'}</span></div>
            </div>
            <GisMap height="460px" showAoi={true} showCadastral={true} showBuildings={true} />
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <button
                onClick={() => setActiveUnitForMap(null)}
                style={{ padding: '8px 18px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Close Map Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ManageAoiPage } from './pages/ManageAoiPage';
import { UploadLayerPage } from './pages/UploadLayerPage';
import { CaseEntryPage } from './pages/CaseEntryPage';
import { SurveyUnitsPage } from './pages/SurveyUnitsPage';
import { DepartmentsPage } from './pages/user-management/DepartmentsPage';
import { DesignationsPage } from './pages/user-management/DesignationsPage';
import { RolesPage } from './pages/user-management/RolesPage';
import { UsersPage } from './pages/user-management/UsersPage';
import { AssignRolePage } from './pages/user-management/AssignRolePage';
import { AssignAreaPage } from './pages/user-management/AssignAreaPage';
import { ManagePublicationPage } from './pages/ManagePublicationPage';
import { ReportsPage, NotificationsPage, ManageLogPage, ComplaintsPage } from './pages/AuxiliaryPages';
import { PublicPortalPage } from './pages/PublicPortalPage';

// State Admin Pages matching NAKSHA State Admin Manual
import { StateHomePage } from './pages/state/StateHomePage';
import { StateDashboardPage } from './pages/state/StateDashboardPage';
import { StateCreateRolePage } from './pages/state/StateCreateRolePage';
import { StateUsersPage } from './pages/state/StateUsersPage';

// Desktop Application Suite matching NAKSHA Desktop Application Manual
import { DesktopAppPage } from './pages/desktop/DesktopAppPage';

// ULB Admin Pages matching NAKSHA ULB Admin Video Tutorial (Maharashtra / Pune District / PMRDA Pune)
import { UlbHomePage } from './pages/ulb/UlbHomePage';
import { UlbDashboardPage } from './pages/ulb/UlbDashboardPage';
import { UlbCommitteeFormationPage } from './pages/ulb/UlbCommitteeFormationPage';
import { UlbCreateSurveyUnitPage } from './pages/ulb/UlbCreateSurveyUnitPage';
import { UlbManageDepartmentPage } from './pages/ulb/UlbManageDepartmentPage';
import { UlbManageDesignationPage } from './pages/ulb/UlbManageDesignationPage';
import { UlbManageRolePage } from './pages/ulb/UlbManageRolePage';
import { UlbManageUserPage } from './pages/ulb/UlbManageUserPage';
import { UlbAssignRolePage } from './pages/ulb/UlbAssignRolePage';
import { UlbAssignAreaPage } from './pages/ulb/UlbAssignAreaPage';
import { UlbSurveyUnitsDetailsPage } from './pages/ulb/UlbSurveyUnitsDetailsPage';
import { UlbManagePublicationPage } from './pages/ulb/UlbManagePublicationPage';
import { UlbFirstPublicationPage } from './pages/ulb/UlbFirstPublicationPage';
import { UlbClaimRedressalPage } from './pages/ulb/UlbClaimRedressalPage';
import { UlbProfilePage } from './pages/ulb/UlbProfilePage';
import { UlbChangePasswordPage } from './pages/ulb/UlbChangePasswordPage';

// Surveyor MAP-2 & 3D Property Intelligence Pages matching surveyers_map2 source of truth
import { SurveyorDashboardPage } from './pages/surveyor/SurveyorDashboardPage';
import { SurveyorSurveyUnitsPage } from './pages/surveyor/SurveyorSurveyUnitsPage';
import { MapImageVerificationPage } from './pages/surveyor/MapImageVerificationPage';
import { UploadGtPointsPage } from './pages/surveyor/UploadGtPointsPage';
import { MergeSplitPage } from './pages/surveyor/MergeSplitPage';
import { PlotVerificationPage } from './pages/surveyor/PlotVerificationPage';
import { RorEntryPage } from './pages/surveyor/RorEntryPage';
import { SurveyorManagePublicationPage } from './pages/surveyor/SurveyorManagePublicationPage';
import { SurveyorClaimsPage } from './pages/surveyor/SurveyorClaimsPage';
import { PropertySearchPage } from './pages/surveyor/PropertySearchPage';
import { PropertyDetailPage } from './pages/surveyor/PropertyDetailPage';
import { ThreeDViewerPage } from './pages/surveyor/ThreeDViewerPage';
import { BuildingFloorUnitRecordsPage } from './pages/surveyor/BuildingFloorUnitRecordsPage';
import { EvidenceVaultPage } from './pages/surveyor/EvidenceVaultPage';
import { SurveyorComparisonPage } from './pages/surveyor/SurveyorComparisonPage';
import { SurveyorVerificationQueuePage } from './pages/surveyor/SurveyorVerificationQueuePage';
import { BhunakshaPage } from './pages/bhunaksha/BhunakshaPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Landing Portal */}
        <Route path="/" element={<PublicPortalPage />} />

        {/* Dedicated BhuNaksha 1-Click ULPIN Generator (Standalone Independent Portal) */}
        <Route path="/bhunaksha" element={<BhunakshaPage />} />
        <Route path="/bhunaksha-ulpin" element={<BhunakshaPage />} />
        <Route path="/bhu-naksha" element={<BhunakshaPage />} />

        {/* 2. Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. NAKSHA Desktop Application Suite (Standalone Utility) */}
        <Route path="/desktop" element={<DesktopAppPage />} />
        <Route path="/desktop-app" element={<DesktopAppPage />} />

        {/* 4. ULB Admin Portal matching NAKSHA ULB Admin Video Tutorial (DoLR / Maharashtra Pune PMRDA) */}
        <Route path="/ulb" element={<AdminLayout />}>
          <Route index element={<Navigate to="/ulb/home" replace />} />
          <Route path="home" element={<UlbHomePage />} />
          <Route path="dashboard" element={<UlbDashboardPage />} />
          <Route path="committee-formation" element={<UlbCommitteeFormationPage />} />
          <Route path="create-survey-unit" element={<UlbCreateSurveyUnitPage />} />

          {/* Master / User Management Submodule */}
          <Route path="master/manage-departmentrole" element={<UlbManageDepartmentPage />} />
          <Route path="master/manage-designation" element={<UlbManageDesignationPage />} />
          <Route path="master/manage-role-permission" element={<UlbManageRolePage />} />
          <Route path="master/manage-user" element={<UlbManageUserPage />} />
          <Route path="master/manage-user-role" element={<UlbAssignRolePage />} />
          <Route path="master/manage-area-location" element={<UlbAssignAreaPage />} />

          {/* Survey Units Details */}
          <Route path="survey-units-details" element={<UlbSurveyUnitsDetailsPage />} />

          {/* Survey Activities & Publication */}
          <Route path="urban-survey-publication" element={<UlbManagePublicationPage />} />
          <Route path="urban-survey-publication/urban-survey-first-publication" element={<UlbFirstPublicationPage />} />
          <Route path="urban-survey-publication/first-publication" element={<UlbFirstPublicationPage />} />

          {/* Claims & Redressal */}
          <Route path="claim-redressal" element={<UlbClaimRedressalPage />} />
          <Route path="claims-redressal" element={<UlbClaimRedressalPage />} />

          {/* Profile & Change Password */}
          <Route path="profile" element={<UlbProfilePage />} />
          <Route path="profile-page" element={<UlbProfilePage />} />
          <Route path="change-password" element={<UlbChangePasswordPage />} />

          {/* Auxiliary */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="manage-log" element={<ManageLogPage />} />
        </Route>

        {/* 5. District Admin Portal with persistent Sidebar & Header */}
        <Route path="/portal" element={<AdminLayout />}>
          <Route index element={<Navigate to="/portal/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="manage-aoi" element={<ManageAoiPage />} />
          <Route path="upload-aoi" element={<ManageAoiPage />} />
          <Route path="upload-layer" element={<UploadLayerPage />} />
          <Route path="case-entry" element={<CaseEntryPage />} />
          <Route path="survey-units" element={<SurveyUnitsPage />} />

          {/* User Management */}
          <Route path="user-management" element={<Navigate to="/portal/user-management/users" replace />} />
          <Route path="user-management/departments" element={<DepartmentsPage />} />
          <Route path="user-management/designations" element={<DesignationsPage />} />
          <Route path="user-management/roles" element={<RolesPage />} />
          <Route path="user-management/users" element={<UsersPage />} />
          <Route path="user-management/assign-role" element={<AssignRolePage />} />
          <Route path="user-management/assign-area" element={<AssignAreaPage />} />

          {/* Survey Activities */}
          <Route path="survey-activities" element={<Navigate to="/portal/survey-activities/manage-publication" replace />} />
          <Route path="survey-activities/manage-publication" element={<ManagePublicationPage />} />

          {/* Auxiliary Pages */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="logs" element={<ManageLogPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
        </Route>

        {/* 6. State Admin Portal matching State Admin Manual */}
        <Route path="/state" element={<AdminLayout />}>
          <Route index element={<Navigate to="/state/home" replace />} />
          <Route path="home" element={<StateHomePage />} />
          <Route path="dashboard" element={<StateDashboardPage />} />

          {/* State User Management */}
          <Route path="user-management" element={<Navigate to="/state/user-management/users" replace />} />
          <Route path="user-management/departments" element={<DepartmentsPage />} />
          <Route path="user-management/designations" element={<DesignationsPage />} />
          <Route path="user-management/roles" element={<RolesPage />} />
          <Route path="user-management/roles/create" element={<StateCreateRolePage />} />
          <Route path="user-management/users" element={<StateUsersPage />} />
          <Route path="user-management/assign-role" element={<AssignRolePage />} />

          {/* Auxiliary */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 7. Surveyor MAP-2 & 3D Property Intelligence Portal matching surveyers_map2 source of truth */}
        <Route path="/surveyor" element={<AdminLayout />}>
          <Route index element={<Navigate to="/surveyor/dashboard" replace />} />
          <Route path="home" element={<Navigate to="/surveyor/dashboard" replace />} />
          <Route path="dashboard" element={<SurveyorDashboardPage />} />
          <Route path="survey-units" element={<SurveyorSurveyUnitsPage />} />

          {/* Survey Activities */}
          <Route path="survey-activities" element={<Navigate to="/surveyor/map-image-verification" replace />} />
          <Route path="map-image-verification" element={<MapImageVerificationPage />} />
          <Route path="2d-map" element={<MapImageVerificationPage />} />
          <Route path="upload-gt-points" element={<UploadGtPointsPage />} />
          <Route path="gt-points" element={<UploadGtPointsPage />} />
          <Route path="merge-split" element={<MergeSplitPage />} />
          <Route path="plot-verification" element={<PlotVerificationPage />} />
          <Route path="ror-entry" element={<RorEntryPage />} />
          <Route path="manage-publication" element={<SurveyorManagePublicationPage />} />

          {/* 3D Property Intelligence */}
          <Route path="property-search" element={<PropertySearchPage />} />
          <Route path="property-detail" element={<PropertyDetailPage />} />
          <Route path="three-d-viewer" element={<ThreeDViewerPage />} />
          <Route path="3d-viewer" element={<Navigate to="/surveyor/three-d-viewer" replace />} />
          <Route path="3d-intelligence" element={<ThreeDViewerPage />} />
          <Route path="building-records" element={<BuildingFloorUnitRecordsPage />} />
          <Route path="floor-unit-records" element={<BuildingFloorUnitRecordsPage />} />
          <Route path="evidence" element={<EvidenceVaultPage />} />
          <Route path="comparison" element={<SurveyorComparisonPage />} />
          <Route path="verification-queue" element={<SurveyorVerificationQueuePage />} />

          {/* Claims & Redressal */}
          <Route path="claims" element={<SurveyorClaimsPage />} />
          <Route path="claim-redressal" element={<SurveyorClaimsPage />} />
          <Route path="claims-redressal" element={<SurveyorClaimsPage />} />

          {/* Auxiliary */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="logs" element={<ManageLogPage />} />
        </Route>

        {/* Root aliases for quick direct access */}
        <Route path="/home" element={<Navigate to="/portal/home" replace />} />
        <Route path="/dashboard" element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="/manage-aoi" element={<Navigate to="/portal/manage-aoi" replace />} />
        <Route path="/upload-layer" element={<Navigate to="/portal/upload-layer" replace />} />
        <Route path="/case-entry" element={<Navigate to="/portal/case-entry" replace />} />
        <Route path="/survey-units" element={<Navigate to="/portal/survey-units" replace />} />
        <Route path="/user-management" element={<Navigate to="/portal/user-management/users" replace />} />
        <Route path="/manage-publication" element={<Navigate to="/portal/survey-activities/manage-publication" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/portal/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

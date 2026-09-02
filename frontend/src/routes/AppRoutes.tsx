import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AssistantPage } from '../pages/AssistantPage';
import { RequestsPage } from '../pages/RequestsPage';
import { ApprovalsPage } from '../pages/ApprovalsPage';
import { AuditPage } from '../pages/AuditPage';
import { KnowledgePage } from '../pages/KnowledgePage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { LoginPage } from '../pages/auth/LoginPage';
import { ServicesDirectoryPage } from '../pages/services/ServicesDirectoryPage';
import { LabBookingPage } from '../pages/services/LabBookingPage';
import { CertificatePage } from '../pages/services/CertificatePage';
import { MaintenancePage } from '../pages/services/MaintenancePage';
import { StaffMaintenancePage } from '../pages/maintenance/StaffMaintenancePage';
import { GrievancePage } from '../pages/services/GrievancePage';
import { OfficerGrievancePage } from '../pages/grievances/OfficerGrievancePage';
import { CommunityPage } from '../pages/community/CommunityPage';
import { PostDetailPage } from '../pages/community/PostDetailPage';
import { MarketplacePage } from '../pages/marketplace/MarketplacePage';
import { ItemDetailPage } from '../pages/marketplace/ItemDetailPage';
import { CommunityMarketplaceLayout } from '../components/layout/CommunityMarketplaceLayout';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Login Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Standalone Full-Page Dedicated Experience for Community & Marketplace */}
      <Route
        element={
          <ProtectedRoute>
            <CommunityMarketplaceLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:postId" element={<PostDetailPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:itemId" element={<ItemDetailPage />} />
      </Route>

      {/* Protected Main Application Dashboard Shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/services" element={<ServicesDirectoryPage />} />
        <Route path="/services/directory" element={<ServicesDirectoryPage />} />
        <Route path="/services/lab-booking" element={<LabBookingPage />} />
        <Route path="/service/lab-booking" element={<LabBookingPage />} />
        <Route path="/services/certificate" element={<CertificatePage />} />
        <Route path="/services/certificates" element={<CertificatePage />} />
        <Route path="/services/certifcate" element={<CertificatePage />} />
        <Route path="/service/certificate" element={<CertificatePage />} />
        <Route path="/service/certificates" element={<CertificatePage />} />
        <Route path="/service/certifcate" element={<CertificatePage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/certificates" element={<CertificatePage />} />
        <Route path="/services/maintenance" element={<MaintenancePage />} />
        <Route path="/service/maintenance" element={<MaintenancePage />} />
        <Route path="/maintenance/staff" element={<StaffMaintenancePage />} />
        <Route path="/services/grievance" element={<GrievancePage />} />
        <Route path="/service/grievance" element={<GrievancePage />} />
        <Route path="/grievances/officer" element={<OfficerGrievancePage />} />

        {/* Institutional Documents & Circulars Catalog */}
        <Route path="/documents" element={<KnowledgePage />} />

        {/* Admin Overview: Restricted to Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Super_Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Approvals: Restricted to Faculty, Lab In-Charge, Admin */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute allowedRoles={['Faculty', 'Lab_In_Charge', 'Admin', 'Super_Admin']}>
              <ApprovalsPage />
            </ProtectedRoute>
          }
        />

        {/* Audit Console: Restricted to Admin */}
        <Route
          path="/audit"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Super_Admin']}>
              <AuditPage />
            </ProtectedRoute>
          }
        />

        {/* Knowledge Base Manager: Restricted to Admin */}
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Super_Admin']}>
              <KnowledgePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/knowledge"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Super_Admin']}>
              <KnowledgePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

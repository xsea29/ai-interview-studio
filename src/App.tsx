import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/useAuth";
import { RequireAuth } from "@/auth/RequireAuth";
import { RequireAdmin } from "@/auth/RequireAdmin";
import Index from "./pages/Index";
import AuthChoice from "./pages/AuthChoice";
import LoginClient from "./pages/LoginClient";
import LoginAdmin from "./pages/LoginAdmin";
import CreateInterview from "./pages/CreateInterview";
import InterviewMonitoring from "./pages/InterviewMonitoring";
import InterviewDetail from "./pages/InterviewDetail";
import InterviewReadiness from "./pages/InterviewReadiness";
import EvaluationReport from "./pages/EvaluationReport";
import CandidateExperience from "./pages/CandidateExperience";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import AIAnalytics from "./pages/AIAnalytics";
import CompanyOnboarding from "./pages/CompanyOnboarding";
import NotFound from "./pages/NotFound";

// Platform Admin
import AdminLayout from "./components/admin/AdminLayout";
import Organizations from "./pages/admin/Organizations";
import OrganizationDetail from "./pages/admin/OrganizationDetail";
import FeatureFlags from "./pages/admin/FeatureFlags";
import AIModels from "./pages/admin/AIModels";
import Compliance from "./pages/admin/Compliance";
import BillingPlans from "./pages/admin/BillingPlans";
import AuditLogs from "./pages/admin/AuditLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth entry */}
            <Route path="/auth" element={<AuthChoice />} />
            <Route path="/auth/client" element={<LoginClient />} />
            <Route path="/auth/admin" element={<LoginAdmin />} />

            {/* Client app */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Index />
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding"
              element={
                <RequireAuth>
                  <CompanyOnboarding />
                </RequireAuth>
              }
            />
            <Route
              path="/create"
              element={
                <RequireAuth>
                  <CreateInterview />
                </RequireAuth>
              }
            />
            <Route
              path="/interviews"
              element={
                <RequireAuth>
                  <InterviewMonitoring />
                </RequireAuth>
              }
            />
            <Route
              path="/interviews/:id"
              element={
                <RequireAuth>
                  <InterviewDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/readiness/:id"
              element={
                <RequireAuth>
                  <InterviewReadiness />
                </RequireAuth>
              }
            />
            <Route
              path="/report/:id"
              element={
                <RequireAuth>
                  <EvaluationReport />
                </RequireAuth>
              }
            />
            {/* Candidate experience remains public */}
            <Route path="/interview/:id" element={<CandidateExperience />} />

            <Route
              path="/integrations"
              element={
                <RequireAuth>
                  <Integrations />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />
            <Route
              path="/analytics"
              element={
                <RequireAuth>
                  <AIAnalytics />
                </RequireAuth>
              }
            />

            {/* Platform Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/admin/organizations" replace />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="organizations/:id" element={<OrganizationDetail />} />
              <Route path="features" element={<FeatureFlags />} />
              <Route path="models" element={<AIModels />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="billing" element={<BillingPlans />} />
              <Route path="logs" element={<AuditLogs />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

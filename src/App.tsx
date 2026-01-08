import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<CompanyOnboarding />} />
          <Route path="/create" element={<CreateInterview />} />
          <Route path="/interviews" element={<InterviewMonitoring />} />
          <Route path="/interviews/:id" element={<InterviewDetail />} />
          <Route path="/readiness/:id" element={<InterviewReadiness />} />
          <Route path="/report/:id" element={<EvaluationReport />} />
          <Route path="/interview/:id" element={<CandidateExperience />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<AIAnalytics />} />
          
          {/* Platform Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
  </QueryClientProvider>
);

export default App;

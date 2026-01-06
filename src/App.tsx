import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateInterview from "./pages/CreateInterview";
import InterviewMonitoring from "./pages/InterviewMonitoring";
import InterviewDetail from "./pages/InterviewDetail";
import InterviewReadiness from "./pages/InterviewReadiness";
import EvaluationReport from "./pages/EvaluationReport";
import CandidateExperience from "./pages/CandidateExperience";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateInterview />} />
          <Route path="/interviews" element={<InterviewMonitoring />} />
          <Route path="/interviews/:id" element={<InterviewDetail />} />
          <Route path="/readiness/:id" element={<InterviewReadiness />} />
          <Route path="/report/:id" element={<EvaluationReport />} />
          <Route path="/interview/:id" element={<CandidateExperience />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

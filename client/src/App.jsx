import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./features/applications/pages/ApplicationsPage";
import GenerateResumePage from "./features/resume/pages/GenerateResumePage";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
=======
import ProtectedRoute from "./auth/protectedRoute";
import ResumeHubPage from "@/features/resume/pages/ResumeHubPage";
import ResumeImproverPage from "@/features/resume/pages/ResumeImproverPage";
>>>>>>> 1b32d940e3e51586f5e349ecf1f95a40850e1774

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/generate-resume" element={<GenerateResumePage />} />
=======
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeHubPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/generate-resume"
            element={
              <ProtectedRoute>
                <GenerateResumePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume/improve"
            element={
              <ProtectedRoute>
                <ResumeImproverPage />
              </ProtectedRoute>
            }
          />
>>>>>>> 1b32d940e3e51586f5e349ecf1f95a40850e1774
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

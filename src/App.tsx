import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import MasterResume from "./pages/MasterResume";
import Variants from "./pages/Variants";
import VariantEditor from "./pages/VariantEditor";
import Jobs from "./pages/Jobs";
import JobEditor from "./pages/JobEditor";
import CoverLetters from "./pages/CoverLetters";
import CoverLetterEditor from "./pages/CoverLetterEditor";
import Reports from "./pages/Reports";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ResumeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/master" element={
              <MainLayout>
                <MasterResume />
              </MainLayout>
            } />
            <Route path="/variants" element={
              <MainLayout>
                <Variants />
              </MainLayout>
            } />
            <Route path="/variants/:id" element={
              <MainLayout>
                <VariantEditor />
              </MainLayout>
            } />
            <Route path="/variants/new" element={
              <MainLayout>
                <VariantEditor />
              </MainLayout>
            } />
            <Route path="/jobs" element={
              <MainLayout>
                <Jobs />
              </MainLayout>
            } />
            <Route path="/jobs/:id" element={
              <MainLayout>
                <JobEditor />
              </MainLayout>
            } />
            <Route path="/jobs/new" element={
              <MainLayout>
                <JobEditor />
              </MainLayout>
            } />
            <Route path="/cover-letters" element={
              <MainLayout>
                <CoverLetters />
              </MainLayout>
            } />
            <Route path="/cover-letters/:id" element={
              <MainLayout>
                <CoverLetterEditor />
              </MainLayout>
            } />
            <Route path="/cover-letters/new" element={
              <MainLayout>
                <CoverLetterEditor />
              </MainLayout>
            } />
            <Route path="/reports" element={
              <MainLayout>
                <Reports />
              </MainLayout>
            } />
            <Route path="/templates" element={
              <MainLayout>
                <Index />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <Index />
              </MainLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ResumeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
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
import ResumeViewer from "./pages/ResumeViewer";
import Templates from "./pages/Templates";
import TemplateDownloads from "./pages/TemplateDownloads";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";
import LoadMikeResume from "./pages/LoadMikeResume";

const App = () => {
  console.log('App component initializing');
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ResumeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/dashboard" element={
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
            <Route path="/viewer" element={
              <MainLayout>
                <ResumeViewer />
              </MainLayout>
            } />
            <Route path="/reports" element={
              <MainLayout>
                <Reports />
              </MainLayout>
            } />
            <Route path="/templates" element={
              <MainLayout>
                <Templates />
              </MainLayout>
            } />
            <Route path="/template-downloads" element={
              <MainLayout>
                <TemplateDownloads />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } />
            <Route path="/guide" element={
              <MainLayout>
                <Guide />
              </MainLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </ResumeProvider>
    </TooltipProvider>
  );
};

export default App;

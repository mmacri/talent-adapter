import React, { createContext, useContext, useEffect, useState } from 'react';
import { ResumeMaster, Variant, JobApplication, CoverLetter, Template } from '@/types/resume';
import { resumeStorage, jobsStorage, coverLettersStorage, templatesStorage } from '@/lib/storage';
import { initializeData } from '@/lib/seedData';

interface ResumeContextType {
  // Master Resume
  masterResume: ResumeMaster | null;
  setMasterResume: (resume: ResumeMaster) => void;
  
  // Variants
  variants: Variant[];
  addVariant: (variant: Variant) => void;
  updateVariant: (id: string, updates: Partial<Variant>) => void;
  deleteVariant: (id: string) => void;
  getVariant: (id: string) => Variant | null;
  
  // Job Applications
  jobApplications: JobApplication[];
  addJobApplication: (job: JobApplication) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  clearAllJobApplications: () => void;
  
  // Cover Letters
  coverLetters: CoverLetter[];
  addCoverLetter: (letter: CoverLetter) => void;
  updateCoverLetter: (id: string, updates: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;
  
  // Templates
  templates: Template[];
  
  // Clear sections methods for master resume
  clearMasterResumeSection: (section: string) => void;
  
  // State
  isLoading: boolean;
  refreshData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterResume, setMasterResumeState] = useState<ResumeMaster | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    try {
      // Initialize seed data if needed
      console.log('🔄 Loading resume data...');
      initializeData();
      
      // Load all data from localStorage
      const master = resumeStorage.getMaster();
      const variantsData = resumeStorage.getVariants();
      const jobsData = jobsStorage.getAll();
      const lettersData = coverLettersStorage.getAll();
      const templatesData = templatesStorage.getAll();
      
      console.log('📊 Data loaded:', {
        masterResume: !!master,
        variants: variantsData.length,
        jobApplications: jobsData.length,
        coverLetters: lettersData.length,
        templates: templatesData.length
      });
      
      setMasterResumeState(master);
      setVariants(variantsData);
      setJobApplications(jobsData);
      setCoverLetters(lettersData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const setMasterResume = (resume: ResumeMaster) => {
    resumeStorage.setMaster(resume);
    setMasterResumeState(resume);
  };

  const addVariant = (variant: Variant) => {
    resumeStorage.addVariant(variant);
    setVariants(prev => [...prev, variant]);
  };

  const updateVariant = (id: string, updates: Partial<Variant>) => {
    resumeStorage.updateVariant(id, updates);
    setVariants(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVariant = (id: string) => {
    resumeStorage.deleteVariant(id);
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const getVariant = (id: string): Variant | null => {
    return variants.find(v => v.id === id) || null;
  };

  const addJobApplication = (job: JobApplication) => {
    console.log('addJobApplication called with:', job);
    try {
      console.log('Calling jobsStorage.add');
      jobsStorage.add(job);
      console.log('jobsStorage.add completed');
      
      console.log('Updating state with setJobApplications');
      setJobApplications(prev => {
        console.log('Previous job applications:', prev.length);
        const newList = [...prev, job];
        console.log('New job applications count:', newList.length);
        return newList;
      });
      console.log('setJobApplications completed');
    } catch (error) {
      console.error('Error in addJobApplication:', error);
      throw error;
    }
  };

  const updateJobApplication = (id: string, updates: Partial<JobApplication>) => {
    jobsStorage.update(id, updates);
    setJobApplications(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const deleteJobApplication = (id: string) => {
    jobsStorage.delete(id);
    setJobApplications(prev => prev.filter(j => j.id !== id));
  };

  const clearAllJobApplications = () => {
    jobsStorage.clear();
    setJobApplications([]);
  };

  const addCoverLetter = (letter: CoverLetter) => {
    coverLettersStorage.add(letter);
    setCoverLetters(prev => [...prev, letter]);
  };

  const updateCoverLetter = (id: string, updates: Partial<CoverLetter>) => {
    coverLettersStorage.update(id, updates);
    setCoverLetters(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteCoverLetter = (id: string) => {
    coverLettersStorage.delete(id);
    setCoverLetters(prev => prev.filter(l => l.id !== id));
  };

  const clearMasterResumeSection = (section: string) => {
    if (!masterResume) return;
    
    // Use dynamic import to avoid circular dependency
    import('@/lib/masterResumeUtils').then(({ clearSectionData }) => {
      try {
        const clearedResume = clearSectionData(masterResume, section as any);
        setMasterResume(clearedResume);
      } catch (error) {
        console.error('Error clearing section:', error);
      }
    }).catch((error) => {
      console.error('Error importing masterResumeUtils:', error);
    });
  };

  const refreshData = () => {
    loadData();
  };

  const value: ResumeContextType = {
    masterResume,
    setMasterResume,
    variants,
    addVariant,
    updateVariant,
    deleteVariant,
    getVariant,
    jobApplications,
    addJobApplication,
    updateJobApplication,
    deleteJobApplication,
    clearAllJobApplications,
    coverLetters,
    addCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    templates,
    isLoading,
    refreshData,
    clearMasterResumeSection,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
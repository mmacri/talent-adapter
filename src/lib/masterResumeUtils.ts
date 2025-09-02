import { ResumeMaster, Contact, Experience, Education, Award } from '@/types/resume';

export type MasterResumeSections = 
  | 'contacts' 
  | 'headline' 
  | 'summary' 
  | 'key_achievements' 
  | 'experience' 
  | 'education' 
  | 'awards' 
  | 'skills'
  | 'sections';

export interface SectionExportData {
  section: MasterResumeSections;
  data: any;
  exportDate: string;
}

export interface MasterResumeExportData {
  sections: MasterResumeSections[];
  data: Partial<ResumeMaster>;
  exportDate: string;
  version: string;
}

// Export specific sections of master resume
export const exportMasterResumeSections = (
  resume: ResumeMaster, 
  selectedSections: MasterResumeSections[]
): MasterResumeExportData => {
  const exportData: Partial<ResumeMaster> = {};
  
  selectedSections.forEach(section => {
    switch (section) {
      case 'contacts':
        exportData.contacts = resume.contacts;
        break;
      case 'headline':
        exportData.headline = resume.headline;
        break;
      case 'summary':
        exportData.summary = resume.summary;
        break;
      case 'key_achievements':
        exportData.key_achievements = resume.key_achievements;
        break;
      case 'experience':
        exportData.experience = resume.experience;
        break;
      case 'education':
        exportData.education = resume.education;
        break;
      case 'awards':
        exportData.awards = resume.awards;
        break;
      case 'skills':
        exportData.skills = resume.skills;
        break;
      case 'sections':
        exportData.sections = resume.sections;
        break;
    }
  });

  // Always include metadata
  exportData.id = resume.id;
  exportData.owner = resume.owner;
  exportData.createdAt = resume.createdAt;
  exportData.updatedAt = resume.updatedAt;

  return {
    sections: selectedSections,
    data: exportData,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

// Export single section
export const exportSingleSection = (
  resume: ResumeMaster, 
  section: MasterResumeSections
): SectionExportData => {
  let sectionData: any;
  
  switch (section) {
    case 'contacts':
      sectionData = resume.contacts;
      break;
    case 'headline':
      sectionData = resume.headline;
      break;
    case 'summary':
      sectionData = resume.summary;
      break;
    case 'key_achievements':
      sectionData = resume.key_achievements;
      break;
    case 'experience':
      sectionData = resume.experience;
      break;
    case 'education':
      sectionData = resume.education;
      break;
    case 'awards':
      sectionData = resume.awards;
      break;
    case 'skills':
      sectionData = resume.skills;
      break;
    case 'sections':
      sectionData = resume.sections;
      break;
    default:
      throw new Error(`Unknown section: ${section}`);
  }

  return {
    section,
    data: sectionData,
    exportDate: new Date().toISOString()
  };
};

// Download as JSON file
export const downloadAsJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import master resume sections
export const importMasterResumeSections = (
  currentResume: ResumeMaster,
  importData: MasterResumeExportData,
  mergeMode: 'replace' | 'merge' = 'merge'
): ResumeMaster => {
  const updatedResume = { ...currentResume };

  importData.sections.forEach(section => {
    const importedData = importData.data[section];
    if (importedData !== undefined) {
      switch (section) {
        case 'contacts':
          updatedResume.contacts = mergeMode === 'replace' 
            ? importedData as Contact
            : { ...updatedResume.contacts, ...importedData as Contact };
          break;
        case 'headline':
          updatedResume.headline = importedData as string;
          break;
        case 'summary':
          updatedResume.summary = mergeMode === 'replace'
            ? importedData as string[]
            : [...updatedResume.summary, ...importedData as string[]];
          break;
        case 'key_achievements':
          updatedResume.key_achievements = mergeMode === 'replace'
            ? importedData as string[]
            : [...updatedResume.key_achievements, ...importedData as string[]];
          break;
        case 'experience':
          updatedResume.experience = mergeMode === 'replace'
            ? importedData as Experience[]
            : mergeExperienceArrays(updatedResume.experience, importedData as Experience[]);
          break;
        case 'education':
          updatedResume.education = mergeMode === 'replace'
            ? importedData as Education[]
            : mergeEducationArrays(updatedResume.education, importedData as Education[]);
          break;
        case 'awards':
          updatedResume.awards = mergeMode === 'replace'
            ? importedData as Award[]
            : mergeAwardsArrays(updatedResume.awards, importedData as Award[]);
          break;
        case 'skills':
          updatedResume.skills = mergeMode === 'replace'
            ? importedData as typeof updatedResume.skills
            : {
                primary: [...new Set([...updatedResume.skills.primary, ...(importedData as typeof updatedResume.skills).primary])],
                secondary: (importedData as typeof updatedResume.skills).secondary 
                  ? [...new Set([...(updatedResume.skills.secondary || []), ...(importedData as typeof updatedResume.skills).secondary!])]
                  : updatedResume.skills.secondary
              };
          break;
        case 'sections':
          updatedResume.sections = mergeMode === 'replace'
            ? importedData as typeof updatedResume.sections
            : { ...updatedResume.sections, ...importedData as typeof updatedResume.sections };
          break;
      }
    }
  });

  updatedResume.updatedAt = new Date().toISOString();
  return updatedResume;
};

// Import single section
export const importSingleSection = (
  currentResume: ResumeMaster,
  sectionData: SectionExportData,
  mergeMode: 'replace' | 'merge' = 'merge'
): ResumeMaster => {
  return importMasterResumeSections(
    currentResume,
    {
      sections: [sectionData.section],
      data: { [sectionData.section]: sectionData.data },
      exportDate: sectionData.exportDate,
      version: '1.0'
    },
    mergeMode
  );
};

// Clear section data
export const clearSectionData = (
  resume: ResumeMaster,
  section: MasterResumeSections
): ResumeMaster => {
  const clearedResume = { ...resume };
  
  switch (section) {
    case 'contacts':
      clearedResume.contacts = {
        email: '',
        phone: '',
        website: '',
        linkedin: ''
      };
      break;
    case 'headline':
      clearedResume.headline = '';
      break;
    case 'summary':
      clearedResume.summary = [];
      break;
    case 'key_achievements':
      clearedResume.key_achievements = [];
      break;
    case 'experience':
      clearedResume.experience = [];
      break;
    case 'education':
      clearedResume.education = [];
      break;
    case 'awards':
      clearedResume.awards = [];
      break;
    case 'skills':
      clearedResume.skills = {
        primary: [],
        secondary: []
      };
      break;
    case 'sections':
      clearedResume.sections = {
        summary: { enabled: true, order: 1 },
        key_achievements: { enabled: true, order: 2 },
        experience: { enabled: true, order: 3 },
        education: { enabled: true, order: 4 },
        awards: { enabled: true, order: 5 },
        skills: { enabled: true, order: 6 }
      };
      break;
  }
  
  clearedResume.updatedAt = new Date().toISOString();
  return clearedResume;
};

// Helper functions for merging arrays
const mergeExperienceArrays = (current: Experience[], imported: Experience[]): Experience[] => {
  const merged = [...current];
  
  imported.forEach(importedExp => {
    const existingIndex = merged.findIndex(exp => 
      exp.company === importedExp.company && exp.title === importedExp.title
    );
    
    if (existingIndex >= 0) {
      // Update existing experience
      merged[existingIndex] = { ...merged[existingIndex], ...importedExp };
    } else {
      // Add new experience with new ID if needed
      merged.push({
        ...importedExp,
        id: importedExp.id || `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
  });
  
  return merged;
};

const mergeEducationArrays = (current: Education[], imported: Education[]): Education[] => {
  const merged = [...current];
  
  imported.forEach(importedEdu => {
    const existingIndex = merged.findIndex(edu => 
      edu.school === importedEdu.school && edu.degree === importedEdu.degree
    );
    
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...importedEdu };
    } else {
      merged.push({
        ...importedEdu,
        id: importedEdu.id || `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
  });
  
  return merged;
};

const mergeAwardsArrays = (current: Award[], imported: Award[]): Award[] => {
  const merged = [...current];
  
  imported.forEach(importedAward => {
    const existingIndex = merged.findIndex(award => 
      award.title === importedAward.title
    );
    
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...importedAward };
    } else {
      merged.push({
        ...importedAward,
        id: importedAward.id || `award_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
  });
  
  return merged;
};

// Validate imported data
export const validateImportData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    // Check if it's a master resume export or section export
    if (data.sections && Array.isArray(data.sections)) {
      // Master resume export format
      if (!data.data || typeof data.data !== 'object') {
        errors.push('Invalid export format: missing data object');
      }
      if (!data.version) {
        errors.push('Invalid export format: missing version');
      }
    } else if (data.section && data.data !== undefined) {
      // Single section export format
      if (!data.section || typeof data.section !== 'string') {
        errors.push('Invalid section export: missing or invalid section name');
      }
    } else {
      errors.push('Invalid export format: not a recognized master resume export');
    }
  } catch (error) {
    errors.push('Invalid JSON format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
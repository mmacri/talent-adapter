import JSZip from 'jszip';
import { ResumeMaster, Variant, JobApplication, CoverLetter } from '@/types/resume';

export interface BackupData {
  masterResume?: ResumeMaster;
  variants?: Variant[];
  jobApplications?: JobApplication[];
  coverLetters?: CoverLetter[];
}

export const exportBackup = async (data: BackupData): Promise<void> => {
  const zip = new JSZip();
  
  // Add metadata
  const metadata = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    dataTypes: Object.keys(data),
  };
  
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  
  // Add each data type as separate JSON files
  if (data.masterResume) {
    zip.file('master-resume.json', JSON.stringify(data.masterResume, null, 2));
  }
  
  if (data.variants) {
    zip.file('variants.json', JSON.stringify(data.variants, null, 2));
  }
  
  if (data.jobApplications) {
    zip.file('job-applications.json', JSON.stringify(data.jobApplications, null, 2));
  }
  
  if (data.coverLetters) {
    zip.file('cover-letters.json', JSON.stringify(data.coverLetters, null, 2));
  }
  
  // Generate ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  link.download = `resume-backup-${timestamp}.zip`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

export const importBackup = async (file: File): Promise<BackupData> => {
  const zip = new JSZip();
  
  try {
    const zipContents = await zip.loadAsync(file);
    const result: BackupData = {};
    
    // Read master resume
    const masterResumeFile = zipContents.file('master-resume.json');
    if (masterResumeFile) {
      const content = await masterResumeFile.async('text');
      result.masterResume = JSON.parse(content) as ResumeMaster;
    }
    
    // Read variants
    const variantsFile = zipContents.file('variants.json');
    if (variantsFile) {
      const content = await variantsFile.async('text');
      result.variants = JSON.parse(content) as Variant[];
    }
    
    // Read job applications
    const jobsFile = zipContents.file('job-applications.json');
    if (jobsFile) {
      const content = await jobsFile.async('text');
      result.jobApplications = JSON.parse(content) as JobApplication[];
    }
    
    // Read cover letters
    const coversFile = zipContents.file('cover-letters.json');
    if (coversFile) {
      const content = await coversFile.async('text');
      result.coverLetters = JSON.parse(content) as CoverLetter[];
    }
    
    return result;
  } catch (error) {
    throw new Error('Failed to read backup file: ' + (error as Error).message);
  }
};

export const validateBackupFile = async (file: File): Promise<boolean> => {
  try {
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(file);
    
    // Check for metadata file
    const metadataFile = zipContents.file('metadata.json');
    if (!metadataFile) return false;
    
    // Validate at least one data file exists
    const hasData = 
      zipContents.file('master-resume.json') ||
      zipContents.file('variants.json') ||
      zipContents.file('job-applications.json') ||
      zipContents.file('cover-letters.json');
    
    return !!hasData;
  } catch {
    return false;
  }
};
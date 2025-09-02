import { ResumeMaster, Variant, JobApplication, CoverLetter, Template } from '@/types/resume';

const STORAGE_KEYS = {
  RESUME_MASTER: 'resume_master',
  VARIANTS: 'resume_variants',
  JOB_APPLICATIONS: 'job_applications',
  COVER_LETTERS: 'cover_letters',
  TEMPLATES: 'resume_templates',
  USER_SETTINGS: 'user_settings',
} as const;

// Generic storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Resume Master operations
export const resumeStorage = {
  getMaster: (): ResumeMaster | null => storage.get<ResumeMaster>(STORAGE_KEYS.RESUME_MASTER),
  
  setMaster: (resume: ResumeMaster): void => {
    resume.updatedAt = new Date().toISOString();
    storage.set(STORAGE_KEYS.RESUME_MASTER, resume);
  },
  
  getVariants: (): Variant[] => storage.get<Variant[]>(STORAGE_KEYS.VARIANTS) || [],
  
  setVariants: (variants: Variant[]): void => storage.set(STORAGE_KEYS.VARIANTS, variants),
  
  addVariant: (variant: Variant): void => {
    const variants = resumeStorage.getVariants();
    variants.push(variant);
    resumeStorage.setVariants(variants);
  },
  
  updateVariant: (id: string, updates: Partial<Variant>): void => {
    const variants = resumeStorage.getVariants();
    const index = variants.findIndex(v => v.id === id);
    if (index !== -1) {
      variants[index] = { ...variants[index], ...updates, updatedAt: new Date().toISOString() };
      resumeStorage.setVariants(variants);
    }
  },
  
  deleteVariant: (id: string): void => {
    const variants = resumeStorage.getVariants().filter(v => v.id !== id);
    resumeStorage.setVariants(variants);
  },
  
  getVariant: (id: string): Variant | null => {
    return resumeStorage.getVariants().find(v => v.id === id) || null;
  },
};

// Job Applications operations  
export const jobsStorage = {
  getAll: (): JobApplication[] => storage.get<JobApplication[]>(STORAGE_KEYS.JOB_APPLICATIONS) || [],
  
  setAll: (jobs: JobApplication[]): void => storage.set(STORAGE_KEYS.JOB_APPLICATIONS, jobs),
  
  add: (job: JobApplication): void => {
    const jobs = jobsStorage.getAll();
    jobs.push(job);
    jobsStorage.setAll(jobs);
  },
  
  update: (id: string, updates: Partial<JobApplication>): void => {
    const jobs = jobsStorage.getAll();
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() };
      jobsStorage.setAll(jobs);
    }
  },
  
  delete: (id: string): void => {
    const jobs = jobsStorage.getAll().filter(j => j.id !== id);
    jobsStorage.setAll(jobs);
  },

  clear: (): void => {
    jobsStorage.setAll([]);
  },
};

// Cover Letters operations
export const coverLettersStorage = {
  getAll: (): CoverLetter[] => storage.get<CoverLetter[]>(STORAGE_KEYS.COVER_LETTERS) || [],
  
  setAll: (letters: CoverLetter[]): void => storage.set(STORAGE_KEYS.COVER_LETTERS, letters),
  
  add: (letter: CoverLetter): void => {
    const letters = coverLettersStorage.getAll();
    letters.push(letter);
    coverLettersStorage.setAll(letters);
  },
  
  update: (id: string, updates: Partial<CoverLetter>): void => {
    const letters = coverLettersStorage.getAll();
    const index = letters.findIndex(l => l.id === id);
    if (index !== -1) {
      letters[index] = { ...letters[index], ...updates, updatedAt: new Date().toISOString() };
      coverLettersStorage.setAll(letters);
    }
  },
  
  delete: (id: string): void => {
    const letters = coverLettersStorage.getAll().filter(l => l.id !== id);
    coverLettersStorage.setAll(letters);
  },
};

// Templates operations
export const templatesStorage = {
  getAll: (): Template[] => storage.get<Template[]>(STORAGE_KEYS.TEMPLATES) || [],
  
  setAll: (templates: Template[]): void => storage.set(STORAGE_KEYS.TEMPLATES, templates),
  
  add: (template: Template): void => {
    const templates = templatesStorage.getAll();
    templates.push(template);
    templatesStorage.setAll(templates);
  },
  
  update: (id: string, updates: Partial<Template>): void => {
    const templates = templatesStorage.getAll();
    const index = templates.findIndex(t => t.id === id);
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updates };
      templatesStorage.setAll(templates);
    }
  },
  
  delete: (id: string): void => {
    const templates = templatesStorage.getAll().filter(t => t.id !== id);
    templatesStorage.setAll(templates);
  },
};
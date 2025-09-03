export interface Contact {
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  date_start: string;
  date_end?: string | null;
  bullets: string[];
  tags: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  year?: string;
}

export interface Award {
  id: string;
  title: string;
  date?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface ResumeMaster {
  id: string;
  owner: string;
  contacts: Contact;
  headline: string;
  summary: string[];
  key_achievements: string[];
  experience: Experience[];
  education: Education[];
  awards: Award[];
  skills: {
    primary: string[];
    secondary?: string[];
  };
  sections: {
    summary: { enabled: boolean; order: number };
    key_achievements: { enabled: boolean; order: number };
    experience: { enabled: boolean; order: number };
    education: { enabled: boolean; order: number };
    awards: { enabled: boolean; order: number };
    skills: { enabled: boolean; order: number };
  };
  createdAt: string;
  updatedAt: string;
}

export interface VariantRule {
  type: 'include_tags' | 'exclude_tags' | 'max_bullets' | 'section_order' | 'date_range';
  value: any;
}

export interface VariantOverride {
  path: string;
  operation: 'set' | 'add' | 'remove' | 'move';
  value?: any;
}

export interface Variant {
  id: string;
  name: string;
  description?: string;
  rules: VariantRule[];
  overrides: VariantOverride[];
  sectionSettings: {
    headline: { enabled: boolean };
    summary: { enabled: boolean };
    key_achievements: { enabled: boolean };
    experience: { enabled: boolean };
    education: { enabled: boolean };
    awards: { enabled: boolean };
    skills: { enabled: boolean };
  };
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  styles: {
    [key: string]: any;
  };
  sectionConfig?: {
    useVariantSections: boolean;
    enabledSections: string[];
  };
}

export interface CoverLetter {
  id: string;
  title: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location?: string;
  status: 'prospect' | 'applied' | 'interview' | 'offer' | 'rejected' | 'closed';
  variantId?: string; // Resume variant used
  coverLetterId?: string; // Cover letter used
  appliedOn: string; // Required for chronological tracking
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedResume {
  master: ResumeMaster;
  variant?: Variant;
  resolved: ResumeMaster;
}
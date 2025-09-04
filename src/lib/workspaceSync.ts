import { ResumeMaster, Variant, JobApplication, CoverLetter } from '@/types/resume';
import { resumeStorage, jobsStorage, coverLettersStorage } from './storage';

export interface WorkspaceData {
  masterResume: ResumeMaster | null;
  variants: Variant[];
  jobApplications: JobApplication[];
  coverLetters: CoverLetter[];
  lastSyncAt: string;
  version: string;
}

interface WorkspaceConfig {
  filePath?: string;
  autoSave: boolean;
  encrypt: boolean;
  password?: string;
}

// Check if File System Access API is supported
export const isFileSystemAccessSupported = (): boolean => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

// Simple encryption/decryption (you can enhance this with proper encryption libraries)
const simpleEncrypt = (data: string, password: string): string => {
  // This is a basic XOR cipher - in production, use proper encryption
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ password.charCodeAt(i % password.length));
  }
  return btoa(result);
};

const simpleDecrypt = (encryptedData: string, password: string): string => {
  const data = atob(encryptedData);
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ password.charCodeAt(i % password.length));
  }
  return result;
};

class WorkspaceSync {
  private fileHandle: any = null;
  private config: WorkspaceConfig = {
    autoSave: false,
    encrypt: false,
  };

  constructor() {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('workspace_config');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    }
  }

  private saveConfig(): void {
    const { password, ...configToSave } = this.config;
    localStorage.setItem('workspace_config', JSON.stringify(configToSave));
  }

  private getCurrentData(): WorkspaceData {
    return {
      masterResume: resumeStorage.getMaster(),
      variants: resumeStorage.getVariants(),
      jobApplications: jobsStorage.getAll(),
      coverLetters: coverLettersStorage.getAll(),
      lastSyncAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  private async writeToFile(data: WorkspaceData): Promise<void> {
    if (!this.fileHandle) throw new Error('No file handle available');

    let jsonData = JSON.stringify(data, null, 2);
    
    if (this.config.encrypt && this.config.password) {
      jsonData = simpleEncrypt(jsonData, this.config.password);
    }

    const writable = await this.fileHandle.createWritable();
    await writable.write(jsonData);
    await writable.close();
  }

  private async readFromFile(): Promise<WorkspaceData> {
    if (!this.fileHandle) throw new Error('No file handle available');

    const file = await this.fileHandle.getFile();
    let content = await file.text();

    if (this.config.encrypt && this.config.password) {
      content = simpleDecrypt(content, this.config.password);
    }

    return JSON.parse(content);
  }

  async chooseWorkspaceFile(): Promise<boolean> {
    if (!isFileSystemAccessSupported()) {
      throw new Error('File System Access API not supported');
    }

    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [{
          description: 'Workspace JSON files',
          accept: { 'application/json': ['.json'] },
        }],
        multiple: false,
      });

      this.fileHandle = fileHandle;
      this.config.filePath = fileHandle.name;
      this.saveConfig();
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        throw error;
      }
      return false;
    }
  }

  async createNewWorkspaceFile(): Promise<boolean> {
    if (!isFileSystemAccessSupported()) {
      throw new Error('File System Access API not supported');
    }

    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: 'workspace.json',
        types: [{
          description: 'Workspace JSON files',
          accept: { 'application/json': ['.json'] },
        }],
      });

      this.fileHandle = fileHandle;
      this.config.filePath = fileHandle.name;
      this.saveConfig();

      // Write initial data
      await this.writeToFile(this.getCurrentData());
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        throw error;
      }
      return false;
    }
  }

  async saveToWorkspace(): Promise<void> {
    if (!this.fileHandle) {
      throw new Error('No workspace file selected');
    }

    const data = this.getCurrentData();
    await this.writeToFile(data);
  }

  async loadFromWorkspace(): Promise<WorkspaceData> {
    if (!this.fileHandle) {
      throw new Error('No workspace file selected');
    }

    return await this.readFromFile();
  }

  async syncFromWorkspace(): Promise<void> {
    const data = await this.loadFromWorkspace();
    
    // Update local storage with workspace data
    if (data.masterResume) {
      resumeStorage.setMaster(data.masterResume);
    }
    
    if (data.variants) {
      resumeStorage.setVariants(data.variants);
    }
    
    if (data.jobApplications) {
      jobsStorage.setAll(data.jobApplications);
    }
    
    if (data.coverLetters) {
      coverLettersStorage.setAll(data.coverLetters);
    }
  }

  // Manual download/upload for browsers without File System Access API
  downloadWorkspace(): void {
    const data = this.getCurrentData();
    let jsonData = JSON.stringify(data, null, 2);
    
    if (this.config.encrypt && this.config.password) {
      jsonData = simpleEncrypt(jsonData, this.config.password);
    }

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workspace.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async uploadWorkspace(file: File): Promise<void> {
    let content = await file.text();
    
    if (this.config.encrypt && this.config.password) {
      content = simpleDecrypt(content, this.config.password);
    }

    const data: WorkspaceData = JSON.parse(content);
    
    // Update local storage with uploaded data
    if (data.masterResume) {
      resumeStorage.setMaster(data.masterResume);
    }
    
    if (data.variants) {
      resumeStorage.setVariants(data.variants);
    }
    
    if (data.jobApplications) {
      jobsStorage.setAll(data.jobApplications);
    }
    
    if (data.coverLetters) {
      coverLettersStorage.setAll(data.coverLetters);
    }
  }

  getConfig(): WorkspaceConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<WorkspaceConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  hasWorkspaceFile(): boolean {
    return this.fileHandle !== null || Boolean(this.config.filePath);
  }

  getWorkspaceFileName(): string | null {
    return this.config.filePath || null;
  }

  async autoSave(): Promise<void> {
    if (this.config.autoSave && this.fileHandle) {
      await this.saveToWorkspace();
    }
  }
}

export const workspaceSync = new WorkspaceSync();
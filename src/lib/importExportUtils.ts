import * as XLSX from 'xlsx';
import { ResumeMaster, JobApplication, CoverLetter, Experience, Education, Award } from '@/types/resume';

export type ExportFormat = 'json' | 'csv' | 'excel';

export interface ImportExportOptions {
  format: ExportFormat;
  filename?: string;
}

// Date formatting utilities to prevent Excel auto-conversion
export const formatDateForExport = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  // Use YYYY-MM-DD format prefixed with apostrophe to prevent Excel auto-conversion
  return `'${dateObj.toISOString().split('T')[0]}`;
};

export const parseDateFromImport = (dateStr: string): string => {
  if (!dateStr) return '';
  // Remove leading apostrophe if present (from Excel export)
  const cleanDateStr = dateStr.startsWith("'") ? dateStr.substring(1) : dateStr;
  // Validate and return ISO string
  const date = new Date(cleanDateStr);
  return isNaN(date.getTime()) ? '' : date.toISOString();
};

// Generic CSV utilities
export const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] ?? '';
        // Handle dates first to prevent auto-conversion
        if (header.toLowerCase().includes('date') || header.toLowerCase().includes('on')) {
          cell = formatDateForExport(cell);
        } else if (Array.isArray(cell)) {
          cell = cell.join('|');
        } else if (typeof cell === 'object') {
          cell = JSON.stringify(cell);
        }
        // Escape quotes and wrap in quotes if contains comma or quotes
        cell = String(cell);
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ];
  return csvRows.join('\n');
};

// Parse CSV data
export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        let value: any = values[index];
        // Handle date fields first
        if (header.toLowerCase().includes('date') || header.toLowerCase().includes('on')) {
          value = parseDateFromImport(value);
        } else if (typeof value === 'string' && value.includes('|')) {
          // Handle array values (pipe-separated)
          value = value.split('|');
        } else {
          // Try to parse JSON objects
          try {
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
              value = JSON.parse(value);
            }
          } catch {
            // Keep as string if not valid JSON
          }
        }
        row[header] = value;
      });
      data.push(row);
    }
  }
  return data;
};

// Parse a single CSV line handling quotes properly
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

// Download file utilities
export const downloadFile = (content: string | Blob, filename: string, mimeType: string): void => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Universal export function
export const exportData = (data: any, basename: string, format: ExportFormat): void => {
  const timestamp = new Date().toISOString().slice(0, 10);
  
  switch (format) {
    case 'json':
      downloadFile(
        JSON.stringify(data, null, 2),
        `${basename}_${timestamp}.json`,
        'application/json'
      );
      break;
      
    case 'csv':
      const csvData = Array.isArray(data) ? data : [data];
      downloadFile(
        convertToCSV(csvData),
        `${basename}_${timestamp}.csv`,
        'text/csv'
      );
      break;
      
    case 'excel':
      const excelData = Array.isArray(data) ? data : [data];
      // Format dates for Excel export to prevent auto-conversion
      const formattedExcelData = excelData.map(row => {
        const formattedRow = { ...row };
        Object.keys(formattedRow).forEach(key => {
          if (key.toLowerCase().includes('date') || key.toLowerCase().includes('on')) {
            formattedRow[key] = formatDateForExport(formattedRow[key]);
          }
        });
        return formattedRow;
      });
      
      const worksheet = XLSX.utils.json_to_sheet(formattedExcelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Auto-size columns and format date columns as text
      const colWidths = Object.keys(formattedExcelData[0] || {}).map((key) => ({ 
        wch: key.toLowerCase().includes('date') || key.toLowerCase().includes('on') ? 12 : 20 
      }));
      worksheet['!cols'] = colWidths;
      
      // Set date columns to text format
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const header = XLSX.utils.encode_col(col) + '1';
        const headerCell = worksheet[header];
        if (headerCell && (headerCell.v?.toLowerCase().includes('date') || headerCell.v?.toLowerCase().includes('on'))) {
          for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
            if (worksheet[cellAddr]) {
              worksheet[cellAddr].t = 's'; // Force text format
            }
          }
        }
      }
      
      XLSX.writeFile(workbook, `${basename}_${timestamp}.xlsx`);
      break;
  }
};

// Universal import function
export const importFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        
        switch (fileExtension) {
          case 'json':
            if (typeof content === 'string') {
              resolve(JSON.parse(content));
            } else {
              reject(new Error('Invalid JSON file content'));
            }
            break;
            
          case 'csv':
            if (typeof content === 'string') {
              resolve(parseCSV(content));
            } else {
              reject(new Error('Invalid CSV file content'));
            }
            break;
            
          case 'xlsx':
          case 'xls':
            if (content instanceof ArrayBuffer) {
              const workbook = XLSX.read(content);
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              const rawData = XLSX.utils.sheet_to_json(worksheet);
              
              // Process dates from Excel import
              const processedData = rawData.map((row: any) => {
                const processedRow = { ...row };
                Object.keys(processedRow).forEach(key => {
                  if (key.toLowerCase().includes('date') || key.toLowerCase().includes('on')) {
                    processedRow[key] = parseDateFromImport(processedRow[key]);
                  }
                });
                return processedRow;
              });
              
              resolve(processedData);
            } else {
              reject(new Error('Invalid Excel file content'));
            }
            break;
            
          default:
            reject(new Error(`Unsupported file format: ${fileExtension}`));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    // Read file based on extension
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

// Master Resume specific transformations
export const transformMasterResumeForExport = (resume: ResumeMaster, format: ExportFormat): any => {
  if (format === 'json') {
    return resume;
  }
  
  // Flatten for CSV/Excel export
  const flattened = [];
  
  // Contact information
  flattened.push({
    section: 'Contact',
    type: 'contact',
    data: JSON.stringify(resume.contacts),
    ...resume.contacts
  });
  
  // Professional headline
  if (resume.headline) {
    flattened.push({
      section: 'Headline',
      type: 'headline',
      data: resume.headline
    });
  }
  
  // Summary
  resume.summary?.forEach((item, index) => {
    flattened.push({
      section: 'Summary',
      type: 'summary',
      order: index + 1,
      data: item
    });
  });
  
  // Key achievements
  resume.key_achievements?.forEach((item, index) => {
    flattened.push({
      section: 'Key Achievements',
      type: 'achievement',
      order: index + 1,
      data: item
    });
  });
  
  // Experience - using actual type structure
  resume.experience?.forEach((exp, index) => {
    flattened.push({
      section: 'Experience',
      type: 'experience',
      order: index + 1,
      company: exp.company,
      title: exp.title,
      location: exp.location,
      startDate: exp.date_start,
      endDate: exp.date_end,
      bullets: exp.bullets?.join('|') || '',
      tags: exp.tags?.join('|') || '',
      data: JSON.stringify(exp)
    });
  });
  
  // Education - using actual type structure
  resume.education?.forEach((edu, index) => {
    flattened.push({
      section: 'Education',
      type: 'education',
      order: index + 1,
      school: edu.school,
      degree: edu.degree,
      location: edu.location,
      year: edu.year,
      data: JSON.stringify(edu)
    });
  });
  
  // Awards - using actual type structure
  resume.awards?.forEach((award, index) => {
    flattened.push({
      section: 'Awards',
      type: 'award',
      order: index + 1,
      title: award.title,
      date: award.date,
      description: award.description,
      data: JSON.stringify(award)
    });
  });
  
  // Skills
  resume.skills?.primary?.forEach((skill, index) => {
    flattened.push({
      section: 'Skills',
      type: 'skill_primary',
      order: index + 1,
      skill: skill,
      data: skill
    });
  });
  
  resume.skills?.secondary?.forEach((skill, index) => {
    flattened.push({
      section: 'Skills',
      type: 'skill_secondary',
      order: index + 1,
      skill: skill,
      data: skill
    });
  });
  
  return flattened;
};

// Transform flattened data back to master resume structure
export const transformFlattenedToMasterResume = (flatData: any[]): Partial<ResumeMaster> => {
  const resume: Partial<ResumeMaster> = {
    summary: [],
    key_achievements: [],
    experience: [],
    education: [],
    awards: [],
    skills: { primary: [], secondary: [] }
  };
  
  flatData.forEach(item => {
    switch (item.type) {
      case 'contact':
        if (item.data && typeof item.data === 'string') {
          try {
            resume.contacts = JSON.parse(item.data);
          } catch {
            // Fallback to individual fields
            resume.contacts = {
              email: item.email || '',
              phone: item.phone || '',
              website: item.website || '',
              linkedin: item.linkedin || ''
            };
          }
        }
        break;
        
      case 'headline':
        resume.headline = item.data;
        break;
        
      case 'summary':
        resume.summary!.push(item.data);
        break;
        
      case 'achievement':
        resume.key_achievements!.push(item.data);
        break;
        
      case 'experience':
        try {
          const exp = JSON.parse(item.data);
          resume.experience!.push(exp);
        } catch {
          // Fallback to individual fields using correct type structure
          resume.experience!.push({
            id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            company: item.company,
            title: item.title,
            location: item.location,
            date_start: item.startDate,
            date_end: item.endDate || null,
            bullets: item.bullets?.split('|') || [],
            tags: item.tags?.split('|') || []
          });
        }
        break;
        
      case 'education':
        try {
          const edu = JSON.parse(item.data);
          resume.education!.push(edu);
        } catch {
          resume.education!.push({
            id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            school: item.school,
            degree: item.degree,
            location: item.location,
            year: item.year
          });
        }
        break;
        
      case 'award':
        try {
          const award = JSON.parse(item.data);
          resume.awards!.push(award);
        } catch {
          resume.awards!.push({
            id: `award_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: item.title,
            date: item.date,
            description: item.description
          });
        }
        break;
        
      case 'skill_primary':
        resume.skills!.primary.push(item.skill || item.data);
        break;
        
      case 'skill_secondary':
        resume.skills!.secondary!.push(item.skill || item.data);
        break;
    }
  });
  
  // Remove duplicates and sort
  resume.summary = [...new Set(resume.summary)];
  resume.key_achievements = [...new Set(resume.key_achievements)];
  resume.skills!.primary = [...new Set(resume.skills!.primary)];
  resume.skills!.secondary = [...new Set(resume.skills!.secondary || [])];
  
  return resume;
};

// Validate imported data
export const validateImportedData = (data: any, expectedType: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data) {
    errors.push('No data provided');
    return { isValid: false, errors };
  }
  
  switch (expectedType) {
    case 'masterResume':
      if (Array.isArray(data)) {
        // Flattened format from CSV/Excel
        const hasValidSections = data.some(item => item.section && item.type);
        if (!hasValidSections) {
          errors.push('Invalid master resume format - missing section information');
        }
      } else if (typeof data === 'object') {
        // JSON format
        const requiredFields = ['id', 'owner'];
        requiredFields.forEach(field => {
          if (!data[field]) {
            errors.push(`Missing required field: ${field}`);
          }
        });
      } else {
        errors.push('Invalid data format');
      }
      break;
      
    case 'jobApplications':
      if (!Array.isArray(data)) {
        errors.push('Job applications must be an array');
      } else {
        data.forEach((job, index) => {
          if (!job.company || !job.role) {
            errors.push(`Job application ${index + 1}: missing company or role`);
          }
        });
      }
      break;
      
    case 'coverLetters':
      if (!Array.isArray(data)) {
        errors.push('Cover letters must be an array');
      } else {
        data.forEach((letter, index) => {
          if (!letter.title || !letter.content) {
            errors.push(`Cover letter ${index + 1}: missing title or content`);
          }
        });
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

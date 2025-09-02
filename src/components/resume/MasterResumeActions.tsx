import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import { 
  Download, 
  Upload, 
  FileJson, 
  Save,
  FileText
} from 'lucide-react';
import {
  exportMasterResumeSections,
  importMasterResumeSections,
  downloadAsJSON,
  validateImportData,
  MasterResumeSections,
  MasterResumeExportData
} from '@/lib/masterResumeUtils';

const sectionLabels: Record<MasterResumeSections, string> = {
  contacts: 'Contact Information',
  headline: 'Professional Headline',
  summary: 'Professional Summary',
  key_achievements: 'Key Achievements',
  experience: 'Work Experience',
  education: 'Education',
  awards: 'Awards & Certifications',
  skills: 'Skills',
  sections: 'Section Settings'
};

interface MasterResumeActionsProps {
  className?: string;
}

export function MasterResumeActions({ className }: MasterResumeActionsProps) {
  const { masterResume, setMasterResume } = useResume();
  const { toast } = useToast();
  
  const [exportSections, setExportSections] = useState<MasterResumeSections[]>([
    'contacts', 'headline', 'summary', 'key_achievements', 'experience', 'education', 'awards', 'skills'
  ]);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  if (!masterResume) {
    return null;
  }

  const handleExportSections = () => {
    if (exportSections.length === 0) {
      toast({
        title: "No Sections Selected",
        description: "Please select at least one section to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      const exportData = exportMasterResumeSections(masterResume, exportSections);
      const filename = `master-resume-${exportSections.join('-')}-${new Date().toISOString().slice(0, 10)}.json`;
      
      downloadAsJSON(exportData, filename);
      
      toast({
        title: "Export Successful",
        description: `Exported ${exportSections.length} section(s) to ${filename}`,
      });
      
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the resume sections.",
        variant: "destructive",
      });
    }
  };

  const handleFullExport = () => {
    const allSections: MasterResumeSections[] = [
      'contacts', 'headline', 'summary', 'key_achievements', 'experience', 'education', 'awards', 'skills', 'sections'
    ];
    
    const exportData = exportMasterResumeSections(masterResume, allSections);
    const filename = `master-resume-complete-${new Date().toISOString().slice(0, 10)}.json`;
    
    downloadAsJSON(exportData, filename);
    
    toast({
      title: "Full Export Complete",
      description: `Complete master resume exported to ${filename}`,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        const validation = validateImportData(importData);
        
        if (!validation.isValid) {
          toast({
            title: "Invalid Import File",
            description: validation.errors.join(', '),
            variant: "destructive",
          });
          return;
        }

        const updatedResume = importMasterResumeSections(
          masterResume,
          importData as MasterResumeExportData,
          importMode
        );
        
        setMasterResume(updatedResume);
        
        toast({
          title: "Import Successful",
          description: `Successfully imported ${importData.sections?.length || 'unknown'} section(s) in ${importMode} mode.`,
        });
        
        setShowImportDialog(false);
      } catch (error) {
        console.error('Import failed:', error);
        toast({
          title: "Import Failed",
          description: "Invalid file format or corrupted data.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handleSectionExportChange = (section: MasterResumeSections, checked: boolean) => {
    setExportSections(prev => 
      checked 
        ? [...prev, section]
        : prev.filter(s => s !== section)
    );
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {/* Quick Actions */}
      <Button
        onClick={handleFullExport}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        Export All
      </Button>

      {/* Custom Export */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileJson className="w-4 h-4 mr-2" />
            Export Sections
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Resume Sections</DialogTitle>
            <DialogDescription>
              Select which sections of your master resume to export.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Sections to Export:</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(Object.keys(sectionLabels) as MasterResumeSections[]).map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={`export-${section}`}
                      checked={exportSections.includes(section)}
                      onCheckedChange={(checked) => 
                        handleSectionExportChange(section, !!checked)
                      }
                    />
                    <Label htmlFor={`export-${section}`} className="text-sm">
                      {sectionLabels[section]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setExportSections(Object.keys(sectionLabels) as MasterResumeSections[])}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Select All
              </Button>
              <Button
                onClick={() => setExportSections([])}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Clear All
              </Button>
            </div>

            <Button 
              onClick={handleExportSections}
              className="w-full"
              disabled={exportSections.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Selected Sections
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Resume Data</DialogTitle>
            <DialogDescription>
              Import sections from a previously exported master resume file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Import Mode:</Label>
              <Select value={importMode} onValueChange={(value: 'merge' | 'replace') => setImportMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merge">Merge (Add to existing data)</SelectItem>
                  <SelectItem value="replace">Replace (Overwrite existing data)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {importMode === 'merge' 
                  ? 'New data will be added to existing sections without removing current content.'
                  : 'Selected sections will be completely replaced with imported data.'
                }
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="import-file" className="text-sm font-medium">
                Select Import File:
              </Label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-muted-foreground
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-medium
                         file:bg-primary file:text-primary-foreground
                         hover:file:bg-primary/90
                         cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Only JSON files exported from this application are supported.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
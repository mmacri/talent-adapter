import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Download, 
  Upload, 
  Save, 
  Trash2,
  FileJson
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import {
  exportSingleSection,
  importSingleSection,
  clearSectionData,
  downloadAsJSON,
  validateImportData,
  MasterResumeSections,
  SectionExportData
} from '@/lib/masterResumeUtils';

interface SectionActionsProps {
  section: MasterResumeSections;
  sectionTitle: string;
  onSave?: () => void;
  className?: string;
}

export function SectionActions({ 
  section, 
  sectionTitle, 
  onSave, 
  className 
}: SectionActionsProps) {
  const { masterResume, setMasterResume } = useResume();
  const { toast } = useToast();
  const [showClearDialog, setShowClearDialog] = useState(false);

  if (!masterResume) {
    return null;
  }

  const handleSaveSection = () => {
    if (onSave) {
      onSave();
    }
    
    // Update the master resume to trigger save
    setMasterResume({
      ...masterResume,
      updatedAt: new Date().toISOString()
    });

    toast({
      title: "Section Saved",
      description: `${sectionTitle} has been saved successfully.`,
    });
  };

  const handleExportSection = () => {
    try {
      const sectionData = exportSingleSection(masterResume, section);
      const filename = `resume-${section}-${new Date().toISOString().slice(0, 10)}.json`;
      
      downloadAsJSON(sectionData, filename);
      
      toast({
        title: "Export Successful",
        description: `${sectionTitle} exported to ${filename}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: `Failed to export ${sectionTitle}.`,
        variant: "destructive",
      });
    }
  };

  const handleImportSection = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // Check if it's a single section export
        if (!importData.section || importData.section !== section) {
          toast({
            title: "Wrong Section Type",
            description: `This file contains data for '${importData.section}' but you're trying to import to '${section}'.`,
            variant: "destructive",
          });
          return;
        }

        const updatedResume = importSingleSection(
          masterResume,
          importData as SectionExportData,
          'merge' // Default to merge for single sections
        );
        
        setMasterResume(updatedResume);
        
        toast({
          title: "Import Successful",
          description: `Successfully imported data to ${sectionTitle}.`,
        });
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

  const handleClearSection = () => {
    try {
      const clearedResume = clearSectionData(masterResume, section);
      setMasterResume(clearedResume);
      
      toast({
        title: "Section Cleared",
        description: `All data in ${sectionTitle} has been cleared.`,
      });
      
      setShowClearDialog(false);
    } catch (error) {
      console.error('Clear failed:', error);
      toast({
        title: "Clear Failed",
        description: `Failed to clear ${sectionTitle}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleSaveSection}>
            <Save className="w-4 h-4 mr-2" />
            Save Section
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleExportSection}>
            <Download className="w-4 h-4 mr-2" />
            Export Section
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <label className="flex items-center w-full cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Import Section
              <input
                type="file"
                accept=".json"
                onChange={handleImportSection}
                className="hidden"
              />
            </label>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowClearDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Section
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear {sectionTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove all data from the {sectionTitle} section. 
              This action cannot be undone. Consider exporting the section first as a backup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Section
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
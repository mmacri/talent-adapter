import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import { Download, Upload, FileArchive } from 'lucide-react';
import { exportBackup, importBackup } from '@/lib/backupUtils';
import { resumeStorage, jobsStorage, coverLettersStorage } from '@/lib/storage';

export default function Settings() {
  const { toast } = useToast();
  const {
    masterResume,
    variants,
    jobApplications,
    coverLetters,
    setMasterResume,
    refreshData,
  } = useResume();

  const [exportOptions, setExportOptions] = React.useState({
    masterResume: true,
    variants: true,
    jobApplications: true,
    coverLetters: true,
  });

  const [importOptions, setImportOptions] = React.useState({
    masterResume: false,
    variants: false,
    jobApplications: false,
    coverLetters: false,
  });

  const handleExport = async () => {
    try {
      const data = {
        ...(exportOptions.masterResume && { masterResume }),
        ...(exportOptions.variants && { variants }),
        ...(exportOptions.jobApplications && { jobApplications }),
        ...(exportOptions.coverLetters && { coverLetters }),
      };

      await exportBackup(data);
      
      toast({
        title: "Export Successful",
        description: "Your backup has been downloaded as a ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error creating the backup file.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importBackup(file)
      .then((data) => {
        if (importOptions.masterResume && data.masterResume) {
          setMasterResume(data.masterResume);
        }
        if (importOptions.variants && data.variants) {
          resumeStorage.setVariants(data.variants);
        }
        if (importOptions.jobApplications && data.jobApplications) {
          jobsStorage.setAll(data.jobApplications);
        }
        if (importOptions.coverLetters && data.coverLetters) {
          coverLettersStorage.setAll(data.coverLetters);
        }

        // Refresh the context data
        refreshData();

        toast({
          title: "Import Successful",
          description: "Your data has been restored from the backup.",
        });
      })
      .catch(() => {
        toast({
          title: "Import Failed",
          description: "There was an error reading the backup file.",
          variant: "destructive",
        });
      });

    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and backup your data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Backup
            </CardTitle>
            <CardDescription>
              Create a ZIP backup of your selected data for safekeeping.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select data to export:</Label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-master"
                    checked={exportOptions.masterResume}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, masterResume: !!checked }))
                    }
                  />
                  <Label htmlFor="export-master" className="text-sm">
                    Master Resume
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-variants"
                    checked={exportOptions.variants}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, variants: !!checked }))
                    }
                  />
                  <Label htmlFor="export-variants" className="text-sm">
                    Resume Variants ({variants.length})
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-jobs"
                    checked={exportOptions.jobApplications}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, jobApplications: !!checked }))
                    }
                  />
                  <Label htmlFor="export-jobs" className="text-sm">
                    Job Applications ({jobApplications.length})
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-covers"
                    checked={exportOptions.coverLetters}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, coverLetters: !!checked }))
                    }
                  />
                  <Label htmlFor="export-covers" className="text-sm">
                    Cover Letters ({coverLetters.length})
                  </Label>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleExport}
              className="w-full"
              disabled={!Object.values(exportOptions).some(Boolean)}
            >
              <FileArchive className="w-4 h-4 mr-2" />
              Download Backup ZIP
            </Button>
          </CardContent>
        </Card>

        {/* Import Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Backup
            </CardTitle>
            <CardDescription>
              Restore your data from a previously created backup ZIP file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select data to import:</Label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-master"
                    checked={importOptions.masterResume}
                    onCheckedChange={(checked) =>
                      setImportOptions(prev => ({ ...prev, masterResume: !!checked }))
                    }
                  />
                  <Label htmlFor="import-master" className="text-sm">
                    Master Resume
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-variants"
                    checked={importOptions.variants}
                    onCheckedChange={(checked) =>
                      setImportOptions(prev => ({ ...prev, variants: !!checked }))
                    }
                  />
                  <Label htmlFor="import-variants" className="text-sm">
                    Resume Variants
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-jobs"
                    checked={importOptions.jobApplications}
                    onCheckedChange={(checked) =>
                      setImportOptions(prev => ({ ...prev, jobApplications: !!checked }))
                    }
                  />
                  <Label htmlFor="import-jobs" className="text-sm">
                    Job Applications
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-covers"
                    checked={importOptions.coverLetters}
                    onCheckedChange={(checked) =>
                      setImportOptions(prev => ({ ...prev, coverLetters: !!checked }))
                    }
                  />
                  <Label htmlFor="import-covers" className="text-sm">
                    Cover Letters
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-file" className="text-sm font-medium">
                Choose backup file:
              </Label>
              <input
                id="import-file"
                type="file"
                accept=".zip"
                onChange={handleImport}
                className="block w-full text-sm text-muted-foreground
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-medium
                         file:bg-primary file:text-primary-foreground
                         hover:file:bg-primary/90
                         cursor-pointer"
                disabled={!Object.values(importOptions).some(Boolean)}
              />
              {!Object.values(importOptions).some(Boolean) && (
                <p className="text-xs text-muted-foreground">
                  Select at least one data type to import.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
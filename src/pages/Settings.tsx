import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import { Download, Upload, FileArchive, Database, Settings2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { exportBackup, importBackup } from '@/lib/backupUtils';
import { resumeStorage, jobsStorage, coverLettersStorage } from '@/lib/storage';
import mikeResumeData from '@/lib/mikeResumeData';

export default function Settings() {
  const { toast } = useToast();
  const {
    masterResume,
    variants,
    jobApplications,
    coverLetters,
    setMasterResume,
    refreshData,
    clearMasterResumeSection,
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

  const handleLoadMikeResume = () => {
    // Import the transformation function from LoadMikeResume page
    const loadMikeResumeData = () => {
      const now = new Date().toISOString();
      return {
        id: 'master-resume-mike',
        owner: mikeResumeData.name,
        contacts: mikeResumeData.contact,
        headline: 'Strategic Partner Development Leader & Solution Advisory Expert',
        summary: [mikeResumeData.professional_summary],
        key_achievements: mikeResumeData.key_achievements.map(achievement => achievement.details),
        experience: mikeResumeData.experience.map((exp, index) => {
          // Convert MM/YYYY to YYYY-MM format for proper Date parsing
          const convertDateFormat = (dateStr: string) => {
            if (!dateStr) return null;
            const [month, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}`;
          };

          const dateStart = exp.dates.split(' – ')[0];
          const dateEnd = exp.dates.split(' – ')[1];
          
          return {
            id: `exp-${index + 1}`,
            company: exp.company,
            title: exp.title,
            location: exp.location,
            date_start: convertDateFormat(dateStart),
            date_end: dateEnd === '05/2025' ? null : convertDateFormat(dateEnd),
            bullets: exp.responsibilities,
            tags: []
          };
        }),
        education: mikeResumeData.education.map((edu, index) => ({
          id: `edu-${index + 1}`,
          degree: edu.degree,
          school: edu.institution,
          location: edu.location,
          year: ''
        })),
        awards: mikeResumeData.awards.map((award, index) => ({
          id: `award-${index + 1}`,
          title: award.split(' – ')[0],
          date: award.split(' – ')[1] || '',
          description: ''
        })),
        certifications: [
          {
            id: 'cert-mike-1',
            name: 'Technical Alliance Management Certification',
            issuer: 'VMware',
            date: '2020-01',
            description: 'Advanced partner alliance and technical solution expertise'
          }
        ],
        skills: {
          primary: ['Partner Development', 'Strategic Alliances', 'Cross-functional Leadership'],
          secondary: ['VMware Technologies', 'ServiceNow Platform', 'Cloud Solutions']
        },
        sections: {
          summary: { enabled: true, order: 1 },
          key_achievements: { enabled: true, order: 2 },
          experience: { enabled: true, order: 3 },
          education: { enabled: true, order: 4 },
          awards: { enabled: true, order: 5 },
          certifications: { enabled: true, order: 6 },
          skills: { enabled: true, order: 7 }
        },
        createdAt: now,
        updatedAt: now
      };
    };
    
    const data = loadMikeResumeData();
    setMasterResume(data);
    toast({
      title: "Resume Loaded Successfully",
      description: "Mike's resume data has been loaded as your master resume.",
    });
  };

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
          Manage your application settings and resume data.
        </p>
      </div>

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <FileArchive className="w-4 h-4" />
            Backup & Import
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Load Resume Data
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Data Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Load Sample Resume Data
              </CardTitle>
              <CardDescription>
                Load Mike's sample resume data to get started quickly with the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Sample Resume Data
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This will load a complete resume for Mike Macri, MBA, with experience in 
                      partner development, solution advisory, and technical account management. 
                      Perfect for testing the application features.
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <p>• Complete professional profile with contact information</p>
                      <p>• 6 positions of work experience with detailed accomplishments</p>
                      <p>• Education history and professional awards</p>
                      <p>• Key achievements and skills sections</p>
                    </div>
                  </div>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Load Sample Resume Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Load Sample Resume Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will replace your current master resume with Mike's sample data. 
                      If you have existing resume data, consider exporting a backup first.
                      This action will not affect your variants, job applications, or cover letters.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLoadMikeResume}>
                      Load Sample Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Master Resume Data Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>Master Resume Data Management</CardTitle>
              <CardDescription>
                Clear specific sections of your master resume to remove all data and start fresh.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Clear Individual Sections:</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'contacts', label: 'Contact Information' },
                      { id: 'headline', label: 'Professional Headline' },
                      { id: 'summary', label: 'Professional Summary' },
                      { id: 'key_achievements', label: 'Key Achievements' },
                      { id: 'experience', label: 'Work Experience' },
                      { id: 'education', label: 'Education' },
                      { id: 'awards', label: 'Awards & Certifications' },
                      { id: 'skills', label: 'Skills' },
                    ].map((section) => (
                      <AlertDialog key={section.id}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear {section.label}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear {section.label}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove all data from the {section.label} section of your master resume. 
                              This action cannot be undone. Consider exporting the section first as a backup.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                clearMasterResumeSection(section.id);
                                toast({
                                  title: "Section Cleared",
                                  description: `${section.label} has been cleared successfully.`,
                                });
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Clear Section
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Bulk Actions:</Label>
                  <div className="space-y-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Resume Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear Entire Master Resume?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove ALL data from your master resume, including contacts, 
                            summary, experience, education, awards, and skills. This action cannot be undone.
                            Consider creating a full backup first.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              ['contacts', 'headline', 'summary', 'key_achievements', 'experience', 'education', 'awards', 'skills'].forEach(section => {
                                clearMasterResumeSection(section);
                              });
                              toast({
                                title: "All Sections Cleared",
                                description: "All master resume data has been cleared successfully.",
                              });
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Clear All Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
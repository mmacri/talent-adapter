import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Download, 
  FileText, 
  Layers,
  Calendar,
  Tag,
  Settings,
  Copy
} from 'lucide-react';
import { ResumeMaster } from '@/types/resume';
import { VariantResolver } from '@/lib/variantResolver';
import { DocxExporter } from '@/lib/docxExport';
import ResumePreview from '@/components/resume/ResumePreview';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ResumeViewer = () => {
  const resumeContext = useResume();
  const { toast } = useToast();
  
  // Add loading guard
  if (!resumeContext || resumeContext.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading resume viewer...</p>
        </div>
      </div>
    );
  }

  const { masterResume, variants } = resumeContext;
  const [selectedResumeId, setSelectedResumeId] = useState<string>('master');

  if (!masterResume) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Master Resume Found</h3>
          <p className="text-muted-foreground">Please create a master resume first.</p>
        </div>
      </div>
    );
  }

  // Get the currently selected resume (master or resolved variant)
  const getSelectedResume = (): { resume: ResumeMaster; variant?: any } => {
    if (selectedResumeId === 'master') {
      return { resume: masterResume };
    }
    
    const variant = variants.find(v => v.id === selectedResumeId);
    if (!variant) {
      return { resume: masterResume };
    }
    
    const resolvedResume = VariantResolver.resolveVariant(masterResume, variant);
    return { resume: resolvedResume, variant };
  };

  const { resume: selectedResume, variant: selectedVariant } = getSelectedResume();

  const handleExport = async () => {
    try {
      const filename = selectedVariant 
        ? `${masterResume.owner.replace(/\s+/g, '-')}_${selectedVariant.name.replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.docx`
        : `${masterResume.owner.replace(/\s+/g, '-')}_Master_Resume_${format(new Date(), 'yyyy-MM-dd')}.docx`;
      
      await DocxExporter.exportResume(selectedResume, selectedVariant, filename);
      
      toast({
        title: "Resume Exported",
        description: `${selectedVariant ? selectedVariant.name : 'Master Resume'} has been downloaded as a Word document.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedResume, null, 2));
      toast({
        title: "JSON Copied",
        description: "Resume data has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getResumeStats = (resume: ResumeMaster) => {
    const enabledSections = Object.values(resume.sections || {}).filter(section => section.enabled).length;
    const totalExperience = resume.experience?.length || 0;
    const totalBullets = resume.experience?.reduce((sum, exp) => sum + exp.bullets.length, 0) || 0;
    const totalSummaryPoints = resume.summary?.length || 0;
    const totalAchievements = resume.key_achievements?.length || 0;

    return {
      enabledSections,
      totalExperience,
      totalBullets,
      totalSummaryPoints,
      totalAchievements
    };
  };

  const stats = getResumeStats(selectedResume);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Viewer</h1>
          <p className="text-muted-foreground">
            Preview and export your master resume or any variant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Word
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Selection & Info */}
        <div className="space-y-6">
          {/* Resume Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Select Resume Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a resume version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Master Resume
                    </div>
                  </SelectItem>
                  {variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        {variant.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedVariant && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-1">{selectedVariant.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedVariant.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Updated {format(new Date(selectedVariant.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Resume Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.enabledSections}</p>
                  <p className="text-xs text-muted-foreground">Sections</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.totalExperience}</p>
                  <p className="text-xs text-muted-foreground">Positions</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.totalBullets}</p>
                  <p className="text-xs text-muted-foreground">Bullets</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.totalSummaryPoints}</p>
                  <p className="text-xs text-muted-foreground">Summary</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Key Achievements:</span>
                  <Badge variant="secondary">{stats.totalAchievements}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Education Entries:</span>
                  <Badge variant="secondary">{selectedResume.education?.length || 0}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Awards:</span>
                  <Badge variant="secondary">{selectedResume.awards?.length || 0}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Skills Categories:</span>
                  <Badge variant="secondary">
                    {(selectedResume.skills?.primary?.length || 0) + (selectedResume.skills?.secondary?.length || 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ResumePreview 
                masterResume={selectedResume}
                variant={selectedVariant}
                triggerText="Full Preview"
                triggerVariant="outline"
                triggerIcon={<Eye className="w-4 h-4" />}
              />
              
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to Word
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCopyJson}
                className="w-full justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
                {selectedVariant && (
                  <Badge variant="secondary" className="ml-2">
                    Variant: {selectedVariant.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[800px] overflow-y-auto">
                {/* Header Section */}
                <div className="text-center space-y-2 pb-4 border-b">
                  <h1 className="text-2xl font-bold">{selectedResume.owner}</h1>
                  <p className="text-lg text-muted-foreground">{selectedResume.headline}</p>
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedResume.contacts.email}</span>
                    <span>•</span>
                    <span>{selectedResume.contacts.phone}</span>
                    {selectedResume.contacts.linkedin && (
                      <>
                        <span>•</span>
                        <span>LinkedIn</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Dynamic Sections based on enabled status and order */}
                {Object.entries(selectedResume.sections || {})
                  .filter(([_, section]) => section.enabled)
                  .sort(([_, a], [__, b]) => a.order - b.order)
                  .map(([sectionKey]) => (
                    <div key={sectionKey} className="space-y-3">
                      {sectionKey === 'summary' && selectedResume.summary && selectedResume.summary.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold border-b pb-1">Professional Summary</h3>
                          <ul className="space-y-2">
                            {selectedResume.summary.map((item, index) => (
                              <li key={index} className="text-sm leading-relaxed">• {item}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {sectionKey === 'key_achievements' && selectedResume.key_achievements && selectedResume.key_achievements.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold border-b pb-1">Key Achievements</h3>
                          <ul className="space-y-2">
                            {selectedResume.key_achievements.map((item, index) => (
                              <li key={index} className="text-sm leading-relaxed">• {item}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {sectionKey === 'experience' && selectedResume.experience && selectedResume.experience.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold border-b pb-1">Experience</h3>
                          <div className="space-y-4">
                            {selectedResume.experience.map((exp) => (
                              <div key={exp.id} className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{exp.title}</h4>
                                    <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {exp.date_start} - {exp.date_end || 'Present'}
                                  </span>
                                </div>
                                <ul className="space-y-1 ml-4">
                                  {exp.bullets.map((bullet, index) => (
                                    <li key={index} className="text-sm">• {bullet}</li>
                                  ))}
                                </ul>
                                {exp.tags.length > 0 && (
                                  <div className="flex gap-1 flex-wrap ml-4">
                                    {exp.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {sectionKey === 'education' && selectedResume.education && selectedResume.education.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold border-b pb-1">Education</h3>
                          <div className="space-y-2">
                            {selectedResume.education.map((edu) => (
                              <div key={edu.id} className="flex justify-between">
                                <div>
                                  <p className="font-medium">{edu.degree}</p>
                                  <p className="text-muted-foreground">{edu.school} • {edu.location}</p>
                                </div>
                                {edu.year && (
                                  <span className="text-sm text-muted-foreground">{edu.year}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {sectionKey === 'awards' && selectedResume.awards && selectedResume.awards.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold border-b pb-1">Awards</h3>
                          <div className="space-y-2">
                            {selectedResume.awards.map((award) => (
                              <div key={award.id} className="flex justify-between">
                                <div>
                                  <p className="font-medium">{award.title}</p>
                                  {award.description && (
                                    <p className="text-sm text-muted-foreground">{award.description}</p>
                                  )}
                                </div>
                                {award.date && (
                                  <span className="text-sm text-muted-foreground">{award.date}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {sectionKey === 'skills' && selectedResume.skills && (
                        <>
                          <h3 className="text-lg font-semibold border-b pb-1">Skills</h3>
                          <div className="space-y-2">
                            {selectedResume.skills.primary && selectedResume.skills.primary.length > 0 && (
                              <div>
                                <p className="font-medium text-sm mb-2">Primary Skills</p>
                                <div className="flex gap-2 flex-wrap">
                                  {selectedResume.skills.primary.map((skill, index) => (
                                    <Badge key={index} variant="secondary">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedResume.skills.secondary && selectedResume.skills.secondary.length > 0 && (
                              <div>
                                <p className="font-medium text-sm mb-2">Secondary Skills</p>
                                <div className="flex gap-2 flex-wrap">
                                  {selectedResume.skills.secondary.map((skill, index) => (
                                    <Badge key={index} variant="outline">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
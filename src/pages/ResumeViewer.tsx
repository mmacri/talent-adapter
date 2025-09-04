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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  Download, 
  FileText, 
  Layers,
  Calendar,
  Tag,
  Settings,
  Copy,
  AlertCircle,
  Shuffle,
  Filter,
  Edit3,
  TrendingUp,
  TrendingDown
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
  const [selectedResumeId, setSelectedResumeId] = useState<string>('master');
  
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

  // Date formatting helper (consistent with ResumePreview)  
  const formatDateRange = (startDate: string, endDate: string | null) => {
    // Parse date string and format directly without Date constructor to avoid timezone issues
    const formatDateString = (dateStr: string) => {
      if (!dateStr) return null;
      
      // Handle MM/YYYY format
      if (dateStr.includes('/')) {
        const [month, year] = dateStr.split('/');
        const monthNum = parseInt(month, 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[monthNum - 1]} ${year}`;
      }
      
      // Handle YYYY-MM format  
      if (/^\d{4}-\d{2}$/.test(dateStr)) {
        const [year, month] = dateStr.split('-');
        const monthNum = parseInt(month, 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[monthNum - 1]} ${year}`;
      }
      
      // Return as-is for other formats
      return dateStr;
    };

    try {
      const start = formatDateString(startDate) || startDate;
      const end = endDate ? (formatDateString(endDate) || endDate) : 'Present';
      
      return `${start} - ${end}`;
    } catch (error) {
      console.error('Date formatting error:', error, { startDate, endDate });
      // Fallback to original strings if formatting fails
      return `${startDate} - ${endDate || 'Present'}`;
    }
  };

  // Helper function to render resume content
  const renderResumeContent = (resume: ResumeMaster, variant?: any, isCompact = false) => (
    <div className={`space-y-${isCompact ? '4' : '6'}`}>
      {/* Header Section */}
      <div className="text-center space-y-2 pb-4 border-b">
        <h1 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-bold`}>{resume.owner}</h1>
        <p className={`${isCompact ? 'text-base' : 'text-lg'} text-muted-foreground`}>{resume.headline}</p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{resume.contacts.email}</span>
          <span>•</span>
          <span>{resume.contacts.phone}</span>
          {resume.contacts.website && (
            <>
              <span>•</span>
              <span>{resume.contacts.website}</span>
            </>
          )}
          {resume.contacts.linkedin && (
            <>
              <span>•</span>
              <span>{resume.contacts.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sections based on enabled status and order */}
      {Object.entries(resume.sections || {})
        .filter(([_, section]) => section.enabled)
        .sort(([_, a], [__, b]) => a.order - b.order)
        .map(([sectionKey]) => (
          <div key={sectionKey} className="space-y-3">
            {sectionKey === 'summary' && resume.summary && resume.summary.length > 0 && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Professional Summary</h3>
                <ul className="space-y-2">
                  {resume.summary.map((item, index) => (
                    <li key={index} className="text-sm leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </>
            )}
            
            {sectionKey === 'key_achievements' && resume.key_achievements && resume.key_achievements.length > 0 && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Key Achievements</h3>
                <ul className="space-y-2">
                  {resume.key_achievements.map((item, index) => (
                    <li key={index} className="text-sm leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </>
            )}
            
            {sectionKey === 'experience' && resume.experience && resume.experience.length > 0 && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Experience</h3>
                <div className={`space-y-${isCompact ? '3' : '4'}`}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDateRange(exp.date_start, exp.date_end)}
                        </span>
                      </div>
                      <ul className="space-y-1 ml-4">
                        {exp.bullets.slice(0, isCompact ? 3 : exp.bullets.length).map((bullet, index) => (
                          <li key={index} className="text-sm">• {bullet}</li>
                        ))}
                        {isCompact && exp.bullets.length > 3 && (
                          <li className="text-sm text-muted-foreground">... and {exp.bullets.length - 3} more</li>
                        )}
                      </ul>
                      {exp.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap ml-4">
                          {exp.tags.slice(0, isCompact ? 3 : exp.tags.length).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {isCompact && exp.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{exp.tags.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {sectionKey === 'education' && resume.education && resume.education.length > 0 && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Education</h3>
                <div className="space-y-2">
                  {resume.education.map((edu) => (
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
            
            {sectionKey === 'awards' && resume.awards && resume.awards.length > 0 && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Awards</h3>
                <div className="space-y-2">
                  {resume.awards.map((award) => (
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
            
            {sectionKey === 'certifications' && resume.certifications && resume.certifications.length > 0 && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Certifications</h3>
                <div className="space-y-2">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-sm text-muted-foreground">{cert.description}</p>
                        )}
                      </div>
                      {cert.date && (
                        <span className="text-sm text-muted-foreground">{cert.date}</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {sectionKey === 'skills' && resume.skills && (resume.skills.primary?.length > 0 || resume.skills.secondary?.length > 0) && (
              <>
                <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold border-b pb-1`}>Skills</h3>
                <div className="space-y-3">
                  {resume.skills.primary && resume.skills.primary.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Primary Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {resume.skills.primary.map((skill, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {resume.skills.secondary && resume.skills.secondary.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Additional Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {resume.skills.secondary.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
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
  );

  // Helper function to handle export for a specific resume
  const handleExportResume = async (resume: ResumeMaster, variant?: any) => {
    try {
      const filename = variant 
        ? `${resume.owner.replace(/\s+/g, '-')}_${variant.name.replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.docx`
        : `${resume.owner.replace(/\s+/g, '-')}_Master_Resume_${format(new Date(), 'yyyy-MM-dd')}.docx`;
      
      await DocxExporter.exportResume(resume, variant, filename);
      
      toast({
        title: "Resume Exported",
        description: `${variant ? variant.name : 'Master Resume'} has been downloaded as a Word document.`,
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

  // Helper function to handle copy JSON for a specific resume
  const handleCopyResumeJson = async (resume: ResumeMaster, variant?: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(resume, null, 2));
      toast({
        title: "JSON Copied",
        description: `${variant ? variant.name : 'Master Resume'} data has been copied to your clipboard.`,
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

  // Get all resume versions (master + resolved variants)
  const getAllResumeVersions = () => {
    type ResumeVersion = {
      id: string;
      name: string;
      description: string;
      resume: ResumeMaster;
      variant: any;
      type: 'master' | 'variant';
      diff?: any;
    };

    const versions: ResumeVersion[] = [
      {
        id: 'master',
        name: 'Master Resume',
        description: 'Original base resume with all content',
        resume: masterResume,
        variant: null,
        type: 'master'
      }
    ];

    variants.forEach(variant => {
      const resolvedResume = VariantResolver.resolveVariant(masterResume, variant);
      const diff = VariantResolver.generateDiff(masterResume, resolvedResume, variant);
      versions.push({
        id: variant.id,
        name: variant.name,
        description: variant.description,
        resume: resolvedResume,
        variant,
        type: 'variant',
        diff
      });
    });

    return versions;
  };

  // Helper function to render diff summary
  const renderDiffSummary = (diff: any) => {
    if (!diff) return null;

    const hasChanges = 
      diff.sections.removed.length > 0 ||
      diff.sections.added.length > 0 ||
      diff.sections.reordered.length > 0 ||
      diff.experiences.removed.length > 0 ||
      diff.experiences.reordered ||
      diff.experiences.modified.length > 0 ||
      diff.content.headline.changed ||
      diff.content.summary.changed ||
      diff.content.keyAchievements.changed ||
      diff.rules.applied.length > 0 ||
      diff.overrides.applied.length > 0;

    if (!hasChanges) {
      return (
        <Alert className="border-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No visible differences from master resume
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        {/* Applied Rules */}
        {diff.rules.applied.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Applied Rules ({diff.rules.applied.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diff.rules.applied.map((rule: any, index: number) => (
                <div key={index} className="text-sm space-y-1">
                  <div className="font-medium text-primary">{rule.description}</div>
                  <div className="text-muted-foreground text-xs">{rule.impact}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Applied Overrides */}
        {diff.overrides.applied.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Applied Overrides ({diff.overrides.applied.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diff.overrides.applied.map((override: any, index: number) => (
                <div key={index} className="text-sm space-y-1">
                  <div className="font-medium text-primary">{override.description}</div>
                  <div className="text-muted-foreground text-xs">Path: {override.path}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Section Changes */}
        {(diff.sections.removed.length > 0 || diff.sections.added.length > 0 || diff.sections.reordered.length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Section Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diff.sections.removed.map((section: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-3 h-3 text-destructive" />
                  <span className="text-destructive">Hidden: {section}</span>
                </div>
              ))}
              {diff.sections.added.map((section: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Shown: {section}</span>
                </div>
              ))}
              {diff.sections.reordered.map((change: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Shuffle className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-600">{change}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Experience Changes */}
        {(diff.experiences.removed.length > 0 || diff.experiences.reordered || diff.experiences.modified.length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Experience Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diff.experiences.removed.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-destructive">
                    Filtered Out ({diff.experiences.removed.length}):
                  </div>
                  {diff.experiences.removed.map((exp: any, index: number) => (
                    <div key={index} className="ml-4 text-sm space-y-1">
                      <div className="font-medium">{exp.title} at {exp.company}</div>
                      <div className="text-muted-foreground text-xs">Reason: {exp.reason}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {diff.experiences.reordered && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shuffle className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-600 font-medium">Experience order modified</span>
                  </div>
                  <div className="ml-6 text-xs text-muted-foreground">
                    {diff.stats.resolvedExperiences} experiences reordered
                  </div>
                </div>
              )}
              
              {diff.experiences.modified.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600">
                    Modified ({diff.experiences.modified.length}):
                  </div>
                  {diff.experiences.modified.map((exp: any, index: number) => (
                    <div key={index} className="ml-4 text-sm space-y-1">
                      <div className="font-medium">{exp.title} at {exp.company}</div>
                      <ul className="text-muted-foreground text-xs list-disc ml-4">
                        {exp.changes.map((change: string, changeIndex: number) => (
                          <li key={changeIndex}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Content Changes */}
        {(diff.content.headline.changed || diff.content.summary.changed || diff.content.keyAchievements.changed) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Content Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diff.content.headline.changed && (
                <div className="text-sm space-y-1">
                  <div className="font-medium text-primary">Headline modified</div>
                  <div className="text-muted-foreground text-xs">
                    From: "{diff.content.headline.original}" → To: "{diff.content.headline.modified}"
                  </div>
                </div>
              )}
              {diff.content.summary.changed && (
                <div className="text-sm space-y-1">
                  <div className="font-medium text-primary">Summary points changed</div>
                  <div className="text-muted-foreground text-xs">
                    {diff.content.summary.originalCount} → {diff.content.summary.modifiedCount} points 
                    ({diff.content.summary.difference > 0 ? '+' : ''}{diff.content.summary.difference})
                  </div>
                </div>
              )}
              {diff.content.keyAchievements.changed && (
                <div className="text-sm space-y-1">
                  <div className="font-medium text-primary">Key achievements changed</div>
                  <div className="text-muted-foreground text-xs">
                    {diff.content.keyAchievements.originalCount} → {diff.content.keyAchievements.modifiedCount} achievements 
                    ({diff.content.keyAchievements.difference > 0 ? '+' : ''}{diff.content.keyAchievements.difference})
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statistics Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Experiences</div>
              <div className="text-muted-foreground text-xs">
                {diff.stats.resolvedExperiences} of {diff.stats.masterExperiences} 
                {diff.stats.experienceReduction > 0 && ` (-${diff.stats.experienceReduction})`}
              </div>
            </div>
            <div>
              <div className="font-medium">Total Bullets</div>
              <div className="text-muted-foreground text-xs">
                {diff.stats.totalBulletsResolved} of {diff.stats.totalBulletsOriginal}
                {diff.stats.bulletReduction > 0 && ` (-${diff.stats.bulletReduction})`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const allVersions = getAllResumeVersions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Viewer</h1>
          <p className="text-muted-foreground">
            View all your resume versions with complete content for easy comparison and export
          </p>
        </div>
      </div>

      {/* All Resume Versions */}
      <div className="space-y-8">
        {allVersions.map((version) => (
          <Card key={version.id} className="w-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {version.type === 'master' ? (
                    <FileText className="w-6 h-6 text-primary" />
                  ) : (
                    <Layers className="w-6 h-6 text-secondary-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-xl">{version.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{version.description}</p>
                    {version.variant && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        Updated {format(new Date(version.variant.updatedAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ResumePreview 
                    masterResume={version.resume}
                    variant={version.variant}
                    triggerText="Full Preview"
                    triggerVariant="outline"
                    triggerIcon={<Eye className="w-4 h-4" />}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportResume(version.resume, version.variant)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyResumeJson(version.resume, version.variant)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy JSON
                  </Button>
                </div>
              </div>
              
              {/* Diff Summary for Variants */}
              {version.type === 'variant' && version.diff && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  {renderDiffSummary(version.diff)}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto border rounded-lg p-4 bg-background/50">
                {renderResumeContent(version.resume, version.variant, true)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allVersions.length === 1 && (
        <Card className="text-center py-8">
          <CardContent>
            <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Variants Created</h3>
            <p className="text-muted-foreground">
              Create resume variants to see multiple versions here for easy comparison.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeViewer;
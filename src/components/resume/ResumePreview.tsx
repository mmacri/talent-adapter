import { useState } from 'react';
import { ResumeMaster, Variant } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Copy, 
  Download, 
  Eye, 
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Linkedin,
  MapPin,
  Calendar
} from 'lucide-react';
import { DocxExporter } from '@/lib/docxExport';
import { VariantResolver } from '@/lib/variantResolver';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ResumePreviewProps {
  masterResume: ResumeMaster;
  variant?: Variant;
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const ResumePreview = ({ 
  masterResume, 
  variant, 
  triggerText = "Preview", 
  triggerIcon = <Eye className="w-4 h-4" />,
  triggerVariant = "outline"
}: ResumePreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  // Resolve the resume (apply variant rules if variant is provided)
  const resolvedResume = variant 
    ? VariantResolver.resolveVariant(masterResume, variant)
    : masterResume;

  // Filter sections based on master resume section settings
  const getFilteredResume = (resume: ResumeMaster) => {
    if (!resume.sections) return resume;
    
    const filtered = { ...resume };
    
    // Only include enabled sections
    if (!resume.sections.summary?.enabled) filtered.summary = [];
    if (!resume.sections.key_achievements?.enabled) filtered.key_achievements = [];
    if (!resume.sections.experience?.enabled) filtered.experience = [];
    if (!resume.sections.education?.enabled) filtered.education = [];
    if (!resume.sections.awards?.enabled) filtered.awards = [];
    if (!resume.sections.skills?.enabled) filtered.skills = { primary: [] };
    
    return filtered;
  };

  const displayResume = getFilteredResume(resolvedResume);

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = format(new Date(startDate), 'MMM yyyy');
    const end = endDate ? format(new Date(endDate), 'MMM yyyy') : 'Present';
    return `${start} - ${end}`;
  };

  const handleCopyToClipboard = async () => {
    setIsCopying(true);
    try {
      // Create a text version of the resume
      const resumeText = generateResumeText(displayResume);
      await navigator.clipboard.writeText(resumeText);
      
      toast({
        title: "Resume Copied",
        description: "The resume has been copied to your clipboard.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = variant 
        ? `${masterResume.owner.replace(/\s+/g, '-')}_${variant.name.replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.docx`
        : `${masterResume.owner.replace(/\s+/g, '-')}_Master_Resume_${format(new Date(), 'yyyy-MM-dd')}.docx`;
      
      await DocxExporter.exportResume(displayResume, variant, fileName);
      
      toast({
        title: "Resume Downloaded",
        description: `${variant ? `"${variant.name}"` : "Master resume"} has been downloaded as a Word document.`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateResumeText = (resume: ResumeMaster): string => {
    let text = '';
    
    // Header
    text += `${resume.owner}\n`;
    text += `${resume.headline}\n\n`;
    
    // Contact Info
    if (resume.contacts.email) text += `Email: ${resume.contacts.email}\n`;
    if (resume.contacts.phone) text += `Phone: ${resume.contacts.phone}\n`;
    if (resume.contacts.website) text += `Website: ${resume.contacts.website}\n`;
    if (resume.contacts.linkedin) text += `LinkedIn: ${resume.contacts.linkedin}\n`;
    text += '\n';
    
    // Summary
    if (resume.summary && resume.summary.length > 0) {
      text += 'PROFESSIONAL SUMMARY\n';
      text += '===================\n';
      resume.summary.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += '\n';
    }
    
    // Key Achievements
    if (resume.key_achievements && resume.key_achievements.length > 0) {
      text += 'KEY ACHIEVEMENTS\n';
      text += '================\n';
      resume.key_achievements.forEach(achievement => {
        text += `• ${achievement}\n`;
      });
      text += '\n';
    }
    
    // Experience
    if (resume.experience && resume.experience.length > 0) {
      text += 'PROFESSIONAL EXPERIENCE\n';
      text += '=======================\n';
      resume.experience.forEach(exp => {
        text += `${exp.title}\n`;
        text += `${exp.company}${exp.location ? ` | ${exp.location}` : ''}\n`;
        text += `${formatDateRange(exp.date_start, exp.date_end)}\n`;
        exp.bullets.forEach(bullet => {
          text += `• ${bullet}\n`;
        });
        text += '\n';
      });
    }
    
    // Education
    if (resume.education && resume.education.length > 0) {
      text += 'EDUCATION\n';
      text += '=========\n';
      resume.education.forEach(edu => {
        text += `${edu.degree}\n`;
        text += `${edu.school}${edu.location ? ` | ${edu.location}` : ''}\n\n`;
      });
    }
    
    // Awards
    if (resume.awards && resume.awards.length > 0) {
      text += 'AWARDS & RECOGNITION\n';
      text += '====================\n';
      resume.awards.forEach(award => {
        text += `• ${award.title}${award.date ? ` - ${award.date}` : ''}\n`;
      });
      text += '\n';
    }
    
    // Skills
    if (resume.skills && resume.skills.primary && resume.skills.primary.length > 0) {
      text += 'CORE SKILLS\n';
      text += '===========\n';
      text += resume.skills.primary.join(' • ');
      text += '\n';
    }
    
    return text;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          {triggerIcon}
          {triggerText && <span className="ml-2">{triggerText}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Resume Preview {variant && `- ${variant.name}`}
          </DialogTitle>
          <DialogDescription>
            {variant 
              ? `Preview of "${variant.name}" variant with rules applied`
              : "Preview of master resume"
            }
          </DialogDescription>
        </DialogHeader>
        
        {/* Actions Bar */}
        <div className="flex gap-2 pb-4 border-b">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyToClipboard}
            disabled={isCopying}
          >
            {isCopying ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {isCopying ? "Copied!" : "Copy Text"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Word
          </Button>
          {variant && (
            <Badge variant="secondary" className="ml-auto">
              {variant.rules.length} rule{variant.rules.length !== 1 ? 's' : ''} applied
            </Badge>
          )}
        </div>

        {/* Resume Content */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Header */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {displayResume.owner}
                </CardTitle>
                <p className="text-lg text-muted-foreground">
                  {displayResume.headline}
                </p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                  {displayResume.contacts.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{displayResume.contacts.email}</span>
                    </div>
                  )}
                  {displayResume.contacts.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{displayResume.contacts.phone}</span>
                    </div>
                  )}
                  {displayResume.contacts.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{displayResume.contacts.website}</span>
                    </div>
                  )}
                  {displayResume.contacts.linkedin && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="w-3 h-3" />
                      <span>LinkedIn</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Summary */}
            {displayResume.summary && displayResume.summary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {displayResume.summary.map((bullet, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Key Achievements */}
            {displayResume.key_achievements && displayResume.key_achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {displayResume.key_achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {displayResume.experience && displayResume.experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Professional Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {displayResume.experience.map((exp, index) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <MapPin className="w-3 h-3" />
                                <span>{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateRange(exp.date_start, exp.date_end)}</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-1 ml-4">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {exp.tags && exp.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {exp.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {index < displayResume.experience.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {displayResume.skills?.primary && displayResume.skills.primary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Core Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {displayResume.skills.primary.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {displayResume.education && displayResume.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayResume.education.map((edu, index) => (
                    <div key={edu.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{edu.school}</span>
                          {edu.location && (
                            <>
                              <MapPin className="w-3 h-3" />
                              <span>{edu.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Awards */}
            {displayResume.awards && displayResume.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Awards & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {displayResume.awards.map((award) => (
                      <li key={award.id} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          {award.title}
                          {award.date && (
                            <span className="text-muted-foreground"> - {award.date}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResumePreview;
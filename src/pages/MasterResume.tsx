import React, { useState, useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  History, 
  FileJson,
  Search,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Copy,
  Settings,
  Layout,
  Lightbulb,
  Target,
  Briefcase,
  User,
  GraduationCap,
  Trophy,
  Wrench,
  Award as AwardIcon,
  Menu
} from 'lucide-react';
import { ResumeMaster, Experience } from '@/types/resume';
import { ContentTree } from '@/components/resume/ContentTree';
import { TipTapEditor } from '@/components/resume/TipTapEditor';
import { TagManager } from '@/components/resume/TagManager';
import { GlobalTagManager } from '@/components/resume/GlobalTagManager';
import { SectionEditor } from '@/components/resume/SectionEditor';
import { SortableExperienceList } from '@/components/resume/SortableExperienceList';
import { MasterResumeActions } from '@/components/resume/MasterResumeActions';
import { HelpCard } from '@/components/ui/help-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
// import { SectionActions } from '@/components/resume/SectionActions';
import { DocxExporter } from '@/lib/docxExport';
import ResumePreview from '@/components/resume/ResumePreview';
import { useToast } from '@/hooks/use-toast';
import { MasterResumeSections } from '@/lib/masterResumeUtils';

const MasterResume = () => {
  const resumeContext = useResume();
  const [selectedSection, setSelectedSection] = useState<string>('contacts');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Get masterResume and setMasterResume safely
  const masterResume = resumeContext?.masterResume || null;
  const setMasterResume = resumeContext?.setMasterResume || (() => {});

  const handleSave = useCallback(() => {
    if (masterResume) {
      setMasterResume({
        ...masterResume,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      toast({
        title: "Resume Saved",
        description: "Your master resume has been saved successfully.",
      });
    }
  }, [masterResume, setMasterResume, toast]);

  const handleCopyJson = useCallback(async () => {
    if (!masterResume) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(masterResume, null, 2));
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
  }, [masterResume, toast]);

  const handleSectionToggle = useCallback((sectionKey: string, enabled: boolean) => {
    if (!masterResume) return;
    
    setMasterResume({
      ...masterResume,
      sections: {
        ...masterResume.sections,
        [sectionKey]: {
          ...masterResume.sections[sectionKey],
          enabled
        }
      },
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  }, [masterResume, setMasterResume]);

  const handleSectionOrderChange = useCallback((sectionKey: string, order: number) => {
    if (!masterResume) return;
    
    setMasterResume({
      ...masterResume,
      sections: {
        ...masterResume.sections,
        [sectionKey]: {
          ...masterResume.sections[sectionKey],
          order
        }
      },
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  }, [masterResume, setMasterResume]);

  // Add loading guard AFTER all hooks
  if (!resumeContext || resumeContext.isLoading || !masterResume) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading master resume...</p>
        </div>
      </div>
    );
  }

  const handleFieldUpdate = (field: string, value: any) => {
    if (!masterResume) return;
    
    setMasterResume({
      ...masterResume,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  };

  const handleExperienceUpdate = (experienceId: string, updates: Partial<Experience>) => {
    if (!masterResume) return;
    
    const updatedExperience = masterResume.experience.map(exp => 
      exp.id === experienceId ? { ...exp, ...updates } : exp
    );
    
    handleFieldUpdate('experience', updatedExperience);
  };

  const addExperience = () => {
    if (!masterResume) return;
    
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: 'New Company',
      title: 'New Position',
      location: '',
      date_start: new Date().toISOString().slice(0, 7), // YYYY-MM format
      date_end: null,
      bullets: ['New responsibility or achievement'],
      tags: []
    };
    
    handleFieldUpdate('experience', [...masterResume.experience, newExp]);
  };

  const deleteExperience = (experienceId: string) => {
    if (!masterResume) return;
    
    const filteredExperience = masterResume.experience.filter(exp => exp.id !== experienceId);
    handleFieldUpdate('experience', filteredExperience);
  };

  const handleExperienceReorder = (reorderedExperiences: Experience[]) => {
    if (!masterResume) return;
    handleFieldUpdate('experience', reorderedExperiences);
  };

  const handleExport = async () => {
    if (!masterResume) return;
    
    try {
      await DocxExporter.exportResume(masterResume);
      toast({
        title: "Resume Exported",
        description: "Your master resume has been downloaded as a Word document.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sections = [
    { 
      id: 'contacts', 
      title: 'Contact Information', 
      icon: User,
      enabled: true,
      order: 0
    },
    { 
      id: 'summary', 
      title: 'Professional Summary', 
      icon: Edit3,
      enabled: masterResume?.sections?.summary?.enabled ?? true,
      order: masterResume?.sections?.summary?.order ?? 1
    },
    { 
      id: 'key_achievements', 
      title: 'Key Achievements', 
      icon: Plus,
      enabled: masterResume?.sections?.key_achievements?.enabled ?? true,
      order: masterResume?.sections?.key_achievements?.order ?? 2
    },
    { 
      id: 'experience', 
      title: 'Experience', 
      icon: Edit3,
      enabled: masterResume?.sections?.experience?.enabled ?? true,
      order: masterResume?.sections?.experience?.order ?? 3
    },
    { 
      id: 'education', 
      title: 'Education', 
      icon: Edit3,
      enabled: masterResume?.sections?.education?.enabled ?? true,
      order: masterResume?.sections?.education?.order ?? 4
    },
    { 
      id: 'certifications', 
      title: 'Certifications', 
      icon: AwardIcon,
      enabled: masterResume?.sections?.certifications?.enabled ?? true,
      order: masterResume?.sections?.certifications?.order ?? 6
    },
    { 
      id: 'skills', 
      title: 'Skills', 
      icon: Tag,
      enabled: masterResume?.sections?.skills?.enabled ?? true,
      order: masterResume?.sections?.skills?.order ?? 6
    },
  ].sort((a, b) => a.order - b.order);

  const handleContactUpdate = (field: keyof typeof masterResume.contacts, value: string) => {
    if (!masterResume) return;
    
    setMasterResume({
      ...masterResume,
      contacts: {
        ...masterResume.contacts,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  };

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Master Resume</h2>
            <InfoTooltip content="Your comprehensive resume containing all experience and skills. This is the foundation for creating targeted variants." />
          </div>
          <Button
            onClick={handleSave}
            disabled={!isEditing}
            size={isMobile ? "sm" : "default"}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            <Save className="w-4 h-4 mr-1" />
            {isMobile ? "" : "Save"}
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-base"
          />
        </div>
      </div>

      <ContentTree
        resume={masterResume}
        selectedSection={selectedSection}
        selectedItem={selectedItem}
        searchQuery={searchQuery}
        onSectionSelect={(section) => {
          setSelectedSection(section);
          if (isMobile) setShowSidebar(false);
        }}
        onItemSelect={setSelectedItem}
      />
      
      <div className="mt-auto p-4 border-t border-border">
        <div className="space-y-2">
          <GlobalTagManager 
            masterResume={masterResume}
            onMasterResumeUpdate={setMasterResume}
          />
          
          {masterResume && (
            <ResumePreview 
              masterResume={masterResume}
              triggerText={isMobile ? "Preview" : "Preview Resume"}
              triggerVariant="outline"
              triggerIcon={<Eye className="w-4 h-4" />}
            />
          )}
          
          <Dialog open={showSectionSettings} onOpenChange={setShowSectionSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start touch-target">
                <Layout className="w-4 h-4 mr-2" />
                {isMobile ? "Settings" : "Section Settings"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Section Visibility & Order
                </DialogTitle>
                <DialogDescription>
                  Control which sections appear in your master resume and their order
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid gap-4">
                  {sections.map((section) => (
                    <Card key={section.id} className={`p-4 ${!section.enabled ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <section.icon className="w-5 h-5" />
                          <div>
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Order: {section.order}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`order-${section.id}`} className="text-sm">
                              Order:
                            </Label>
                            <Input
                              id={`order-${section.id}`}
                              type="number"
                              min="1"
                              max="6"
                              value={section.order}
                              onChange={(e) => handleSectionOrderChange(section.id, parseInt(e.target.value) || 1)}
                              className="w-16"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`switch-${section.id}`} className="text-sm">
                              Include:
                            </Label>
                            <Switch
                              id={`switch-${section.id}`}
                              checked={section.enabled}
                              onCheckedChange={(enabled) => handleSectionToggle(section.id, enabled)}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {sections.filter(s => s.enabled).length} of {sections.length} sections enabled
                  </p>
                  <Button onClick={() => setShowSectionSettings(false)}>
                    Done
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start touch-target">
                <FileJson className="w-4 h-4 mr-2" />
                {isMobile ? "JSON" : "JSON View"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileJson className="w-5 h-5" />
                  Master Resume JSON Data
                </DialogTitle>
                <DialogDescription>
                  Raw JSON data structure for your master resume
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyJson}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{JSON.stringify(masterResume, null, 2)}</code>
                </pre>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );

  return (
    <div className={`${isMobile ? 'flex flex-col h-screen' : 'flex h-screen'} bg-background`}>
      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
          <SheetContent side="left" className="w-80 p-0 bg-card">
            <SheetHeader className="sr-only">
              <SheetTitle>Master Resume Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <SidebarContent />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div className="p-4 border-b border-border bg-card safe-top">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="touch-target"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!isEditing}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary-hover"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-accent to-accent"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold truncate">{masterResume.owner}</h1>
              <p className="text-sm text-muted-foreground truncate">{masterResume.headline}</p>
            </div>
            {isEditing && (
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 text-xs">
                  Unsaved Changes
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="p-6 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{masterResume.owner}</h1>
                <p className="text-muted-foreground">{masterResume.headline}</p>
              </div>
              <div className="flex gap-2">
                <MasterResumeActions className="flex-shrink-0" />
                
                {masterResume && (
                  <ResumePreview 
                    masterResume={masterResume}
                    triggerText="Preview"
                    triggerVariant="outline"
                    triggerIcon={<Eye className="w-4 h-4" />}
                  />
                )}
                
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="bg-gradient-to-r from-accent to-accent hover:from-accent/80 hover:to-accent/80"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export to Word
                </Button>
                
                {isEditing && (
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    Unsaved Changes
                  </Badge>
                )}
                <Badge variant="outline">
                  Last updated: {new Date(masterResume.updatedAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 overflow-auto safe-bottom">
          <Tabs value={selectedSection} onValueChange={setSelectedSection} className="h-full">
            <div className="border-b border-border bg-muted/50">
              <TabsList className={`h-auto p-2 bg-transparent ${isMobile ? 'w-full overflow-x-auto' : ''}`}>
                {sections.filter(section => section.enabled).map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className={`flex items-center gap-2 data-[state=active]:bg-background touch-target ${
                      isMobile ? 'text-xs px-2 py-2 min-w-max flex-shrink-0' : ''
                    }`}
                  >
                    <section.icon className="w-4 h-4 flex-shrink-0" />
                    <span className={isMobile ? 'whitespace-nowrap' : ''}>{section.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className={isMobile ? 'p-4 mobile-spacing' : 'p-6'}>
              <TabsContent value="contacts" className="mt-0">
                <HelpCard 
                  title="Contact Information Tips" 
                  icon={User}
                  defaultVisible={false}
                >
                  <ul className="space-y-1 text-sm">
                    <li>• Use a professional email address</li>
                    <li>• Include your phone number with area code</li>
                    <li>• Add your LinkedIn profile URL</li>
                    <li>• Include your website or portfolio if relevant</li>
                    <li>• Keep contact information current and professional</li>
                  </ul>
                </HelpCard>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Contact Information</h3>
                    <p className="text-muted-foreground">Your professional contact details</p>
                  </div>
                </div>

                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                          id="full-name"
                          value={masterResume.owner}
                          onChange={(e) => handleFieldUpdate('owner', e.target.value)}
                          placeholder="Your full name"
                          className="text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="headline">Professional Headline</Label>
                        <Input
                          id="headline"
                          value={masterResume.headline}
                          onChange={(e) => handleFieldUpdate('headline', e.target.value)}
                          placeholder="e.g. Senior Software Engineer"
                          className="text-base"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={masterResume.contacts.email}
                          onChange={(e) => handleContactUpdate('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={masterResume.contacts.phone}
                          onChange={(e) => handleContactUpdate('phone', e.target.value)}
                          placeholder="(555) 123-4567"
                          className="text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={masterResume.contacts.website || ''}
                          onChange={(e) => handleContactUpdate('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          value={masterResume.contacts.linkedin || ''}
                          onChange={(e) => handleContactUpdate('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="text-base"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <h4 className="font-medium">Professional Contact Tips</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Use a professional email that includes your name</li>
                          <li>• Ensure your LinkedIn profile is complete and up-to-date</li>
                          <li>• Only include a personal website if it showcases relevant work</li>
                          <li>• Double-check all contact information for accuracy</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                <HelpCard 
                  title="Professional Summary Tips" 
                  icon={User}
                  defaultVisible={!masterResume.summary || masterResume.summary.length === 0}
                >
                  <ul className="space-y-1 text-sm">
                    <li>• Write in first person without using "I"</li>
                    <li>• Highlight your most valuable skills and experience</li>
                    <li>• Keep it concise - 3-4 sentences maximum</li>
                    <li>• Include quantifiable achievements when possible</li>
                  </ul>
                </HelpCard>

                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-xl font-semibold">Professional Summary</h3>
                     <p className="text-muted-foreground">A brief overview of your professional background and expertise</p>
                   </div>
                   {/* <SectionActions
                     section="summary"
                     sectionTitle="Professional Summary"
                     onSave={() => handleSave()}
                   /> */}
                 </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.summary}
                  onUpdate={(content) => handleFieldUpdate('summary', content)}
                  type="list"
                />
              </TabsContent>

              <TabsContent value="key_achievements" className="mt-0">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-xl font-semibold">Key Achievements</h3>
                     <p className="text-muted-foreground">Your most significant professional accomplishments</p>
                   </div>
                   {/* <SectionActions
                     section="key_achievements"
                     sectionTitle="Key Achievements"
                     onSave={() => handleSave()}
                   /> */}
                 </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.key_achievements}
                  onUpdate={(content) => handleFieldUpdate('key_achievements', content)}
                  type="list"
                />
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <HelpCard 
                  title="Experience Section Best Practices" 
                  icon={Briefcase}
                  defaultVisible={!masterResume.experience || masterResume.experience.length === 0}
                >
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Use action verbs:</strong> "Developed", "Led", "Achieved", "Implemented"</li>
                    <li>• <strong>Quantify results:</strong> Include percentages, dollar amounts, team sizes</li>
                    <li>• <strong>Be comprehensive:</strong> Add all positions, even if not used in every variant</li>
                    <li>• <strong>Add tags:</strong> Use tags to group related experience for variant filtering</li>
                  </ul>
                </HelpCard>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Work Experience</h3>
                      <p className="text-muted-foreground">Your professional work history</p>
                    </div>
                     <div className="flex items-center gap-2">
                       {/* <SectionActions
                         section="experience"
                         sectionTitle="Work Experience"
                         onSave={() => handleSave()}
                       /> */}
                       <Button 
                          onClick={addExperience} 
                          className={`bg-gradient-to-r from-accent to-accent touch-target ${isMobile ? 'text-sm px-3' : ''}`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {isMobile ? "Add" : "Add Experience"}
                        </Button>
                     </div>
                  </div>

                  {masterResume.experience.length > 0 ? (
                    <SortableExperienceList
                      experiences={masterResume.experience}
                      onReorder={handleExperienceReorder}
                      onExperienceUpdate={handleExperienceUpdate}
                      onExperienceDelete={deleteExperience}
                    />
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="py-12 text-center">
                        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No work experience added yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your work experience to build your comprehensive master resume
                        </p>
                        <Button 
                          onClick={addExperience} 
                          className={`bg-gradient-to-r from-accent to-accent touch-target ${isMobile ? 'text-sm' : ''}`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {isMobile ? "Add Experience" : "Add Your First Experience"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <HelpCard 
                  title="Education Section Guide" 
                  icon={GraduationCap}
                  defaultVisible={false}
                >
                  <div className="space-y-2 text-sm">
                    <p>Include degrees, certifications, and relevant coursework:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Degree type, major/field of study</li>
                      <li>• Institution name and location</li>
                      <li>• Graduation year (or expected)</li>
                      <li>• Relevant certifications and completion dates</li>
                    </ul>
                  </div>
                </HelpCard>

                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-xl font-semibold">Education</h3>
                     <p className="text-muted-foreground">Your educational background and qualifications</p>
                   </div>
                   {/* <SectionActions
                     section="education"
                     sectionTitle="Education"
                     onSave={() => handleSave()}
                   /> */}
                 </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.education}
                  onUpdate={(content) => handleFieldUpdate('education', content)}
                  type="education"
                />
              </TabsContent>

              <TabsContent value="awards" className="mt-0">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-xl font-semibold">Awards & Recognition</h3>
                     <p className="text-muted-foreground">Professional awards and recognition you've received</p>
                   </div>
                   {/* <SectionActions
                     section="awards"
                     sectionTitle="Awards & Recognition"
                     onSave={() => handleSave()}
                   /> */}
                 </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.awards}
                  onUpdate={(content) => handleFieldUpdate('awards', content)}
                  type="awards"
                />
              </TabsContent>

              <TabsContent value="certifications" className="mt-0">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-xl font-semibold">Certifications</h3>
                     <p className="text-muted-foreground">Professional certifications and credentials</p>
                   </div>
                 </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.certifications}
                  onUpdate={(content) => handleFieldUpdate('certifications', content)}
                  type="certifications"
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <HelpCard 
                  title="Skills Section Strategy" 
                  icon={Wrench}
                  defaultVisible={false}
                >
                  <div className="space-y-2 text-sm">
                    <p><strong>Primary Skills:</strong> Your core competencies and main technical skills</p>
                    <p><strong>Secondary Skills:</strong> Supporting skills and technologies you're familiar with</p>
                    <div className="mt-2">
                      <p>💡 <strong>Tip:</strong> List skills you actually use - variants can filter these based on job requirements</p>
                    </div>
                  </div>
                </HelpCard>

                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-xl font-semibold">Skills & Expertise</h3>
                     <p className="text-muted-foreground">Your key skills and areas of expertise</p>
                   </div>
                 </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.skills}
                  onUpdate={(content) => handleFieldUpdate('skills', content)}
                  type="skills"
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MasterResume;
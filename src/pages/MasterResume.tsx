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
  Layout
} from 'lucide-react';
import { ResumeMaster, Experience } from '@/types/resume';
import { ContentTree } from '@/components/resume/ContentTree';
import { TipTapEditor } from '@/components/resume/TipTapEditor';
import { TagManager } from '@/components/resume/TagManager';
import { SectionEditor } from '@/components/resume/SectionEditor';
import { MasterResumeActions } from '@/components/resume/MasterResumeActions';
import { SectionActions } from '@/components/resume/SectionActions';
import { DocxExporter } from '@/lib/docxExport';
import ResumePreview from '@/components/resume/ResumePreview';
import { useToast } from '@/hooks/use-toast';
import { MasterResumeSections } from '@/lib/masterResumeUtils';

const MasterResume = () => {
  const resumeContext = useResume();
  const [selectedSection, setSelectedSection] = useState<string>('summary');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const { toast } = useToast();
  
  // Add loading guard
  if (!resumeContext || resumeContext.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading master resume...</p>
        </div>
      </div>
    );
  }

  const { masterResume, setMasterResume } = resumeContext;

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

  const handleCopyJson = async () => {
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
  };

  const handleSectionToggle = (sectionKey: string, enabled: boolean) => {
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
  };

  const handleSectionOrderChange = (sectionKey: string, order: number) => {
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
  };

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
      id: 'awards', 
      title: 'Awards', 
      icon: Plus,
      enabled: masterResume?.sections?.awards?.enabled ?? true,
      order: masterResume?.sections?.awards?.order ?? 5
    },
    { 
      id: 'skills', 
      title: 'Skills', 
      icon: Tag,
      enabled: masterResume?.sections?.skills?.enabled ?? true,
      order: masterResume?.sections?.skills?.order ?? 6
    },
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Content Tree */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Master Resume</h2>
            <Button
              onClick={handleSave}
              disabled={!isEditing}
              className="bg-gradient-to-r from-primary to-primary-hover"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ContentTree
          resume={masterResume}
          selectedSection={selectedSection}
          selectedItem={selectedItem}
          searchQuery={searchQuery}
          onSectionSelect={setSelectedSection}
          onItemSelect={setSelectedItem}
        />
        
        <div className="mt-auto p-4 border-t border-border">
          <div className="space-y-2">
            {masterResume && (
              <ResumePreview 
                masterResume={masterResume}
                triggerText="Preview Resume"
                triggerVariant="outline"
                triggerIcon={<Eye className="w-4 h-4" />}
              />
            )}
            
            <Dialog open={showSectionSettings} onOpenChange={setShowSectionSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Layout className="w-4 h-4 mr-2" />
                  Section Settings
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
                <Button variant="outline" className="w-full justify-start">
                  <FileJson className="w-4 h-4 mr-2" />
                  JSON View
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Enhanced with import/export actions */}
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

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          <Tabs value={selectedSection} onValueChange={setSelectedSection} className="h-full">
            <div className="border-b border-border bg-muted/50">
              <TabsList className="h-auto p-2 bg-transparent">
                {sections.filter(section => section.enabled).map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="summary" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Professional Summary</h3>
                    <p className="text-muted-foreground">A brief overview of your professional background and expertise</p>
                  </div>
                  <SectionActions
                    section="summary"
                    sectionTitle="Professional Summary"
                    onSave={() => handleSave()}
                  />
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
                  <SectionActions
                    section="key_achievements"
                    sectionTitle="Key Achievements"
                    onSave={() => handleSave()}
                  />
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
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Work Experience</h3>
                      <p className="text-muted-foreground">Your professional work history</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SectionActions
                        section="experience"
                        sectionTitle="Work Experience"
                        onSave={() => handleSave()}
                      />
                      <Button onClick={addExperience} className="bg-gradient-to-r from-accent to-accent">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {masterResume.experience.map((exp, index) => (
                      <Card key={exp.id} className="relative">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Input
                                value={exp.title}
                                onChange={(e) => handleExperienceUpdate(exp.id, { title: e.target.value })}
                                className="text-lg font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                              />
                              <Input
                                value={exp.company}
                                onChange={(e) => handleExperienceUpdate(exp.id, { company: e.target.value })}
                                className="text-primary bg-transparent border-0 p-0 h-auto focus-visible:ring-0 mt-1"
                              />
                              <div className="flex gap-2 mt-2">
                                <Input
                                  type="month"
                                  value={exp.date_start}
                                  onChange={(e) => handleExperienceUpdate(exp.id, { date_start: e.target.value })}
                                  className="w-32"
                                />
                                <span className="self-center text-muted-foreground">to</span>
                                <Input
                                  type="month"
                                  value={exp.date_end || ''}
                                  onChange={(e) => handleExperienceUpdate(exp.id, { date_end: e.target.value || null })}
                                  className="w-32"
                                  placeholder="Present"
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExperience(exp.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Responsibilities & Achievements</Label>
                              <TipTapEditor
                                content={exp.bullets}
                                onChange={(bullets) => handleExperienceUpdate(exp.id, { bullets })}
                                placeholder="Add your key responsibilities and achievements..."
                              />
                            </div>
                            
                            <TagManager
                              tags={exp.tags}
                              onTagsChange={(tags) => handleExperienceUpdate(exp.id, { tags })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Education</h3>
                    <p className="text-muted-foreground">Your educational background and qualifications</p>
                  </div>
                  <SectionActions
                    section="education"
                    sectionTitle="Education"
                    onSave={() => handleSave()}
                  />
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
                  <SectionActions
                    section="awards"
                    sectionTitle="Awards & Recognition"
                    onSave={() => handleSave()}
                  />
                </div>
                <SectionEditor
                  title=""
                  description=""
                  content={masterResume.awards}
                  onUpdate={(content) => handleFieldUpdate('awards', content)}
                  type="awards"
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Skills & Expertise</h3>
                    <p className="text-muted-foreground">Your key skills and areas of expertise</p>
                  </div>
                  <SectionActions
                    section="skills"
                    sectionTitle="Skills & Expertise"
                    onSave={() => handleSave()}
                  />
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
import { useState, useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Download
} from 'lucide-react';
import { ResumeMaster, Experience } from '@/types/resume';
import { ContentTree } from '@/components/resume/ContentTree';
import { TipTapEditor } from '@/components/resume/TipTapEditor';
import { TagManager } from '@/components/resume/TagManager';
import { SectionEditor } from '@/components/resume/SectionEditor';
import { DocxExporter } from '@/lib/docxExport';
import { useToast } from '@/hooks/use-toast';

const MasterResume = () => {
  const { masterResume, setMasterResume } = useResume();
  const [selectedSection, setSelectedSection] = useState<string>('summary');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  if (!masterResume) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading master resume...</p>
        </div>
      </div>
    );
  }

  const handleSave = useCallback(() => {
    if (masterResume) {
      setMasterResume({
        ...masterResume,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    }
  }, [masterResume, setMasterResume]);

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
    { id: 'summary', title: 'Professional Summary', icon: Edit3 },
    { id: 'achievements', title: 'Key Achievements', icon: Plus },
    { id: 'experience', title: 'Experience', icon: Edit3 },
    { id: 'education', title: 'Education', icon: Edit3 },
    { id: 'awards', title: 'Awards', icon: Plus },
    { id: 'skills', title: 'Skills', icon: Tag },
  ];

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
            <Button variant="outline" className="w-full justify-start">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileJson className="w-4 h-4 mr-2" />
              JSON View
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{masterResume.owner}</h1>
              <p className="text-muted-foreground">{masterResume.headline}</p>
            </div>
            <div className="flex gap-2">
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
                {sections.map((section) => (
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
                <SectionEditor
                  title="Professional Summary"
                  description="A brief overview of your professional background and expertise"
                  content={masterResume.summary}
                  onUpdate={(content) => handleFieldUpdate('summary', content)}
                  type="list"
                />
              </TabsContent>

              <TabsContent value="achievements" className="mt-0">
                <SectionEditor
                  title="Key Achievements"
                  description="Your most significant professional accomplishments"
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
                    <Button onClick={addExperience} className="bg-gradient-to-r from-accent to-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
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
                <SectionEditor
                  title="Education"
                  description="Your educational background and qualifications"
                  content={masterResume.education}
                  onUpdate={(content) => handleFieldUpdate('education', content)}
                  type="education"
                />
              </TabsContent>

              <TabsContent value="awards" className="mt-0">
                <SectionEditor
                  title="Awards & Recognition"
                  description="Professional awards and recognition you've received"
                  content={masterResume.awards}
                  onUpdate={(content) => handleFieldUpdate('awards', content)}
                  type="awards"
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <SectionEditor
                  title="Skills & Expertise"
                  description="Your key skills and areas of expertise"
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
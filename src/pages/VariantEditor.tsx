import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  ArrowLeft, 
  Download, 
  Eye, 
  Settings, 
  FileText,
  Diff,
  History
} from 'lucide-react';
import ResumePreview from '@/components/resume/ResumePreview';
import { Variant } from '@/types/resume';
import { DocxExporter } from '@/lib/docxExport';
import { VariantResolver } from '@/lib/variantResolver';
import { VariantRulesEditor } from '@/components/resume/VariantRulesEditor';
import { VariantOverridesEditor } from '@/components/resume/VariantOverridesEditor';

import { VariantSectionSettings } from '@/components/resume/VariantSectionSettings';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const VariantEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { masterResume, getVariant, updateVariant } = useResume();
  const { toast } = useToast();
  
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overrides');

  useEffect(() => {
    if (id) {
      const foundVariant = getVariant(id);
      if (foundVariant) {
        setVariant(foundVariant);
      } else {
        navigate('/variants');
        toast({
          title: "Variant Not Found",
          description: "The requested variant could not be found.",
          variant: "destructive",
        });
      }
    }
  }, [id, getVariant, navigate, toast]);

  if (!variant || !masterResume) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading variant...</p>
        </div>
      </div>
    );
  }

  const resolvedResume = VariantResolver.resolveVariant(masterResume, variant);
  const diff = VariantResolver.generateDiff(masterResume, resolvedResume);

  const handleSave = () => {
    if (variant) {
      updateVariant(variant.id, {
        ...variant,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      toast({
        title: "Variant Saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleFieldUpdate = (field: keyof Variant, value: any) => {
    if (!variant) return;
    
    setVariant({
      ...variant,
      [field]: value
    });
    setIsEditing(true);
  };

  const handleExport = async () => {
    if (!variant || !masterResume) return;

    try {
      await DocxExporter.exportResume(
        resolvedResume,
        variant,
        `${masterResume.owner.replace(/\s+/g, '-')}_${variant.name.replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.docx`
      );
      toast({
        title: "Variant Exported",
        description: `"${variant.name}" has been downloaded as a Word document.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the variant. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/variants')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{variant.name}</h1>
            <p className="text-muted-foreground">{variant.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              Unsaved Changes
            </Badge>
          )}
          <Button
            onClick={handleExport}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isEditing}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Variant Name</Label>
                <Input
                  id="name"
                  value={variant.name}
                  onChange={(e) => handleFieldUpdate('name', e.target.value)}
                  placeholder="Enter variant name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={variant.description || ''}
                  onChange={(e) => handleFieldUpdate('description', e.target.value)}
                  placeholder="Describe this variant's purpose..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuration Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Variant Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overrides" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Content & Overrides
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Sections
                  </TabsTrigger>
                  <TabsTrigger value="rules" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Rules
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="flex items-center gap-2">
                    <Diff className="w-4 h-4" />
                    Diff
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overrides" className="mt-6">
                  <VariantOverridesEditor
                    overrides={variant.overrides}
                    masterResume={masterResume}
                    onOverridesChange={(overrides) => handleFieldUpdate('overrides', overrides)}
                  />
                </TabsContent>

                <TabsContent value="sections" className="mt-6">
                  <VariantSectionSettings
                    sectionSettings={variant.sectionSettings}
                    onSectionSettingsChange={(settings) => handleFieldUpdate('sectionSettings', settings)}
                  />
                </TabsContent>

                <TabsContent value="rules" className="mt-6">
                  <VariantRulesEditor
                    rules={variant.rules}
                    onRulesChange={(rules) => handleFieldUpdate('rules', rules)}
                  />
                </TabsContent>


                <TabsContent value="diff" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Changes from Master Resume</h4>
                    
                    {diff.added.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-green-600">Added</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {diff.added.map((item, index) => (
                            <li key={index} className="text-green-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {diff.removed.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-red-600">Removed</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {diff.removed.map((item, index) => (
                            <li key={index} className="text-red-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {diff.modified.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-orange-600">Modified</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {diff.modified.map((item, index) => (
                            <li key={index} className="text-orange-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 && (
                      <p className="text-muted-foreground text-sm">No changes detected from master resume.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Quick Preview</h5>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {variant.rules.length} rules
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {variant.overrides.length} overrides
                    </Badge>
                  </div>
                </div>
                
                <ScrollArea className="h-80 border rounded-lg p-4 bg-muted/20">
                  <div className="space-y-4 text-sm">
                    <div className="text-center border-b pb-2">
                      <h4 className="font-semibold">{resolvedResume.owner}</h4>
                      <p className="text-muted-foreground text-xs">{resolvedResume.headline}</p>
                    </div>

                    {resolvedResume.summary && resolvedResume.summary.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2 text-primary">
                          Summary {variant.overrides.some(o => o.path === 'summary' && o.operation === 'set') && 
                          <Badge variant="secondary" className="ml-1 text-xs">Override</Badge>}
                        </h5>
                        <ul className="space-y-1 text-xs">
                          {resolvedResume.summary.map((bullet, index) => (
                            <li key={index}>• {bullet}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resolvedResume.key_achievements && resolvedResume.key_achievements.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2 text-primary">
                          Key Achievements {variant.overrides.some(o => o.path === 'key_achievements' && o.operation === 'set') && 
                          <Badge variant="secondary" className="ml-1 text-xs">Override</Badge>}
                        </h5>
                        <ul className="space-y-1 text-xs">
                          {resolvedResume.key_achievements.map((achievement, index) => (
                            <li key={index}>• {achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resolvedResume.experience && resolvedResume.experience.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2 text-primary">Experience ({resolvedResume.experience.length} positions)</h5>
                        <div className="space-y-3">
                          {resolvedResume.experience.map((exp, index) => (
                            <div key={exp.id} className="text-xs border-l-2 border-muted pl-2">
                              <p className="font-medium">{exp.title}</p>
                              <p className="text-muted-foreground">{exp.company} • {exp.date_start} - {exp.date_end || 'Present'}</p>
                              <ul className="mt-1 space-y-1">
                                {exp.bullets.map((bullet, bIndex) => (
                                  <li key={bIndex} className="text-muted-foreground">• {bullet.length > 60 ? bullet.substring(0, 60) + '...' : bullet}</li>
                                ))}
                              </ul>
                              {exp.tags && exp.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {exp.tags.map((tag, tIndex) => (
                                    <Badge key={tIndex} variant="outline" className="text-xs h-4">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resolvedResume.skills && (resolvedResume.skills.primary?.length > 0 || resolvedResume.skills.secondary?.length > 0) && (
                      <div>
                        <h5 className="font-medium mb-2 text-primary">Skills</h5>
                        {resolvedResume.skills.primary && resolvedResume.skills.primary.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium">Primary:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resolvedResume.skills.primary.map((skill, index) => (
                                <Badge key={index} variant="default" className="text-xs h-4">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {resolvedResume.skills.secondary && resolvedResume.skills.secondary.length > 0 && (
                          <div>
                            <p className="text-xs font-medium">Secondary:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resolvedResume.skills.secondary.slice(0, 8).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs h-4">
                                  {skill}
                                </Badge>
                              ))}
                              {resolvedResume.skills.secondary.length > 8 && (
                                <Badge variant="outline" className="text-xs h-4">
                                  +{resolvedResume.skills.secondary.length - 8}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <ResumePreview 
                    masterResume={masterResume}
                    variant={variant}
                    triggerText="Full Preview"
                    triggerVariant="outline"
                  />
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{format(new Date(variant.createdAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated:</span>
                <span>{format(new Date(variant.updatedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rules:</span>
                <Badge variant="secondary">{variant.rules.length}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overrides:</span>
                <Badge variant="secondary">{variant.overrides.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VariantEditor;
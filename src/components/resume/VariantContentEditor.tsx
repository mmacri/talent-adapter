import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, FileText, Target, Lightbulb, Briefcase } from 'lucide-react';
import { ResumeMaster, VariantOverride } from '@/types/resume';
import { TipTapEditor } from './TipTapEditor';
import { VariantExperienceReorder } from './VariantExperienceReorder';

interface VariantContentEditorProps {
  overrides: VariantOverride[];
  masterResume: ResumeMaster;
  onOverridesChange: (overrides: VariantOverride[]) => void;
}

export const VariantContentEditor = ({ 
  overrides, 
  masterResume, 
  onOverridesChange 
}: VariantContentEditorProps) => {
  const [activeTab, setActiveTab] = useState('summary');

  // Get current overrides for sections
  const getSummaryOverride = () => {
    return overrides.find(o => o.path === 'summary' && o.operation === 'set');
  };

  const getAchievementsOverride = () => {
    return overrides.find(o => o.path === 'key_achievements' && o.operation === 'set');
  };

  const updateSectionContent = (section: 'summary' | 'key_achievements', content: string[]) => {
    const updatedOverrides = overrides.filter(o => !(o.path === section && o.operation === 'set'));
    
    if (content.length > 0) {
      updatedOverrides.push({
        path: section,
        operation: 'set',
        value: content
      });
    }
    
    onOverridesChange(updatedOverrides);
  };

  const clearSectionOverride = (section: 'summary' | 'key_achievements') => {
    const updatedOverrides = overrides.filter(o => !(o.path === section && o.operation === 'set'));
    onOverridesChange(updatedOverrides);
  };

  const getCurrentSummary = () => {
    const override = getSummaryOverride();
    return override ? override.value : masterResume.summary;
  };

  const getCurrentAchievements = () => {
    const override = getAchievementsOverride();
    return override ? override.value : masterResume.key_achievements;
  };

  const addPresetVariant = (type: 'executive' | 'technical' | 'sales' | 'consulting') => {
    const presets = {
      executive: {
        summary: [
          'Strategic executive with 15+ years of experience driving organizational transformation and revenue growth',
          'Proven track record of leading cross-functional teams and implementing scalable business solutions',
          'Expert in stakeholder management, operational excellence, and change management initiatives'
        ],
        achievements: [
          'Led digital transformation initiative that increased operational efficiency by 40%',
          'Managed P&L responsibility for $50M+ business unit with consistent YoY growth',
          'Built and scaled high-performing teams across multiple geographic regions'
        ]
      },
      technical: {
        summary: [
          'Senior technical professional with deep expertise in modern software architecture and development',
          'Experienced in leading technical teams and delivering complex, scalable solutions',
          'Strong background in cloud technologies, DevOps practices, and system optimization'
        ],
        achievements: [
          'Architected and deployed cloud-native solutions serving 1M+ users with 99.9% uptime',
          'Led technical team that reduced system response times by 60% through optimization',
          'Implemented CI/CD pipelines that decreased deployment time from hours to minutes'
        ]
      },
      sales: {
        summary: [
          'Results-driven sales professional with proven ability to exceed targets and drive revenue growth',
          'Expertise in relationship building, account management, and complex deal negotiations',
          'Strong track record of developing new markets and expanding customer relationships'
        ],
        achievements: [
          'Consistently exceeded sales targets by 25%+ for 5 consecutive years',
          'Developed and closed $10M+ in new business opportunities within 18 months',
          'Built strategic partnerships that generated 30% of total regional revenue'
        ]
      },
      consulting: {
        summary: [
          'Strategic consultant with expertise in business transformation and process optimization',
          'Proven ability to analyze complex business challenges and deliver actionable solutions',
          'Strong background in stakeholder engagement and project management across industries'
        ],
        achievements: [
          'Delivered consulting projects that generated $25M+ in cost savings for Fortune 500 clients',
          'Led business process reengineering initiatives resulting in 45% efficiency improvements',
          'Managed cross-functional project teams of 15+ members across multiple client engagements'
        ]
      }
    };

    const preset = presets[type];
    updateSectionContent('summary', preset.summary);
    updateSectionContent('key_achievements', preset.achievements);
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Quick Content Presets
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Apply professionally written content templates for common roles
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => addPresetVariant('executive')}
              className="h-auto p-3 flex flex-col items-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span className="text-sm">Executive</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addPresetVariant('technical')}
              className="h-auto p-3 flex flex-col items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Technical</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addPresetVariant('sales')}
              className="h-auto p-3 flex flex-col items-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span className="text-sm">Sales</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addPresetVariant('consulting')}
              className="h-auto p-3 flex flex-col items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">Consulting</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Variant Content
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize the Professional Summary and Key Achievements for this variant
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Professional Summary
                {getSummaryOverride() && (
                  <Badge variant="secondary" className="ml-1 text-xs">Custom</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Key Achievements
                {getAchievementsOverride() && (
                  <Badge variant="secondary" className="ml-1 text-xs">Custom</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Experience Order
                {overrides.some(o => o.path === 'experience_order' && o.operation === 'set') && (
                  <Badge variant="secondary" className="ml-1 text-xs">Custom</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Professional Summary</Label>
                  <div className="flex gap-2">
                    {getSummaryOverride() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => clearSectionOverride('summary')}
                      >
                        Use Master Resume
                      </Button>
                    )}
                  </div>
                </div>
                
                <TipTapEditor
                  content={getCurrentSummary()}
                  onChange={(content) => updateSectionContent('summary', content)}
                  placeholder="Write a compelling professional summary for this variant..."
                />

                <div className="text-xs text-muted-foreground">
                  {getSummaryOverride() ? (
                    <span className="text-orange-600">✏️ Using custom content for this variant</span>
                  ) : (
                    <span>📄 Using master resume content</span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Key Achievements</Label>
                  <div className="flex gap-2">
                    {getAchievementsOverride() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => clearSectionOverride('key_achievements')}
                      >
                        Use Master Resume
                      </Button>
                    )}
                  </div>
                </div>
                
                <TipTapEditor
                  content={getCurrentAchievements()}
                  onChange={(content) => updateSectionContent('key_achievements', content)}
                  placeholder="List your key achievements relevant to this variant..."
                />

                <div className="text-xs text-muted-foreground">
                  {getAchievementsOverride() ? (
                    <span className="text-orange-600">✏️ Using custom content for this variant</span>
                  ) : (
                    <span>📄 Using master resume content</span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
              <VariantExperienceReorder
                masterResume={masterResume}
                overrides={overrides}
                onOverridesChange={onOverridesChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Current Overrides */}
      {overrides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Content Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overrides.map((override, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {override.operation}
                    </Badge>
                    <span className="text-sm font-mono">{override.path}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = overrides.filter((_, i) => i !== index);
                      onOverridesChange(updated);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
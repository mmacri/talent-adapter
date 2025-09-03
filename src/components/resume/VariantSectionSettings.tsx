import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, FileText, Target, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react';
import { Variant } from '@/types/resume';

interface VariantSectionSettingsProps {
  sectionSettings: Variant['sectionSettings'];
  onSectionSettingsChange: (settings: Variant['sectionSettings']) => void;
}

export const VariantSectionSettings = ({
  sectionSettings,
  onSectionSettingsChange
}: VariantSectionSettingsProps) => {
  
  // Ensure sectionSettings is always defined with default values
  const safeSectionSettings = sectionSettings || {
    headline: { enabled: true },
    summary: { enabled: false },
    key_achievements: { enabled: false },
    experience: { enabled: true },
    education: { enabled: true },
    awards: { enabled: true },
    skills: { enabled: true }
  };
  
  const updateSectionSetting = (section: keyof Variant['sectionSettings'], setting: string, value: boolean) => {
    onSectionSettingsChange({
      ...safeSectionSettings,
      [section]: {
        ...safeSectionSettings[section],
        [setting]: value
      }
    });
  };

  const sections = [
    {
      key: 'headline' as const,
      label: 'Headline/Tagline',
      icon: FileText,
      description: 'Professional title or tagline'
    },
    {
      key: 'summary' as const,
      label: 'Professional Summary',
      icon: FileText,
      description: 'Brief overview of professional background'
    },
    {
      key: 'key_achievements' as const,
      label: 'Key Achievements',
      icon: Target,
      description: 'Most significant accomplishments'
    },
    {
      key: 'experience' as const,
      label: 'Experience',
      icon: Briefcase,
      description: 'Work history and responsibilities'
    },
    {
      key: 'education' as const,
      label: 'Education',
      icon: GraduationCap,
      description: 'Academic background and qualifications'
    },
    {
      key: 'awards' as const,
      label: 'Awards',
      icon: Award,
      description: 'Recognition and honors'
    },
    {
      key: 'skills' as const,
      label: 'Skills',
      icon: Wrench,
      description: 'Technical and soft skills'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Section Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Control which sections appear in this variant. Use "Content & Overrides" tab to customize section content.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => {
          const sectionSetting = safeSectionSettings[section.key] || { enabled: true };
          const Icon = section.icon;
          
          return (
            <div key={section.key} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <div>
                    <Label className="font-medium">{section.label}</Label>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <Switch
                  checked={Boolean(sectionSetting?.enabled)}
                  onCheckedChange={(checked) => updateSectionSetting(section.key, 'enabled', checked)}
                />
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                💡 Want to customize content?
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Use the "Content & Overrides" tab to replace default content with variant-specific text for Summary and Key Achievements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
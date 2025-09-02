import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, FileText, Target, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react';
import { Variant } from '@/types/resume';

interface VariantSectionSettingsProps {
  sectionSettings: Variant['sectionSettings'];
  onSectionSettingsChange: (settings: Variant['sectionSettings']) => void;
  hasCustomSummary: boolean;
  hasCustomKeyAchievements: boolean;
}

export const VariantSectionSettings = ({
  sectionSettings,
  onSectionSettingsChange,
  hasCustomSummary,
  hasCustomKeyAchievements
}: VariantSectionSettingsProps) => {
  
  // Ensure sectionSettings is always defined with default values
  const safeSectionSettings = sectionSettings || {
    summary: { enabled: true, useCustom: false },
    key_achievements: { enabled: true, useCustom: false },
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
      key: 'summary' as const,
      label: 'Professional Summary',
      icon: FileText,
      hasCustomOption: true,
      hasCustomContent: hasCustomSummary
    },
    {
      key: 'key_achievements' as const,
      label: 'Key Achievements',
      icon: Target,
      hasCustomOption: true,
      hasCustomContent: hasCustomKeyAchievements
    },
    {
      key: 'experience' as const,
      label: 'Experience',
      icon: Briefcase,
      hasCustomOption: false,
      hasCustomContent: false
    },
    {
      key: 'education' as const,
      label: 'Education',
      icon: GraduationCap,
      hasCustomOption: false,
      hasCustomContent: false
    },
    {
      key: 'awards' as const,
      label: 'Awards',
      icon: Award,
      hasCustomOption: false,
      hasCustomContent: false
    },
    {
      key: 'skills' as const,
      label: 'Skills',
      icon: Wrench,
      hasCustomOption: false,
      hasCustomContent: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Section Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => {
          // Provide default section setting if it doesn't exist
          const sectionSetting = safeSectionSettings[section.key] || 
            (section.hasCustomOption 
              ? { enabled: true, useCustom: false }
              : { enabled: true });
          const Icon = section.icon;
          
          return (
            <div key={section.key} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <Label className="font-medium">{section.label}</Label>
                  {section.hasCustomContent && (
                    <Badge variant="secondary" className="text-xs">
                      Custom Content
                    </Badge>
                  )}
                </div>
                <Switch
                  checked={Boolean(sectionSetting?.enabled)}
                  onCheckedChange={(checked) => updateSectionSetting(section.key, 'enabled', checked)}
                />
              </div>
              
              {section.hasCustomOption && sectionSetting?.enabled && (
                <div className="ml-6 flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Use custom content for this variant
                  </Label>
                  <Switch
                    checked={Boolean(('useCustom' in sectionSetting) ? sectionSetting.useCustom : false)}
                    onCheckedChange={(checked) => updateSectionSetting(section.key, 'useCustom', checked)}
                    disabled={!section.hasCustomContent}
                  />
                </div>
              )}
              
              {section.hasCustomOption && sectionSetting?.enabled && !section.hasCustomContent && ('useCustom' in sectionSetting) && sectionSetting.useCustom && (
                <div className="ml-6 text-xs text-muted-foreground">
                  No custom content available. Add content in the "Custom Content" tab.
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
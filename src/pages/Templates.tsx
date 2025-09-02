import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Layout,
  Search,
  Eye,
  Edit2,
  Palette,
  FileText,
  Settings,
  Download,
  User,
  ChevronDown
} from 'lucide-react';
import { Template } from '@/types/resume';
import { VariantResolver } from '@/lib/variantResolver';
import TemplateSettings from '@/components/resume/TemplateSettings';

const Templates = () => {
  const { templates, masterResume, variants, updateTemplate } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('master');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the current resume content to preview
  const getCurrentResumeContent = () => {
    if (!masterResume) return null;
    
    if (selectedVariantId === 'master') {
      return masterResume;
    }
    
    const selectedVariant = variants.find(v => v.id === selectedVariantId);
    if (selectedVariant) {
      const resolved = VariantResolver.resolveVariant(masterResume, selectedVariant);
      return resolved;
    }
    
    return masterResume;
  };

  const currentResume = getCurrentResumeContent();

  // Get style classes based on template configuration
  const getTemplateStyles = (template: Template) => {
    const styles = template.styles || {};
    
    // Font size mapping
    const fontSizeClasses = {
      'small': 'text-[9px]',
      'medium': 'text-[10px]',
      'large': 'text-[11px]'
    };
    
    // Spacing mapping
    const spacingClasses = {
      'compact': 'space-y-1',
      'comfortable': 'space-y-2',
      'traditional': 'space-y-1.5'
    };
    
    // Color scheme mapping
    const colorSchemes = {
      'professional-blue': {
        header: 'bg-blue-900 text-white',
        headings: 'text-blue-700',
        text: 'text-gray-800',
        accent: 'border-blue-200'
      },
      'modern-gray': {
        header: 'bg-gray-800 text-white',
        headings: 'text-gray-700',
        text: 'text-gray-600',
        accent: 'border-gray-300'
      },
      'classic-black': {
        header: 'bg-gray-900 text-white',
        headings: 'text-gray-900',
        text: 'text-gray-800',
        accent: 'border-gray-400'
      },
      'creative-purple': {
        header: 'bg-purple-700 text-white',
        headings: 'text-purple-700',
        text: 'text-gray-700',
        accent: 'border-purple-200'
      },
      'elegant-green': {
        header: 'bg-green-700 text-white',
        headings: 'text-green-700',
        text: 'text-gray-700',
        accent: 'border-green-200'
      },
      'warm-orange': {
        header: 'bg-orange-700 text-white',
        headings: 'text-orange-700',
        text: 'text-gray-700',
        accent: 'border-orange-200'
      }
    };
    
    // Layout classes
    const layoutClasses = {
      'single-column': 'flex flex-col',
      'two-column': 'grid grid-cols-3 gap-2',
      'three-column': 'grid grid-cols-4 gap-1'
    };
    
    return {
      fontSize: fontSizeClasses[styles.fontSize as keyof typeof fontSizeClasses] || 'text-[10px]',
      spacing: spacingClasses[styles.spacing as keyof typeof spacingClasses] || 'space-y-2',
      colors: colorSchemes[styles.colors as keyof typeof colorSchemes] || colorSchemes['modern-gray'],
      layout: layoutClasses[styles.layout as keyof typeof layoutClasses] || 'flex flex-col'
    };
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'two-column':
        return '⚏';
      case 'single-column':
        return '▬';
      case 'three-column':
        return '⚏⚏';
      default:
        return '▬';
    }
  };

  const getColorPreview = (colorScheme: string) => {
    const colorMap: { [key: string]: string } = {
      'professional-blue': 'bg-blue-600',
      'modern-gray': 'bg-gray-600',
      'classic-black': 'bg-gray-900',
      'creative-purple': 'bg-purple-600'
    };
    return colorMap[colorScheme] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Templates</h1>
          <p className="text-muted-foreground">
            Professional resume layouts that work with your master resume and variants
          </p>
        </div>
      </div>

      {/* Search and Variant Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Preview with:</span>
          <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="master">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Master Resume
                </div>
              </SelectItem>
              {variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {variant.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{getLayoutIcon(template.styles?.layout)}</span>
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Template Preview Area */}
                <div className="aspect-[3/4] bg-background rounded-lg border-2 border-border relative overflow-hidden">
                  {currentResume ? (
                    <div className={`p-2 h-full overflow-hidden ${getTemplateStyles(template).fontSize} ${getTemplateStyles(template).spacing}`}>
                      {template.styles?.layout === 'two-column' ? (
                        /* Two Column Layout */
                        <div className="grid grid-cols-3 gap-2 h-full">
                          {/* Left Sidebar */}
                          <div className={`col-span-1 ${getTemplateStyles(template).colors.header} p-2 rounded-sm`}>
                            <div className="space-y-2">
                              <div className="text-center">
                                <div className="font-bold text-xs">{currentResume.owner}</div>
                                <div className="text-xs opacity-90">{currentResume.contacts.email}</div>
                                <div className="text-xs opacity-90">{currentResume.contacts.phone}</div>
                              </div>
                              
                              {/* Skills in sidebar */}
                              {currentResume.sections.skills.enabled && (
                                <div>
                                  <div className="font-semibold text-xs mb-1 border-b border-white/20 pb-1">SKILLS</div>
                                  <div className="space-y-1">
                                    {currentResume.skills.primary.slice(0, 6).map((skill, i) => (
                                      <div key={i} className="text-xs">• {skill}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Main Content */}
                          <div className="col-span-2 p-2 space-y-2">
                            <div className={`${getTemplateStyles(template).colors.headings} font-bold text-sm border-b ${getTemplateStyles(template).colors.accent} pb-1`}>
                              {currentResume.headline}
                            </div>
                            
                            {/* Summary */}
                            {currentResume.sections.summary.enabled && (
                              <div>
                                <div className={`font-semibold text-xs mb-1 ${getTemplateStyles(template).colors.headings}`}>SUMMARY</div>
                                {currentResume.summary.slice(0, 2).map((item, i) => (
                                  <div key={i} className={`text-xs ${getTemplateStyles(template).colors.text} leading-tight`}>{item}</div>
                                ))}
                              </div>
                            )}
                            
                            {/* Experience */}
                            {currentResume.sections.experience.enabled && (
                              <div>
                                <div className={`font-semibold text-xs mb-1 ${getTemplateStyles(template).colors.headings}`}>EXPERIENCE</div>
                                {currentResume.experience.slice(0, 2).map((exp, i) => (
                                  <div key={i} className="mb-2">
                                    <div className={`font-medium text-xs ${getTemplateStyles(template).colors.text}`}>{exp.title}</div>
                                    <div className={`text-xs ${getTemplateStyles(template).colors.text} opacity-75`}>{exp.company}</div>
                                    {exp.bullets.slice(0, 1).map((bullet, j) => (
                                      <div key={j} className={`text-xs ${getTemplateStyles(template).colors.text} leading-tight`}>• {bullet}</div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : template.styles?.layout === 'three-column' ? (
                        /* Three Column Layout */
                        <div className="grid grid-cols-4 gap-1 h-full">
                          {/* Left sidebar - Contact */}
                          <div className={`col-span-1 ${getTemplateStyles(template).colors.header} p-1.5 rounded-sm`}>
                            <div className="text-center">
                              <div className="font-bold text-xs">{currentResume.owner}</div>
                              <div className="text-xs opacity-90 leading-tight">{currentResume.contacts.email}</div>
                            </div>
                          </div>
                          
                          {/* Main content */}
                          <div className="col-span-2 p-1.5 space-y-1">
                            <div className={`${getTemplateStyles(template).colors.headings} font-bold text-xs`}>{currentResume.headline}</div>
                            
                            {currentResume.sections.summary.enabled && (
                              <div>
                                <div className={`font-semibold text-xs ${getTemplateStyles(template).colors.headings}`}>SUMMARY</div>
                                <div className={`text-xs ${getTemplateStyles(template).colors.text} leading-tight`}>
                                  {currentResume.summary[0]}
                                </div>
                              </div>
                            )}
                            
                            {currentResume.sections.experience.enabled && (
                              <div>
                                <div className={`font-semibold text-xs ${getTemplateStyles(template).colors.headings}`}>EXPERIENCE</div>
                                <div className={`text-xs ${getTemplateStyles(template).colors.text}`}>
                                  <div className="font-medium">{currentResume.experience[0]?.title}</div>
                                  <div className="opacity-75">{currentResume.experience[0]?.company}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Right sidebar - Skills */}
                          <div className="col-span-1 p-1.5">
                            {currentResume.sections.skills.enabled && (
                              <div>
                                <div className={`font-semibold text-xs mb-1 ${getTemplateStyles(template).colors.headings}`}>SKILLS</div>
                                <div className="space-y-0.5">
                                  {currentResume.skills.primary.slice(0, 4).map((skill, i) => (
                                    <div key={i} className={`text-xs ${getTemplateStyles(template).colors.text}`}>• {skill}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Single Column Layout */
                        <div className="space-y-2">
                          {/* Header */}
                          <div className={`text-center ${getTemplateStyles(template).colors.header} p-2 rounded-sm`}>
                            <div className="font-bold text-sm">{currentResume.owner}</div>
                            <div className="text-xs opacity-90">{currentResume.headline}</div>
                            <div className="text-xs opacity-90">{currentResume.contacts.email}</div>
                          </div>
                          
                          {/* Summary */}
                          {currentResume.sections.summary.enabled && (
                            <div>
                              <div className={`font-semibold text-xs mb-1 ${getTemplateStyles(template).colors.headings} border-b ${getTemplateStyles(template).colors.accent} pb-0.5`}>SUMMARY</div>
                              <div className={`text-xs ${getTemplateStyles(template).colors.text} leading-tight space-y-1`}>
                                {currentResume.summary.slice(0, template.styles?.spacing === 'compact' ? 1 : 2).map((item, i) => (
                                  <div key={i}>{item}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Experience */}
                          {currentResume.sections.experience.enabled && (
                            <div>
                              <div className={`font-semibold text-xs mb-1 ${getTemplateStyles(template).colors.headings} border-b ${getTemplateStyles(template).colors.accent} pb-0.5`}>EXPERIENCE</div>
                              <div className="space-y-1">
                                {currentResume.experience.slice(0, template.styles?.spacing === 'compact' ? 1 : 2).map((exp, i) => (
                                  <div key={i}>
                                    <div className={`font-medium text-xs ${getTemplateStyles(template).colors.text}`}>{exp.title}</div>
                                    <div className={`text-xs ${getTemplateStyles(template).colors.text} opacity-75`}>{exp.company}</div>
                                    {exp.bullets.slice(0, 1).map((bullet, j) => (
                                      <div key={j} className={`text-xs ${getTemplateStyles(template).colors.text} leading-tight`}>• {bullet}</div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Skills */}
                          {currentResume.sections.skills.enabled && (
                            <div>
                              <div className={`font-semibold text-xs mb-1 ${getTemplateStyles(template).colors.headings} border-b ${getTemplateStyles(template).colors.accent} pb-0.5`}>SKILLS</div>
                              <div className={`text-xs ${getTemplateStyles(template).colors.text}`}>
                                {currentResume.skills.primary.slice(0, template.styles?.spacing === 'compact' ? 4 : 6).join(' • ')}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="space-y-2">
                        <Layout className="w-8 h-8 text-muted-foreground mx-auto" />
                        <span className="text-sm text-muted-foreground">No Resume Data</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Layout Indicator */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.styles?.layout?.replace('-', ' ') || 'Standard'}
                    </Badge>
                  </div>
                  
                  {/* Preview Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Template Properties */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Layout</span>
                    <span className="capitalize">{template.styles?.layout?.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Font Size</span>
                    <span className="capitalize">{template.styles?.fontSize}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spacing</span>
                    <span className="capitalize">{template.styles?.spacing}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Color Scheme</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getColorPreview(template.styles?.colors)}`}></div>
                      <span className="capitalize">{template.styles?.colors?.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/templates/resume-template.json';
                      link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Layout className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No templates found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search terms."
                  : "Templates will help you create professionally formatted resumes."
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Template Settings Dialog */}
      {selectedTemplateId && (
        <TemplateSettings
          template={templates.find(t => t.id === selectedTemplateId)!}
          isOpen={!!selectedTemplateId}
          onClose={() => setSelectedTemplateId(null)}
          onSave={(updatedTemplate) => {
            updateTemplate(updatedTemplate.id, updatedTemplate);
            setSelectedTemplateId(null);
          }}
        />
      )}

      {/* Template Info */}
      <Card className="bg-muted/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5" />
            About Resume Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Templates control the visual presentation of your resume content</p>
          <p>• Each template can use content from your master resume or specific variants</p>
          <p>• Professional layouts optimized for different industries and roles</p>
          <p>• Automatically format your sections, skills, and experience consistently</p>
          <p>• Click the settings icon to customize colors, layout, and formatting</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Templates;
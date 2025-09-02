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

const Templates = () => {
  const { templates, masterResume, variants } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('master');

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
                    <div className="p-3 text-xs space-y-2 h-full overflow-hidden">
                      {/* Header */}
                      <div className="text-center border-b pb-2 mb-2">
                        <div className="font-bold text-sm">{currentResume.owner}</div>
                        <div className="text-xs text-muted-foreground">{currentResume.headline}</div>
                        <div className="text-xs">{currentResume.contacts.email}</div>
                      </div>
                      
                      {/* Summary */}
                      {currentResume.sections.summary.enabled && currentResume.summary.length > 0 && (
                        <div>
                          <div className="font-semibold text-xs mb-1">SUMMARY</div>
                          <div className="text-xs space-y-1">
                            {currentResume.summary.slice(0, 2).map((item, i) => (
                              <div key={i} className="truncate">{item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Experience */}
                      {currentResume.sections.experience.enabled && currentResume.experience.length > 0 && (
                        <div>
                          <div className="font-semibold text-xs mb-1">EXPERIENCE</div>
                          <div className="space-y-2">
                            {currentResume.experience.slice(0, 2).map((exp, i) => (
                              <div key={i}>
                                <div className="font-medium text-xs truncate">{exp.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{exp.company}</div>
                                <div className="text-xs">
                                  {exp.bullets.slice(0, 1).map((bullet, j) => (
                                    <div key={j} className="truncate">• {bullet}</div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Skills */}
                      {currentResume.sections.skills.enabled && currentResume.skills.primary.length > 0 && (
                        <div>
                          <div className="font-semibold text-xs mb-1">SKILLS</div>
                          <div className="text-xs">
                            {currentResume.skills.primary.slice(0, 6).join(' • ')}
                          </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Templates;
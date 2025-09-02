import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Layout,
  Search,
  Eye,
  Edit2,
  Palette,
  FileText,
  Settings,
  Download
} from 'lucide-react';
import { Template } from '@/types/resume';

const Templates = () => {
  const { templates } = useResume();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
                <div className="aspect-[3/4] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-2">
                    <Layout className="w-8 h-8 text-muted-foreground mx-auto" />
                    <span className="text-sm text-muted-foreground">Preview</span>
                  </div>
                  
                  {/* Layout Indicator */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.styles?.layout?.replace('-', ' ') || 'Standard'}
                    </Badge>
                  </div>
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
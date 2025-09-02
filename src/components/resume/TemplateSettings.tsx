import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Settings,
  Palette,
  Layout,
  Type,
  Save,
  RotateCcw
} from 'lucide-react';
import { Template } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';

interface TemplateSettingsProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTemplate: Template) => void;
}

const TemplateSettings = ({ template, isOpen, onClose, onSave }: TemplateSettingsProps) => {
  const [editedTemplate, setEditedTemplate] = useState<Template>({ ...template });
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editedTemplate);
    toast({
      title: "Template Updated",
      description: `${editedTemplate.name} has been successfully updated.`,
    });
    onClose();
  };

  const handleReset = () => {
    setEditedTemplate({ ...template });
    toast({
      title: "Changes Reset",
      description: "All changes have been reset to the original template settings.",
    });
  };

  const updateTemplateField = (field: string, value: any) => {
    setEditedTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateStyleField = (field: string, value: any) => {
    setEditedTemplate(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [field]: value
      }
    }));
  };

  const colorSchemes = [
    { value: 'professional-blue', label: 'Professional Blue', color: 'bg-blue-600' },
    { value: 'modern-gray', label: 'Modern Gray', color: 'bg-gray-600' },
    { value: 'classic-black', label: 'Classic Black', color: 'bg-gray-900' },
    { value: 'creative-purple', label: 'Creative Purple', color: 'bg-purple-600' },
    { value: 'elegant-green', label: 'Elegant Green', color: 'bg-green-600' },
    { value: 'warm-orange', label: 'Warm Orange', color: 'bg-orange-600' },
  ];

  const layoutOptions = [
    { value: 'single-column', label: 'Single Column', icon: '▬' },
    { value: 'two-column', label: 'Two Column', icon: '⚏' },
    { value: 'three-column', label: 'Three Column', icon: '⚏⚏' },
  ];

  const fontSizes = [
    { value: 'small', label: 'Small (9-10pt)' },
    { value: 'medium', label: 'Medium (11-12pt)' },
    { value: 'large', label: 'Large (13-14pt)' },
  ];

  const spacingOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'traditional', label: 'Traditional' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure Template: {editedTemplate.name}
          </DialogTitle>
          <DialogDescription>
            Customize the appearance and formatting of this resume template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={editedTemplate.name}
                  onChange={(e) => updateTemplateField('name', e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={editedTemplate.description}
                  onChange={(e) => updateTemplateField('description', e.target.value)}
                  placeholder="Describe when to use this template"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Layout Configuration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Layout & Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Layout Style</Label>
                <Select
                  value={editedTemplate.styles?.layout || 'single-column'}
                  onValueChange={(value) => updateStyleField('layout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.icon}</span>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Font Size</Label>
                <Select
                  value={editedTemplate.styles?.fontSize || 'medium'}
                  onValueChange={(value) => updateStyleField('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Spacing</Label>
                <Select
                  value={editedTemplate.styles?.spacing || 'comfortable'}
                  onValueChange={(value) => updateStyleField('spacing', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spacingOptions.map((spacing) => (
                      <SelectItem key={spacing.value} value={spacing.value}>
                        {spacing.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {colorSchemes.map((scheme) => (
                    <div
                      key={scheme.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        editedTemplate.styles?.colors === scheme.value
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => updateStyleField('colors', scheme.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${scheme.color}`}></div>
                        <span className="text-sm font-medium">{scheme.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Changes
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSettings;
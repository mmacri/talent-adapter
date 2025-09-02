import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download,
  FileText,
  Database,
  FileJson,
  FileSpreadsheet,
  Layout,
  Briefcase,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TemplateDownloads = () => {
  const { toast } = useToast();

  const downloadTemplate = (filename: string, displayName: string) => {
    const link = document.createElement('a');
    link.href = `/templates/${filename}`;
    link.download = filename;
    link.click();
    toast({
      title: "Template Downloaded",
      description: `${displayName} template ready for customization.`,
    });
  };

  const templates = [
    {
      id: 'job-applications',
      title: 'Job Applications',
      description: 'CSV template for importing job application data',
      filename: 'job-applications-template.csv',
      icon: Briefcase,
      type: 'CSV',
      color: 'bg-green-100 text-green-800 border-green-200',
      fields: ['Company', 'Role', 'Location', 'Status', 'Applied Date', 'Notes']
    },
    {
      id: 'cover-letters',
      title: 'Cover Letters',
      description: 'CSV template for importing cover letter templates',
      filename: 'cover-letters-template.csv',
      icon: Mail,
      type: 'CSV',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      fields: ['Title', 'Body', 'Variables']
    },
    {
      id: 'master-resume',
      title: 'Master Resume',
      description: 'JSON template for creating a complete master resume',
      filename: 'master-resume-template.json',
      icon: FileText,
      type: 'JSON',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      fields: ['Personal Info', 'Experience', 'Education', 'Skills', 'Achievements']
    },
    {
      id: 'resume-variant',
      title: 'Resume Variant',
      description: 'JSON template for creating custom resume variants',
      filename: 'variant-template.json',
      icon: Database,
      type: 'JSON',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      fields: ['Rules', 'Overrides', 'Section Settings']
    },
    {
      id: 'resume-template',
      title: 'Resume Template',
      description: 'JSON template for custom resume formatting styles',
      filename: 'resume-template.json',
      icon: Layout,
      type: 'JSON',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      fields: ['Styles', 'Layout', 'Typography', 'Colors']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Templates</h1>
        <p className="text-muted-foreground">
          Download customizable templates for importing your data and configurations
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className={template.color}>
                        {template.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Fields Preview */}
                <div>
                  <p className="text-sm font-medium mb-2">Includes fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map((field) => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {template.fields.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.fields.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  className="w-full"
                  onClick={() => downloadTemplate(template.filename, template.title)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <Card className="bg-muted/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            How to Use Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• <strong>CSV Templates:</strong> Open in Excel, Google Sheets, or any spreadsheet app</p>
          <p>• <strong>JSON Templates:</strong> Edit with any text editor or JSON editor</p>
          <p>• <strong>Customize:</strong> Replace example data with your own information</p>
          <p>• <strong>Import:</strong> Use the import features in each section to load your data</p>
          <p>• <strong>Validation:</strong> The app will validate and guide you through any errors</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateDownloads;
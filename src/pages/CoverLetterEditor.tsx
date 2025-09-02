import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Save, 
  Variable,
  Eye,
  FileText,
  Copy,
  Download
} from 'lucide-react';
import { CoverLetter } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const CoverLetterEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    coverLetters, 
    addCoverLetter, 
    updateCoverLetter,
    jobApplications
  } = useResume();
  const { toast } = useToast();
  
  const [letter, setLetter] = useState<CoverLetter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [sampleValues, setSampleValues] = useState<Record<string, string>>({});

  const extractVariables = (body: string): string[] => {
    const matches = body.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    
    return [...new Set(matches.map(match => match.slice(2, -2).trim()))];
  };

  const getSampleValue = (variable: string): string => {
    const samples: Record<string, string> = {
      company: 'Acme Corporation',
      role: 'Senior Software Engineer',
      field: 'software development',
      your_name: 'Mike Macri',
      reason_for_interest: 'I am excited about the opportunity to work on innovative projects that will have a meaningful impact on the company\'s growth.',
      key_achievement_1: 'Led cross-functional teams to deliver high-impact solutions',
      key_achievement_2: 'Improved system performance by 40% through optimization',
      key_achievement_3: 'Mentored junior developers and established best practices',
      company_reason: 'of its commitment to innovation and excellence in the industry',
      relevant_skills: 'technical leadership, solution architecture, and team collaboration',
      specific_goal: 'continued innovation and market leadership'
    };
    
    return samples[variable] || `[${variable}]`;
  };

  useEffect(() => {
    if (id && id !== 'new') {
      const foundLetter = coverLetters.find(l => l.id === id);
      if (foundLetter) {
        setLetter(foundLetter);
        // Initialize sample values for preview
        const variables = extractVariables(foundLetter.body);
        const samples: Record<string, string> = {};
        variables.forEach(variable => {
          samples[variable] = getSampleValue(variable);
        });
        setSampleValues(samples);
      } else {
        navigate('/cover-letters');
        toast({
          title: "Cover Letter Not Found",
          description: "The requested cover letter could not be found.",
          variant: "destructive",
        });
      }
    } else if (id === 'new') {
      setIsNew(true);
      const newLetter: CoverLetter = {
        id: `letter-${Date.now()}`,
        title: '',
        body: `Dear Hiring Manager,

I am writing to express my strong interest in the {{role}} position at {{company}}. With my background in {{field}}, I am confident that I would be a valuable addition to your team.

{{reason_for_interest}}

In my previous roles, I have demonstrated:
• {{key_achievement_1}}
• {{key_achievement_2}}
• {{key_achievement_3}}

I am particularly drawn to {{company}} because {{company_reason}}. I believe my skills in {{relevant_skills}} would contribute significantly to {{specific_goal}}.

Thank you for considering my application. I look forward to the opportunity to discuss how my experience and passion can contribute to {{company}}'s continued success.

Best regards,
{{your_name}}`,
        variables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLetter(newLetter);
      setIsEditing(true);
    }
  }, [id, coverLetters, navigate, toast]);

  if (!letter) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading cover letter...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (letter && letter.title.trim()) {
      const variables = extractVariables(letter.body);
      const updatedLetter = {
        ...letter,
        variables,
        updatedAt: new Date().toISOString()
      };

      if (isNew) {
        addCoverLetter(updatedLetter);
        navigate('/cover-letters');
        toast({
          title: "Cover Letter Created",
          description: "Your cover letter has been saved successfully.",
        });
      } else {
        updateCoverLetter(letter.id, updatedLetter);
        setLetter(updatedLetter);
        setIsEditing(false);
        toast({
          title: "Cover Letter Updated",
          description: "Your changes have been saved successfully.",
        });
      }
    } else {
      toast({
        title: "Title Required",
        description: "Please provide a title for your cover letter.",
        variant: "destructive",
      });
    }
  };

  const handleFieldUpdate = (field: keyof CoverLetter, value: any) => {
    if (!letter) return;
    
    setLetter({
      ...letter,
      [field]: value
    });
    setIsEditing(true);

    // Update sample values when body changes
    if (field === 'body') {
      const variables = extractVariables(value);
      const newSamples: Record<string, string> = {};
      variables.forEach(variable => {
        newSamples[variable] = sampleValues[variable] || getSampleValue(variable);
      });
      setSampleValues(newSamples);
    }
  };

  const handleSampleValueChange = (variable: string, value: string) => {
    setSampleValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const renderPreview = () => {
    let preview = letter.body;
    Object.entries(sampleValues).forEach(([variable, value]) => {
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      preview = preview.replace(regex, value);
    });
    return preview;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(renderPreview());
    toast({
      title: "Copied to Clipboard",
      description: "The rendered cover letter has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const content = renderPreview();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${letter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getUsageInfo = () => {
    const usedByJobs = jobApplications.filter(job => job.coverLetterId === letter.id);
    return usedByJobs;
  };

  const variables = extractVariables(letter.body);
  const usedByJobs = getUsageInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/cover-letters')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? 'New Cover Letter' : letter.title}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? 'Create a new cover letter template' : 'Edit your cover letter template'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              Unsaved Changes
            </Badge>
          )}
          
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={(!isEditing && !isNew) || !letter.title.trim()}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            <Save className="w-4 h-4 mr-2" />
            {isNew ? 'Create' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={letter.title}
                  onChange={(e) => handleFieldUpdate('title', e.target.value)}
                  placeholder="Enter cover letter title..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {previewMode ? 'Preview' : 'Content'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewMode ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={handleCopyToClipboard} size="sm" variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleDownload} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {renderPreview()}
                    </pre>
                  </div>
                </div>
              ) : (
                <Textarea
                  value={letter.body}
                  onChange={(e) => handleFieldUpdate('body', e.target.value)}
                  placeholder="Write your cover letter content here. Use {{variable_name}} for dynamic content..."
                  rows={20}
                  className="font-mono"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Variable className="w-5 h-5" />
                Variables ({variables.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {variables.length > 0 ? (
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {variables.map((variable, index) => (
                      <div key={index} className="space-y-1">
                        <Label className="text-xs font-medium">
                          {variable}
                        </Label>
                        <Input
                          value={sampleValues[variable] || ''}
                          onChange={(e) => handleSampleValueChange(variable, e.target.value)}
                          placeholder={`Sample ${variable}...`}
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-6">
                  <Variable className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No variables detected. Use {`{{variable_name}}`} syntax to add variables.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Information */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used in:</span>
                <Badge variant="secondary">
                  {usedByJobs.length} application{usedByJobs.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {usedByJobs.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Applications:</h5>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {usedByJobs.map((job) => (
                        <div
                          key={job.id}
                          className="text-xs p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <div className="font-medium">{job.role}</div>
                          <div className="text-muted-foreground">{job.company}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Variables:</span>
                <span>{variables.length}</span>
              </div>

              {!isNew && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="text-xs">
                      {format(new Date(letter.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="text-xs">
                      {format(new Date(letter.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Variable Syntax:</h5>
                <p className="text-xs text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{`{{variable_name}}`}</code> to insert dynamic content.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Common Variables:</h5>
                <div className="flex flex-wrap gap-1">
                  {['company', 'role', 'your_name'].map(variable => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Preview Mode:</h5>
                <p className="text-xs text-muted-foreground">
                  Use preview mode to see how your cover letter will look with sample values.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterEditor;
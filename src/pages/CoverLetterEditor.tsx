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

  useEffect(() => {
    if (id && id !== 'new') {
      const foundLetter = coverLetters.find(l => l.id === id);
      if (foundLetter) {
        setLetter(foundLetter);
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
        title: 'New Cover Letter',
        body: `Dear Hiring Manager,

I am writing to express my strong interest in the [Position Title] position at [Company Name]. With my background in [Your Field], I am confident that I would be a valuable addition to your team.

[Reason for your interest in the role and company]

In my previous roles, I have demonstrated:
• [Key achievement or skill 1]
• [Key achievement or skill 2] 
• [Key achievement or skill 3]

I am particularly drawn to [Company Name] because [specific reason]. I believe my skills in [relevant skills] would contribute significantly to [specific goal or project].

Thank you for considering my application. I look forward to the opportunity to discuss how my experience and passion can contribute to [Company Name]'s continued success.

Best regards,
[Your Name]`,
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
      const updatedLetter = {
        ...letter,
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
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(letter.body);
    toast({
      title: "Copied to Clipboard",
      description: "The cover letter has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const content = letter.body;
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
              {isNew ? 'Create a new cover letter' : 'Edit your cover letter'}
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
                Content
              </CardTitle>
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
            </CardHeader>
            <CardContent>
              <Textarea
                value={letter.body}
                onChange={(e) => handleFieldUpdate('body', e.target.value)}
                placeholder="Paste your cover letter content here..."
                rows={25}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                <h5 className="text-sm font-medium">Simple Tracking:</h5>
                <p className="text-xs text-muted-foreground">
                  Copy and paste the exact cover letters you send to employers to keep a record of what you submitted.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Organization:</h5>
                <p className="text-xs text-muted-foreground">
                  Use descriptive titles like "Software Engineer - TechCorp" to easily identify cover letters.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Job Applications:</h5>
                <p className="text-xs text-muted-foreground">
                  Link cover letters to specific job applications to track which version you sent to each company.
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
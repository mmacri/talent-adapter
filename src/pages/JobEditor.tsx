import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  ExternalLink,
  FileText,
  Download,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Target
} from 'lucide-react';
import { JobApplication } from '@/types/resume';
import { DocxExporter } from '@/lib/docxExport';
import { VariantResolver } from '@/lib/variantResolver';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const JobEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    jobApplications, 
    addJobApplication, 
    updateJobApplication,
    masterResume,
    variants,
    coverLetters,
    getVariant
  } = useResume();
  const { toast } = useToast();
  
  const [job, setJob] = useState<JobApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const foundJob = jobApplications.find(j => j.id === id);
      if (foundJob) {
        setJob(foundJob);
      } else {
        navigate('/jobs');
        toast({
          title: "Application Not Found",
          description: "The requested job application could not be found.",
          variant: "destructive",
        });
      }
    } else if (id === 'new') {
      setIsNew(true);
      const newJob: JobApplication = {
        id: `job-${Date.now()}`,
        company: '',
        role: '',
        location: '',
        source: '',
        url: '',
        jdText: '',
        status: 'prospect',
        variantId: '',
        coverLetterId: '',
        appliedOn: '',
        notes: '',
        salary: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setJob(newJob);
      setIsEditing(true);
    }
  }, [id, jobApplications, navigate, toast]);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    console.log('handleSave called with job:', job);
    
    if (job) {
      // Validate required fields
      if (!job.company.trim() || !job.role.trim()) {
        console.log('Validation failed - missing fields');
        toast({
          title: "Missing Required Fields",
          description: "Please fill in both Company and Role before saving.",
          variant: "destructive",
        });
        return;
      }

      console.log('Validation passed, creating updated job');
      const updatedJob = {
        ...job,
        updatedAt: new Date().toISOString()
      };

      if (isNew) {
        console.log('Adding new job application:', updatedJob);
        try {
          addJobApplication(updatedJob);
          console.log('Job application added successfully');
          
          console.log('Navigating to /jobs');
          navigate('/jobs');
          
          console.log('Showing success toast');
          toast({
            title: "Application Added",
            description: "Your job application has been saved successfully.",
          });
        } catch (error) {
          console.error('Error adding job application:', error);
          toast({
            title: "Error",
            description: "Failed to save job application. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        updateJobApplication(job.id, updatedJob);
        setJob(updatedJob);
        setIsEditing(false);
        toast({
          title: "Application Updated",
          description: "Your changes have been saved successfully.",
        });
      }
    }
  };

  const handleFieldUpdate = (field: keyof JobApplication, value: any) => {
    if (!job) return;
    
    setJob({
      ...job,
      [field]: value
    });
    setIsEditing(true);
  };

  const handleExportResume = async () => {
    if (!job.variantId || !masterResume) {
      toast({
        title: "No Resume Selected",
        description: "Please select a resume variant to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      const variant = getVariant(job.variantId);
      if (!variant) {
        toast({
          title: "Variant Not Found",
          description: "The selected resume variant could not be found.",
          variant: "destructive",
        });
        return;
      }

      const resolved = VariantResolver.resolveVariant(masterResume, variant);
      const fileName = `${masterResume.owner.replace(/\s+/g, '-')}_${variant.name.replace(/\s+/g, '-')}_${job.company.replace(/\s+/g, '-')}_${job.role.replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.docx`;
      
      await DocxExporter.exportResume(resolved, variant, fileName);
      
      toast({
        title: "Resume Exported",
        description: `Resume exported for ${job.company} - ${job.role}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVariantName = (variantId?: string) => {
    if (!variantId) return 'No variant selected';
    const variant = variants.find(v => v.id === variantId);
    return variant?.name || 'Unknown variant';
  };

  const getCoverLetterTitle = (coverLetterId?: string) => {
    if (!coverLetterId) return 'No cover letter selected';
    const coverLetter = coverLetters.find(cl => cl.id === coverLetterId);
    return coverLetter?.title || 'Unknown cover letter';
  };

  const statusOptions = [
    { value: 'prospect', label: 'Prospect', description: 'Considering this opportunity' },
    { value: 'applied', label: 'Applied', description: 'Application submitted' },
    { value: 'interview', label: 'Interview', description: 'Interview scheduled or completed' },
    { value: 'offer', label: 'Offer', description: 'Received job offer' },
    { value: 'rejected', label: 'Rejected', description: 'Application declined' },
    { value: 'closed', label: 'Closed', description: 'No longer pursuing' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/jobs')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? 'New Application' : `${job.role} at ${job.company}`}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? 'Add a new job application' : 'Manage your job application'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              Unsaved Changes
            </Badge>
          )}
          
          {!isNew && job.variantId && (
            <Button
              onClick={handleExportResume}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Resume
            </Button>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!job?.company?.trim() || !job?.role?.trim()}
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
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={job.company}
                    onChange={(e) => handleFieldUpdate('company', e.target.value)}
                    placeholder="Enter company name..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={job.role}
                    onChange={(e) => handleFieldUpdate('role', e.target.value)}
                    placeholder="Enter job title..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={job.location || ''}
                    onChange={(e) => handleFieldUpdate('location', e.target.value)}
                    placeholder="City, State or Remote..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={job.salary || ''}
                    onChange={(e) => handleFieldUpdate('salary', e.target.value)}
                    placeholder="e.g., $100k - $150k"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Job Posting URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      value={job.url || ''}
                      onChange={(e) => handleFieldUpdate('url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    {job.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={job.source || ''}
                    onChange={(e) => handleFieldUpdate('source', e.target.value)}
                    placeholder="LinkedIn, Indeed, Referral..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status & Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={job.status} onValueChange={(value) => handleFieldUpdate('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appliedOn">Application Date</Label>
                  <Input
                    id="appliedOn"
                    type="date"
                    value={job.appliedOn || ''}
                    onChange={(e) => handleFieldUpdate('appliedOn', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume & Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents Used
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variant">Resume Variant</Label>
                  <Select 
                    value={job.variantId || ''} 
                    onValueChange={(value) => handleFieldUpdate('variantId', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resume variant..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No variant selected</SelectItem>
                      {variants.map(variant => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Select 
                    value={job.coverLetterId || ''} 
                    onValueChange={(value) => handleFieldUpdate('coverLetterId', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cover letter..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No cover letter selected</SelectItem>
                      {coverLetters.map(letter => (
                        <SelectItem key={letter.id} value={letter.id}>
                          {letter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={job.jdText || ''}
                onChange={(e) => handleFieldUpdate('jdText', e.target.value)}
                placeholder="Paste the job description here for reference..."
                rows={8}
              />
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes & Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={job.notes || ''}
                onChange={(e) => handleFieldUpdate('notes', e.target.value)}
                placeholder="Add notes about the interview process, contacts, follow-ups, etc..."
                rows={5}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.url && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Job Posting
                  </a>
                </Button>
              )}
              
              {job.variantId && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleExportResume}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Resume
                </Button>
              )}
              
              {job.coverLetterId && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/cover-letters/${job.coverLetterId}`)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Cover Letter
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="capitalize">
                  {job.status}
                </Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Resume:</span>
                <span className="text-right text-xs">
                  {getVariantName(job.variantId)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cover Letter:</span>
                <span className="text-right text-xs">
                  {getCoverLetterTitle(job.coverLetterId)}
                </span>
              </div>
              
              {job.appliedOn && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applied:</span>
                  <span className="text-xs">
                    {format(new Date(job.appliedOn), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              
              {!isNew && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-xs">
                    {format(new Date(job.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobEditor;
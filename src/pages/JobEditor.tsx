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
  Calendar,
  Building,
  MapPin,
  FileText,
  User,
  Eye
} from 'lucide-react';
import { JobApplication } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';

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
    getVariant,
    isLoading
  } = useResume();
  const { toast } = useToast();
  
  const [job, setJob] = useState<JobApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    console.log('JobEditor useEffect called with id:', id);
    console.log('jobApplications length:', jobApplications?.length || 0);
    console.log('isLoading:', isLoading);
    
    // Don't proceed if still loading
    if (isLoading) {
      console.log('Still loading data, waiting...');
      return;
    }
    
    // Handle the case where id might be an object or undefined - convert to string
    const actualId = id?.toString() || 'new';
    console.log('Processed id:', actualId);
    
    if (actualId && actualId !== 'new' && actualId !== 'undefined') {
      console.log('Looking for existing job with id:', actualId);
      const foundJob = jobApplications.find(j => j.id === actualId);
      if (foundJob) {
        console.log('Found existing job:', foundJob);
        setJob(foundJob);
        setIsNew(false);
      } else {
        console.log('Job not found, redirecting to /jobs');
        navigate('/jobs');
        toast({
          title: "Application Not Found",
          description: "The requested job application could not be found.",
          variant: "destructive",
        });
      }
    } else {
      // Create new job for 'new', 'undefined', or empty id
      console.log('Creating new job application');
      setIsNew(true);
      const newJob: JobApplication = {
        id: `job-${Date.now()}`,
        company: '',
        role: '',
        location: '',
        status: 'prospect',
        variantId: '',
        coverLetterId: '',
        appliedOn: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('New job created:', newJob);
      setJob(newJob);
      setIsEditing(true);
    }
  }, [id, jobApplications, navigate, toast, isLoading]);

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

  const getVariantName = (variantId: string) => {
    if (!variantId) return 'Select resume variant...';
    if (variantId === 'master') return 'Master Resume';
    const variant = getVariant(variantId);
    return variant?.name || 'Unknown variant';
  };

  const getCoverLetterTitle = (letterid: string) => {
    if (!letterid) return 'Select cover letter...';
    const letter = coverLetters.find(l => l.id === letterid);
    return letter?.title || 'Unknown cover letter';
  };

  const usedByApplications = jobApplications.filter(app => 
    app.id !== job.id && (app.variantId === job.variantId || app.coverLetterId === job.coverLetterId)
  ).length;

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
              {isNew ? 'New Job Application' : `${job.role} at ${job.company}`}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? 'Track a new job application' : 'Edit job application details'}
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
          {/* Basic Job Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Job Information
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
                    placeholder="Company name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={job.role}
                    onChange={(e) => handleFieldUpdate('role', e.target.value)}
                    placeholder="Job title"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={job.location}
                    onChange={(e) => handleFieldUpdate('location', e.target.value)}
                    placeholder="City, State or Remote"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={job.status}
                    onValueChange={(value) => handleFieldUpdate('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appliedOn" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Applied On
                </Label>
                <DatePicker
                  date={job.appliedOn ? new Date(job.appliedOn) : undefined}
                  onDateChange={(date) => handleFieldUpdate('appliedOn', date ? date.toISOString().split('T')[0] : '')}
                  placeholder="Select application date"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resume & Cover Letter Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents Used
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="variant">Resume Used</Label>
                <Select
                  value={job.variantId}
                  onValueChange={(value) => handleFieldUpdate('variantId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resume..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Master Resume</SelectItem>
                    {variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {job.variantId && job.variantId !== 'master' && (
                  <div className="text-sm text-muted-foreground">
                    {getVariant(job.variantId)?.description}
                  </div>
                )}
                {job.variantId === 'master' && (
                  <div className="text-sm text-muted-foreground">
                    Using the complete master resume with all sections
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Select
                  value={job.coverLetterId}
                  onValueChange={(value) => handleFieldUpdate('coverLetterId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cover letter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {coverLetters.map((letter) => (
                      <SelectItem key={letter.id} value={letter.id}>
                        {letter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={job.notes}
                onChange={(e) => handleFieldUpdate('notes', e.target.value)}
                placeholder="Add notes about this application, contacts, interview feedback, etc."
                className="min-h-32"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="capitalize">
                  {job.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              
              {job.appliedOn && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applied</span>
                  <span>{new Date(job.appliedOn).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Usage */}
          {(job.variantId || job.coverLetterId) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Document Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.variantId && (
                  <div>
                    <div className="text-sm font-medium">Resume Used</div>
                    <div className="text-sm text-muted-foreground">
                      {getVariantName(job.variantId)}
                    </div>
                  </div>
                )}
                
                {job.coverLetterId && (
                  <div>
                    <div className="text-sm font-medium">Cover Letter</div>
                    <div className="text-sm text-muted-foreground">
                      {getCoverLetterTitle(job.coverLetterId)}
                    </div>
                  </div>
                )}

                {usedByApplications > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Also used by {usedByApplications} other application{usedByApplications !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Track which resume variants and cover letters work best for different types of roles</p>
              <p>• Use notes to record interview feedback and follow-up actions</p>
              <p>• Keep application dates accurate for chronological reporting</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobEditor;
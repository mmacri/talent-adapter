import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Layers, 
  Briefcase, 
  TrendingUp, 
  Download,
  Plus,
  Eye,
  FileBarChart,
  HelpCircle,
  Target,
  Lightbulb,
  ArrowRight,
  Edit3,
  User,
  CheckCircle,
  AlertCircle,
  FileEdit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelpCard } from '@/components/ui/help-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumePreview from '@/components/resume/ResumePreview';
import { DocxExporter } from '@/lib/docxExport';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const resumeContext = useResume();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add loading guard
  if (!resumeContext || resumeContext.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your resume data...</p>
        </div>
      </div>
    );
  }

  const { 
    masterResume, 
    variants, 
    jobApplications, 
    coverLetters
  } = resumeContext;

  const recentApplications = jobApplications
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const statusCounts = jobApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportMaster = async () => {
    if (!masterResume) return;

    try {
      await DocxExporter.exportResume(
        masterResume,
        undefined,
        `${masterResume.owner.replace(/\s+/g, '-')}_Master_Resume_${format(new Date(), 'yyyy-MM-dd')}.docx`
      );
      toast({
        title: "Master Resume Exported",
        description: "Your master resume has been downloaded as a Word document.",
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

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <HelpCard 
        title="Getting Started with Resume Manager" 
        icon={Lightbulb}
        defaultVisible={variants.length === 0 && jobApplications.length === 0}
      >
        <div className="space-y-2">
          <p>Welcome! Here's how to get started:</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-blue-600" />
              <span>1. Build your <strong>Master Resume</strong> with all experience</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-green-600" />
              <span>2. Create <strong>Variants</strong> for different job types</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-purple-600" />
              <span>3. Track applications and export targeted resumes</span>
            </div>
          </div>
        </div>
      </HelpCard>

      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back, {masterResume?.owner || 'User'}
          </p>
        </div>
      </div>

      {/* Master Resume Status Alert */}
      {!masterResume && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No master resume found. <Link to="/settings" className="underline font-medium">Load your resume data</Link> or <Link to="/master" className="underline font-medium">create a new master resume</Link> to get started.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="master">Master Resume</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats - Mobile responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link to="/variants">
              <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 touch-manipulation">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xl md:text-2xl font-bold">{variants.length}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Resume Variants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/jobs">
              <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 touch-manipulation">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xl md:text-2xl font-bold">{jobApplications.length}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Job Applications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/jobs">
              <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 touch-manipulation">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-success" />
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xl md:text-2xl font-bold">{statusCounts.interview || 0}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Interviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/cover-letters">
              <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 touch-manipulation">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Download className="h-5 w-5 md:h-6 md:w-6 text-warning" />
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xl md:text-2xl font-bold">{coverLetters.length}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Cover Letters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to get you started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <Link to="/master">
                  <Button variant="outline" className="w-full h-auto p-3 md:p-4 flex flex-col items-center gap-2 touch-manipulation">
                    <FileText className="w-5 h-5 md:w-6 md:h-6" />
                    <div className="text-center">
                      <p className="text-sm md:font-medium">Edit Master Resume</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">Update your base resume</p>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/variants/new">
                  <Button variant="outline" className="w-full h-auto p-3 md:p-4 flex flex-col items-center gap-2 touch-manipulation">
                    <Layers className="w-5 h-5 md:w-6 md:h-6" />
                    <div className="text-center">
                      <p className="text-sm md:font-medium">Create Variant</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">Tailor for specific roles</p>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/jobs/new">
                  <Button variant="outline" className="w-full h-auto p-3 md:p-4 flex flex-col items-center gap-2 touch-manipulation">
                    <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                    <div className="text-center">
                      <p className="text-sm md:font-medium">Track Application</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">Log new job applications</p>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/viewer">
                  <Button variant="outline" className="w-full h-auto p-3 md:p-4 flex flex-col items-center gap-2 touch-manipulation">
                    <FileBarChart className="w-5 h-5 md:w-6 md:h-6" />
                    <div className="text-center">
                      <p className="text-sm md:font-medium">Resume Viewer</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">Preview and export resumes</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master" className="space-y-6">
          {masterResume ? (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{masterResume.owner}</CardTitle>
                      <p className="text-sm text-muted-foreground">{masterResume.headline}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ResumePreview 
                      masterResume={masterResume}
                      triggerText="Preview"
                      triggerVariant="outline"
                      triggerIcon={<Eye className="w-4 h-4" />}
                    />
                    <Button variant="outline" onClick={handleExportMaster}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Link to="/master">
                      <Button>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{masterResume.experience?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Work Experience</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{masterResume.education?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Education</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{masterResume.awards?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Awards</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{(masterResume.skills?.primary?.length || 0) + (masterResume.skills?.secondary?.length || 0)}</div>
                    <div className="text-sm text-muted-foreground">Skills</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{masterResume.contacts?.email}</p>
                    <p>{masterResume.contacts?.phone}</p>
                    {masterResume.contacts?.website && <p>{masterResume.contacts.website}</p>}
                    {masterResume.contacts?.linkedin && <p>{masterResume.contacts.linkedin}</p>}
                  </div>
                </div>

                {masterResume.summary && masterResume.summary.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Professional Summary</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {masterResume.summary.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileEdit className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Master Resume</h3>
                <p className="text-muted-foreground mb-4">
                  Create your master resume to get started with targeted job applications.
                </p>
                <div className="flex gap-2 justify-center">
                  <Link to="/settings">
                    <Button variant="outline">Load Resume Data</Button>
                  </Link>
                  <Link to="/master">
                    <Button>Create Master Resume</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Resume Variants</h3>
              <p className="text-sm text-muted-foreground">Targeted versions of your master resume</p>
            </div>
            <Link to="/variants/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Variant
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {variants.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Layers className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Variants Created</h3>
                <p className="text-muted-foreground mb-4">
                  Create targeted resume variants for different job types.
                </p>
                <Link to="/variants/new">
                  <Button>Create Your First Variant</Button>
                </Link>
              </div>
            ) : (
              variants.map((variant) => (
                <Card key={variant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{variant.name}</CardTitle>
                    <CardDescription className="text-sm">{variant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {variant.rules.length} rules
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {variant.overrides.length} overrides
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/variants/${variant.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      {masterResume && (
                        <ResumePreview 
                          masterResume={masterResume}
                          variant={variant}
                          triggerText=""
                          triggerVariant="outline"
                          triggerIcon={<Eye className="w-4 h-4" />}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Job Applications & Cover Letters</h3>
              <p className="text-sm text-muted-foreground">Track your application progress</p>
            </div>
            <div className="flex gap-2">
              <Link to="/cover-letters/new">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Cover Letter
                </Button>
              </Link>
              <Link to="/jobs/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Track Application
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Recent Applications ({jobApplications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No applications tracked yet</p>
                      <Link to="/jobs/new">
                        <Button variant="outline" className="mt-2">
                          Track Your First Application
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium">{app.role}</h4>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`status-${app.status}`}
                            >
                              {app.status}
                            </Badge>
                            {app.location && (
                              <span className="text-xs text-muted-foreground">{app.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Cover Letters ({coverLetters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coverLetters.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No cover letters created yet</p>
                      <Link to="/cover-letters/new">
                        <Button variant="outline" className="mt-2">
                          Create Your First Cover Letter
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    coverLetters.slice(0, 5).map((letter) => (
                      <div key={letter.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium">{letter.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(letter.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated {new Date(letter.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link to={`/cover-letters/${letter.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
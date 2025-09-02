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
  FileBarChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const resumeContext = useResume();
  
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {masterResume?.owner || 'User'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/variants">
          <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{variants.length}</p>
                  <p className="text-sm text-muted-foreground">Resume Variants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/jobs">
          <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{jobApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Job Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/jobs">
          <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{statusCounts.interview || 0}</p>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/cover-letters">
          <Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Download className="h-6 w-6 text-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{coverLetters.length}</p>
                  <p className="text-sm text-muted-foreground">Cover Letters</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Variants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Recent Variants
            </CardTitle>
            <CardDescription>
              Your most recently updated resume variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variants.length === 0 ? (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No variants created yet</p>
                  <Link to="/variants/new">
                    <Button variant="outline" className="mt-2">
                      Create Your First Variant
                    </Button>
                  </Link>
                </div>
              ) : (
                variants.slice(0, 3).map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{variant.name}</h4>
                      <p className="text-sm text-muted-foreground">{variant.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {new Date(variant.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/variants/${variant.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Recent Applications
            </CardTitle>
            <CardDescription>
              Track your job application progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/master">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Edit Master Resume</p>
                  <p className="text-xs text-muted-foreground">Update your base resume</p>
                </div>
              </Button>
            </Link>
            
            <Link to="/variants/new">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <Layers className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Create Variant</p>
                  <p className="text-xs text-muted-foreground">Tailor for specific roles</p>
                </div>
              </Button>
            </Link>
            
            <Link to="/jobs/new">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <Briefcase className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Track Application</p>
                  <p className="text-xs text-muted-foreground">Log new job applications</p>
                </div>
              </Button>
            </Link>
            
            <Link to="/viewer">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <FileBarChart className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Resume Viewer</p>
                  <p className="text-xs text-muted-foreground">Preview and export resumes</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
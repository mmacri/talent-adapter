import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  Calendar,
  FileText,
  Briefcase,
  Target,
  Users,
  Plus
} from 'lucide-react';

const Reports = () => {
  console.log('Reports component rendering');
  const { jobApplications, variants, coverLetters } = useResume();
  
  console.log('Data loaded:', {
    jobApplications: jobApplications?.length || 0,
    variants: variants?.length || 0,
    coverLetters: coverLetters?.length || 0
  });

  // Simple success metrics calculation
  const totalApplications = jobApplications?.length || 0;
  const interviewCount = jobApplications?.filter(app => app.status === 'interview').length || 0;
  const offerCount = jobApplications?.filter(app => app.status === 'offer').length || 0;
  
  const interviewRate = totalApplications > 0 ? ((interviewCount / totalApplications) * 100).toFixed(1) : '0';
  const offerRate = totalApplications > 0 ? ((offerCount / totalApplications) * 100).toFixed(1) : '0';

  console.log('Calculated metrics:', { totalApplications, interviewCount, offerCount, interviewRate, offerRate });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Track your job application performance and document usage patterns
          </p>
        </div>
      </div>

      {/* Success Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-xl font-bold">{totalApplications}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div className="ml-3">
                <p className="text-xl font-bold">{interviewRate}%</p>
                <p className="text-sm text-muted-foreground">Interview Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div className="ml-3">
                <p className="text-xl font-bold">{offerRate}%</p>
                <p className="text-sm text-muted-foreground">Offer Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div className="ml-3">
                <p className="text-xl font-bold">{variants?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Resume Variants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Document Usage</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Resume Variants:</span>
                  <Badge variant="secondary">{variants?.length || 0}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cover Letters:</span>
                  <Badge variant="secondary">{coverLetters?.length || 0}</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Application Status</h4>
              <div className="space-y-1">
                {jobApplications && jobApplications.length > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Applied:</span>
                      <span>{jobApplications.filter(app => app.status === 'applied').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Interviews:</span>
                      <span>{interviewCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Offers:</span>
                      <span>{offerCount}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Success Rates</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Interview Rate:</span>
                  <span className="font-medium">{interviewRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Offer Rate:</span>
                  <span className="font-medium">{offerRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {totalApplications === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Application Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your job applications to see detailed analytics and insights.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Track Your First Application
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
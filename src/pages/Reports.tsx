import { useState, useMemo } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp,
  Calendar,
  FileText,
  Briefcase,
  Target,
  Users,
  Download,
  Filter,
  Plus
} from 'lucide-react';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear, eachWeekOfInterval, eachMonthOfInterval, eachQuarterOfInterval, subMonths, subWeeks, subQuarters, subYears } from 'date-fns';
import { JobApplication } from '@/types/resume';

type TimeRange = 'week' | 'month' | 'quarter' | 'half' | 'year';

const Reports = () => {
  const { jobApplications, variants, coverLetters, masterResume } = useResume();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');

  // Color palette for charts
  const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  // Time range calculations
  const getTimeRangeData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let intervals: Date[] = [];
    
    switch (selectedTimeRange) {
      case 'week':
        startDate = subWeeks(now, 12); // Last 12 weeks
        intervals = eachWeekOfInterval({ start: startDate, end: now });
        break;
      case 'month':
        startDate = subMonths(now, 12); // Last 12 months
        intervals = eachMonthOfInterval({ start: startDate, end: now });
        break;
      case 'quarter':
        startDate = subQuarters(now, 8); // Last 8 quarters (2 years)
        intervals = eachQuarterOfInterval({ start: startDate, end: now });
        break;
      case 'half':
        startDate = subMonths(now, 36); // Last 3 years (6 halves)
        intervals = eachMonthOfInterval({ start: startDate, end: now })
          .filter((_, index) => index % 6 === 0); // Every 6 months
        break;
      case 'year':
        startDate = subYears(now, 5); // Last 5 years
        intervals = [];
        for (let i = 0; i < 5; i++) {
          intervals.push(subYears(now, i));
        }
        intervals.reverse();
        break;
    }

    return intervals.map(intervalStart => {
      let intervalEnd: Date;
      let label: string;

      switch (selectedTimeRange) {
        case 'week':
          intervalEnd = new Date(intervalStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          label = format(intervalStart, 'MMM dd');
          break;
        case 'month':
          intervalEnd = new Date(intervalStart.getFullYear(), intervalStart.getMonth() + 1, 0);
          label = format(intervalStart, 'MMM yyyy');
          break;
        case 'quarter':
          intervalEnd = new Date(intervalStart.getFullYear(), intervalStart.getMonth() + 3, 0);
          label = `Q${Math.floor(intervalStart.getMonth() / 3) + 1} ${intervalStart.getFullYear()}`;
          break;
        case 'half':
          intervalEnd = new Date(intervalStart.getFullYear(), intervalStart.getMonth() + 6, 0);
          label = `H${intervalStart.getMonth() < 6 ? 1 : 2} ${intervalStart.getFullYear()}`;
          break;
        case 'year':
          intervalEnd = new Date(intervalStart.getFullYear(), 11, 31);
          label = intervalStart.getFullYear().toString();
          break;
        default:
          intervalEnd = intervalStart;
          label = format(intervalStart, 'MMM dd');
      }

      const applicationsInPeriod = jobApplications.filter(app => {
        const appDate = new Date(app.appliedOn);
        return appDate >= intervalStart && appDate <= intervalEnd;
      });

      const statusCounts = applicationsInPeriod.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        period: label,
        total: applicationsInPeriod.length,
        applied: statusCounts.applied || 0,
        interview: statusCounts.interview || 0,
        offer: statusCounts.offer || 0,
        rejected: statusCounts.rejected || 0,
        prospect: statusCounts.prospect || 0,
        closed: statusCounts.closed || 0,
        ...statusCounts
      };
    });
  }, [jobApplications, selectedTimeRange]);

  // Application status distribution
  const statusDistribution = useMemo(() => {
    const distribution = jobApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: ((count / jobApplications.length) * 100).toFixed(1)
    }));
  }, [jobApplications]);

  // Most used variants and cover letters
  const variantUsage = useMemo(() => {
    const usage = jobApplications.reduce((acc, app) => {
      if (app.variantId) {
        const variant = variants.find(v => v.id === app.variantId);
        const variantName = variant?.name || 'Unknown Variant';
        acc[variantName] = (acc[variantName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(usage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [jobApplications, variants]);

  const coverLetterUsage = useMemo(() => {
    const usage = jobApplications.reduce((acc, app) => {
      if (app.coverLetterId) {
        const letter = coverLetters.find(l => l.id === app.coverLetterId);
        const letterTitle = letter?.title || 'Unknown Cover Letter';
        acc[letterTitle] = (acc[letterTitle] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(usage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [jobApplications, coverLetters]);

  // Success metrics
  const successMetrics = useMemo(() => {
    const totalApplications = jobApplications.length;
    const interviewCount = jobApplications.filter(app => app.status === 'interview').length;
    const offerCount = jobApplications.filter(app => app.status === 'offer').length;
    const rejectedCount = jobApplications.filter(app => app.status === 'rejected').length;

    return {
      totalApplications,
      interviewRate: totalApplications > 0 ? ((interviewCount / totalApplications) * 100).toFixed(1) : '0',
      offerRate: totalApplications > 0 ? ((offerCount / totalApplications) * 100).toFixed(1) : '0',
      rejectionRate: totalApplications > 0 ? ((rejectedCount / totalApplications) * 100).toFixed(1) : '0',
      conversionRate: interviewCount > 0 ? ((offerCount / interviewCount) * 100).toFixed(1) : '0'
    };
  }, [jobApplications]);

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
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedTimeRange} onValueChange={(value: TimeRange) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="half">Semi-Annual</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
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
                <p className="text-xl font-bold">{successMetrics.totalApplications}</p>
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
                <p className="text-xl font-bold">{successMetrics.interviewRate}%</p>
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
                <p className="text-xl font-bold">{successMetrics.offerRate}%</p>
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
                <p className="text-xl font-bold">{successMetrics.conversionRate}%</p>
                <p className="text-sm text-muted-foreground">Interview to Offer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Applications Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getTimeRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Total Applications"
                />
                <Line 
                  type="monotone" 
                  dataKey="interview" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Interviews"
                />
                <Line 
                  type="monotone" 
                  dataKey="offer" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Offers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications by Status Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getTimeRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applied" stackId="a" fill="hsl(var(--primary))" name="Applied" />
                <Bar dataKey="interview" stackId="a" fill="hsl(var(--success))" name="Interview" />
                <Bar dataKey="offer" stackId="a" fill="hsl(var(--accent))" name="Offer" />
                <Bar dataKey="rejected" stackId="a" fill="hsl(var(--destructive))" name="Rejected" />
                <Bar dataKey="prospect" stackId="a" fill="hsl(var(--muted))" name="Prospect" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Usage Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Resume Variants Created</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{variants.length} variants</Badge>
                <span className="text-sm text-muted-foreground">
                  {variantUsage.length > 0 && `Most used: ${variantUsage[0]?.name}`}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Cover Letters Created</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{coverLetters.length} letters</Badge>
                <span className="text-sm text-muted-foreground">
                  {coverLetterUsage.length > 0 && `Most used: ${coverLetterUsage[0]?.name}`}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Application Success</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Interview Rate:</span>
                  <span className="font-medium">{successMetrics.interviewRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Offer Rate:</span>
                  <span className="font-medium">{successMetrics.offerRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion Rate:</span>
                  <span className="font-medium">{successMetrics.conversionRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Usage Tables */}
      {(variantUsage.length > 0 || coverLetterUsage.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Used Variants */}
          {variantUsage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Most Used Resume Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {variantUsage.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Badge variant="secondary">{item.count} applications</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Most Used Cover Letters */}
          {coverLetterUsage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Most Used Cover Letters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coverLetterUsage.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Badge variant="secondary">{item.count} applications</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {jobApplications.length === 0 && (
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
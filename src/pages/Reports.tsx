import { useState, useMemo } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  Calendar,
  FileText,
  Briefcase,
  Target,
  Users,
  Plus,
  Filter
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { subDays, subWeeks, subMonths, startOfWeek, startOfMonth, startOfQuarter, format, parseISO, isAfter, isBefore } from 'date-fns';

type TimeFilter = 'all' | 'week' | 'month' | '3months' | 'quarter' | '6months' | 'year';

const Reports = () => {
  const { jobApplications, variants, coverLetters } = useResume();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Filter applications based on time period
  const filteredApplications = useMemo(() => {
    if (!jobApplications || timeFilter === 'all') return jobApplications || [];
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeFilter) {
      case 'week':
        cutoffDate = startOfWeek(subWeeks(now, 1));
        break;
      case 'month':
        cutoffDate = startOfMonth(subMonths(now, 1));
        break;
      case '3months':
        cutoffDate = startOfMonth(subMonths(now, 3));
        break;
      case 'quarter':
        cutoffDate = startOfQuarter(subMonths(now, 3));
        break;
      case '6months':
        cutoffDate = startOfMonth(subMonths(now, 6));
        break;
      case 'year':
        cutoffDate = startOfMonth(subMonths(now, 12));
        break;
      default:
        return jobApplications;
    }
    
    return jobApplications.filter(app => {
      const appDate = parseISO(app.appliedOn);
      return isAfter(appDate, cutoffDate);
    });
  }, [jobApplications, timeFilter]);

  // Calculate metrics based on filtered data
  const totalApplications = filteredApplications?.length || 0;
  const interviewCount = filteredApplications?.filter(app => app.status === 'interview').length || 0;
  const offerCount = filteredApplications?.filter(app => app.status === 'offer').length || 0;
  const rejectedCount = filteredApplications?.filter(app => app.status === 'rejected').length || 0;
  const appliedCount = filteredApplications?.filter(app => app.status === 'applied').length || 0;
  const prospectCount = filteredApplications?.filter(app => app.status === 'prospect').length || 0;
  
  const interviewRate = totalApplications > 0 ? ((interviewCount / totalApplications) * 100).toFixed(1) : '0';
  const offerRate = totalApplications > 0 ? ((offerCount / totalApplications) * 100).toFixed(1) : '0';

  // Prepare chart data
  const statusDistribution = [
    { name: 'Applied', value: appliedCount, color: '#3b82f6' },
    { name: 'Interview', value: interviewCount, color: '#10b981' },
    { name: 'Offer', value: offerCount, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
    { name: 'Prospect', value: prospectCount, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  // Timeline data - applications over time
  const timelineData = useMemo(() => {
    if (!filteredApplications?.length) return [];
    
    const grouped = filteredApplications.reduce((acc, app) => {
      const date = format(parseISO(app.appliedOn), 'MMM dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, applications: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Show last 10 data points
  }, [filteredApplications]);

  const chartConfig = {
    applied: { label: 'Applied', color: '#3b82f6' },
    interview: { label: 'Interview', color: '#10b981' },
    offer: { label: 'Offer', color: '#f59e0b' },
    rejected: { label: 'Rejected', color: '#ef4444' },
    prospect: { label: 'Prospect', color: '#8b5cf6' },
  };

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
        
        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
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

      {/* Visual Analytics */}
      {totalApplications > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Application Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Summary
            {timeFilter !== 'all' && (
              <Badge variant="outline" className="ml-2">
                {timeFilter === 'week' ? 'Last Week' :
                 timeFilter === 'month' ? 'Last Month' :
                 timeFilter === '3months' ? 'Last 3 Months' :
                 timeFilter === 'quarter' ? 'Last Quarter' :
                 timeFilter === '6months' ? 'Last 6 Months' :
                 timeFilter === 'year' ? 'Last Year' : 'All Time'}
              </Badge>
            )}
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
                {totalApplications > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Prospect:</span>
                      <span>{prospectCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Applied:</span>
                      <span>{appliedCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Interviews:</span>
                      <span>{interviewCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Offers:</span>
                      <span>{offerCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rejected:</span>
                      <span>{rejectedCount}</span>
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
                {totalApplications > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Conversion:</span>
                    <span className="font-medium">
                      {((interviewCount + offerCount) / totalApplications * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Applications Table */}
      {totalApplications > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status Date</TableHead>
                  <TableHead>Variant Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications?.map((app) => {
                  const variant = variants?.find(v => v.id === app.variantId);
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.company}</TableCell>
                      <TableCell>{app.role}</TableCell>
                      <TableCell>
                        <Badge variant={
                          app.status === 'offer' ? 'default' :
                          app.status === 'interview' ? 'secondary' :
                          app.status === 'rejected' ? 'destructive' :
                          app.status === 'prospect' ? 'outline' :
                          'outline'
                        }>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(app.appliedOn), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {app.statusDate ? format(parseISO(app.statusDate), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>{variant?.name || 'Unknown'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
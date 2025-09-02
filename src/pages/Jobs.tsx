import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter,
  Edit3, 
  ExternalLink,
  Trash2, 
  Calendar,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { JobApplication } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const statusColors = {
  prospect: 'bg-gray-100 text-gray-800 border-gray-200',
  applied: 'bg-blue-100 text-blue-800 border-blue-200',
  interview: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  offer: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
};

const Jobs = () => {
  const { jobApplications, variants, coverLetters, deleteJobApplication } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredJobs = jobApplications.filter(job => {
    const matchesSearch = 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteJob = (jobId: string) => {
    deleteJobApplication(jobId);
    toast({
      title: "Application Deleted",
      description: "The job application has been permanently deleted.",
    });
  };

  const getVariantName = (variantId?: string) => {
    if (!variantId) return 'No variant selected';
    const variant = variants.find(v => v.id === variantId);
    return variant?.name || 'Unknown variant';
  };

  const getCoverLetterTitle = (coverLetterId?: string) => {
    if (!coverLetterId) return 'No cover letter';
    const coverLetter = coverLetters.find(cl => cl.id === coverLetterId);
    return coverLetter?.title || 'Unknown cover letter';
  };

  const getStatusStats = () => {
    const stats = {
      prospect: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      closed: 0
    };

    jobApplications.forEach(job => {
      stats[job.status]++;
    });

    return stats;
  };

  const statusStats = getStatusStats();
  const statusColumns = Object.keys(statusColors) as Array<keyof typeof statusColors>;

  const KanbanColumn = ({ status, jobs }: { status: string, jobs: JobApplication[] }) => (
    <Card className="min-h-96">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium capitalize">
            {status === 'prospect' ? 'Prospects' : status}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {jobs.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="p-3 hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-sm">{job.role}</h4>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
              
              {job.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>
              )}

              {job.appliedOn && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(job.appliedOn), 'MMM d')}
                </div>
              )}

              {job.salary && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="w-3 h-3" />
                  {job.salary}
                </div>
              )}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground">
            Track your job applications and associated resume variants
          </p>
        </div>
        <Button 
          onClick={() => navigate('/jobs/new')} 
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusColumns.map((status) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {status === 'prospect' ? 'Prospects' : status}
                  </p>
                  <p className="text-2xl font-bold">{statusStats[status]}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${statusColors[status].split(' ')[0]}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, roles, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="prospect">Prospects</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'kanban')}>
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company & Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Variant Used</TableHead>
                <TableHead>Cover Letter</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{job.role}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-3 h-3" />
                        {job.company}
                        {job.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusColors[job.status]}
                    >
                      {job.status === 'prospect' ? 'Prospect' : job.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {job.appliedOn ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(job.appliedOn), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not applied</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm">{getVariantName(job.variantId)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm">{getCoverLetterTitle(job.coverLetterId)}</span>
                  </TableCell>
                  
                  <TableCell>
                    {job.salary ? (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {job.salary}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Application</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this job application for "{job.role}" at {job.company}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteJob(job.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statusColumns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              jobs={filteredJobs.filter(job => job.status === status)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Building className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No applications found' : 'No job applications yet'}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? "Try adjusting your search terms or filters."
              : "Start tracking your job applications to stay organized and monitor your progress."
            }
          </p>
          <Button onClick={() => navigate('/jobs/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
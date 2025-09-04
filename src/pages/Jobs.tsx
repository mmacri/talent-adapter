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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  Calendar as CalendarIcon,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Eye,
  Download,
  Printer,
  CalendarRange,
  Upload,
  Table2
} from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { JobApplication } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import * as XLSX from 'xlsx';

const statusColors = {
  prospect: 'bg-gray-100 text-gray-800 border-gray-200',
  applied: 'bg-blue-100 text-blue-800 border-blue-200',
  interview: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  offer: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
};

const Jobs = () => {
  const resumeContext = useResume();
  
  // Add loading guard
  if (!resumeContext || resumeContext.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading job applications...</p>
        </div>
      </div>
    );
  }

  const { jobApplications, variants, coverLetters, deleteJobApplication, clearAllJobApplications, addJobApplication, updateJobApplication } = resumeContext;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importMode, setImportMode] = useState<'update' | 'replace'>('update');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [reportDateRange, setReportDateRange] = useState<'week' | 'month' | '3months' | 'custom'>('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handler for clearing all job applications
  const handleClearAll = () => {
    try {
      clearAllJobApplications();
      toast({
        title: "Applications Cleared",
        description: "All job applications have been successfully removed.",
      });
    } catch (error) {
      console.error('Error clearing applications:', error);
      toast({
        title: "Error",
        description: "Failed to clear applications. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Simple inline DatePickerWithRange component
  const DatePickerWithRange = ({ date, onDateChange }: { date?: DateRange, onDateChange?: (date: DateRange | undefined) => void }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[260px] justify-start text-left font-normal"
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => onDateChange?.(range)}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  };

  const getReportJobs = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (reportDateRange) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
      case 'custom':
        if (!customDateRange?.from) return [];
        startDate = customDateRange.from;
        endDate = customDateRange.to || now;
        break;
      default:
        startDate = startOfMonth(now);
        break;
    }

    return jobApplications
      .filter(job => {
        if (!job.appliedOn) return false;
        const appliedDate = new Date(job.appliedOn);
        return isWithinInterval(appliedDate, { start: startDate, end: endDate });
      })
      .sort((a, b) => {
        const dateA = new Date(a.appliedOn!).getTime();
        const dateB = new Date(b.appliedOn!).getTime();
        return dateB - dateA; // Most recent first
      });
  };

  const handlePrintReport = () => {
    const reportJobs = getReportJobs();
    if (reportJobs.length === 0) {
      toast({
        title: "No Applications Found",
        description: "No job applications found in the selected date range.",
        variant: "destructive",
      });
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive",
      });
      return;
    }

    const getDateRangeText = () => {
      const now = new Date();
      switch (reportDateRange) {
        case 'week':
          return `Week of ${format(startOfWeek(now), 'MMM dd')} - ${format(endOfWeek(now), 'MMM dd, yyyy')}`;
        case 'month':
          return format(now, 'MMMM yyyy');
        case '3months':
          return `${format(subMonths(now, 3), 'MMM yyyy')} - ${format(now, 'MMM yyyy')}`;
        case 'custom':
          if (customDateRange?.from && customDateRange?.to) {
            return `${format(customDateRange.from, 'MMM dd, yyyy')} - ${format(customDateRange.to, 'MMM dd, yyyy')}`;
          } else if (customDateRange?.from) {
            return `Since ${format(customDateRange.from, 'MMM dd, yyyy')}`;
          }
          return 'Custom Range';
        default:
          return '';
      }
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Applications Report - ${getDateRangeText()}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            h1 {
              color: #2563eb;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .report-info {
              margin-bottom: 30px;
              padding: 15px;
              background-color: #f8fafc;
              border-radius: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .summary {
              margin-top: 30px;
              padding: 15px;
              background-color: #ecfdf5;
              border-radius: 8px;
            }
            @media print {
              body {
                margin: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Job Applications Report</h1>
          
          <div class="report-info">
            <h3>Report Details</h3>
            <p><strong>Period:</strong> ${getDateRangeText()}</p>
            <p><strong>Generated:</strong> ${format(new Date(), 'MMMM dd, yyyy \'at\' h:mm a')}</p>
            <p><strong>Total Applications:</strong> ${reportJobs.length}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reportJobs.map(job => `
                <tr>
                  <td>${job.company}</td>
                  <td>${job.role}</td>
                  <td>${job.appliedOn ? format(new Date(job.appliedOn), 'MMM dd, yyyy') : 'Not applied'}</td>
                  <td style="text-transform: capitalize;">${job.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p>This report shows ${reportJobs.length} job application${reportJobs.length !== 1 ? 's' : ''} for the period ${getDateRangeText()}.</p>
            <p>Report generated on ${format(new Date(), 'MMMM dd, yyyy')} by Resume Manager.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };

    setShowReportDialog(false);
    toast({
      title: "Report Generated",
      description: `Print dialog opened for ${reportJobs.length} application${reportJobs.length !== 1 ? 's' : ''}.`,
    });
  };

  // Export functions
  const exportToCSV = () => {
    const csvData = jobApplications.map(job => ({
      'Company': job.company,
      'Role': job.role,
      'Location': job.location || '',
      'Status': job.status,
      'Status Date': job.statusDate || '',
      'Applied Date': job.appliedOn || '',
      'Variant ID': job.variantId || '',
      'Cover Letter ID': job.coverLetterId || '',
      'Notes': job.notes || '',
      'Created At': job.createdAt,
      'Updated At': job.updatedAt
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `job_applications_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Exported",
      description: `Exported ${jobApplications.length} job applications to CSV.`,
    });
  };

  const exportToExcel = () => {
    const excelData = jobApplications.map(job => ({
      'Company': job.company,
      'Role': job.role,
      'Location': job.location || '',
      'Status': job.status,
      'Status Date': job.statusDate || '',
      'Applied Date': job.appliedOn || '',
      'Variant ID': job.variantId || '',
      'Cover Letter ID': job.coverLetterId || '',
      'Notes': job.notes || '',
      'Created At': job.createdAt,
      'Updated At': job.updatedAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');
    
    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `job_applications_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

    toast({
      title: "Excel Exported",
      description: `Exported ${jobApplications.length} job applications to Excel.`,
    });
  };

  // Import functions
  const handleFileImport = async () => {
    if (!importFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV or Excel file to import.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExtension = importFile.name.toLowerCase().split('.').pop();
      let importedData: any[] = [];

      if (fileExtension === 'csv') {
        const text = await importFile.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        importedData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
            const row: any = {};
            headers.forEach((header, index) => {
              const value = values[index]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '';
              row[header] = value;
            });
            return row;
          });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const arrayBuffer = await importFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        importedData = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('Unsupported file format. Please use CSV or Excel files.');
      }

      // Convert imported data to JobApplication format
      const processedApplications: JobApplication[] = importedData
        .filter(row => row.Company && row.Role) // Must have company and role
        .map((row, index) => ({
          id: row.ID || `imported-${Date.now()}-${index}`,
          company: row.Company || '',
          role: row.Role || '',
          location: row.Location || undefined,
          status: (['prospect', 'applied', 'interview', 'offer', 'rejected', 'closed'].includes(row.Status) 
            ? row.Status : 'prospect') as JobApplication['status'],
          statusDate: row['Status Date'] || undefined,
          appliedOn: row['Applied Date'] || new Date().toISOString().split('T')[0],
          variantId: row['Variant ID'] || undefined,
          coverLetterId: row['Cover Letter ID'] || undefined,
          notes: row.Notes || undefined,
          createdAt: row['Created At'] || new Date().toISOString(),
          updatedAt: row['Updated At'] || new Date().toISOString()
        }));

      if (processedApplications.length === 0) {
        toast({
          title: "Import Failed",
          description: "No valid job applications found in the file. Make sure it has Company and Role columns.",
          variant: "destructive",
        });
        return;
      }

      // Apply import mode
      if (importMode === 'replace') {
        // Clear existing applications first
        jobApplications.forEach(job => deleteJobApplication(job.id));
        
        // Add all imported applications
        processedApplications.forEach(app => addJobApplication(app));
        
        toast({
          title: "Import Complete",
          description: `Replaced all applications with ${processedApplications.length} imported records.`,
        });
      } else {
        // Update mode - merge with existing
        let addedCount = 0;
        let updatedCount = 0;

        processedApplications.forEach(importedApp => {
          const existingApp = jobApplications.find(app => 
            app.company.toLowerCase() === importedApp.company.toLowerCase() && 
            app.role.toLowerCase() === importedApp.role.toLowerCase()
          );

          if (existingApp) {
            updateJobApplication(existingApp.id, {
              ...importedApp,
              id: existingApp.id, // Keep existing ID
              updatedAt: new Date().toISOString()
            });
            updatedCount++;
          } else {
            addJobApplication(importedApp);
            addedCount++;
          }
        });

        toast({
          title: "Import Complete",
          description: `Added ${addedCount} new applications and updated ${updatedCount} existing ones.`,
        });
      }

      setShowImportDialog(false);
      setImportFile(null);

    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobApplications.filter(job => {
    const matchesSearch = 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort jobs chronologically by applied date (most recent first)
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const dateA = a.appliedOn ? new Date(a.appliedOn).getTime() : 0;
    const dateB = b.appliedOn ? new Date(b.appliedOn).getTime() : 0;
    return dateB - dateA; // Most recent first
  });

  const handleDeleteJob = (jobId: string) => {
    deleteJobApplication(jobId);
    toast({
      title: "Application Deleted",
      description: "The job application has been permanently deleted.",
    });
  };

  const handleDateChange = (jobId: string, field: 'appliedOn' | 'statusDate', date: Date | undefined) => {
    const job = jobApplications.find(j => j.id === jobId);
    if (job) {
      const dateString = date ? date.toISOString().split('T')[0] : undefined;
      updateJobApplication(jobId, {
        ...job,
        [field]: dateString,
        updatedAt: new Date().toISOString()
      });
    }
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
                  <CalendarIcon className="w-3 h-3" />
                  {format(new Date(job.appliedOn), 'MMM d')}
                </div>
              )}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track your job applications and associated resume variants
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            onClick={() => navigate('/jobs/new')} 
            className="bg-gradient-to-r from-primary to-primary-hover touch-manipulation w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
          
          {/* Clear All Button */}
          {jobApplications.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground touch-manipulation w-full sm:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Job Applications?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {jobApplications.length} job applications from your list. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All Applications
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto touch-manipulation">
                <Printer className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Print Report</span>
                <span className="sm:hidden">Report</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Printer className="w-5 h-5" />
                  Generate Application Report
                </DialogTitle>
                <DialogDescription>
                  Create a printable report of your job applications for tracking and record-keeping.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Report Period</Label>
                  <Select value={reportDateRange} onValueChange={(value: any) => setReportDateRange(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reportDateRange === 'custom' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Custom Date Range</Label>
                    <DatePickerWithRange
                      date={customDateRange}
                      onDateChange={setCustomDateRange}
                    />
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarRange className="w-4 h-4" />
                    <span className="font-medium">Applications in range:</span>
                    <span className="text-primary font-semibold">
                      {getReportJobs().length}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setShowReportDialog(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handlePrintReport} className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Export/Import Dropdown - Mobile responsive */}
          <Select onValueChange={(value) => {
            if (value === 'export-csv') exportToCSV();
            else if (value === 'export-excel') exportToExcel();
            else if (value === 'import') setShowImportDialog(true);
            else if (value === 'download-template') {
              const link = document.createElement('a');
              link.href = '/templates/job-applications-template.csv';
              link.download = 'job-applications-template.csv';
              link.click();
              toast({
                title: "Template Downloaded",
                description: "Job applications template ready for customization.",
              });
            }
          }}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder={
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Export/Import</span>
                  <span className="sm:hidden">Export</span>
                </div>
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="download-template">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Template
                </div>
              </SelectItem>
              <SelectItem value="export-csv">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export to CSV
                </div>
              </SelectItem>
              <SelectItem value="export-excel">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export to Excel
                </div>
              </SelectItem>
              <SelectItem value="import">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import Data
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Import Dialog */}
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import Job Applications
                </DialogTitle>
                <DialogDescription>
                  Import job applications from CSV or Excel files to backup, update, or replace your current data.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Import Mode</Label>
                  <Select value={importMode} onValueChange={(value: any) => setImportMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">Update/Merge (keeps existing data)</SelectItem>
                      <SelectItem value="replace">Replace All (clears existing data)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {importMode === 'update' 
                      ? 'Adds new applications and updates existing ones based on Company + Role match.'
                      : 'Replaces all current applications with imported data.'
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select File</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <Table2 className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm">
                          {importFile ? importFile.name : 'Click to select CSV or Excel file'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: .csv, .xlsx, .xls
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {importFile && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Ready to import:</span>
                      <span className="text-primary">{importFile.name}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium">Required columns:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Company (required)</li>
                    <li>Role (required)</li>
                    <li>Location, Status, Applied Date (optional)</li>
                    <li>Variant ID, Cover Letter ID, Notes (optional)</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      setShowImportDialog(false);
                      setImportFile(null);
                    }} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleFileImport} 
                    disabled={!importFile}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards - Mobile responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {statusColumns.map((status) => (
          <Card key={status}>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground capitalize">
                    {status === 'prospect' ? 'Prospects' : status}
                  </p>
                  <p className="text-lg md:text-2xl font-bold">{statusStats[status]}</p>
                </div>
                <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${statusColors[status].split(' ')[0]}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters - Mobile responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
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
          <SelectTrigger className="w-full sm:w-40">
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
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="table" className="flex-1 sm:flex-initial">Table</TabsTrigger>
            <TabsTrigger value="kanban" className="flex-1 sm:flex-initial">Kanban</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content - Mobile responsive */}
      {viewMode === 'table' ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Company & Role</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Applied Date</TableHead>
                  <TableHead className="min-w-[120px]">Status Date</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell">Variant Used</TableHead>
                  <TableHead className="min-w-[150px] hidden lg:table-cell">Cover Letter</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJobs.map((job) => (
                  <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm md:text-base">{job.role}</div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                          <Building className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                          {job.location && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <MapPin className="w-3 h-3 flex-shrink-0 hidden sm:inline" />
                              <span className="truncate hidden sm:inline">{job.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[job.status]} text-xs`}
                      >
                        <span className="hidden sm:inline">
                          {job.status === 'prospect' ? 'Prospect' : job.status}
                        </span>
                        <span className="sm:hidden">
                          {job.status.charAt(0).toUpperCase()}
                        </span>
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <DatePicker
                        date={job.appliedOn ? new Date(job.appliedOn) : undefined}
                        onDateChange={(date) => handleDateChange(job.id, 'appliedOn', date)}
                        placeholder="Set applied date"
                        className="w-[140px] h-8 text-xs"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <DatePicker
                        date={job.statusDate ? new Date(job.statusDate) : undefined}
                        onDateChange={(date) => handleDateChange(job.id, 'statusDate', date)}
                        placeholder="Set status date"
                        className="w-[140px] h-8 text-xs"
                      />
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm truncate block max-w-[150px]">{getVariantName(job.variantId)}</span>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm truncate block max-w-[150px]">{getCoverLetterTitle(job.coverLetterId)}</span>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="touch-manipulation"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive touch-manipulation"
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
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          {statusColumns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              jobs={sortedJobs.filter(job => job.status === status)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedJobs.length === 0 && (
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
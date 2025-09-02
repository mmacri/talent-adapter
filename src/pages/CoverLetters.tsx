import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2,
  FileText,
  Calendar,
  Variable,
  Eye,
  ExternalLink
} from 'lucide-react';
import { CoverLetter } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { extractVariables, getPreviewText } from '@/lib/coverLetterUtils';

const CoverLetters = () => {
  const { coverLetters, addCoverLetter, deleteCoverLetter, jobApplications } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredLetters = coverLetters.filter(letter =>
    letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLetter = () => {
    const newLetter: CoverLetter = {
      id: `letter-${Date.now()}`,
      title: 'New Cover Letter',
      body: `Dear Hiring Manager,

I am writing to express my strong interest in the {{role}} position at {{company}}. With my background in {{field}}, I am confident that I would be a valuable addition to your team.

{{reason_for_interest}}

In my previous roles, I have demonstrated:
• {{key_achievement_1}}
• {{key_achievement_2}}
• {{key_achievement_3}}

I am particularly drawn to {{company}} because {{company_reason}}. I believe my skills in {{relevant_skills}} would contribute significantly to {{specific_goal}}.

Thank you for considering my application. I look forward to the opportunity to discuss how my experience and passion can contribute to {{company}}'s continued success.

Best regards,
{{your_name}}`,
      variables: ['company', 'role', 'field', 'reason_for_interest', 'key_achievement_1', 'key_achievement_2', 'key_achievement_3', 'company_reason', 'relevant_skills', 'specific_goal', 'your_name'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addCoverLetter(newLetter);
    navigate(`/cover-letters/${newLetter.id}`);
  };

  const handleDuplicateLetter = (letter: CoverLetter) => {
    const duplicatedLetter: CoverLetter = {
      ...letter,
      id: `letter-${Date.now()}`,
      title: `${letter.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addCoverLetter(duplicatedLetter);
    toast({
      title: "Cover Letter Duplicated",
      description: `Created a copy of "${letter.title}"`,
    });
  };

  const handleDeleteLetter = (letterId: string) => {
    // Check if letter is being used by any job applications
    const usedByJobs = jobApplications.filter(job => job.coverLetterId === letterId);
    
    if (usedByJobs.length > 0) {
      toast({
        title: "Cannot Delete",
        description: `This cover letter is being used by ${usedByJobs.length} job application(s).`,
        variant: "destructive",
      });
      return;
    }

    deleteCoverLetter(letterId);
    toast({
      title: "Cover Letter Deleted",
      description: "The cover letter has been permanently deleted.",
    });
  };

  const getUsageCount = (letterId: string) => {
    return jobApplications.filter(job => job.coverLetterId === letterId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cover Letters</h1>
          <p className="text-muted-foreground">
            Create and manage reusable cover letter templates with variables
          </p>
        </div>
        <Button onClick={handleCreateLetter} className="bg-gradient-to-r from-primary to-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          New Cover Letter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Letters</p>
                <p className="text-2xl font-bold">{coverLetters.length}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Use</p>
                <p className="text-2xl font-bold">
                  {new Set(jobApplications.filter(job => job.coverLetterId).map(job => job.coverLetterId)).size}
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">
                  {jobApplications.filter(job => job.coverLetterId).length}
                </p>
              </div>
              <Variable className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search cover letters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cover Letters Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLetters.map((letter) => {
          const variables = extractVariables(letter.body);
          const usageCount = getUsageCount(letter.id);
          
          return (
            <Card key={letter.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{letter.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {format(new Date(letter.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/cover-letters/${letter.id}`)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateLetter(letter)}
                    >
                      <Copy className="w-4 h-4" />
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
                          <AlertDialogTitle>Delete Cover Letter</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{letter.title}"? 
                            {usageCount > 0 && (
                              <span className="block mt-2 text-destructive">
                                This cover letter is being used by {usageCount} job application(s).
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteLetter(letter.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={usageCount > 0}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Preview</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getPreviewText(letter.body)}
                  </p>
                </div>

                {/* Variables */}
                {variables.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Variable className="w-4 h-4" />
                      <span className="text-sm font-medium">Variables ({variables.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {variables.slice(0, 4).map((variable, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                      {variables.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{variables.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Usage Stats */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {usageCount > 0 ? (
                      <Badge variant="secondary">
                        Used in {usageCount} application{usageCount !== 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not used</Badge>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/cover-letters/${letter.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLetters.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No cover letters found' : 'No cover letters yet'}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms or create a new cover letter."
              : "Create reusable cover letter templates with variables for different job applications."
            }
          </p>
          <Button onClick={handleCreateLetter}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Cover Letter
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoverLetters;
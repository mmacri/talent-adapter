import { useEffect } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { useToast } from '@/hooks/use-toast';
import { transformToResumeMaster } from '@/lib/mikeResumeData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Briefcase, GraduationCap, Award, Target } from 'lucide-react';

const LoadMikeResume = () => {
  const { setMasterResume, masterResume } = useResume();
  const { toast } = useToast();

  const handleLoadResume = () => {
    try {
      const mikeResume = transformToResumeMaster();
      setMasterResume(mikeResume);
      
      toast({
        title: "Resume Loaded Successfully",
        description: "Mike Macri's complete resume has been loaded into the system.",
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "There was an error loading the resume data.",
        variant: "destructive",
      });
    }
  };

  const stats = masterResume ? [
    { icon: User, label: 'Contact Info', value: 'Complete', color: 'text-green-600' },
    { icon: Target, label: 'Key Achievements', value: masterResume.key_achievements.length, color: 'text-blue-600' },
    { icon: Briefcase, label: 'Experience', value: masterResume.experience.length, color: 'text-purple-600' },
    { icon: GraduationCap, label: 'Education', value: masterResume.education.length, color: 'text-orange-600' },
    { icon: Award, label: 'Awards', value: masterResume.awards.length, color: 'text-red-600' }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Load Mike Macri's Resume</h1>
        <p className="text-muted-foreground mt-2">
          Load the complete resume data into the system
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Resume Data Preview
            </CardTitle>
            <CardDescription>
              This will load Mike Macri's complete professional resume including all experience, education, awards, and achievements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {masterResume && masterResume.owner === 'Mike Macri' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Mike's resume is currently loaded</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                        <IconComponent className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-sm font-medium">{stat.label}</div>
                        <div className="text-lg font-bold">{stat.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Click below to load the complete resume with:
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span>Complete contact information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>6 key achievements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <span>6 positions of experience</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-orange-600" />
                      <span>MBA + Bachelor's degree</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-600" />
                      <span>6 professional awards</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleLoadResume}
              className="w-full"
              size="lg"
            >
              {masterResume && masterResume.owner === 'Mike Macri' ? 'Reload Resume Data' : 'Load Resume Data'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadMikeResume;
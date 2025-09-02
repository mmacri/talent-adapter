import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Layers, 
  Briefcase, 
  Mail, 
  Download, 
  Edit, 
  Upload,
  Filter,
  Target,
  Settings2,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const Guide = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resume Manager Guide</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to create targeted resumes efficiently using our comprehensive system
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="master">Master Resume</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                How Resume Manager Works
              </CardTitle>
              <CardDescription>
                A complete system for creating targeted resume versions from a single master resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10">
                  <FileText className="w-12 h-12 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">1. Build Master Resume</h3>
                  <p className="text-sm text-muted-foreground">Create your comprehensive resume with all experience, skills, and achievements</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-gradient-to-br from-accent/5 to-accent/10">
                  <Layers className="w-12 h-12 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">2. Create Variants</h3>
                  <p className="text-sm text-muted-foreground">Generate targeted versions using rules and field overrides for specific roles</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-gradient-to-br from-secondary/20 to-secondary/5">
                  <Download className="w-12 h-12 text-foreground mb-3" />
                  <h3 className="font-semibold mb-2">3. Export & Apply</h3>
                  <p className="text-sm text-muted-foreground">Download professional Word documents ready for job applications</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Benefits</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Maintain Consistency</p>
                      <p className="text-sm text-muted-foreground">Single source of truth for all your information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Target Specific Roles</p>
                      <p className="text-sm text-muted-foreground">Customize content for different job types</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Save Time</p>
                      <p className="text-sm text-muted-foreground">No more copy-pasting between documents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Version Control</p>
                      <p className="text-sm text-muted-foreground">Track changes and maintain history</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Master Resume
              </CardTitle>
              <CardDescription>
                Your complete professional profile - the foundation for all variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What to Include</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge variant="secondary">Contact</Badge>
                    <div>
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-muted-foreground">Name, email, phone, LinkedIn, location, professional summary</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge variant="secondary">Experience</Badge>
                    <div>
                      <p className="font-medium">Work History</p>
                      <p className="text-sm text-muted-foreground">All jobs, achievements, responsibilities - include everything you might need</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge variant="secondary">Skills</Badge>
                    <div>
                      <p className="font-medium">Technical & Soft Skills</p>
                      <p className="text-sm text-muted-foreground">Comprehensive list of all your capabilities and technologies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge variant="secondary">Education</Badge>
                    <div>
                      <p className="font-medium">Academic Background</p>
                      <p className="text-sm text-muted-foreground">Degrees, certifications, courses, relevant academic projects</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Best Practices</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span><strong>Be comprehensive:</strong> Include all relevant experience, even if you don't use it in every variant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span><strong>Use action verbs:</strong> Start bullet points with strong action words (achieved, developed, led)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span><strong>Quantify achievements:</strong> Include numbers, percentages, and measurable outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span><strong>Keep it current:</strong> Regularly update with new skills and achievements</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-6 h-6 text-accent" />
                Creating Targeted Variants
              </CardTitle>
              <CardDescription>
                Customize your resume for specific roles and industries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Content Rules
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Include/Exclude Sections</p>
                      <p className="text-xs text-muted-foreground">Show only relevant sections for specific roles</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Keyword Filtering</p>
                      <p className="text-xs text-muted-foreground">Highlight experience matching job requirements</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Priority Reordering</p>
                      <p className="text-xs text-muted-foreground">Put most relevant experience first</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Field Overrides
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Custom Summaries</p>
                      <p className="text-xs text-muted-foreground">Tailor professional summary for each role</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Role-Specific Skills</p>
                      <p className="text-xs text-muted-foreground">Emphasize relevant technical skills</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Job Titles</p>
                      <p className="text-xs text-muted-foreground">Adjust titles to match industry terminology</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Example Scenarios</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border">
                    <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Frontend Developer Role</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Emphasize React, JavaScript skills; prioritize web development experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border">
                    <Settings2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">DevOps Engineer Role</p>
                      <p className="text-sm text-green-700 dark:text-green-300">Highlight cloud platforms, CI/CD; focus on infrastructure experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border">
                    <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">Senior Leadership Role</p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Emphasize management experience; include team size and budget responsibility</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Workflow</CardTitle>
              <CardDescription>Step-by-step process for maximum efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Build Your Master Resume",
                    description: "Start with a comprehensive resume including all your experience",
                    actions: ["Add all work experience", "Include every skill you have", "List all education and certifications", "Write a general professional summary"]
                  },
                  {
                    step: 2,
                    title: "Analyze Job Postings",
                    description: "Use the Jobs section to track opportunities and requirements",
                    actions: ["Save job postings you're interested in", "Note key requirements and skills", "Identify common themes across similar roles"]
                  },
                  {
                    step: 3,
                    title: "Create Targeted Variants",
                    description: "Build variants for different types of roles",
                    actions: ["Create variants for each role type", "Set up content rules to filter relevant experience", "Override fields with role-specific content", "Test different approaches"]
                  },
                  {
                    step: 4,
                    title: "Generate & Apply",
                    description: "Export professional documents and track applications",
                    actions: ["Export variants as Word documents", "Customize cover letters for each application", "Track application status", "Update master resume regularly"]
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <ul className="space-y-1">
                        {item.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="font-medium text-sm">Use Tags Strategically</p>
                  <p className="text-xs text-muted-foreground">Tag experience items to easily filter them in variants</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Version Control</p>
                  <p className="text-xs text-muted-foreground">Export and backup your master resume regularly</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Test Different Approaches</p>
                  <p className="text-xs text-muted-foreground">Create multiple variants for the same role type to see what works</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚠️ Common Pitfalls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="font-medium text-sm">Over-Customization</p>
                  <p className="text-xs text-muted-foreground">Don't create a new variant for every single job - group similar roles</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Forgetting Updates</p>
                  <p className="text-xs text-muted-foreground">Keep your master resume current to ensure all variants benefit</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Ignoring ATS</p>
                  <p className="text-xs text-muted-foreground">Use keywords from job postings to pass applicant tracking systems</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Guide;
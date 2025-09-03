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
  ArrowRight,
  BarChart,
  Eye,
  Calendar,
  List,
  Tag,
  Diff,
  FileSpreadsheet
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="master">Master Resume</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
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
                    Advanced Rules System
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tag Filtering
                      </p>
                      <p className="text-xs text-muted-foreground">Include or exclude experience based on tags</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <List className="w-4 h-4" />
                        Content Limits
                      </p>
                      <p className="text-xs text-muted-foreground">Limit bullet points per experience entry</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <List className="w-4 h-4" />
                        Section Ordering
                      </p>
                      <p className="text-xs text-muted-foreground">Reorder sections (Summary, Experience, Skills, etc.)</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Filtering
                      </p>
                      <p className="text-xs text-muted-foreground">Show only experience within specific date ranges</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Custom Content & Overrides
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Section Enable/Disable</p>
                      <p className="text-xs text-muted-foreground">Show or hide entire sections per variant</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Custom Summaries</p>
                      <p className="text-xs text-muted-foreground">Role-specific professional summary content</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">Key Achievement Overrides</p>
                      <p className="text-xs text-muted-foreground">Highlight different achievements per role type</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Diff className="w-4 h-4" />
                        Advanced Field Overrides
                      </p>
                      <p className="text-xs text-muted-foreground">Granular control over any field using path notation</p>
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
                    title: "Organize with Tags & Structure",
                    description: "Tag your experience entries for easy filtering in variants",
                    actions: ["Tag each experience with relevant keywords (e.g., 'Leadership', 'AI', 'Partner')", "Use consistent tagging across similar experiences", "Organize sections in logical order", "Review and update contact information including LinkedIn"]
                  },
                  {
                    step: 3,
                    title: "Track Job Opportunities",
                    description: "Use the Jobs section to manage applications and requirements",
                    actions: ["Add job applications with company and role details", "Note key requirements and skills from job postings", "Import/export applications via CSV or Excel", "Track application status and interview progress"]
                  },
                  {
                    step: 4,
                    title: "Create Targeted Variants",
                    description: "Build variants for different types of roles using the 5-tab system",
                    actions: ["Content: Set custom summaries and key achievements", "Sections: Enable/disable sections per variant", "Order: Arrange sections in optimal order", "Rules: Apply tag filtering, limits, and date ranges", "Advanced: Use field overrides for granular control"]
                  },
                  {
                    step: 5,
                    title: "Preview & Export",
                    description: "Use the Resume Viewer and export professional documents",
                    actions: ["Preview all variants in the Resume Viewer", "Compare different versions side-by-side", "Export variants as Word documents with standardized formatting", "Create matching cover letters using templates"]
                  },
                  {
                    step: 6,
                    title: "Track & Analyze Performance",
                    description: "Monitor application success and optimize your approach",
                    actions: ["Update job application statuses as they progress", "Review Reports to see success rates and trends", "Identify which variants perform best", "Refine your approach based on analytics data"]
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

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Application Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Application Management</p>
                      <p className="text-xs text-muted-foreground">Track company, role, status, and application dates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Document Association</p>
                      <p className="text-xs text-muted-foreground">Link which resume variant and cover letter you used</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">CSV/Excel Import/Export</p>
                      <p className="text-xs text-muted-foreground">Bulk manage applications with spreadsheet tools</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Print Reports</p>
                      <p className="text-xs text-muted-foreground">Generate formatted reports with date filtering</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  Cover Letter Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Template System</p>
                      <p className="text-xs text-muted-foreground">Create reusable cover letter templates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Variable Substitution</p>
                      <p className="text-xs text-muted-foreground">Use placeholders like {`{{company}}`} and {`{{role}}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Rich Text Editing</p>
                      <p className="text-xs text-muted-foreground">Full WYSIWYG editor for professional formatting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Usage Tracking</p>
                      <p className="text-xs text-muted-foreground">See which letters are associated with applications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-secondary-foreground" />
                  Resume Viewer & Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">All Versions Display</p>
                      <p className="text-xs text-muted-foreground">View master resume + all resolved variants</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Complete Content View</p>
                      <p className="text-xs text-muted-foreground">Full resume content with proper contact info display</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Individual Export</p>
                      <p className="text-xs text-muted-foreground">Export each version separately to Word format</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Copy JSON Data</p>
                      <p className="text-xs text-muted-foreground">Copy raw data for debugging or external tools</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-success" />
                  Analytics & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Success Rate Analysis</p>
                      <p className="text-xs text-muted-foreground">Track interview and offer conversion rates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Time-based Trends</p>
                      <p className="text-xs text-muted-foreground">Weekly, monthly, quarterly analysis views</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Document Effectiveness</p>
                      <p className="text-xs text-muted-foreground">Identify which variants and cover letters work best</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Visual Charts</p>
                      <p className="text-xs text-muted-foreground">Line charts, pie charts, and bar charts for insights</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Enhanced Import/Export System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Standardized Formatting</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Consistent filename generation across all exports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Standardized date formatting throughout the application
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Professional Word document formatting
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Bulk Operations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      CSV/Excel import with update or replace modes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Bulk export of job applications and data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Template downloads for easy data entry
                    </li>
                  </ul>
                </div>
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
                  <p className="font-medium text-sm">Use the 5-Tab Variant System</p>
                  <p className="text-xs text-muted-foreground">Content → Sections → Order → Rules → Advanced for complete customization</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Tag Strategically</p>
                  <p className="text-xs text-muted-foreground">Use consistent tags like 'Leadership', 'Partner', 'AI' for easy filtering</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Leverage Section Ordering</p>
                  <p className="text-xs text-muted-foreground">Put most relevant sections first - drag and drop to reorder</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Use the Resume Viewer</p>
                  <p className="text-xs text-muted-foreground">Compare all versions side-by-side before applying</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Track Everything</p>
                  <p className="text-xs text-muted-foreground">Link applications to specific variants for performance analysis</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Analyze Performance</p>
                  <p className="text-xs text-muted-foreground">Use Reports to identify which variants get the best results</p>
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
                  <p className="text-xs text-muted-foreground">Keep your master resume current so all variants benefit from improvements</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Ignoring LinkedIn URLs</p>
                  <p className="text-xs text-muted-foreground">Make sure your LinkedIn URL is properly formatted and displays correctly</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Not Using Analytics</p>
                  <p className="text-xs text-muted-foreground">Review your Reports regularly to optimize your approach</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Inconsistent Tagging</p>
                  <p className="text-xs text-muted-foreground">Use consistent tag names to make filtering rules more effective</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Missing Backups</p>
                  <p className="text-xs text-muted-foreground">Export and backup your master resume and variants regularly</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚀 Advanced Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Variant Optimization</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Create A/B test variants for the same role type</li>
                    <li>• Use date range rules to emphasize recent experience</li>
                    <li>• Combine multiple rule types for precise filtering</li>
                    <li>• Use advanced overrides for company-specific customizations</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Data Management</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Import job applications from spreadsheets</li>
                    <li>• Export application data for external analysis</li>
                    <li>• Use the template download system for consistent data entry</li>
                    <li>• Regular backup your data using JSON export</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Guide;
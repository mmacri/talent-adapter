# Resume Builder Application - Complete Agent Documentation

## Overview
This is a comprehensive, production-ready resume builder application built with React 18.3.1, TypeScript, Vite, and Tailwind CSS. The application enables users to create a master resume, generate targeted variants for different job applications, track job application performance, manage cover letters, and analyze application success through detailed analytics and reporting.

## Current Application State & Features

### 1. Dashboard (`/`) - Central Overview
**Purpose**: Centralized hub showing application overview and quick access to all features
**Current Features**:
- Welcome message with user's name from master resume
- Four statistical cards showing:
  - Resume Variants count (clickable → `/variants`)
  - Job Applications count (clickable → `/jobs`) 
  - Active Interviews count (clickable → `/jobs`)
  - Cover Letters count (clickable → `/cover-letters`)
- Recent Variants section (last 3 updated variants)
- Recent Applications section (last 5 applications by update date)
- Quick Actions grid with 4 buttons:
  - Edit Master Resume → `/master`
  - Create Variant → `/variants/new`
  - Track Application → `/jobs/new`
  - Resume Viewer → `/viewer`

**Recent Changes**: Removed the "+ New Variant" button from the page header, keeping only the one in Quick Actions

### 2. Master Resume Management (`/master`)
**Purpose**: Central hub for maintaining the core resume content that serves as the foundation for all variants
**Current Features**:
- **Personal Information**: Contact details (email, phone, website, LinkedIn), headline
- **Professional Summary**: Rich text editing with TipTap editor, bullet-point management
- **Key Achievements**: Separate section for notable accomplishments
- **Work Experience**: 
  - Company, title, location, start/end dates
  - Multiple bullet points per position
  - Tag-based categorization system for filtering
  - Drag & drop reordering
- **Education**: Degree, school, location, year
- **Awards & Recognition**: Title, date, description
- **Skills**: Primary and secondary skill categories
- **Section Management**: Enable/disable sections, reorder sections
- **Real-time Preview**: Live preview as you edit
- **Export Capabilities**: Preview modal and Word document export
- **Auto-save**: Automatic persistence to localStorage

### 3. Resume Variants System (`/variants`)
**Purpose**: Create targeted versions of the master resume for specific job types or applications
**Current Features**:
- **Variant List**: Search, filter, and manage all variants
- **+ New Variant Button**: Creates new variants (primary creation point)
- **Rules Engine** with 5 rule types:
  - `include_tags`: Show only experience entries with specific tags
  - `exclude_tags`: Hide experience entries with certain tags  
  - `max_bullets`: Limit number of bullet points per experience entry
  - `section_order`: Reorder resume sections for different emphasis
  - `date_range`: Filter experience by date ranges
- **Override System**: Granular path-based content modifications
  - Operations: `set`, `add`, `remove`
  - Target any content path (e.g., `experience.0.bullets.0`)
- **Section Settings**: Enable/disable sections per variant
- **Custom Content**: Variant-specific summary and key achievements
- **Preview System**: Side-by-side comparison of master vs resolved variant
- **Duplication**: Clone existing variants as starting points
- **Export**: Individual variant export to Word documents
- **Real-time Resolution**: Live preview of rule application

### 4. Job Application Tracking (`/jobs`)
**Purpose**: Comprehensive job application lifecycle management with document associations
**Current Data Model**:
```typescript
{
  id: string;
  company: string;
  role: string;
  location: string;
  status: 'prospect' | 'applied' | 'interview' | 'offer' | 'rejected' | 'closed';
  variantId: string;        // Links to resume variant used
  coverLetterId: string;    // Links to cover letter used  
  appliedOn: string;        // ISO date string
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

**Current Features**:
- **Application Management**: Add, edit, delete applications
- **Status Workflow**: prospect → applied → interview → offer/rejected/closed
- **Document Association**: Track which resume variant and cover letter were used
- **Search & Filter**: Full-text search and status-based filtering
- **Table View**: Sortable columns with all application data
- **Print Reports**: Generate printable reports with date range filtering:
  - This week, This month, Last 3 months, Custom range
  - Shows Company, Role, Applied Date, Status
- **CSV/Excel Import/Export**:
  - Export current list to CSV or Excel format
  - Import from CSV/Excel with two modes:
    - Update/Merge: Add new applications, update existing
    - Replace All: Clear list and import new data
- **Clear All Applications**: Bulk delete all applications with confirmation
- **Notes System**: Track follow-ups, interview feedback, etc.

### 5. Cover Letter Management (`/cover-letters`)
**Purpose**: Create and manage reusable cover letter templates with variable substitution
**Current Features**:
- **Template System**: Create reusable cover letter templates
- **Variable Placeholders**: Support for `{{company}}`, `{{role}}`, etc.
- **Rich Text Editing**: Full WYSIWYG editor for formatting
- **Usage Tracking**: See which cover letters are associated with applications
- **Version Management**: Track creation and modification dates
- **Export Capabilities**: Generate final cover letters for applications

### 6. Resume Viewer (`/viewer`)
**Purpose**: Preview, compare, and export all resume versions in one place
**Current Features**:
- **All Resume Versions Display**: Shows master resume + all resolved variants
- **Complete Content View**: Full resume content for each version (not just names)
- **Individual Cards**: Each resume version in its own expandable card
- **Export Buttons**: Export individual resumes to Word format
- **Copy JSON**: Copy resume data to clipboard for debugging
- **Full Preview**: Modal preview for detailed viewing
- **Version Comparison**: Easy side-by-side comparison of different versions
- **Compact Display**: Optimized layout for scanning multiple versions

### 7. Reports & Analytics (`/reports`)
**Purpose**: Comprehensive analytics on application performance and document effectiveness
**Current Features**:
- **Time-based Analysis**: Weekly, monthly, quarterly, semi-annual, yearly views
- **Key Metrics**:
  - Total applications submitted
  - Interview rate (applications → interviews)
  - Offer rate (applications → offers)  
  - Conversion rate (interviews → offers)
- **Visualizations**:
  - Line charts for application trends over time
  - Pie charts for status distribution
  - Bar charts for period comparisons
- **Document Effectiveness**: Most successful resume variants and cover letters
- **Performance Trends**: Historical success rate analysis

## Technical Architecture

### Frontend Stack
- **React 18.3.1**: Core framework with hooks and functional components
- **TypeScript**: Full type safety across application
- **Vite**: Fast development server and optimized production builds
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Radix UI**: Accessible component primitives via shadcn/ui

### Key Libraries
```json
{
  "@tiptap/react": "Rich text editing",
  "@tanstack/react-query": "Data fetching and caching", 
  "date-fns": "Date manipulation and formatting",
  "recharts": "Chart visualization",
  "docx": "Word document generation",
  "xlsx": "Excel file processing",
  "react-router-dom": "Client-side routing",
  "react-hook-form + zod": "Form handling and validation",
  "jsondiffpatch": "Data comparison utilities"
}
```

### State Management
- **React Context**: `ResumeContext` provides centralized state management
- **Local Storage**: All data persisted to browser localStorage
- **No Backend**: Fully client-side application with no server dependencies
- **Seed Data**: Automatic initialization with sample data on first load

### Data Storage Structure
```typescript
// Storage modules in src/lib/storage.ts
localStorage.setItem('resume_master', masterResume);
localStorage.setItem('resume_variants', variants);  
localStorage.setItem('job_applications', jobApplications);
localStorage.setItem('cover_letters', coverLetters);
localStorage.setItem('resume_templates', templates);
```

### Component Architecture
```
src/
├── components/
│   ├── ui/                    # Shadcn/ui components (40+ components)
│   ├── layout/               # App layout components
│   │   ├── MainLayout.tsx    # Main app shell with sidebar
│   │   └── AppSidebar.tsx    # Navigation sidebar
│   └── resume/               # Resume-specific components
│       ├── ContentTree.tsx          # Hierarchical content navigation
│       ├── ResumePreview.tsx        # Full resume preview modal
│       ├── SectionEditor.tsx        # Individual section editing
│       ├── TagManager.tsx           # Tag management interface
│       ├── TipTapEditor.tsx         # Rich text editor wrapper
│       ├── VariantContentEditor.tsx # Custom content editing
│       ├── VariantOverridesEditor.tsx # Manual overrides interface  
│       ├── VariantRulesEditor.tsx     # Rules configuration
│       ├── VariantSectionSettings.tsx # Section enable/disable
│       └── VersionHistory.tsx         # Version management
├── pages/                    # Main application pages
│   ├── Dashboard.tsx         # Overview and quick stats
│   ├── MasterResume.tsx      # Master resume editing
│   ├── Variants.tsx          # Variant list and management
│   ├── VariantEditor.tsx     # Individual variant editing  
│   ├── Jobs.tsx             # Job application tracking
│   ├── JobEditor.tsx        # Individual job editing
│   ├── CoverLetters.tsx     # Cover letter management
│   ├── CoverLetterEditor.tsx # Individual cover letter editing
│   ├── ResumeViewer.tsx     # Resume preview and export
│   ├── Reports.tsx          # Analytics and reporting
│   └── Index.tsx            # Landing/template page
├── contexts/                # React Context providers
│   └── ResumeContext.tsx    # Main application state
├── lib/                     # Business logic and utilities
│   ├── storage.ts           # Data persistence layer
│   ├── variantResolver.ts   # Variant rule processing engine
│   ├── docxExport.ts       # Word document generation
│   ├── coverLetterUtils.ts  # Cover letter processing
│   ├── seedData.ts         # Initial data setup
│   └── utils.ts            # Common utilities
└── types/                  # TypeScript definitions
    └── resume.ts           # All data model interfaces
```

### Routing Structure
```typescript
// Routes defined in src/App.tsx
"/" → Dashboard
"/master" → MasterResume
"/variants" → Variants (list)
"/variants/new" → VariantEditor (create)
"/variants/:id" → VariantEditor (edit)
"/jobs" → Jobs (list)  
"/jobs/new" → JobEditor (create)
"/jobs/:id" → JobEditor (edit)
"/cover-letters" → CoverLetters (list)
"/cover-letters/new" → CoverLetterEditor (create) 
"/cover-letters/:id" → CoverLetterEditor (edit)
"/viewer" → ResumeViewer
"/reports" → Reports
```

## Data Models & Relationships

### Core Entities
```typescript
interface ResumeMaster {
  id: string;
  owner: string;
  contacts: Contact;
  headline: string; 
  summary: string[];
  key_achievements: string[];
  experience: Experience[];
  education: Education[];
  awards: Award[];
  skills: { primary: string[]; secondary: string[]; };
  sections: Record<string, { enabled: boolean; order: number; }>;
  createdAt: string;
  updatedAt: string;
}

interface Variant {
  id: string;
  name: string;
  description: string;
  rules: VariantRule[];
  overrides: VariantOverride[];
  customSummary?: string[];
  customKeyAchievements?: string[];
  sectionSettings: Record<string, { enabled: boolean; useCustom?: boolean; }>;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  variantId?: string;
  coverLetterId?: string;
  appliedOn: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface CoverLetter {
  id: string;
  name: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Entity Relationships
- **Master Resume** (1) → **Variants** (many)
- **Job Application** (many) → **Variant** (1)
- **Job Application** (many) → **Cover Letter** (1)
- **Master Resume** sections → **Variant** section settings

## Advanced Features

### Variant Resolution Engine
Located in `src/lib/variantResolver.ts`:
- **Rule Processing**: Applies rules in specific order (filters → limits → overrides)
- **Deep Cloning**: Creates independent copies to avoid mutation
- **Tag Filtering**: Supports complex include/exclude tag logic
- **Content Limiting**: Respects bullet point and section limits
- **Override Application**: Applies path-based modifications last
- **Validation**: Ensures referential integrity between master and variant

### Import/Export System
- **Word Document Export**: Professional formatting with proper indentation
- **CSV/Excel Processing**: Full bidirectional data exchange
- **JSON Export**: Raw data export for backup/debugging
- **Print Reports**: Formatted reports for offline analysis

### Analytics Engine
- **Time Series Analysis**: Tracks application patterns over time
- **Success Rate Calculations**: Interview and offer conversion rates
- **Document Effectiveness**: Performance ranking of variants and cover letters
- **Trend Analysis**: Historical performance and forecasting

### Search & Filtering
- **Full-Text Search**: Across company names, roles, notes
- **Status Filtering**: Multi-select status combinations  
- **Date Range Filtering**: Applications within specific periods
- **Tag-based Filtering**: Experience entries by tag combinations

## User Workflows

### Creating Resume Variants
1. Navigate to `/variants` → Click "+ New Variant"
2. Configure rules (tag filters, bullet limits, date ranges)
3. Set up section visibility preferences
4. Add manual overrides for specific content changes
5. Preview resolved variant against master resume
6. Save and associate with job applications

### Tracking Job Applications  
1. Navigate to `/jobs` → Click "Add Application"
2. Enter company, role, location details
3. Select which resume variant was used
4. Choose associated cover letter
5. Set application status and date
6. Add notes for follow-up tracking
7. Update status as application progresses

### Generating Analytics
1. Navigate to `/reports`
2. Select time range (week/month/quarter/half/year)
3. Review application volume trends
4. Analyze success rates and conversion metrics
5. Identify most effective resume variants
6. Export data or generate reports

### Document Management
1. Use `/viewer` to see all resume versions
2. Compare master resume with variants
3. Export specific versions to Word format
4. Copy JSON data for integration with other tools
5. Preview before sending to applications

## Recent Updates & Current Status

### Latest Features Added
1. **Removed Dashboard Variant Button**: Cleaned up dashboard UI by removing duplicate "+ New Variant" button
2. **Enhanced Job Import/Export**: Full CSV/Excel support with update/replace modes
3. **Print Reports**: Formatted application reports with date filtering
4. **Clear All Applications**: Bulk deletion with confirmation dialog
5. **Improved Resume Viewer**: Shows complete content for all resume versions
6. **Fixed Section Settings**: Resolved undefined section settings errors

### Current Bug Fixes
1. **JobEditor Loading**: Fixed hanging "loading application" state for new job creation
2. **Resume Preview**: Fixed display showing only names instead of full content
3. **Icon Imports**: Resolved missing Lucide React icon references
4. **Section Settings**: Added proper null checks and default values
5. **Import Validation**: Enhanced CSV/Excel parsing with error handling

### Performance Optimizations
1. **Lazy Loading**: Route-based code splitting for faster initial loads
2. **Memoization**: Optimized expensive calculations with React.memo
3. **Virtual Scrolling**: Efficient rendering for large lists
4. **Storage Optimization**: Compressed data structures in localStorage

## Development Guidelines

### Code Organization
- **Feature-based Structure**: Group related components and utilities
- **Consistent Naming**: Use descriptive, intention-revealing names
- **Type Safety**: Leverage TypeScript for all data models and props
- **Component Composition**: Prefer composition over inheritance
- **Custom Hooks**: Extract complex logic into reusable hooks

### Styling Standards
- **Design Tokens**: Use semantic CSS custom properties  
- **Component Variants**: Leverage shadcn/ui variant system
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: WCAG 2.1 AA compliance for all interactive elements
- **Consistent Spacing**: Use Tailwind spacing scale throughout

### Testing Strategy
- **Component Testing**: Isolated unit tests for UI components
- **Integration Testing**: End-to-end user workflow validation  
- **Type Checking**: Compile-time validation with TypeScript
- **Manual Testing**: Cross-browser compatibility verification

This application provides a complete, production-ready resume management platform with advanced features for job seekers who want to optimize their application process through data-driven insights and professional document management.
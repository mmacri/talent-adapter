# Resume Builder Application - Complete Agent Documentation

## Overview
This is a comprehensive resume builder application built with React, TypeScript, Vite, and Tailwind CSS. The application allows users to create a master resume, generate variants for different job applications, track job applications, manage cover letters, and analyze their application performance through detailed reports.

## Core Features & Functionality

### 1. Master Resume Management (`/master`)
- **Purpose**: Central hub for maintaining the core resume content
- **Key Components**: 
  - Personal information (contact details, headline)
  - Professional summary (bullet points)
  - Key achievements section
  - Work experience (company, title, dates, location, bullet points, tags)
  - Education history
  - Awards & recognition
  - Core skills
- **Functionality**:
  - Rich text editing with TipTap editor
  - Drag & drop reordering of sections
  - Tag-based categorization of experience entries
  - Real-time preview and editing
  - Auto-save functionality

### 2. Resume Variants System (`/variants`)
- **Purpose**: Create targeted versions of the master resume for specific job applications
- **Key Features**:
  - Rule-based content filtering (include/exclude tags, limit bullet points, date ranges)
  - Manual overrides for specific content modifications
  - Preview system showing resolved variant vs master resume
  - Variant duplication and version management
- **Rules Engine**:
  - `include_tags`: Filter content to only show entries with specific tags
  - `exclude_tags`: Remove entries with certain tags
  - `max_bullets`: Limit number of bullet points per section
  - `section_order`: Reorder sections for different emphasis
  - `date_range`: Filter experience by date ranges
- **Overrides System**:
  - Path-based content modification (e.g., `experience.0.bullets.0`)
  - Operations: `set`, `add`, `remove`
  - Granular control over any resume content

### 3. Job Application Tracking (`/jobs`)
- **Purpose**: Track applications, associate with specific resume variants and cover letters
- **Core Data Model**:
  ```typescript
  {
    id: string;
    company: string;
    role: string;
    location?: string;
    status: 'prospect' | 'applied' | 'interview' | 'offer' | 'rejected' | 'closed';
    variantId?: string;      // Links to resume variant used
    coverLetterId?: string;  // Links to cover letter used
    appliedOn: string;       // ISO date string
    notes: string;
    createdAt: string;
    updatedAt: string;
  }
  ```
- **Status Workflow**: prospect → applied → interview → offer/rejected/closed
- **Features**:
  - Document association tracking (which resume/cover letter was used)
  - Chronological application history
  - Search and filter capabilities
  - Status-based organization and reporting

### 4. Cover Letter Management (`/cover-letters`)
- **Purpose**: Create and manage reusable cover letter templates
- **Features**:
  - Template system with variable placeholders (`{{company}}`, `{{role}}`, etc.)
  - Rich text editing
  - Version management and templates
  - Usage tracking across applications

### 5. Reports & Analytics (`/reports`)
- **Purpose**: Comprehensive analytics on application performance and document usage
- **Time-based Analysis**:
  - Weekly, monthly, quarterly, semi-annual, yearly views
  - Application volume trends
  - Success rate metrics (interview rate, offer rate, conversion rate)
- **Charts & Visualizations**:
  - Line charts for application trends over time
  - Pie charts for status distribution
  - Stacked bar charts for status breakdown by time period
  - Document usage rankings
- **Key Metrics Tracked**:
  - Total applications submitted
  - Interview rate (applications → interviews)
  - Offer rate (applications → offers)
  - Conversion rate (interviews → offers)
  - Most effective resume variants and cover letters

### 6. Dashboard (`/`)
- **Purpose**: Central overview and quick access to all features
- **Components**:
  - Quick stats cards (clickable navigation to full lists)
  - Recent variants and applications preview
  - Master resume preview with export capability
  - Quick action buttons for common tasks

## Technical Architecture

### Data Management
- **Context Pattern**: Uses React Context (`ResumeContext`) for global state management
- **Local Storage**: All data persisted to browser localStorage with structured storage modules
- **Data Flow**: 
  - Context provides centralized state and methods
  - Storage modules handle CRUD operations
  - Seed data initialization on first load

### Component Structure
```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components (Button, Card, Input, etc.)
│   ├── layout/             # Layout components (MainLayout, AppSidebar)
│   └── resume/             # Resume-specific components
│       ├── ContentTree.tsx     # Hierarchical content navigation
│       ├── SectionEditor.tsx   # Individual section editing
│       ├── TagManager.tsx      # Tag management interface
│       ├── TipTapEditor.tsx    # Rich text editor
│       ├── VariantOverridesEditor.tsx  # Manual overrides interface
│       ├── VariantRulesEditor.tsx      # Rules configuration
│       ├── VersionHistory.tsx          # Version management
│       └── ResumePreview.tsx          # Full resume preview modal
├── pages/                  # Main application pages
├── contexts/              # React Context providers
├── lib/                   # Utilities and business logic
│   ├── storage.ts         # Data persistence layer
│   ├── variantResolver.ts # Variant rule processing
│   ├── docxExport.ts      # Word document export
│   ├── seedData.ts        # Initial data setup
│   └── utils.ts           # Common utilities
└── types/                 # TypeScript type definitions
```

### Key Libraries & Dependencies
- **React 18.3.1**: Core framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **TipTap**: Rich text editor
- **Date-fns**: Date manipulation
- **Recharts**: Chart visualization
- **DOCX**: Word document generation
- **React Router Dom**: Client-side routing
- **React Hook Form + Zod**: Form handling and validation

### Design System
- **Colors**: HSL-based semantic tokens in CSS custom properties
- **Components**: Consistent shadcn/ui component library
- **Responsive**: Mobile-first responsive design
- **Themes**: Dark/light mode support through CSS variables
- **Typography**: Semantic heading and text scales

### Export Capabilities
- **Word Documents**: Full DOCX export with proper formatting
  - Hierarchical bullet points with proper indentation
  - Professional styling and layout
  - Support for both master resume and variants
- **Text Copy**: Clipboard export for quick sharing
- **Preview System**: Full-featured modal preview before export

### Data Models

#### ResumeMaster
```typescript
interface ResumeMaster {
  id: string;
  owner: string;
  contacts: ContactInfo;
  headline: string;
  summary: string[];
  key_achievements: string[];
  experience: ExperienceEntry[];
  awards: Award[];
  education: EducationEntry[];
  skills: SkillsSection;
  sections: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

#### Variant
```typescript
interface Variant {
  id: string;
  name: string;
  description: string;
  rules: VariantRule[];
  overrides: VariantOverride[];
  createdAt: string;
  updatedAt: string;
}
```

#### VariantRule
```typescript
interface VariantRule {
  type: 'include_tags' | 'exclude_tags' | 'max_bullets' | 'section_order' | 'date_range';
  value: any;  // Type varies based on rule type
}
```

## User Workflows

### Creating a New Variant
1. Navigate to `/variants` → Click "New Variant"
2. Configure rules (tag filters, bullet limits, etc.)
3. Add manual overrides if needed
4. Preview the resolved variant
5. Save and use for applications

### Tracking a Job Application
1. Navigate to `/jobs` → Click "Track Application" 
2. Enter company and role information
3. Select which resume variant was used
4. Choose associated cover letter
5. Set application status and date
6. Add notes for follow-up tracking

### Generating Reports
1. Navigate to `/reports`
2. Select time range (week/month/quarter/half/year)
3. View application trends and success metrics
4. Analyze document effectiveness
5. Identify most successful variants and cover letters

### Exporting Documents
1. From variants page or preview modal
2. Click "Preview" to see formatted resume
3. Choose "Copy Text" for clipboard or "Download Word" for DOCX
4. Documents include proper formatting and styling

## Advanced Features

### Variant Resolution Engine
- Processes rules in specific order: filters → limits → overrides
- Maintains referential integrity between master and variant
- Supports complex rule combinations
- Provides diff visualization between master and resolved variant

### Tag System
- Flexible categorization for experience entries
- Enables rule-based filtering (include/exclude specific tags)
- Powers analytics and reporting
- Supports multiple tags per experience entry

### Search & Filtering
- Full-text search across all job applications
- Status-based filtering
- Chronological sorting and grouping
- Company and role-based organization

### Analytics Engine
- Time-series analysis of application patterns
- Success rate calculations and trending
- Document effectiveness scoring
- Performance benchmarking over time periods

## Configuration & Customization

### Styling Customization
- Modify `src/index.css` for design tokens
- Update `tailwind.config.ts` for theme extensions
- Customize component variants in shadcn/ui components

### Data Schema Extensions
- Extend type definitions in `src/types/resume.ts`
- Update storage modules in `src/lib/storage.ts`
- Modify context methods in `src/contexts/ResumeContext.tsx`

### Feature Extensions
- Add new rule types in `src/lib/variantResolver.ts`
- Extend export formats in `src/lib/docxExport.ts`
- Add new chart types in Reports page

This application provides a complete, production-ready resume management system with advanced features for job seekers who want to optimize their application process through data-driven insights and document management.
# User Interface (UI) Complete Documentation

## Design System Foundation

### Color System
The application uses a comprehensive HSL-based semantic color system defined in CSS custom properties for consistent theming and accessibility:

```css
/* Primary Brand Colors - Professional blue gradient system */
--primary: 262.1 83.3% 57.8%;           /* Main brand color (#8B5CF6) */
--primary-foreground: 210 20% 98%;      /* White text on primary background */
--primary-hover: 262.1 83.3% 52%;       /* Darker hover state */
--primary-glow: 262.1 83.3% 65%;        /* Lighter accent for highlights */

/* Secondary System - Neutral grays for secondary elements */
--secondary: 220 14.3% 95.9%;           /* Light gray backgrounds (#F8FAFC) */
--secondary-foreground: 220.9 39.3% 11%; /* Dark text on secondary (#1E293B) */

/* Accent Colors - Complementary highlights */
--accent: 220 14.3% 95.9%;              /* Accent elements match secondary */
--accent-foreground: 220.9 39.3% 11%;   /* Text on accent elements */

/* Semantic Status Colors */
--success: 142 76% 36%;                  /* Green for success states (#16A34A) */
--success-foreground: 0 0% 100%;         /* White text on success background */
--warning: 38 92% 50%;                   /* Orange for warning states (#F59E0B) */
--warning-foreground: 0 0% 0%;           /* Black text on warning background */
--destructive: 0 84.2% 60.2%;           /* Red for error/delete actions (#EF4444) */
--destructive-foreground: 210 20% 98%;   /* White text on destructive background */

/* Neutral System - Backgrounds and borders */
--background: 0 0% 100%;                 /* Main page background (white) */
--foreground: 222.2 84% 4.9%;          /* Main text color (near-black) */
--muted: 210 40% 96%;                   /* Muted backgrounds (#F1F5F9) */
--muted-foreground: 215.4 16.3% 46.9%; /* Muted text color (#64748B) */
--border: 214.3 31.8% 91.4%;           /* Standard border color (#E2E8F0) */
--input: 214.3 31.8% 91.4%;            /* Input field borders */
--ring: 262.1 83.3% 57.8%;             /* Focus ring color (matches primary) */

/* Card System - Elevated surfaces */
--card: 0 0% 100%;                      /* Card backgrounds (white) */
--card-foreground: 222.2 84% 4.9%;     /* Text on cards */
--popover: 0 0% 100%;                   /* Dropdown/modal backgrounds */
--popover-foreground: 222.2 84% 4.9%;  /* Text in dropdowns/modals */

/* Chart Colors - Data visualization palette */
--chart-1: 262.1 83.3% 57.8%;          /* Primary data series */
--chart-2: 173 58% 39%;                 /* Secondary data series */
--chart-3: 197 37% 24%;                 /* Tertiary data series */
--chart-4: 43 74% 66%;                  /* Quaternary data series */
--chart-5: 27 87% 67%;                  /* Quinary data series */

/* Dark Mode Overrides */
.dark {
  --background: 222.2 84% 4.9%;         /* Dark background */
  --foreground: 210 40% 98%;            /* Light text */
  --card: 222.2 84% 4.9%;              /* Dark card backgrounds */
  --card-foreground: 210 40% 98%;       /* Light text on dark cards */
  --muted: 217.2 32.6% 17.5%;          /* Dark muted backgrounds */
  --muted-foreground: 215 20.2% 65.1%; /* Light muted text */
}
```

### Typography Scale
Consistent typography hierarchy using Tailwind's type scale with semantic sizing:

```css
/* Display Typography - Large headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }     /* 36px - Page titles */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }   /* 30px - Section titles */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }        /* 24px - Card titles */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }     /* 20px - Subsection titles */

/* Body Typography - Content text */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }    /* 18px - Large body text */
.text-base { font-size: 1rem; line-height: 1.5rem; }       /* 16px - Standard body text */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }    /* 14px - Small body text */
.text-xs { font-size: 0.75rem; line-height: 1rem; }        /* 12px - Captions and labels */

/* Font Weights */
.font-normal { font-weight: 400; }      /* Regular text */
.font-medium { font-weight: 500; }      /* Slightly emphasized */
.font-semibold { font-weight: 600; }    /* Subheadings */
.font-bold { font-weight: 700; }        /* Main headings */

/* Semantic Text Colors */
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
.text-destructive { color: hsl(var(--destructive)); }
.text-success { color: hsl(var(--success)); }
```

### Spacing System
Consistent spacing using Tailwind's rem-based scale for perfect vertical rhythm:

```css
/* Padding Scale (p-*) */
.p-1 { padding: 0.25rem; }    /* 4px */
.p-2 { padding: 0.5rem; }     /* 8px */
.p-3 { padding: 0.75rem; }    /* 12px */
.p-4 { padding: 1rem; }       /* 16px - Standard component padding */
.p-6 { padding: 1.5rem; }     /* 24px - Card padding */
.p-8 { padding: 2rem; }       /* 32px - Section padding */

/* Margin Scale (m-*) */
.m-2 { margin: 0.5rem; }      /* 8px */
.m-4 { margin: 1rem; }        /* 16px */
.m-6 { margin: 1.5rem; }      /* 24px */

/* Gap Scale (gap-*) - Flexbox and Grid spacing */
.gap-1 { gap: 0.25rem; }      /* 4px - Tight element spacing */
.gap-2 { gap: 0.5rem; }       /* 8px - Standard button/icon spacing */
.gap-3 { gap: 0.75rem; }      /* 12px - Form element spacing */
.gap-4 { gap: 1rem; }         /* 16px - Card grid spacing */
.gap-6 { gap: 1.5rem; }       /* 24px - Section spacing */

/* Space Scale (space-y-*) - Vertical spacing between children */
.space-y-2 > * + * { margin-top: 0.5rem; }    /* 8px vertical rhythm */
.space-y-4 > * + * { margin-top: 1rem; }      /* 16px vertical rhythm */
.space-y-6 > * + * { margin-top: 1.5rem; }    /* 24px vertical rhythm */
```

## Component Library Documentation

### Button System
Comprehensive button variant system with consistent styling and semantic meaning:

#### Primary Action Button
```tsx
<Button className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg">
  <Plus className="w-4 h-4 mr-2" />
  Create Application
</Button>
```
**Usage**: Main call-to-action buttons, form submissions, primary navigation
**Styling**: Gradient primary background, white text, enhanced hover shadow
**Accessibility**: `role="button"`, proper focus states, keyboard navigation

#### Secondary Action Button  
```tsx
<Button variant="outline" className="border-border hover:bg-muted">
  <Edit3 className="w-4 h-4 mr-2" />
  Edit Details
</Button>
```
**Usage**: Secondary actions, edit functions, alternative choices
**Styling**: Transparent background with border, hover background fill
**States**: Normal, hover, focus, disabled, loading

#### Ghost Button (Minimal)
```tsx
<Button variant="ghost" size="sm" className="hover:bg-muted/50">
  <Eye className="w-4 h-4" />
</Button>
```
**Usage**: Icon-only actions, table row actions, minimal visual weight needed
**Styling**: No background, subtle hover state, maintains accessibility

#### Destructive Action Button
```tsx
<Button variant="destructive" className="hover:bg-destructive/90">
  <Trash2 className="w-4 h-4 mr-2" />
  Delete Application
</Button>
```
**Usage**: Delete actions, dangerous operations, irreversible changes
**Styling**: Red background, warning visual treatment, confirmation dialogs

#### Loading State Button
```tsx
<Button disabled={isLoading} className="relative">
  {isLoading ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : (
    <Save className="w-4 h-4 mr-2" />
  )}
  {isLoading ? 'Saving...' : 'Save Changes'}
</Button>
```

### Card Component System
Flexible card components for content organization and visual hierarchy:

#### Standard Content Card
```tsx
<Card className="hover:shadow-md transition-shadow duration-200">
  <CardHeader className="pb-3">
    <CardTitle className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-primary" />
      Resume Variant
    </CardTitle>
    <CardDescription>
      Targeted resume for software development roles
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Main card content */}
  </CardContent>
</Card>
```
**Usage**: Primary content containers, list items, form sections
**Styling**: White background, subtle border, rounded corners, hover elevation

#### Dashboard Statistics Card
```tsx
<Card className="glass hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
  <CardContent className="p-6">
    <div className="flex items-center">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Briefcase className="h-6 w-6 text-primary" />
      </div>
      <div className="ml-4">
        <p className="text-2xl font-bold text-foreground">{applications.length}</p>
        <p className="text-sm text-muted-foreground">Job Applications</p>
      </div>
    </div>
  </CardContent>
</Card>
```
**Usage**: Dashboard metrics, key performance indicators, navigation cards
**Styling**: Glass effect background, scale transform on hover, icon + metric layout

#### Interactive Navigation Card
```tsx
<Link to="/variants">
  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20">
            <Layers className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-medium group-hover:text-primary transition-colors">Resume Variants</h3>
            <p className="text-sm text-muted-foreground">Create targeted resumes</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
      </div>
    </CardContent>
  </Card>
</Link>
```

### Form Component System
Comprehensive form controls with consistent styling and validation states:

#### Standard Input Field with Validation
```tsx
<div className="space-y-2">
  <Label htmlFor="company-name" className="text-sm font-medium">
    Company Name *
  </Label>
  <Input
    id="company-name"
    value={companyName}
    onChange={(e) => setCompanyName(e.target.value)}
    placeholder="Enter company name"
    className={cn(
      "transition-colors duration-200",
      error && "border-destructive focus:ring-destructive",
      success && "border-success focus:ring-success"
    )}
    aria-invalid={!!error}
    aria-describedby={error ? "company-error" : undefined}
    required
  />
  {error && (
    <p id="company-error" className="text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {error}
    </p>
  )}
  {success && (
    <p className="text-sm text-success flex items-center gap-1">
      <CheckCircle className="w-3 h-3" />
      Looks good!
    </p>
  )}
</div>
```

#### Select Dropdown with Search
```tsx
<div className="space-y-2">
  <Label htmlFor="status-select">Application Status</Label>
  <Select value={status} onValueChange={setStatus}>
    <SelectTrigger id="status-select" className="w-full">
      <SelectValue placeholder="Select application status" />
    </SelectTrigger>
    <SelectContent className="bg-popover border shadow-md max-h-60 overflow-y-auto">
      <SelectItem value="prospect" className="hover:bg-muted cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
          Prospect
        </div>
      </SelectItem>
      <SelectItem value="applied" className="hover:bg-muted cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          Applied
        </div>
      </SelectItem>
      {/* Additional status options */}
    </SelectContent>
  </Select>
</div>
```

#### Rich Text Area with Character Count
```tsx
<div className="space-y-2">
  <Label htmlFor="notes">Application Notes</Label>
  <Textarea
    id="notes"
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Add notes about this application..."
    className="min-h-32 resize-y"
    maxLength={1000}
  />
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>Add interview feedback, follow-up reminders, etc.</span>
    <span>{notes.length}/1000</span>
  </div>
</div>
```

#### Date Picker with Validation
```tsx
<div className="space-y-2">
  <Label>Application Date</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 bg-popover border shadow-md" align="start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
      />
    </PopoverContent>
  </Popover>
</div>
```

### Navigation Component System
Consistent navigation patterns across the application:

#### Primary Sidebar Navigation
```tsx
<nav className="flex flex-col gap-1 p-4">
  {navigationItems.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <item.icon className="w-4 h-4" />
      {item.label}
      {item.count && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {item.count}
        </Badge>
      )}
    </NavLink>
  ))}
</nav>
```

#### Breadcrumb Navigation
```tsx
<nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
  <Link to="/" className="hover:text-foreground transition-colors">
    Dashboard
  </Link>
  <ChevronRight className="w-3 h-3" />
  <Link to="/jobs" className="hover:text-foreground transition-colors">
    Job Applications  
  </Link>
  <ChevronRight className="w-3 h-3" />
  <span className="text-foreground font-medium">New Application</span>
</nav>
```

#### Tab Navigation
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  <TabsList className="grid w-full grid-cols-4 mb-6">
    <TabsTrigger value="overview" className="flex items-center gap-2">
      <BarChart className="w-4 h-4" />
      Overview
    </TabsTrigger>
    <TabsTrigger value="trends" className="flex items-center gap-2">
      <TrendingUp className="w-4 h-4" />
      Trends
    </TabsTrigger>
    <TabsTrigger value="documents" className="flex items-center gap-2">
      <FileText className="w-4 h-4" />
      Documents
    </TabsTrigger>
    <TabsTrigger value="export" className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      Export
    </TabsTrigger>
  </TabsList>
  <TabsContent value={activeTab}>
    {/* Tab content */}
  </TabsContent>
</Tabs>
```

### Data Display Components
Rich components for displaying structured information:

#### Status Badge System
```tsx
const statusConfig = {
  prospect: { 
    variant: "secondary" as const, 
    className: "bg-muted text-muted-foreground border-muted-foreground/20" 
  },
  applied: { 
    variant: "default" as const, 
    className: "bg-primary text-primary-foreground" 
  },
  interview: { 
    variant: "default" as const, 
    className: "bg-warning text-warning-foreground" 
  },
  offer: { 
    variant: "default" as const, 
    className: "bg-success text-success-foreground" 
  },
  rejected: { 
    variant: "destructive" as const, 
    className: "bg-destructive text-destructive-foreground" 
  }
};

<Badge 
  variant={statusConfig[status].variant}
  className={cn("text-xs font-medium", statusConfig[status].className)}
>
  {status.charAt(0).toUpperCase() + status.slice(1)}
</Badge>
```

#### Data Table with Sorting and Filtering
```tsx
<div className="border rounded-lg overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="hover:bg-muted/50">
        <TableHead className="w-[200px]">
          <Button variant="ghost" size="sm" onClick={() => handleSort('company')}>
            Company
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Applied Date</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredApplications.map((app) => (
        <TableRow 
          key={app.id} 
          className="hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate(`/jobs/${app.id}`)}
        >
          <TableCell className="font-medium">{app.company}</TableCell>
          <TableCell>{app.role}</TableCell>
          <TableCell>
            <StatusBadge status={app.status} />
          </TableCell>
          <TableCell>{format(new Date(app.appliedOn), 'MMM d, yyyy')}</TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="sm">
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

#### Statistics Display Card
```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-foreground">{successRate}%</p>
          <p className="text-sm text-success flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2.5% from last month
          </p>
        </div>
      </div>
      <div className="p-3 bg-success/10 rounded-lg">
        <Target className="w-6 h-6 text-success" />
      </div>
    </div>
    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
      <div 
        className="h-full bg-success rounded-full transition-all duration-500"
        style={{ width: `${successRate}%` }}
      />
    </div>
  </CardContent>
</Card>
```

### Modal & Dialog Components
Accessible modal patterns for user interactions:

#### Standard Dialog
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">
      <Settings className="w-4 h-4 mr-2" />
      Settings
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Application Settings
      </DialogTitle>
      <DialogDescription>
        Configure your job application preferences and defaults.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {/* Dialog content */}
    </div>
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Confirmation Alert Dialog
```tsx
<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="sm">
      <Trash2 className="w-4 h-4 mr-2" />
      Delete Application
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        Confirm Deletion
      </AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete the job application for <strong>{application.role}</strong> at <strong>{application.company}</strong>. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction 
        onClick={handleDelete}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        Delete Application
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Full-Screen Preview Modal
```tsx
<Dialog open={showPreview} onOpenChange={setShowPreview}>
  <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
    <DialogHeader className="border-b pb-4">
      <DialogTitle className="flex items-center gap-2">
        <Eye className="w-5 h-5" />
        Resume Preview: {variant?.name || 'Master Resume'}
      </DialogTitle>
    </DialogHeader>
    
    <div className="flex gap-4 py-4 border-b">
      <Button variant="outline" size="sm" onClick={handleCopyText}>
        <Copy className="w-4 h-4 mr-2" />
        Copy Text
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportWord}>
        <Download className="w-4 h-4 mr-2" />
        Export Word
      </Button>
    </div>
    
    <ScrollArea className="flex-1">
      <div className="p-6 bg-white text-black max-w-4xl mx-auto">
        {/* Resume content */}
      </div>
    </ScrollArea>
  </DialogContent>
</Dialog>
```

### Chart & Visualization Components
Data visualization using Recharts with consistent theming:

#### Line Chart for Trends
```tsx
<Card>
  <CardHeader>
    <CardTitle>Application Trends</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="period" 
          axisLine={false}
          tickLine={false}
          className="text-xs text-muted-foreground"
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          className="text-xs text-muted-foreground"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="applications" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="interviews" 
          stroke="hsl(var(--warning))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

#### Pie Chart for Distribution
```tsx
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
          outerRadius={100}
          dataKey="value"
        >
          {statusDistribution.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={statusColors[entry.status] || 'hsl(var(--muted))'} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

#### Bar Chart with Multiple Series
```tsx
<ResponsiveContainer width="100%" height={400}>
  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
    <XAxis 
      dataKey="month" 
      axisLine={false}
      tickLine={false}
      className="text-xs"
    />
    <YAxis 
      axisLine={false}
      tickLine={false}
      className="text-xs"
    />
    <Tooltip 
      contentStyle={{
        backgroundColor: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px'
      }}
    />
    <Legend />
    <Bar 
      dataKey="applied" 
      fill="hsl(var(--chart-1))" 
      name="Applications Sent"
      radius={[2, 2, 0, 0]}
    />
    <Bar 
      dataKey="interviews" 
      fill="hsl(var(--chart-2))" 
      name="Interviews"
      radius={[2, 2, 0, 0]}
    />
    <Bar 
      dataKey="offers" 
      fill="hsl(var(--chart-3))" 
      name="Offers"
      radius={[2, 2, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
```

## Layout Patterns & Responsive Design

### Page Layout Structure
Consistent page structure across all routes:

```tsx
<div className="min-h-screen bg-background">
  <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
    {/* Page Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Page Title
        </h1>
        <p className="text-muted-foreground">
          Page description and context
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* Action buttons */}
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>

    {/* Content Sections */}
    <div className="space-y-6">
      {/* Main content goes here */}
    </div>
  </div>
</div>
```

### Grid Layout Patterns
Responsive grid systems for different content types:

#### Dashboard Grid (Responsive Stats)
```tsx
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {statsCards.map((card) => (
    <StatCard key={card.id} {...card} />
  ))}
</div>

{/* Mobile: 1 column, Desktop: 2 columns for detailed sections */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <RecentVariantsCard />
  <RecentApplicationsCard />
</div>
```

#### Editor Layout (Two-Column)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main Content Area - Takes 2/3 width on desktop */}
  <div className="lg:col-span-2 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Main Content</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Primary editing interface */}
      </CardContent>
    </Card>
  </div>
  
  {/* Sidebar - Takes 1/3 width on desktop */}
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Configuration options */}
      </CardContent>
    </Card>
  </div>
</div>
```

#### List View with Filters
```tsx
<div className="space-y-6">
  {/* Filter Bar */}
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1">
      <Input 
        placeholder="Search applications..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />
    </div>
    <div className="flex gap-2">
      <StatusFilter />
      <DateRangeFilter />
    </div>
  </div>

  {/* Content Grid - Responsive cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {filteredItems.map((item) => (
      <ItemCard key={item.id} {...item} />
    ))}
  </div>
</div>
```

### Mobile Optimization Patterns
Mobile-first responsive design with progressive enhancement:

#### Responsive Navigation
```tsx
{/* Desktop sidebar, mobile drawer */}
<div className="lg:hidden">
  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="sm">
        <Menu className="w-5 h-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="p-0">
      <SidebarContent />
    </SheetContent>
  </Sheet>
</div>

<div className="hidden lg:block">
  <Sidebar />
</div>
```

#### Responsive Tables
```tsx
{/* Desktop: Full table, Mobile: Card layout */}
<div className="hidden md:block">
  <Table>
    {/* Full table for desktop */}
  </Table>
</div>

<div className="md:hidden space-y-4">
  {applications.map((app) => (
    <Card key={app.id} className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{app.role}</h3>
          <StatusBadge status={app.status} />
        </div>
        <p className="text-sm text-muted-foreground">{app.company}</p>
        <p className="text-xs text-muted-foreground">
          Applied {format(new Date(app.appliedOn), 'MMM d, yyyy')}
        </p>
      </div>
    </Card>
  ))}
</div>
```

#### Responsive Spacing
```tsx
{/* Different padding/margins for mobile vs desktop */}
<div className="p-4 md:p-6 lg:p-8">
  <div className="space-y-4 md:space-y-6">
    <h1 className="text-2xl md:text-3xl font-bold">
      {/* Smaller text on mobile */}
    </h1>
  </div>
</div>

{/* Responsive gap in flex/grid layouts */}
<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
  {/* Stack vertically on mobile, horizontal on desktop */}
</div>
```

## Interactive States & Microinteractions

### Hover Effects & Transitions
Consistent hover states across interactive elements:

```css
/* Card hover effects */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:scale-105;
}

/* Button hover effects */
.button-hover {
  @apply transition-colors duration-200 hover:bg-primary/90;
}

/* Link hover effects */  
.link-hover {
  @apply transition-colors duration-200 hover:text-primary;
}

/* Custom transitions for specific interactions */
.smooth-transform {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Loading States & Feedback
Comprehensive loading state patterns:

#### Skeleton Loading
```tsx
const SkeletonCard = () => (
  <Card>
    <CardContent className="p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-full" />
      </div>
    </CardContent>
  </Card>
);

{/* Usage in loading states */}
{isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
) : (
  <ApplicationsList applications={applications} />
)}
```

#### Spinner Loading
```tsx
const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size], className)} />
  );
};

{/* Page-level loading */}
<div className="flex items-center justify-center h-96">
  <div className="text-center space-y-4">
    <LoadingSpinner size="xl" />
    <p className="text-muted-foreground">Loading your data...</p>
  </div>
</div>
```

#### Progress Indicators
```tsx
const ProgressBar = ({ value, max = 100, className = "" }) => (
  <div className={cn("w-full bg-muted rounded-full h-2 overflow-hidden", className)}>
    <div 
      className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
    />
  </div>
);

{/* Usage for multi-step processes */}
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Import Progress</span>
    <span>{currentStep}/5</span>
  </div>
  <ProgressBar value={currentStep} max={5} />
</div>
```

### Focus States & Accessibility
Comprehensive keyboard navigation and focus management:

```css
/* Focus ring for interactive elements */
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}

/* Custom focus states for different element types */
.focus-input {
  @apply focus:ring-2 focus:ring-primary focus:border-primary;
}

.focus-button {
  @apply focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}
```

```tsx
{/* Skip navigation for accessibility */}
<a 
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
>
  Skip to main content
</a>

{/* Proper focus management in modals */}
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent 
    onOpenAutoFocus={(e) => {
      // Focus first input when modal opens
      e.preventDefault();
      firstInputRef.current?.focus();
    }}
  >
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

## Icon System & Visual Language

### Lucide React Icon Usage
Consistent icon usage with proper sizing and semantic meaning:

```tsx
import { 
  // Navigation
  Home, Dashboard, FileText, Layers, Briefcase, Mail,
  // Actions  
  Plus, Edit3, Trash2, Save, Copy, Download, Upload, Search, Filter,
  // Status
  CheckCircle, XCircle, AlertCircle, Clock, TrendingUp, TrendingDown,
  // Interface
  ChevronDown, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight,
  // Content
  User, Building, MapPin, Calendar, Tag, Eye, Settings
} from 'lucide-react';

{/* Icon sizing standards */}
<Icon className="w-3 h-3" />   {/* 12px - Small indicators */}
<Icon className="w-4 h-4" />   {/* 16px - Inline with text */}
<Icon className="w-5 h-5" />   {/* 20px - Section headers */}
<Icon className="w-6 h-6" />   {/* 24px - Prominent elements */}
<Icon className="w-8 h-8" />   {/* 32px - Large feature icons */}

{/* Icon with text patterns */}
<Button>
  <Plus className="w-4 h-4 mr-2" />
  Add Application
</Button>

<div className="flex items-center gap-2">
  <Building className="w-4 h-4 text-muted-foreground" />
  <span>Google Inc.</span>
</div>
```

### Icon Color & State Conventions
```tsx
{/* Semantic icon coloring */}
<CheckCircle className="w-5 h-5 text-success" />      {/* Success states */}
<XCircle className="w-5 h-5 text-destructive" />       {/* Error states */}
<AlertCircle className="w-5 h-5 text-warning" />      {/* Warning states */}
<Clock className="w-4 h-4 text-muted-foreground" />   {/* Neutral/pending */}

{/* Interactive states */}
<Button variant="ghost" className="group">
  <Edit3 className="w-4 h-4 group-hover:text-primary transition-colors" />
</Button>
```

## Animation & Motion Design

### CSS Animations & Keyframes
```css
/* Loading animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
.animate-bounce { animation: bounce 1s infinite; }

/* Custom animations for specific interactions */
@keyframes slideInFromRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInScale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.slide-in-right { animation: slideInFromRight 0.3s ease-out; }
.fade-in-scale { animation: fadeInScale 0.2s ease-out; }
```

### Transition Classes
```css
/* Duration classes */
.duration-75 { transition-duration: 75ms; }
.duration-100 { transition-duration: 100ms; }
.duration-150 { transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }

/* Easing functions */
.ease-linear { transition-timing-function: linear; }
.ease-in { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

/* Property-specific transitions */
.transition-all { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.transition-colors { transition: color, background-color, border-color 0.2s ease; }
.transition-transform { transition: transform 0.2s ease; }
.transition-opacity { transition: opacity 0.2s ease; }
```

## Error States & Feedback

### Form Validation Display
```tsx
const FormField = ({ label, error, success, children, ...props }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}
      {props.required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="relative">
      {children}
      {(error || success) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {error && <AlertCircle className="w-4 h-4 text-destructive" />}
          {success && <CheckCircle className="w-4 h-4 text-success" />}
        </div>
      )}
    </div>
    {error && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
    {success && (
      <p className="text-sm text-success flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        {success}
      </p>
    )}
  </div>
);
```

### Empty State Components
```tsx
const EmptyState = ({ 
  icon: Icon = FileText, 
  title, 
  description, 
  action, 
  className = "" 
}) => (
  <div className={cn("text-center py-12", className)}>
    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
    {action && (
      <Button onClick={action.onClick} className={action.className}>
        {action.icon && <action.icon className="w-4 h-4 mr-2" />}
        {action.label}
      </Button>
    )}
  </div>
);

{/* Usage examples */}
<EmptyState 
  icon={Briefcase}
  title="No applications yet"
  description="Start tracking your job applications to see them here"
  action={{
    label: "Add First Application",
    onClick: () => navigate('/jobs/new'),
    icon: Plus
  }}
/>
```

### Error Boundary Fallback
```tsx
const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-[400px] flex items-center justify-center p-8">
    <div className="text-center space-y-4 max-w-md">
      <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          We encountered an error while loading this page. Please try again.
        </p>
      </div>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
        <Button onClick={resetError}>
          Try Again
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="text-left text-xs bg-muted p-3 rounded mt-4">
          <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
          <pre className="whitespace-pre-wrap">{error.message}</pre>
        </details>
      )}
    </div>
  </div>
);
```

### Toast Notification System
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success notification
toast({
  title: "Application saved",
  description: "Your job application has been successfully saved.",
  duration: 3000
});

// Error notification  
toast({
  title: "Save failed",
  description: "There was a problem saving your application. Please try again.",
  variant: "destructive",
  duration: 5000
});

// Warning notification
toast({
  title: "Unsaved changes",
  description: "You have unsaved changes that will be lost.",
  variant: "warning",
  action: (
    <Button size="sm" onClick={handleSave}>
      Save Now
    </Button>
  )
});
```

## Current Page Implementations

### Dashboard Page (`/`)
**Primary Layout**: Statistics grid + recent items + quick actions
**Current Implementation**:
```tsx
<div className="space-y-8">
  {/* Stats Grid - Updated with standardized formatting */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {statsCards.map(card => (
      <StatsCard key={card.title} {...card} />
    ))}
  </div>
  
  {/* Recent Items - Enhanced with format consistency */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <RecentVariants variants={recentVariants} />
    <RecentApplications applications={recentApplications} />
  </div>
  
  {/* Quick Actions - Simplified navigation */}
  <QuickActionsGrid actions={quickActions} />
</div>
```
**Recent Updates**:
- Removed duplicate "+ New Variant" button for cleaner UI
- Added consistent date formatting using format-consistency utilities
- Enhanced stats cards with proper click navigation

### Resume Viewer Page (`/viewer`)
**Primary Layout**: Multi-card layout with full resume content display and proper contact information
**Current Implementation**:
```tsx
<div className="space-y-6">
  {/* Page Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Resume Viewer</h1>
      <p className="text-muted-foreground">View and export all resume versions with complete content</p>
    </div>
  </div>
  
  {/* Resume Version Cards - Enhanced with proper LinkedIn display */}
  {allVersions.map(version => (
    <Card key={version.id} className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VersionIcon type={version.type} />
            <div>
              <CardTitle>{version.name}</CardTitle>
              <CardDescription>{version.description}</CardDescription>
              {/* Standardized date formatting */}
              <StandardDateDisplay date={version.updatedAt} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ResumePreview />
            <ExportButton />
            <CopyJsonButton />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Enhanced contact display with actual LinkedIn URLs */}
        <ResumeContentDisplay resume={version.resume} compact showLinkedIn />
      </CardContent>
    </Card>
  ))}
</div>
```
**Recent Updates**:
- Fixed LinkedIn display to show actual URLs instead of generic "LinkedIn" text
- Added standardized date formatting using format-consistency utilities  
- Enhanced export functionality with consistent filename generation
- Improved contact information display in resume content

This comprehensive UI documentation provides all the patterns, components, and guidelines needed to maintain design consistency and build new features within the application's established design system. The components are built for accessibility, responsive design, and consistent user experience across all devices and interaction methods.
# User Interface (UI) Complete Documentation

## Design System Foundation

### Color System
The application uses a semantic HSL-based color system defined in CSS custom properties:

```css
/* Primary Brand Colors */
--primary: 262.1 83.3% 57.8%;           /* Main brand color */
--primary-foreground: 210 20% 98%;      /* Text on primary */
--primary-hover: 262.1 83.3% 52%;       /* Hover state */

/* Secondary Colors */
--secondary: 220 14.3% 95.9%;           /* Secondary backgrounds */
--secondary-foreground: 220.9 39.3% 11%; /* Text on secondary */
--accent: 220 14.3% 95.9%;              /* Accent elements */
--accent-foreground: 220.9 39.3% 11%;   /* Text on accent */

/* Semantic Colors */
--success: 142 76% 36%;                  /* Success states */
--warning: 38 92% 50%;                   /* Warning states */
--destructive: 0 84.2% 60.2%;           /* Error/delete actions */
--destructive-foreground: 210 20% 98%;  /* Text on destructive */

/* Neutral Colors */
--background: 0 0% 100%;                 /* Main background */
--foreground: 222.2 84% 4.9%;          /* Main text */
--muted: 210 40% 96%;                   /* Muted backgrounds */
--muted-foreground: 215.4 16.3% 46.9%; /* Muted text */
--border: 214.3 31.8% 91.4%;           /* Border color */
--input: 214.3 31.8% 91.4%;            /* Input borders */
--ring: 262.1 83.3% 57.8%;             /* Focus rings */

/* Card System */
--card: 0 0% 100%;                      /* Card backgrounds */
--card-foreground: 222.2 84% 4.9%;     /* Card text */
--popover: 0 0% 100%;                   /* Popover backgrounds */
--popover-foreground: 222.2 84% 4.9%;  /* Popover text */
```

### Typography Scale
```css
/* Heading Scale */
h1: text-3xl font-bold tracking-tight    /* 30px, 700 weight */
h2: text-2xl font-bold                   /* 24px, 700 weight */
h3: text-xl font-semibold               /* 20px, 600 weight */
h4: text-lg font-semibold               /* 18px, 600 weight */

/* Body Text */
body: text-sm                           /* 14px base */
large: text-lg                          /* 18px */
small: text-xs                          /* 12px */
muted: text-muted-foreground            /* Semantic muted color */
```

### Spacing System
Based on Tailwind's spacing scale (0.25rem increments):
```css
gap-1: 0.25rem    gap-2: 0.5rem     gap-3: 0.75rem    gap-4: 1rem
gap-6: 1.5rem     gap-8: 2rem       gap-12: 3rem      gap-16: 4rem
p-2: 0.5rem       p-3: 0.75rem      p-4: 1rem         p-6: 1.5rem
m-2: 0.5rem       m-3: 0.75rem      m-4: 1rem         m-6: 1.5rem
```

## Component Library Documentation

### Button Components
#### Primary Button
```tsx
<Button className="bg-gradient-to-r from-primary to-primary-hover">
  <Plus className="w-4 h-4 mr-2" />
  Primary Action
</Button>
```
**Usage**: Main call-to-action buttons
**Styling**: Gradient primary background, white text, shadow on hover

#### Secondary Button  
```tsx
<Button variant="outline">
  <Edit className="w-4 h-4 mr-2" />
  Secondary Action
</Button>
```
**Usage**: Secondary actions, edit functions
**Styling**: Border with transparent background, primary text color

#### Ghost Button
```tsx
<Button variant="ghost" size="sm">
  <Eye className="w-4 h-4" />
</Button>
```
**Usage**: Icon-only actions, minimal visual weight
**Styling**: No background, hover state with muted background

#### Destructive Button
```tsx
<Button variant="destructive">
  <Trash2 className="w-4 h-4 mr-2" />
  Delete
</Button>
```
**Usage**: Delete or dangerous actions
**Styling**: Red background, warning visual treatment

### Card Components
#### Standard Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Subtitle or description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
</Card>
```
**Usage**: Primary content containers
**Styling**: White background, subtle border, rounded corners, shadow

#### Glass Card (Dashboard)
```tsx
<Card className="glass">
  <CardContent className="p-6">
    {/* Dashboard stats */}
  </CardContent>
</Card>
```
**Usage**: Dashboard statistics and overview cards
**Styling**: Translucent background with backdrop blur effect

#### Interactive Card
```tsx
<Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
  {/* Clickable card content */}
</Card>
```
**Usage**: Navigation cards, clickable elements
**Styling**: Hover effects with scale and shadow transitions

### Form Components
#### Input Field
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id">Field Label *</Label>
  <Input
    id="field-id"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Placeholder text"
    required
  />
</div>
```
**Pattern**: Consistent label-input pairing with required field indicators

#### Select Dropdown
```tsx
<Select value={selectedValue} onValueChange={setSelectedValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```
**Styling**: Consistent with input fields, dropdown arrow indicator

#### Textarea
```tsx
<Textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Enter description..."
  className="min-h-32"
/>
```
**Usage**: Multi-line text input with minimum height constraints

#### Date Picker
```tsx
<DatePicker
  date={selectedDate}
  onDateChange={(date) => setSelectedDate(date)}
  placeholder="Select date"
/>
```
**Features**: Calendar popup, keyboard navigation, date formatting

### Navigation Components
#### Sidebar Navigation
```tsx
<nav className="flex flex-col gap-2">
  <NavLink 
    to="/path" 
    className={({ isActive }) => 
      `flex items-center gap-2 p-2 rounded-lg transition-colors ${
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      }`
    }
  >
    <Icon className="w-4 h-4" />
    Navigation Item
  </NavLink>
</nav>
```
**Pattern**: Icon + text with active state highlighting

#### Breadcrumb Navigation
```tsx
<nav className="flex items-center gap-2 text-sm">
  <Link to="/" className="text-muted-foreground hover:text-foreground">
    Home
  </Link>
  <ChevronRight className="w-3 h-3" />
  <span>Current Page</span>
</nav>
```

### Data Display Components
#### Badge System
```tsx
{/* Status Badges */}
<Badge variant="secondary">Applied</Badge>
<Badge variant="outline">Interview</Badge>
<Badge className="bg-success text-success-foreground">Offer</Badge>
<Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>

{/* Count Badges */}
<Badge variant="secondary">{count} items</Badge>
```
**Usage**: Status indicators, counts, categories

#### Statistics Cards
```tsx
<Card className="hover:shadow-lg transition-all duration-200">
  <CardContent className="p-6">
    <div className="flex items-center">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="ml-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  </CardContent>
</Card>
```
**Pattern**: Icon + large number + descriptive label

### Modal & Dialog Components
#### Standard Dialog
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

#### Confirmation Dialog
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. Are you sure?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={confirmAction}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Chart Components
#### Line Chart (Trends)
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={timeSeriesData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="period" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="applications" 
      stroke="hsl(var(--primary))" 
      strokeWidth={2}
    />
  </LineChart>
</ResponsiveContainer>
```

#### Bar Chart (Comparisons)
```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={categoryData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="category" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="hsl(var(--primary))" />
  </BarChart>
</ResponsiveContainer>
```

#### Pie Chart (Distribution)
```tsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={distributionData}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, percentage }) => `${name} (${percentage}%)`}
      outerRadius={80}
      dataKey="value"
    >
      {distributionData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

## Layout Patterns

### Page Layout Structure
```tsx
<div className="space-y-6">
  {/* Page Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
      <p className="text-muted-foreground">Page description</p>
    </div>
    <div className="flex items-center gap-2">
      {/* Action buttons */}
    </div>
  </div>

  {/* Content Sections */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Content cards */}
  </div>
</div>
```

### Two-Column Layout (Editor Pages)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main Content - 2/3 width */}
  <div className="lg:col-span-2 space-y-6">
    {/* Primary content */}
  </div>
  
  {/* Sidebar - 1/3 width */}
  <div className="space-y-6">
    {/* Secondary content */}
  </div>
</div>
```

### Dashboard Grid Layout
```tsx
{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stat cards */}
</div>

{/* Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Feature cards */}
</div>
```

## Interactive States & Transitions

### Hover Effects
```css
/* Card Hover */
.hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.hover\:scale-105:hover { transform: scale(1.05); }
.transition-all { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }

/* Button Hover */
.hover\:bg-primary\/90:hover { background-color: hsl(var(--primary) / 0.9); }
```

### Loading States
```tsx
{/* Spinner */}
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />

{/* Skeleton Loading */}
<div className="animate-pulse">
  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
  <div className="h-4 bg-muted rounded w-1/2" />
</div>

{/* Page Loading */}
<div className="flex items-center justify-center h-96">
  <div className="text-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto" />
    <p className="mt-4 text-muted-foreground">Loading...</p>
  </div>
</div>
```

### Focus States
```css
/* Focus Ring */
.focus-visible\:outline-none:focus-visible { outline: none; }
.focus-visible\:ring-2:focus-visible { 
  box-shadow: 0 0 0 2px hsl(var(--ring)); 
}
```

## Responsive Design Patterns

### Breakpoint System
```css
/* Tailwind Breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large screens */
```

### Grid Responsiveness
```tsx
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

{/* Mobile: 1 column, Desktop: 2 columns */}  
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* Mobile: 1 column, Desktop: 3 columns with 2/3 + 1/3 split */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">Main Content</div>
  <div>Sidebar</div>
</div>
```

### Mobile Optimization
```tsx
{/* Hidden on mobile, visible on desktop */}
<div className="hidden md:block">Desktop Only Content</div>

{/* Visible on mobile, hidden on desktop */}
<div className="block md:hidden">Mobile Only Content</div>

{/* Different spacing on mobile vs desktop */}
<div className="p-4 md:p-6">Responsive Padding</div>

{/* Stack vertically on mobile, horizontal on desktop */}
<div className="flex flex-col md:flex-row gap-4">
```

## Icon System

### Lucide React Icons
```tsx
import { 
  Plus, Edit, Trash2, Eye, Download, Upload,
  Search, Filter, Calendar, User, Building,
  FileText, Layers, Briefcase, TrendingUp,
  Mail, Phone, Globe, Linkedin, MapPin,
  ChevronRight, ChevronDown, ArrowLeft, ArrowRight,
  Settings, Info, Warning, CheckCircle, XCircle
} from 'lucide-react';

{/* Standard icon usage */}
<Icon className="w-4 h-4" />        {/* 16px - inline with text */}
<Icon className="w-5 h-5" />        {/* 20px - card headers */}
<Icon className="w-6 h-6" />        {/* 24px - prominent elements */}
```

### Icon + Text Patterns
```tsx
{/* Button with icon */}
<Button>
  <Plus className="w-4 h-4 mr-2" />
  Add Item
</Button>

{/* List item with icon */}
<div className="flex items-center gap-2">
  <Icon className="w-4 h-4 text-muted-foreground" />
  <span>List Item</span>
</div>

{/* Card header with icon */}
<CardTitle className="flex items-center gap-2">
  <Icon className="w-5 h-5" />
  Section Title
</CardTitle>
```

## Animation & Motion

### CSS Transitions
```css
/* Standard transition */
.transition-all { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }

/* Specific property transitions */
.transition-colors { transition: color, background-color 0.2s ease; }
.transition-transform { transition: transform 0.2s ease; }
.transition-opacity { transition: opacity 0.2s ease; }

/* Duration variants */
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
```

### Keyframe Animations
```css
/* Spin animation for loading */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }

/* Pulse animation for loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

## Accessibility Features

### ARIA Labels & Roles
```tsx
{/* Button with description */}
<Button aria-label="Delete application" aria-describedby="delete-help">
  <Trash2 className="w-4 h-4" />
</Button>
<div id="delete-help" className="sr-only">
  This will permanently delete the application
</div>

{/* Status indicators */}
<Badge role="status" aria-label="Application status">
  Applied
</Badge>

{/* Interactive elements */}
<div 
  role="button" 
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
  aria-pressed={isPressed}
>
  Toggle Button
</div>
```

### Keyboard Navigation
```tsx
{/* Tab order management */}
<div className="focus-within:ring-2 focus-within:ring-primary">
  <Input tabIndex={1} />
  <Button tabIndex={2}>Submit</Button>
</div>

{/* Skip links */}
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>
```

### Screen Reader Support
```tsx
{/* Hidden content for screen readers */}
<span className="sr-only">Additional context for screen readers</span>

{/* Live regions for dynamic content */}
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

{/* Descriptive headings */}
<h2 className="text-2xl font-bold">
  Job Applications 
  <span className="text-sm font-normal text-muted-foreground ml-2">
    ({applicationCount} total)
  </span>
</h2>
```

## Error States & Validation

### Form Validation
```tsx
{/* Field-level validation */}
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className={error ? 'border-destructive' : ''}
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <p id="email-error" className="text-sm text-destructive">
      {error}
    </p>
  )}
</div>
```

### Empty States
```tsx
<div className="text-center py-12">
  <Icon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold mb-2">No Items Found</h3>
  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
    Description of empty state and suggested actions.
  </p>
  <Button>
    <Plus className="w-4 h-4 mr-2" />
    Create First Item
  </Button>
</div>
```

### Error Boundaries
```tsx
{/* Error fallback UI */}
<div className="text-center py-8">
  <XCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
  <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
  <p className="text-muted-foreground mb-4">
    Please try refreshing the page or contact support.
  </p>
  <Button variant="outline" onClick={() => window.location.reload()}>
    Refresh Page
  </Button>
</div>
```

This comprehensive UI documentation provides all the patterns, components, and guidelines needed to maintain consistency and build new features within the application's design system.
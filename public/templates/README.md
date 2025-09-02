# Resume Builder Import Templates

This folder contains customizable templates for importing data into the Resume Builder application.

## Available Templates

### 1. Job Applications Template (`job-applications-template.csv`)
**Use this to import your job tracking data**

Required columns:
- `Company` - Company name (required)
- `Role` - Job title/position (required)

Optional columns:
- `Location` - Job location
- `Status` - One of: prospect, applied, interview, offer, rejected, closed
- `Applied Date` - Date you applied (YYYY-MM-DD format)
- `Variant ID` - ID of resume variant used (leave blank if none)
- `Cover Letter ID` - ID of cover letter used (leave blank if none)
- `Notes` - Additional notes about the application

### 2. Cover Letters Template (`cover-letters-template.csv`)
**Use this to import cover letter templates**

Required columns:
- `Title` - Cover letter name
- `Body` - Cover letter content (use {{VARIABLE_NAME}} for placeholders)

Optional columns:
- `Variables` - Comma-separated list of variable names used in the body

### 3. Master Resume Template (`master-resume-template.json`)
**Use this to create or import a complete resume profile**

Contains sections for:
- Personal contact information
- Professional headline
- Summary statements
- Work experience with bullet points and tags
- Education history
- Awards and achievements
- Skills (primary and secondary)
- Section ordering and visibility settings

### 4. Resume Variant Template (`variant-template.json`)
**Use this to create custom resume variants**

Configure:
- **Rules**: Filter content by tags, date ranges, or bullet point limits
- **Overrides**: Custom content for specific sections or fields
- **Section Settings**: Which sections to include in this variant

### 5. Resume Style Template (`resume-template.json`)
**Use this to create custom formatting templates**

Customize:
- Layout (single-column, two-column, three-column)
- Typography (fonts, sizes, line heights)
- Colors and styling
- Margins and spacing
- Section formatting preferences

## How to Use Templates

1. **Download** the template file you need from the app
2. **Edit** the file with your preferred editor:
   - CSV files: Excel, Google Sheets, or any spreadsheet app
   - JSON files: Any text editor or JSON editor
3. **Replace** example data with your own information
4. **Import** the customized file using the import features in each section
5. **Validate**: The app will check your data and guide you through any errors

## Tips for Success

- **CSV Files**: Keep column headers exactly as shown in templates
- **JSON Files**: Maintain the structure while customizing values
- **Required Fields**: Make sure all required fields have values
- **Date Format**: Use YYYY-MM-DD format for all dates
- **Testing**: Start with a small amount of data to test the import process

## Support

If you encounter issues with templates or imports:
1. Check that required fields are filled
2. Verify date formats match YYYY-MM-DD
3. Ensure JSON files are valid (use a JSON validator)
4. Check that status values match the allowed options

For more help, refer to the Guide section in the app or check the documentation.
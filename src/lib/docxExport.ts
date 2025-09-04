import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType,
  UnderlineType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  SectionType,
  PageOrientation,
  convertInchesToTwip,
  LevelFormat,
  NumberFormat,
  Tab,
  TabStopPosition,
  TabStopType
} from 'docx';
import { ResumeMaster, Variant } from '@/types/resume';
import { VariantResolver } from './variantResolver';
import { format } from 'date-fns';

export class DocxExporter {
  // Helper method to create section headers with consistent formatting
  private static createSectionHeader(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { 
        before: convertInchesToTwip(0.15),
        after: convertInchesToTwip(0.05) 
      },
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    });
  }

  // Helper method to format dates consistently
  private static formatDateRange(startDate: string, endDate: string | null): string {
    // Convert MM/YYYY to YYYY-MM-DD format for proper Date parsing
    const convertDateFormat = (dateStr: string) => {
      if (!dateStr) return null;
      
      // Check if it's in MM/YYYY format
      if (dateStr.includes('/')) {
        const [month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-01`; // Add day to avoid timezone issues
      }
      
      // If already in YYYY-MM format, add day
      if (/^\d{4}-\d{2}$/.test(dateStr)) {
        return `${dateStr}-01`;
      }
      
      return dateStr;
    };

    try {
      const convertedStart = convertDateFormat(startDate);
      const start = convertedStart ? new Date(convertedStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : startDate;
      
      let end = 'Present';
      if (endDate) {
        const convertedEnd = convertDateFormat(endDate);
        end = convertedEnd ? new Date(convertedEnd).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : endDate;
      }
      
      return `${start} – ${end}`;
    } catch (error) {
      console.error('Date formatting error:', error, { startDate, endDate });
      // Fallback to original strings if formatting fails
      return `${startDate} – ${endDate || 'Present'}`;
    }
  }

  // Helper method to create formatted bullet paragraphs with proper indentation
  private static createBulletParagraph(text: string, level: number = 0): Paragraph {
    const cleanText = text.replace(/^[•◦▪‣\-\*\+]\s*/, '').trim();
    const indentLevel = convertInchesToTwip(0.25 + (level * 0.25)); // Base indent + level indent
    const hangingIndent = convertInchesToTwip(0.2);
    
    return new Paragraph({
      children: [
        new TextRun({
          text: `• ${cleanText}`,
          size: 20,
          font: "Calibri",
        }),
      ],
      indent: {
        left: indentLevel,
        hanging: hangingIndent,
      },
      spacing: { 
        after: convertInchesToTwip(0.05),
        line: 240 // 1.2 line spacing
      },
      tabStops: [
        {
          type: TabStopType.LEFT,
          position: indentLevel,
        },
      ],
    });
  }

  // Helper method to create job/position headers
  private static createPositionHeader(title: string, company: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` | ${company}`,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { 
        before: convertInchesToTwip(0.1),
        after: convertInchesToTwip(0.02) 
      },
    });
  }

  // Helper method to create date/location lines
  private static createDateLocationLine(location: string, dateStart: string, dateEnd?: string | null): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: `${location} | ${this.formatDateRange(dateStart, dateEnd)}`,
          italics: true,
          size: 20,
          font: "Calibri",
        }),
      ],
      spacing: { 
        after: convertInchesToTwip(0.05) 
      },
    });
  }

  // Enhanced method to parse and format hierarchical bullet points
  private static formatBulletPoints(bullets: string[]): Paragraph[] {
    if (!bullets || bullets.length === 0) return [];
    
    return bullets.map((bullet) => {
      // Detect indentation level more accurately
      let level = 0;
      const originalText = bullet;
      const trimmed = bullet.trim();
      
      // Count leading whitespace to determine hierarchy
      const leadingSpaces = originalText.length - originalText.trimStart().length;
      if (leadingSpaces >= 8) level = 3;
      else if (leadingSpaces >= 4) level = 2;
      else if (leadingSpaces >= 2) level = 1;
      
      // Also check for explicit sub-bullet indicators
      if (trimmed.match(/^[-◦▪]\s/) && level === 0) level = 1;
      if (trimmed.match(/^[▪‣]\s/) && level <= 1) level = 2;
      
      return this.createBulletParagraph(trimmed, level);
    });
  }

  // Helper to create education entries
  private static createEducationEntry(degree: string, school: string, location?: string, year?: string): Paragraph[] {
    const educationParts = [degree, school];
    if (location) educationParts.push(location);
    if (year) educationParts.push(year);
    
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: educationParts.join(' | '),
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: convertInchesToTwip(0.05) },
      })
    ];
  }

  // Helper to create certification entries
  private static createCertificationEntry(name: string, issuer: string, date?: string): Paragraph {
    const certText = `${name} – ${issuer}${date ? ` (${date})` : ''}`;
    return this.createBulletParagraph(certText, 0);
  }

  // Helper to create skills section with better formatting
  private static createSkillsSection(skills: { primary?: string[], secondary?: string[] }): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    
    if (skills.primary && skills.primary.length > 0) {
      // Create skill groups of 6-8 skills per line for better readability
      const skillGroups: string[][] = [];
      for (let i = 0; i < skills.primary.length; i += 7) {
        skillGroups.push(skills.primary.slice(i, i + 7));
      }
      
      skillGroups.forEach(group => {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: group.join(' • '),
              size: 20,
              font: "Calibri",
            }),
          ],
          spacing: { after: convertInchesToTwip(0.05) },
        }));
      });
    }
    
    if (skills.secondary && skills.secondary.length > 0) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: "Additional Skills: ",
            bold: true,
            size: 20,
            font: "Calibri",
          }),
          new TextRun({
            text: skills.secondary.join(', '),
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { 
          before: convertInchesToTwip(0.05),
          after: convertInchesToTwip(0.05) 
        },
      }));
    }
    
    return paragraphs;
  }

  static async exportResume(resume: ResumeMaster, variant?: Variant, fileName?: string): Promise<void> {
    // Get sections in the correct order based on master resume settings
    const sectionOrder = [
      { key: 'summary', enabled: resume.sections?.summary?.enabled ?? true, order: resume.sections?.summary?.order ?? 1 },
      { key: 'key_achievements', enabled: resume.sections?.key_achievements?.enabled ?? true, order: resume.sections?.key_achievements?.order ?? 2 },
      { key: 'experience', enabled: resume.sections?.experience?.enabled ?? true, order: resume.sections?.experience?.order ?? 3 },
      { key: 'education', enabled: resume.sections?.education?.enabled ?? true, order: resume.sections?.education?.order ?? 4 },
      { key: 'certifications', enabled: resume.sections?.certifications?.enabled ?? true, order: resume.sections?.certifications?.order ?? 5 },
      { key: 'skills', enabled: resume.sections?.skills?.enabled ?? true, order: resume.sections?.skills?.order ?? 6 },
      { key: 'awards', enabled: resume.sections?.awards?.enabled ?? true, order: resume.sections?.awards?.order ?? 7 }
    ].filter(section => section.enabled).sort((a, b) => a.order - b.order);

    const documentChildren: Paragraph[] = [];

    // Header Section - Name and Contact Info
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.owner,
            bold: true,
            size: 36,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: convertInchesToTwip(0.05) },
      })
    );

    // Professional Headline
    if (resume.headline) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.headline,
              size: 24,
              italics: true,
              font: "Calibri",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: convertInchesToTwip(0.1) },
        })
      );
    }

    // Contact Information with better formatting
    const contactParts = [resume.contacts.email, resume.contacts.phone];
    if (resume.contacts.website) contactParts.push(resume.contacts.website);
    if (resume.contacts.linkedin) contactParts.push(resume.contacts.linkedin);

    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: 20,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: convertInchesToTwip(0.15) },
      })
    );

    // Add a subtle separator line
    documentChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "", size: 1 })],
        border: {
          bottom: {
            color: "CCCCCC",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 3,
          },
        },
        spacing: { after: convertInchesToTwip(0.1) },
      })
    );

    // Process sections in order
    sectionOrder.forEach(section => {
      switch (section.key) {
        case 'summary':
          if (resume.summary && resume.summary.length > 0) {
            documentChildren.push(this.createSectionHeader("Professional Summary"));
            documentChildren.push(...this.formatBulletPoints(resume.summary));
          }
          break;

        case 'key_achievements':
          if (resume.key_achievements && resume.key_achievements.length > 0) {
            documentChildren.push(this.createSectionHeader("Key Achievements"));
            documentChildren.push(...this.formatBulletPoints(resume.key_achievements));
          }
          break;

        case 'experience':
          if (resume.experience && resume.experience.length > 0) {
            documentChildren.push(this.createSectionHeader("Professional Experience"));
            resume.experience.forEach(exp => {
              documentChildren.push(this.createPositionHeader(exp.title, exp.company));
              documentChildren.push(this.createDateLocationLine(exp.location, exp.date_start, exp.date_end));
              documentChildren.push(...this.formatBulletPoints(exp.bullets));
            });
          }
          break;

        case 'education':
          if (resume.education && resume.education.length > 0) {
            documentChildren.push(this.createSectionHeader("Education"));
            resume.education.forEach(edu => {
              documentChildren.push(...this.createEducationEntry(edu.degree, edu.school, edu.location, edu.year));
            });
          }
          break;

        case 'certifications':
          if (resume.certifications && resume.certifications.length > 0) {
            documentChildren.push(this.createSectionHeader("Certifications"));
            resume.certifications.forEach(cert => {
              documentChildren.push(this.createCertificationEntry(cert.name, cert.issuer, cert.date));
            });
          }
          break;

        case 'skills':
          if (resume.skills?.primary && resume.skills.primary.length > 0) {
            documentChildren.push(this.createSectionHeader("Core Competencies"));
            documentChildren.push(...this.createSkillsSection(resume.skills));
          }
          break;

        case 'awards':
          if (resume.awards && resume.awards.length > 0) {
            documentChildren.push(this.createSectionHeader("Awards & Recognition"));
            resume.awards.forEach(award => {
              const awardText = `${award.title}${award.date ? ` (${award.date})` : ''}${award.description ? ` – ${award.description}` : ''}`;
              documentChildren.push(this.createBulletParagraph(awardText, 0));
            });
          }
          break;
      }
    });

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children: documentChildren,
      }],
      styles: {
        default: {
          document: {
            run: {
              font: "Calibri",
              size: 20,
            },
            paragraph: {
              spacing: {
                line: 240, // 1.2 line spacing
              },
            },
          },
        },
      },
    });

    const blob = await Packer.toBlob(doc);
    
    const variantSuffix = variant ? `_${variant.name.replace(/\s+/g, '-')}` : '';
    const defaultFileName = `${resume.owner.replace(/\s+/g, '-')}_Resume${variantSuffix}_${format(new Date(), 'yyyy-MM-dd')}.docx`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || defaultFileName;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  // Enhanced export method that automatically resolves variants
  static async exportVariant(masterResume: ResumeMaster, variant: Variant, fileName?: string): Promise<void> {
    try {
      // Resolve the variant to get the final resume data
      const resolvedResume = VariantResolver.resolveVariant(masterResume, variant);
      
      // Export the resolved resume with variant information
      await this.exportResume(resolvedResume, variant, fileName);
    } catch (error) {
      console.error('Error exporting variant:', error);
      throw new Error(`Failed to export variant "${variant.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility method to generate standardized filename
  static generateFileName(resume: ResumeMaster, variant?: Variant): string {
    const ownerName = resume.owner.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
    const variantSuffix = variant ? `_${variant.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')}` : '_Master';
    const dateSuffix = format(new Date(), 'yyyy-MM-dd');
    return `${ownerName}_Resume${variantSuffix}_${dateSuffix}.docx`;
  }

  // Batch export method for multiple variants
  static async exportMultipleVariants(masterResume: ResumeMaster, variants: Variant[]): Promise<void> {
    const results = [];
    
    for (const variant of variants) {
      try {
        const fileName = this.generateFileName(masterResume, variant);
        await this.exportVariant(masterResume, variant, fileName);
        results.push({ variant: variant.name, success: true });
      } catch (error) {
        results.push({ 
          variant: variant.name, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    // Log results for debugging
    console.log('Batch export results:', results);
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      throw new Error(`${failed.length} of ${variants.length} variants failed to export. Check console for details.`);
    }
  }
}
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
  NumberFormat
} from 'docx';
import { ResumeMaster, Variant } from '@/types/resume';
import { format } from 'date-fns';

export class DocxExporter {
  // Helper method to create formatted bullet paragraphs with proper indentation
  private static createBulletParagraph(text: string, level: number = 0): Paragraph {
    const indentLevel = level * 360; // 0.25 inch per level
    const bulletSymbols = ['•', '◦', '▪', '‣'];
    const symbol = bulletSymbols[Math.min(level, bulletSymbols.length - 1)];
    
    return new Paragraph({
      children: [
        new TextRun({
          text: `${symbol} ${text.replace(/^[•◦▪‣\-\*]\s*/, '')}`, // Remove existing bullet if present
          size: 20,
        }),
      ],
      indent: {
        left: indentLevel,
        hanging: convertInchesToTwip(0.25),
      },
      spacing: { after: 80 },
    });
  }

  // Helper method to parse and format hierarchical bullet points
  private static formatBulletPoints(bullets: string[]): Paragraph[] {
    return bullets.map((bullet) => {
      // Detect indentation level based on leading spaces, tabs, or dash patterns
      let level = 0;
      const trimmed = bullet.trim();
      
      // Count indentation based on leading whitespace or nested patterns
      if (bullet.match(/^\s{2,4}/) || bullet.match(/^\t/)) {
        level = 1;
      } else if (bullet.match(/^\s{5,8}/) || bullet.match(/^\t\t/)) {
        level = 2;
      } else if (bullet.match(/^\s{9,}/) || bullet.match(/^\t\t\t/)) {
        level = 3;
      }
      
      // Also detect sub-bullet patterns like "- Sub item" or "o Sub item"
      if (trimmed.match(/^[-o]\s/) && level === 0) {
        level = 1;
      }
      
      return this.createBulletParagraph(trimmed, level);
    });
  }

  static async exportResume(resume: ResumeMaster, variant?: Variant, fileName?: string): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.5),
            },
          },
        },
        children: [
          // Header with name and contact info
          new Paragraph({
            children: [
              new TextRun({
                text: resume.owner,
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: resume.headline || '',
                size: 24,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          // Contact information
          new Paragraph({
            children: [
              new TextRun({
                text: `${resume.contacts.email} | ${resume.contacts.phone}`,
                size: 20,
              }),
              ...(resume.contacts.website ? [new TextRun({
                text: ` | ${resume.contacts.website}`,
                size: 20,
              })] : []),
              ...(resume.contacts.linkedin ? [new TextRun({
                text: ` | ${resume.contacts.linkedin}`,
                size: 20,
              })] : []),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Professional Summary
          ...(resume.summary && resume.summary.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROFESSIONAL SUMMARY",
                  bold: true,
                  size: 24,
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...this.formatBulletPoints(resume.summary),
          ] : []),

          // Key Achievements
          ...(resume.key_achievements && resume.key_achievements.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "KEY ACHIEVEMENTS",
                  bold: true,
                  size: 24,
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...this.formatBulletPoints(resume.key_achievements),
          ] : []),

          // Experience
          ...(resume.experience && resume.experience.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROFESSIONAL EXPERIENCE",
                  bold: true,
                  size: 24,
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...resume.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.title} | ${exp.company}`,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { before: 150, after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.location} | ${exp.date_start} - ${exp.date_end || 'Present'}`,
                    italics: true,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              }),
              ...this.formatBulletPoints(exp.bullets),
            ]),
          ] : []),

          // Education
          ...(resume.education && resume.education.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "EDUCATION",
                  bold: true,
                  size: 24,
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...resume.education.map(edu => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree} | ${edu.school}`,
                    size: 20,
                    bold: true,
                  }),
                  ...(edu.location ? [new TextRun({
                    text: ` | ${edu.location}`,
                    size: 20,
                  })] : []),
                  ...(edu.year ? [new TextRun({
                    text: ` | ${edu.year}`,
                    size: 20,
                  })] : []),
                ],
                spacing: { after: 100 },
              })
            ),
          ] : []),

          // Skills
          ...(resume.skills?.primary && resume.skills.primary.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "CORE COMPETENCIES",
                  bold: true,
                  size: 24,
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.skills.primary.join(' • '),
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            }),
          ] : []),

          // Awards
          ...(resume.awards && resume.awards.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "AWARDS & RECOGNITION",
                  bold: true,
                  size: 24,
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...resume.awards.map(award => 
              this.createBulletParagraph(`${award.title}${award.date ? ` – ${award.date}` : ''}`, 0)
            ),
          ] : []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    
    const defaultFileName = `${resume.owner.replace(/\s+/g, '-')}_Resume_${format(new Date(), 'yyyy-MM-dd')}.docx`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || defaultFileName;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }
}
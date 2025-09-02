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
  convertInchesToTwip
} from 'docx';
import { ResumeMaster, Variant } from '@/types/resume';
import { format } from 'date-fns';

export class DocxExporter {
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
            ...resume.summary.map(bullet => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${bullet}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              })
            ),
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
            ...resume.key_achievements.map(bullet => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${bullet}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              })
            ),
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
              ...exp.bullets.map(bullet => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${bullet}`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 80 },
                })
              ),
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
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${award.title}${award.date ? ` – ${award.date}` : ''}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 80 },
              })
            ),
          ] : []),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    const defaultFileName = `${resume.owner.replace(/\s+/g, '-')}_Resume_${format(new Date(), 'yyyy-MM-dd')}.docx`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || defaultFileName;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }
}
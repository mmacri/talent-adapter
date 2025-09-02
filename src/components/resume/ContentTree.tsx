import { useState } from 'react';
import { ResumeMaster } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award,
  Target,
  Tag
} from 'lucide-react';

interface ContentTreeProps {
  resume: ResumeMaster;
  selectedSection: string;
  selectedItem: string | null;
  searchQuery: string;
  onSectionSelect: (section: string) => void;
  onItemSelect: (item: string | null) => void;
}

export const ContentTree = ({
  resume,
  selectedSection,
  selectedItem,
  searchQuery,
  onSectionSelect,
  onItemSelect
}: ContentTreeProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['experience']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionSelect(sectionId);
    if (!expandedSections.has(sectionId)) {
      toggleSection(sectionId);
    }
  };

  const getSectionIcon = (sectionId: string) => {
    const icons: Record<string, any> = {
      summary: FileText,
      achievements: Target,
      experience: Briefcase,
      education: GraduationCap,
      awards: Award,
      skills: Tag
    };
    return icons[sectionId] || FileText;
  };

  const filterContent = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const sections = [
    {
      id: 'summary',
      title: 'Professional Summary',
      items: resume.summary.filter(filterContent),
      count: resume.summary.length
    },
    {
      id: 'achievements',
      title: 'Key Achievements',
      items: resume.key_achievements.filter(filterContent),
      count: resume.key_achievements.length
    },
    {
      id: 'experience',
      title: 'Work Experience',
      items: resume.experience.filter(exp => 
        filterContent(exp.company) || 
        filterContent(exp.title) || 
        exp.bullets.some(filterContent)
      ),
      count: resume.experience.length
    },
    {
      id: 'education',
      title: 'Education',
      items: resume.education.filter(edu => 
        filterContent(edu.degree) || filterContent(edu.school)
      ),
      count: resume.education.length
    },
    {
      id: 'awards',
      title: 'Awards & Recognition',
      items: resume.awards.filter(award => 
        filterContent(award.title || '')
      ),
      count: resume.awards.length
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      items: resume.skills.primary.filter(filterContent),
      count: resume.skills.primary.length
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-1 p-2">
        {sections.map((section) => {
          const Icon = getSectionIcon(section.id);
          const isExpanded = expandedSections.has(section.id);
          const isSelected = selectedSection === section.id;
          
          return (
            <div key={section.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start px-2 py-1 h-auto font-normal ${
                  isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => handleSectionClick(section.id)}
              >
                <div className="flex items-center w-full">
                  {section.count > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(section.id);
                      }}
                      className="mr-1"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    <div className="w-5" />
                  )}
                  
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  
                  <span className="flex-1 text-left text-sm truncate">
                    {section.title}
                  </span>
                  
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {section.count}
                  </Badge>
                </div>
              </Button>

              {/* Section Items */}
              {isExpanded && section.items.length > 0 && (
                <div className="ml-6 space-y-1 mt-1">
                  {section.id === 'experience' && (
                    <>
                      {(section.items as typeof resume.experience).map((exp) => (
                        <div key={exp.id} className="space-y-1">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start px-2 py-1 h-auto font-normal text-xs ${
                              selectedItem === exp.id ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => onItemSelect(exp.id)}
                          >
                            <div className="flex flex-col items-start w-full">
                              <span className="font-medium truncate w-full">{exp.title}</span>
                              <span className="text-muted-foreground truncate w-full">{exp.company}</span>
                            </div>
                          </Button>
                          
                          {/* Experience Tags */}
                          {exp.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 ml-2">
                              {exp.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                  
                  {section.id === 'education' && (
                    <>
                      {(section.items as typeof resume.education).map((edu, index) => (
                        <Button
                          key={edu.id}
                          variant="ghost"
                          className="w-full justify-start px-2 py-1 h-auto font-normal text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => onItemSelect(`edu-${index}`)}
                        >
                          <div className="flex flex-col items-start w-full">
                            <span className="font-medium truncate w-full">{edu.degree}</span>
                            <span className="text-muted-foreground truncate w-full">{edu.school}</span>
                          </div>
                        </Button>
                      ))}
                    </>
                  )}
                  
                  {(section.id === 'summary' || section.id === 'achievements') && (
                    <>
                      {(section.items as string[]).map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start px-2 py-1 h-auto font-normal text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => onItemSelect(`${section.id}-${index}`)}
                        >
                          <span className="truncate text-left">
                            {item.length > 50 ? `${item.substring(0, 50)}...` : item}
                          </span>
                        </Button>
                      ))}
                    </>
                  )}
                  
                  {section.id === 'awards' && (
                    <>
                      {(section.items as typeof resume.awards).map((award, index) => (
                        <Button
                          key={award.id}
                          variant="ghost"
                          className="w-full justify-start px-2 py-1 h-auto font-normal text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => onItemSelect(`award-${index}`)}
                        >
                          <span className="truncate text-left">
                            {award.title && award.title.length > 40 ? `${award.title.substring(0, 40)}...` : award.title}
                          </span>
                        </Button>
                      ))}
                    </>
                  )}
                  
                  {section.id === 'skills' && (
                    <div className="flex flex-wrap gap-1 p-2">
                      {(section.items as string[]).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary/10"
                          onClick={() => onItemSelect(`skill-${index}`)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
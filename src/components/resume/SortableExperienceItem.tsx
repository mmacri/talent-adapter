import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Trash2, Briefcase, Edit3, Plus } from 'lucide-react';
import { Experience } from '@/types/resume';
import { TipTapEditor } from './TipTapEditor';
import { TagManager } from './TagManager';

interface SortableExperienceItemProps {
  experience: Experience;
  index: number;
  onUpdate: (experienceId: string, updates: Partial<Experience>) => void;
  onDelete: (experienceId: string) => void;
}

export const SortableExperienceItem = ({
  experience,
  index,
  onUpdate,
  onDelete,
}: SortableExperienceItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const [isExpanded, setIsExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const addBullet = () => {
    const updatedBullets = [...experience.bullets, 'New responsibility or achievement'];
    onUpdate(experience.id, { bullets: updatedBullets });
  };

  const updateBullet = (bulletIndex: number, newText: string) => {
    const updatedBullets = experience.bullets.map((bullet, i) => 
      i === bulletIndex ? newText : bullet
    );
    onUpdate(experience.id, { bullets: updatedBullets });
  };

  const removeBullet = (bulletIndex: number) => {
    const updatedBullets = experience.bullets.filter((_, i) => i !== bulletIndex);
    onUpdate(experience.id, { bullets: updatedBullets });
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`${isDragging ? 'shadow-lg' : ''} transition-shadow`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="bg-primary/10 rounded-full p-1">
              <span className="text-xs font-bold text-primary px-2">
                {index + 1}
              </span>
            </div>
            <Briefcase className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg flex-1">
              {experience.company} - {experience.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(experience.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-11">
            <span>{experience.location}</span>
            <span>•</span>
            <span>
              {experience.date_start} - {experience.date_end || 'Present'}
            </span>
            {experience.tags && experience.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-1">
                  {experience.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {experience.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{experience.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Company</Label>
                <Input
                  value={experience.company}
                  onChange={(e) => onUpdate(experience.id, { company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  value={experience.title}
                  onChange={(e) => onUpdate(experience.id, { title: e.target.value })}
                  placeholder="Position Title"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  value={experience.location}
                  onChange={(e) => onUpdate(experience.id, { location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Input
                    type="month"
                    value={experience.date_start}
                    onChange={(e) => onUpdate(experience.id, { date_start: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <Input
                    type="month"
                    value={experience.date_end || ''}
                    onChange={(e) => onUpdate(experience.id, { date_end: e.target.value || null })}
                    placeholder="Leave empty if current"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <TagManager
                tags={experience.tags || []}
                onTagsChange={(tags) => onUpdate(experience.id, { tags })}
              />
            </div>

            {/* Responsibilities/Bullets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Responsibilities & Achievements</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBullet}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Point
                </Button>
              </div>
              
              <TipTapEditor
                content={experience.bullets}
                onChange={(bullets) => onUpdate(experience.id, { bullets })}
                placeholder="Add a responsibility or achievement..."
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
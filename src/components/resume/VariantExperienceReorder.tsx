import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Briefcase, RotateCcw } from 'lucide-react';
import { Experience, ResumeMaster, VariantOverride } from '@/types/resume';

interface VariantExperienceReorderProps {
  masterResume: ResumeMaster;
  overrides: VariantOverride[];
  onOverridesChange: (overrides: VariantOverride[]) => void;
}

interface SortableExperienceCardProps {
  experience: Experience;
  index: number;
}

const SortableExperienceCard = ({ experience, index }: SortableExperienceCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`cursor-default ${isDragging ? 'shadow-lg' : ''} transition-shadow`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
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
            <div className="flex-1">
              <CardTitle className="text-base">
                {experience.title} - {experience.company}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>
                  {experience.date_start} - {experience.date_end || 'Present'}
                </span>
                {experience.tags && experience.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex gap-1">
                      {experience.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {experience.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{experience.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export const VariantExperienceReorder = ({
  masterResume,
  overrides,
  onOverridesChange,
}: VariantExperienceReorderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get current experience order (could be overridden)
  const getExperienceOrder = (): string[] => {
    const orderOverride = overrides.find(o => o.path === 'experience_order' && o.operation === 'set');
    if (orderOverride && Array.isArray(orderOverride.value)) {
      return orderOverride.value;
    }
    return masterResume.experience.map(exp => exp.id);
  };

  // Get ordered experiences based on current order
  const getOrderedExperiences = (): Experience[] => {
    const order = getExperienceOrder();
    const experienceMap = new Map(masterResume.experience.map(exp => [exp.id, exp]));
    
    // Return experiences in the specified order, including any that might not be in the order list
    const orderedExperiences = order
      .map(id => experienceMap.get(id))
      .filter((exp): exp is Experience => exp !== undefined);
    
    // Add any experiences not in the order list at the end
    const remainingExperiences = masterResume.experience.filter(
      exp => !order.includes(exp.id)
    );
    
    return [...orderedExperiences, ...remainingExperiences];
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const currentExperiences = getOrderedExperiences();
      const oldIndex = currentExperiences.findIndex((exp) => exp.id === active.id);
      const newIndex = currentExperiences.findIndex((exp) => exp.id === over?.id);

      const reorderedExperiences = arrayMove(currentExperiences, oldIndex, newIndex);
      const newOrder = reorderedExperiences.map(exp => exp.id);

      // Update overrides
      const updatedOverrides = overrides.filter(o => !(o.path === 'experience_order' && o.operation === 'set'));
      
      // Only add override if order is different from master resume
      const masterOrder = masterResume.experience.map(exp => exp.id);
      if (JSON.stringify(newOrder) !== JSON.stringify(masterOrder)) {
        updatedOverrides.push({
          path: 'experience_order',
          operation: 'set',
          value: newOrder
        });
      }

      onOverridesChange(updatedOverrides);
    }
  };

  const resetToMasterOrder = () => {
    const updatedOverrides = overrides.filter(o => !(o.path === 'experience_order' && o.operation === 'set'));
    onOverridesChange(updatedOverrides);
  };

  const orderedExperiences = getOrderedExperiences();
  const hasCustomOrder = overrides.some(o => o.path === 'experience_order' && o.operation === 'set');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Experience Order
              {hasCustomOrder && (
                <Badge variant="secondary" className="ml-2 text-xs">Custom</Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Drag to reorder work experiences for this variant
            </p>
          </div>
          {hasCustomOrder && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetToMasterOrder}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Master Order
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {orderedExperiences.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No work experience found in master resume</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={orderedExperiences.map(exp => exp.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {orderedExperiences.map((experience, index) => (
                  <SortableExperienceCard
                    key={experience.id}
                    experience={experience}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          {hasCustomOrder ? (
            <span className="text-orange-600">✏️ Using custom order for this variant</span>
          ) : (
            <span>📄 Using master resume order</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
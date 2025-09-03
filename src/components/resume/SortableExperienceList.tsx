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
import { Experience } from '@/types/resume';
import { SortableExperienceItem } from './SortableExperienceItem';

interface SortableExperienceListProps {
  experiences: Experience[];
  onReorder: (experiences: Experience[]) => void;
  onExperienceUpdate: (experienceId: string, updates: Partial<Experience>) => void;
  onExperienceDelete: (experienceId: string) => void;
}

export const SortableExperienceList = ({
  experiences,
  onReorder,
  onExperienceUpdate,
  onExperienceDelete,
}: SortableExperienceListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = experiences.findIndex((exp) => exp.id === active.id);
      const newIndex = experiences.findIndex((exp) => exp.id === over?.id);

      const reorderedExperiences = arrayMove(experiences, oldIndex, newIndex);
      onReorder(reorderedExperiences);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={experiences.map(exp => exp.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <SortableExperienceItem
              key={experience.id}
              experience={experience}
              index={index}
              onUpdate={onExperienceUpdate}
              onDelete={onExperienceDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
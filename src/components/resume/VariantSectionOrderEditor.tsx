import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  List
} from 'lucide-react';

export interface SectionOrderItem {
  id: string;
  name: string;
  enabled: boolean;
}

interface VariantSectionOrderEditorProps {
  sectionOrder: string[];
  onSectionOrderChange: (order: string[]) => void;
  availableSections: SectionOrderItem[];
}

const defaultSectionOrder = ['summary', 'key_achievements', 'experience', 'education', 'awards', 'certifications', 'skills'];

const sectionLabels: Record<string, string> = {
  summary: 'Professional Summary',
  key_achievements: 'Key Achievements', 
  experience: 'Experience',
  education: 'Education',
  awards: 'Awards & Recognition',
  certifications: 'Certifications',
  skills: 'Skills'
};

export const VariantSectionOrderEditor = ({ 
  sectionOrder, 
  onSectionOrderChange,
  availableSections 
}: VariantSectionOrderEditorProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Ensure we have all sections in order, add missing ones at the end
  const completeOrder = useCallback(() => {
    const currentOrder = [...sectionOrder];
    const availableIds = availableSections.map(s => s.id);
    
    // Add missing sections at the end
    availableIds.forEach(id => {
      if (!currentOrder.includes(id)) {
        currentOrder.push(id);
      }
    });
    
    // Remove sections that don't exist anymore
    return currentOrder.filter(id => availableIds.includes(id));
  }, [sectionOrder, availableSections]);

  const orderedSections = completeOrder();

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newOrder = [...orderedSections];
    const [movedSection] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedSection);
    onSectionOrderChange(newOrder);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      moveSection(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < orderedSections.length - 1) {
      moveSection(index, index + 1);
    }
  };

  const resetToDefault = () => {
    const availableIds = availableSections.map(s => s.id);
    const defaultOrder = defaultSectionOrder.filter(id => availableIds.includes(id));
    onSectionOrderChange(defaultOrder);
  };

  const getSectionInfo = (sectionId: string) => {
    return availableSections.find(s => s.id === sectionId);
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedItem) {
      const draggedIndex = orderedSections.indexOf(draggedItem);
      if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        moveSection(draggedIndex, targetIndex);
      }
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4" />
          <h4 className="font-medium">Section Order</h4>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefault}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset to Default
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Drag sections to reorder them, or use the arrow buttons. Only enabled sections will appear in the final resume.
      </p>

      <div className="space-y-2">
        {orderedSections.map((sectionId, index) => {
          const sectionInfo = getSectionInfo(sectionId);
          const isEnabled = sectionInfo?.enabled ?? true;
          const isDragging = draggedItem === sectionId;
          
          return (
            <Card
              key={sectionId}
              className={`transition-all duration-200 ${
                isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
              } ${!isEnabled ? 'opacity-60' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, sectionId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  
                  {/* Order Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </div>
                  
                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium truncate">
                      {sectionLabels[sectionId] || sectionId}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={isEnabled ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {sectionId}
                      </span>
                    </div>
                  </div>
                  
                  {/* Move Buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === orderedSections.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {orderedSections.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <List className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No Sections Available</h4>
          <p className="text-sm text-muted-foreground">
            Enable sections in the section settings tab to configure their order.
          </p>
        </div>
      )}
    </div>
  );
};
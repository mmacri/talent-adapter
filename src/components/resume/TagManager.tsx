import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Tag } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
}

const DEFAULT_TAGS = [
  'GRC', 'AI', 'Leadership', 'CustomerSuccess', 'Partner', 'GTM', 
  'Revenue', 'Enablement', 'Consulting', 'SME', 'Delivery', 'Scale'
];

export const TagManager = ({ 
  tags, 
  onTagsChange, 
  availableTags = DEFAULT_TAGS 
}: TagManagerProps) => {
  const [newTag, setNewTag] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      onTagsChange([...tags, normalizedTag]);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  const suggestedTags = availableTags.filter(tag => !tags.includes(tag));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags
        </Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Add New Tag</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter tag name..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim() || tags.includes(newTag.trim())}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {suggestedTags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Suggested Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedTags.map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          addTag(tag);
                          setIsOpen(false);
                        }}
                        className="h-7 text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Current Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No tags assigned. Add tags to categorize and filter this content.
          </p>
        ) : (
          tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 hover:bg-secondary/80 group"
            >
              <span>{tag}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="w-4 h-4 p-0 hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))
        )}
      </div>

      {/* Tag Stats */}
      {tags.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {tags.length} tag{tags.length !== 1 ? 's' : ''} assigned
        </div>
      )}
    </div>
  );
};
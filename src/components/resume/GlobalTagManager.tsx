import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  X, 
  Tag, 
  Search, 
  AlertTriangle,
  CheckCircle,
  Hash
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ResumeMaster } from '@/types/resume';
import { TagManager } from './TagManager';

interface GlobalTagManagerProps {
  masterResume: ResumeMaster;
  onMasterResumeUpdate: (resume: ResumeMaster) => void;
}

export const GlobalTagManager = ({ masterResume, onMasterResumeUpdate }: GlobalTagManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique tags used in the master resume
  const getAllUsedTags = () => {
    const tags = new Set<string>();
    masterResume.experience.forEach(exp => {
      exp.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  };

  // Get tag usage statistics
  const getTagStats = () => {
    const tagCounts = new Map<string, number>();
    masterResume.experience.forEach(exp => {
      exp.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return tagCounts;
  };

  // Remove a tag globally from all experience entries
  const removeTagGlobally = (tagToRemove: string) => {
    const updatedExperience = masterResume.experience.map(exp => ({
      ...exp,
      tags: exp.tags.filter(tag => tag !== tagToRemove)
    }));

    onMasterResumeUpdate({
      ...masterResume,
      experience: updatedExperience,
      updatedAt: new Date().toISOString()
    });
  };

  // Rename a tag globally across all experience entries
  const renameTagGlobally = (oldTag: string, newTag: string) => {
    if (newTag.trim() && oldTag !== newTag.trim()) {
      const updatedExperience = masterResume.experience.map(exp => ({
        ...exp,
        tags: exp.tags.map(tag => tag === oldTag ? newTag.trim() : tag)
      }));

      onMasterResumeUpdate({
        ...masterResume,
        experience: updatedExperience,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const allTags = getAllUsedTags();
  const tagStats = getTagStats();
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Hash className="w-4 h-4 mr-2" />
          Manage All Tags
          <Badge variant="secondary" className="ml-auto">
            {allTags.length}
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Global Tag Management
          </DialogTitle>
          <DialogDescription>
            Manage all tags used across your experience entries. Changes apply globally.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="overview" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Tag Overview</TabsTrigger>
              <TabsTrigger value="management">Tag Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allTags.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Most Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Array.from(tagStats.entries())
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tagged Experiences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {masterResume.experience.filter(exp => exp.tags.length > 0).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tag Usage List */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-base">Tag Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredTags.map(tag => (
                      <div key={tag} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{tag}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {tagStats.get(tag)} use{tagStats.get(tag) !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {filteredTags.length === 0 && searchQuery && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tags found matching "{searchQuery}"</p>
                      </div>
                    )}
                    
                    {allTags.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tags defined yet</p>
                        <p className="text-sm">Add tags to your experience entries to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="management" className="flex-1 space-y-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-base">Manage Individual Tags</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Rename or delete tags. Changes apply to all experience entries.
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {filteredTags.map(tag => (
                      <TagEditRow
                        key={tag}
                        tag={tag}
                        usageCount={tagStats.get(tag) || 0}
                        onRename={(newTag) => renameTagGlobally(tag, newTag)}
                        onDelete={() => removeTagGlobally(tag)}
                      />
                    ))}
                    
                    {filteredTags.length === 0 && allTags.length > 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No tags found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component for editing individual tags
interface TagEditRowProps {
  tag: string;
  usageCount: number;
  onRename: (newTag: string) => void;
  onDelete: () => void;
}

const TagEditRow = ({ tag, usageCount, onRename, onDelete }: TagEditRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (editValue.trim() && editValue !== tag) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(tag);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(tag);
  };

  const handleDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      
      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className="flex-1 h-8"
          autoFocus
        />
      ) : (
        <span className="flex-1 font-medium">{tag}</span>
      )}
      
      <Badge variant="outline" className="text-xs">
        {usageCount} use{usageCount !== 1 ? 's' : ''}
      </Badge>
      
      <div className="flex gap-1">
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
              <CheckCircle className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Tag className="w-3 h-3" />
            </Button>
            {showConfirm ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                className="h-8 w-8 p-0"
              >
                <AlertTriangle className="w-3 h-3" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(true)}
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
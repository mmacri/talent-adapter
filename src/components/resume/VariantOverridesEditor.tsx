import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Edit3, FileText } from 'lucide-react';
import { VariantOverride, ResumeMaster } from '@/types/resume';

interface VariantOverridesEditorProps {
  overrides: VariantOverride[];
  masterResume: ResumeMaster;
  onOverridesChange: (overrides: VariantOverride[]) => void;
}

const commonPaths = [
  { path: 'headline', label: 'Professional Headline' },
  { path: 'summary', label: 'Professional Summary' },
  { path: 'key_achievements', label: 'Key Achievements' },
  { path: 'contacts.email', label: 'Email Address' },
  { path: 'contacts.phone', label: 'Phone Number' },
  { path: 'contacts.website', label: 'Website' },
  { path: 'contacts.linkedin', label: 'LinkedIn Profile' },
];

export const VariantOverridesEditor = ({ overrides, masterResume, onOverridesChange }: VariantOverridesEditorProps) => {
  const [newOverridePath, setNewOverridePath] = useState<string>('');
  const [newOverrideOperation, setNewOverrideOperation] = useState<VariantOverride['operation']>('set');

  const addOverride = () => {
    if (!newOverridePath) return;

    const newOverride: VariantOverride = {
      path: newOverridePath,
      operation: newOverrideOperation,
      value: getDefaultValueForPath(newOverridePath)
    };

    onOverridesChange([...overrides, newOverride]);
    setNewOverridePath('');
    setNewOverrideOperation('set');
  };

  const updateOverride = (index: number, updates: Partial<VariantOverride>) => {
    const updatedOverrides = overrides.map((override, i) => 
      i === index ? { ...override, ...updates } : override
    );
    onOverridesChange(updatedOverrides);
  };

  const removeOverride = (index: number) => {
    const updatedOverrides = overrides.filter((_, i) => i !== index);
    onOverridesChange(updatedOverrides);
  };

  const getDefaultValueForPath = (path: string): any => {
    switch (path) {
      case 'headline':
        return 'New Professional Headline';
      case 'summary':
        return ['New summary point'];
      case 'key_achievements':
        return ['New achievement'];
      case 'contacts.email':
        return 'new.email@example.com';
      case 'contacts.phone':
        return '555-0123';
      case 'contacts.website':
        return 'https://example.com';
      case 'contacts.linkedin':
        return 'https://linkedin.com/in/username';
      default:
        return '';
    }
  };

  const getCurrentValue = (path: string): any => {
    const pathParts = path.split('.');
    let current: any = masterResume;
    
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    
    return current;
  };

  const renderOverrideValue = (override: VariantOverride, index: number) => {
    const currentValue = getCurrentValue(override.path);
    
    switch (override.operation) {
      case 'set':
        if (Array.isArray(currentValue)) {
          return (
            <div className="space-y-2">
              <Label className="text-sm">New Value (array)</Label>
              <Textarea
                value={Array.isArray(override.value) ? override.value.join('\n') : ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim());
                  updateOverride(index, { value: lines });
                }}
                placeholder="Enter each item on a new line..."
                rows={3}
              />
            </div>
          );
        } else {
          return (
            <div className="space-y-2">
              <Label className="text-sm">New Value</Label>
              <Input
                value={override.value || ''}
                onChange={(e) => updateOverride(index, { value: e.target.value })}
                placeholder="Enter new value..."
              />
            </div>
          );
        }

      case 'add':
        return (
          <div className="space-y-2">
            <Label className="text-sm">Value to Add</Label>
            <Input
              value={override.value || ''}
              onChange={(e) => updateOverride(index, { value: e.target.value })}
              placeholder="Enter value to add..."
            />
          </div>
        );

      case 'remove':
        return (
          <div className="space-y-2">
            <Label className="text-sm">Value to Remove</Label>
            <Input
              value={override.value || ''}
              onChange={(e) => updateOverride(index, { value: e.target.value })}
              placeholder="Enter value to remove..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getOperationDescription = (operation: VariantOverride['operation']) => {
    switch (operation) {
      case 'set':
        return 'Replace the field value entirely';
      case 'add':
        return 'Add a new item to an array field';
      case 'remove':
        return 'Remove an item from an array field';
      case 'move':
        return 'Move an item within an array field';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Field Overrides</h4>
          <p className="text-sm text-muted-foreground">
            Override specific fields in this variant without changing the master resume
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={newOverridePath} onValueChange={setNewOverridePath}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              {commonPaths.map((item) => (
                <SelectItem key={item.path} value={item.path}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={newOverrideOperation}
            onValueChange={(value) => setNewOverrideOperation(value as VariantOverride['operation'])}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="set">Set</SelectItem>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="remove">Remove</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={addOverride}
            disabled={!newOverridePath}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {overrides.map((override, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <CardTitle className="text-base">
                    {commonPaths.find(p => p.path === override.path)?.label || override.path}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {override.operation}
                  </Badge>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Override</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this override? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeOverride(index)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getOperationDescription(override.operation)} • Path: <code className="text-xs bg-muted px-1 rounded">{override.path}</code>
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Current Value Display */}
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Current Master Value:</Label>
                <div className="mt-1 text-sm text-muted-foreground">
                  {Array.isArray(getCurrentValue(override.path)) 
                    ? (getCurrentValue(override.path) as any[]).join(', ')
                    : JSON.stringify(getCurrentValue(override.path)) || 'undefined'
                  }
                </div>
              </div>

              {/* Override Value Input */}
              {renderOverrideValue(override, index)}
            </CardContent>
          </Card>
        ))}
      </div>

      {overrides.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No Overrides Applied</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add field overrides to customize specific content for this variant
          </p>
          <div className="flex gap-2 justify-center">
            <Select value={newOverridePath} onValueChange={setNewOverridePath}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select field to override..." />
              </SelectTrigger>
              <SelectContent>
                {commonPaths.map((item) => (
                  <SelectItem key={item.path} value={item.path}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
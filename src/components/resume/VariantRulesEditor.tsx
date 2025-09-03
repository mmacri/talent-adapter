import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2, Tag, Filter, Calendar, List } from 'lucide-react';
import { VariantRule } from '@/types/resume';

interface VariantRulesEditorProps {
  rules: VariantRule[];
  onRulesChange: (rules: VariantRule[]) => void;
  masterResume?: any;
}

const commonTags = [
  'GRC', 'Partner', 'CustomerSuccess', 'Leadership', 'AI', 'GTM', 
  'Enablement', 'Revenue', 'Consulting', 'SME', 'Delivery', 'Scale'
];

export const VariantRulesEditor = ({ rules, onRulesChange, masterResume }: VariantRulesEditorProps) => {
  const [newRuleType, setNewRuleType] = useState<string>('');

  // Get all tags used in master resume
  const getAllAvailableTags = () => {
    if (!masterResume) return commonTags;
    
    const usedTags = new Set<string>();
    masterResume.experience?.forEach((exp: any) => {
      exp.tags?.forEach((tag: string) => usedTags.add(tag));
    });
    
    // Combine used tags with common tags, remove duplicates
    const allTags = [...Array.from(usedTags), ...commonTags];
    return [...new Set(allTags)].sort();
  };

  const availableTags = getAllAvailableTags();

  const addRule = () => {
    if (!newRuleType) return;

    const newRule: VariantRule = {
      type: newRuleType as VariantRule['type'],
      value: getDefaultValueForRuleType(newRuleType as VariantRule['type'])
    };

    onRulesChange([...rules, newRule]);
    setNewRuleType('');
  };

  const updateRule = (index: number, updates: Partial<VariantRule>) => {
    const updatedRules = rules.map((rule, i) => 
      i === index ? { ...rule, ...updates } : rule
    );
    onRulesChange(updatedRules);
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    onRulesChange(updatedRules);
  };

  const getDefaultValueForRuleType = (type: VariantRule['type']) => {
    switch (type) {
      case 'include_tags':
      case 'exclude_tags':
        return [];
      case 'max_bullets':
        return 3;
      case 'section_order':
        return ['summary', 'experience', 'education', 'skills'];
      case 'date_range':
        return { start: '2020-01-01', end: '2024-12-31' };
      default:
        return null;
    }
  };

  const getRuleIcon = (type: VariantRule['type']) => {
    switch (type) {
      case 'include_tags':
      case 'exclude_tags':
        return <Tag className="w-4 h-4" />;
      case 'max_bullets':
        return <List className="w-4 h-4" />;
      case 'section_order':
        return <Filter className="w-4 h-4" />;
      case 'date_range':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const getRuleDescription = (type: VariantRule['type']) => {
    switch (type) {
      case 'include_tags':
        return 'Only show experiences with these tags';
      case 'exclude_tags':
        return 'Hide experiences with these tags';
      case 'max_bullets':
        return 'Limit the number of bullet points per experience';
      case 'section_order':
        return 'Change the order of resume sections';
      case 'date_range':
        return 'Only show experiences within date range';
      default:
        return '';
    }
  };

  const renderRuleValue = (rule: VariantRule, index: number) => {
    switch (rule.type) {
      case 'include_tags':
      case 'exclude_tags':
        return (
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Selected Tags ({(rule.value as string[]).length})
                </h5>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {(rule.value as string[]).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No tags selected. Click + buttons below to add tags.
                    </p>
                  ) : (
                    (rule.value as string[]).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => {
                          const newTags = (rule.value as string[]).filter((_, i) => i !== tagIndex);
                          updateRule(index, { value: newTags });
                        }}
                        title={`Click to remove ${tag}`}
                      >
                        {tag} ×
                      </Badge>
                    ))
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Available Tags ({availableTags.filter(tag => !(rule.value as string[]).includes(tag)).length})</h5>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags
                    .filter(tag => !(rule.value as string[]).includes(tag))
                    .map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => {
                          const newTags = [...(rule.value as string[]), tag];
                          updateRule(index, { value: newTags });
                        }}
                        title={`Click to add ${tag}`}
                      >
                        + {tag}
                      </Badge>
                    ))
                  }
                </div>
                
                {availableTags.filter(tag => !(rule.value as string[]).includes(tag)).length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    All available tags are already selected
                  </p>
                )}
              </div>
            </div>
        );

      case 'max_bullets':
        return (
          <Input
            type="number"
            min="1"
            max="10"
            value={rule.value as number}
            onChange={(e) => updateRule(index, { value: parseInt(e.target.value) || 1 })}
            className="w-24"
          />
        );

      case 'date_range':
        return (
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              value={(rule.value as any).start}
              onChange={(e) => 
                updateRule(index, { 
                  value: { ...(rule.value as any), start: e.target.value } 
                })
              }
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={(rule.value as any).end}
              onChange={(e) => 
                updateRule(index, { 
                  value: { ...(rule.value as any), end: e.target.value } 
                })
              }
            />
          </div>
        );

      case 'section_order':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Define the order in which resume sections appear. Drag to reorder or use the section order editor.
            </p>
            <div className="space-y-2">
              {(rule.value as string[]).map((sectionId, index) => (
                <div key={sectionId} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm">
                      {sectionId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Filtering Rules</h4>
          <p className="text-sm text-muted-foreground">
            Rules determine which content from your master resume is included in this variant
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={newRuleType} onValueChange={setNewRuleType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select rule type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="include_tags">Include Tags</SelectItem>
              <SelectItem value="exclude_tags">Exclude Tags</SelectItem>
              <SelectItem value="max_bullets">Max Bullets</SelectItem>
              <SelectItem value="section_order">Section Order</SelectItem>
              <SelectItem value="date_range">Date Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={addRule}
            disabled={!newRuleType}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRuleIcon(rule.type)}
                  <CardTitle className="text-base capitalize">
                    {rule.type.replace('_', ' ')}
                  </CardTitle>
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
                      <AlertDialogTitle>Remove Rule</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this rule? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeRule(index)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getRuleDescription(rule.type)}
              </p>
            </CardHeader>
            
            <CardContent>
              {renderRuleValue(rule, index)}
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No Rules Applied</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add rules to filter and customize the content from your master resume
          </p>
          <Select value={newRuleType} onValueChange={setNewRuleType}>
            <SelectTrigger className="w-48 mx-auto">
              <SelectValue placeholder="Add your first rule..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="include_tags">Include Tags</SelectItem>
              <SelectItem value="exclude_tags">Exclude Tags</SelectItem>
              <SelectItem value="max_bullets">Max Bullets</SelectItem>
              <SelectItem value="section_order">Section Order</SelectItem>
              <SelectItem value="date_range">Date Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
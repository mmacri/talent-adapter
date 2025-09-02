import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, FileText, Target } from 'lucide-react';

interface VariantContentEditorProps {
  customSummary?: string[];
  customKeyAchievements?: string[];
  onSummaryChange: (summary: string[]) => void;
  onKeyAchievementsChange: (achievements: string[]) => void;
}

export const VariantContentEditor = ({
  customSummary = [],
  customKeyAchievements = [],
  onSummaryChange,
  onKeyAchievementsChange
}: VariantContentEditorProps) => {
  const [newSummaryBullet, setNewSummaryBullet] = useState('');
  const [newAchievementBullet, setNewAchievementBullet] = useState('');

  const addSummaryBullet = () => {
    if (newSummaryBullet.trim()) {
      onSummaryChange([...customSummary, newSummaryBullet.trim()]);
      setNewSummaryBullet('');
    }
  };

  const removeSummaryBullet = (index: number) => {
    onSummaryChange(customSummary.filter((_, i) => i !== index));
  };

  const updateSummaryBullet = (index: number, value: string) => {
    const updated = [...customSummary];
    updated[index] = value;
    onSummaryChange(updated);
  };

  const addAchievementBullet = () => {
    if (newAchievementBullet.trim()) {
      onKeyAchievementsChange([...customKeyAchievements, newAchievementBullet.trim()]);
      setNewAchievementBullet('');
    }
  };

  const removeAchievementBullet = (index: number) => {
    onKeyAchievementsChange(customKeyAchievements.filter((_, i) => i !== index));
  };

  const updateAchievementBullet = (index: number, value: string) => {
    const updated = [...customKeyAchievements];
    updated[index] = value;
    onKeyAchievementsChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Custom Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Custom Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customSummary.length > 0 && (
            <div className="space-y-3">
              <Label>Summary Bullets</Label>
              {customSummary.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => updateSummaryBullet(index, e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSummaryBullet(index)}
                    className="shrink-0 mt-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a new summary bullet point..."
              value={newSummaryBullet}
              onChange={(e) => setNewSummaryBullet(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button onClick={addSummaryBullet} className="shrink-0 mt-1">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {customSummary.length > 0 && (
            <Badge variant="secondary" className="w-fit">
              {customSummary.length} custom bullets
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Custom Key Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Custom Key Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customKeyAchievements.length > 0 && (
            <div className="space-y-3">
              <Label>Achievement Bullets</Label>
              {customKeyAchievements.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => updateAchievementBullet(index, e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAchievementBullet(index)}
                    className="shrink-0 mt-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a new achievement bullet point..."
              value={newAchievementBullet}
              onChange={(e) => setNewAchievementBullet(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button onClick={addAchievementBullet} className="shrink-0 mt-1">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {customKeyAchievements.length > 0 && (
            <Badge variant="secondary" className="w-fit">
              {customKeyAchievements.length} custom achievements
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
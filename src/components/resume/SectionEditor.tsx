import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit3, GraduationCap, Award as AwardIcon } from 'lucide-react';
import { TipTapEditor } from './TipTapEditor';
import { Award, Education, Certification } from '@/types/resume';

interface SectionEditorProps {
  title: string;
  description: string;
  content: any;
  onUpdate: (content: any) => void;
  type: 'list' | 'education' | 'awards' | 'skills' | 'certifications';
}

export const SectionEditor = ({
  title,
  description,
  content,
  onUpdate,
  type
}: SectionEditorProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleListUpdate = (newContent: string[]) => {
    onUpdate(newContent);
  };

  const handleEducationUpdate = (education: Education[]) => {
    onUpdate(education);
  };

  const handleAwardsUpdate = (awards: Award[]) => {
    onUpdate(awards);
  };

  const handleCertificationsUpdate = (certifications: Certification[]) => {
    onUpdate(certifications);
  };

  const handleSkillsUpdate = (skills: any) => {
    onUpdate(skills);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: 'New Degree',
      school: 'Institution Name',
      location: '',
      year: new Date().getFullYear().toString()
    };
    handleEducationUpdate([...content, newEdu]);
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const updated = content.map((edu: Education, i: number) =>
      i === index ? { ...edu, ...updates } : edu
    );
    handleEducationUpdate(updated);
  };

  const removeEducation = (index: number) => {
    const filtered = content.filter((_: Education, i: number) => i !== index);
    handleEducationUpdate(filtered);
  };

  const addAward = () => {
    const newAward: Award = {
      id: `award-${Date.now()}`,
      title: 'New Award',
      date: new Date().toISOString().slice(0, 7),
      description: ''
    };
    handleAwardsUpdate([...content, newAward]);
  };

  const updateAward = (index: number, updates: Partial<Award>) => {
    const updated = content.map((award: Award, i: number) =>
      i === index ? { ...award, ...updates } : award
    );
    handleAwardsUpdate(updated);
  };

  const removeAward = (index: number) => {
    const filtered = content.filter((_: Award, i: number) => i !== index);
    handleAwardsUpdate(filtered);
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: `cert-${Date.now()}`,
      name: 'New Certification',
      issuer: 'Issuing Organization',
      date: new Date().toISOString().slice(0, 7), // YYYY-MM format
      description: ''
    };
    handleCertificationsUpdate([...content, newCertification]);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = content.map((cert: Certification, i: number) => 
      i === index ? { ...cert, [field]: value } : cert
    );
    handleCertificationsUpdate(updated);
  };

  const removeCertification = (index: number) => {
    handleCertificationsUpdate(content.filter((_: any, i: number) => i !== index));
  };

  if (type === 'list') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <TipTapEditor
          content={content || []}
          onChange={handleListUpdate}
          placeholder={`Add a ${title.toLowerCase()} point...`}
        />
      </div>
    );
  }

  if (type === 'education') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button onClick={addEducation} className="bg-gradient-to-r from-accent to-accent">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        <div className="space-y-4">
          {content.map((edu: Education, index: number) => (
            <Card key={edu.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, { degree: e.target.value })}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Institution</Label>
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, { school: e.target.value })}
                      placeholder="e.g., University Name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <Input
                      value={edu.location}
                      onChange={(e) => updateEducation(index, { location: e.target.value })}
                      placeholder="e.g., City, State"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Year</Label>
                    <Input
                      value={edu.year || ''}
                      onChange={(e) => updateEducation(index, { year: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'awards') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button onClick={addAward} className="bg-gradient-to-r from-accent to-accent">
            <Plus className="w-4 h-4 mr-2" />
            Add Award
          </Button>
        </div>

        <div className="space-y-4">
          {content.map((award: Award, index: number) => (
            <Card key={award.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AwardIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Award #{index + 1}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Award Title</Label>
                    <Input
                      value={award.title || ''}
                      onChange={(e) => updateAward(index, { title: e.target.value })}
                      placeholder="e.g., Employee of the Year"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <Input
                      type="month"
                      value={award.date || ''}
                      onChange={(e) => updateAward(index, { date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description (Optional)</Label>
                    <Input
                      value={award.description || ''}
                      onChange={(e) => updateAward(index, { description: e.target.value })}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAward(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'certifications') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button onClick={addCertification} className="bg-gradient-to-r from-accent to-accent">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>

        <div className="space-y-4">
          {content.map((cert: Certification, index: number) => (
            <Card key={cert.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AwardIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Certification Name</Label>
                    <Input
                      value={cert.name || ''}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      placeholder="e.g., AWS Solutions Architect"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Issuing Organization</Label>
                    <Input
                      value={cert.issuer || ''}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date Obtained</Label>
                    <Input
                      type="month"
                      value={cert.date || ''}
                      onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Expiry Date (Optional)</Label>
                    <Input
                      type="month"
                      value={cert.expiryDate || ''}
                      onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Credential ID (Optional)</Label>
                    <Input
                      value={cert.credentialId || ''}
                      onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                      placeholder="e.g., AWS-123456"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description (Optional)</Label>
                    <Input
                      value={cert.description || ''}
                      onChange={(e) => updateCertification(index, 'description', e.target.value)}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'skills') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primary Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <TipTapEditor
              content={content.primary || []}
              onChange={(skills) => handleSkillsUpdate({ ...content, primary: skills })}
              placeholder="Add a key skill..."
            />
          </CardContent>
        </Card>

        {content.secondary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Secondary Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <TipTapEditor
                content={content.secondary || []}
                onChange={(skills) => handleSkillsUpdate({ ...content, secondary: skills })}
                placeholder="Add a secondary skill..."
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
};
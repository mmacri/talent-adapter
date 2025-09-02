import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  Download,
  Eye,
  Calendar,
  Tag
} from 'lucide-react';
import { Variant } from '@/types/resume';
import { DocxExporter } from '@/lib/docxExport';
import { VariantResolver } from '@/lib/variantResolver';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Variants = () => {
  const { variants, masterResume, addVariant, deleteVariant } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredVariants = variants.filter(variant =>
    variant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    variant.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      name: 'New Variant',
      description: 'A new resume variant',
      rules: [],
      overrides: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addVariant(newVariant);
    navigate(`/variants/${newVariant.id}`);
  };

  const handleDuplicateVariant = (variant: Variant) => {
    const duplicatedVariant: Variant = {
      ...variant,
      id: `variant-${Date.now()}`,
      name: `${variant.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addVariant(duplicatedVariant);
    toast({
      title: "Variant Duplicated",
      description: `Created a copy of "${variant.name}"`,
    });
  };

  const handleDeleteVariant = (variantId: string) => {
    deleteVariant(variantId);
    toast({
      title: "Variant Deleted",
      description: "The variant has been permanently deleted.",
    });
  };

  const handleExportVariant = async (variant: Variant) => {
    if (!masterResume) return;

    try {
      const resolved = VariantResolver.resolveVariant(masterResume, variant);
      await DocxExporter.exportResume(
        resolved, 
        variant, 
        `${masterResume.owner.replace(/\s+/g, '-')}_${variant.name.replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.docx`
      );
      toast({
        title: "Variant Exported",
        description: `"${variant.name}" has been downloaded as a Word document.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the variant. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRulesSummary = (variant: Variant) => {
    if (variant.rules.length === 0) return 'No rules applied';
    
    const ruleSummary = variant.rules.map(rule => {
      switch (rule.type) {
        case 'include_tags':
          return `Include: ${rule.value.join(', ')}`;
        case 'exclude_tags':
          return `Exclude: ${rule.value.join(', ')}`;
        case 'max_bullets':
          return `Max ${rule.value} bullets`;
        case 'date_range':
          return `${rule.value.start} - ${rule.value.end}`;
        default:
          return rule.type;
      }
    });

    return ruleSummary.join(' • ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Variants</h1>
          <p className="text-muted-foreground">
            Create targeted versions of your resume for different opportunities
          </p>
        </div>
        <Button onClick={handleCreateVariant} className="bg-gradient-to-r from-primary to-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          New Variant
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search variants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Variants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVariants.map((variant) => (
          <Card key={variant.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{variant.name}</CardTitle>
                  {variant.description && (
                    <p className="text-sm text-muted-foreground">
                      {variant.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/variants/${variant.id}`)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateVariant(variant)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
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
                        <AlertDialogTitle>Delete Variant</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{variant.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteVariant(variant.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Rules Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">Rules:</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getRulesSummary(variant)}
                </p>
              </div>

              {/* Overrides Count */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {variant.overrides.length} override{variant.overrides.length !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline">
                  {variant.rules.length} rule{variant.rules.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/variants/${variant.id}`)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportVariant(variant)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Calendar className="w-3 h-3" />
                <span>Updated {format(new Date(variant.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVariants.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Copy className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No variants found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms or create a new variant."
              : "Create your first resume variant to get started with targeted applications."
            }
          </p>
          <Button onClick={handleCreateVariant}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Variant
          </Button>
        </div>
      )}
    </div>
  );
};

export default Variants;
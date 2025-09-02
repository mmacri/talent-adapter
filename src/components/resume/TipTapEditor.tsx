import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote,
  Undo,
  Redo,
  Plus,
  Trash2
} from 'lucide-react';

interface TipTapEditorProps {
  content: string[];
  onChange: (content: string[]) => void;
  placeholder?: string;
}

export const TipTapEditor = ({ content, onChange, placeholder }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      // For now, we'll handle this as simple bullet points
      // In a full implementation, this would parse HTML to bullets
    },
  });

  const addBullet = () => {
    const newBullets = [...content, ''];
    onChange(newBullets);
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...content];
    newBullets[index] = value;
    onChange(newBullets);
  };

  const removeBullet = (index: number) => {
    const newBullets = content.filter((_, i) => i !== index);
    onChange(newBullets);
  };

  const moveBullet = (fromIndex: number, toIndex: number) => {
    const newBullets = [...content];
    const [moved] = newBullets.splice(fromIndex, 1);
    newBullets.splice(toIndex, 0, moved);
    onChange(newBullets);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-lg bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-primary/20' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-primary/20' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-primary/20' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-primary/20' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Bullet Point Editor */}
      <div className="space-y-2">
        {content.map((bullet, index) => (
          <div key={index} className="flex items-start gap-2 group">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-2">
              <div className="w-2 h-2 rounded-full bg-primary/60" />
            </div>
            
            <div className="flex-1">
              <textarea
                value={bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                placeholder={placeholder || "Add a bullet point..."}
                className="w-full min-h-[60px] p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                rows={2}
              />
            </div>
            
            <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBullet(index)}
                className="w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBullet(index, index - 1)}
                  className="w-8 h-8 p-0"
                >
                  ↑
                </Button>
              )}
              {index < content.length - 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBullet(index, index + 1)}
                  className="w-8 h-8 p-0"
                >
                  ↓
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={addBullet}
          className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bullet Point
        </Button>
      </div>
    </div>
  );
};
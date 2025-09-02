import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  History, 
  RotateCcw, 
  Eye, 
  Calendar, 
  User,
  GitCommit,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface VersionHistoryEntry {
  id: string;
  timestamp: string;
  type: 'master' | 'variant';
  targetId?: string;
  targetName?: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue?: any;
    operation: 'create' | 'update' | 'delete';
  }[];
  message?: string;
}

interface VersionHistoryProps {
  entries: VersionHistoryEntry[];
  onRestore?: (entryId: string) => void;
}

export const VersionHistory = ({ entries, onRestore }: VersionHistoryProps) => {
  const [selectedEntry, setSelectedEntry] = useState<VersionHistoryEntry | null>(null);

  const getChangeDescription = (change: VersionHistoryEntry['changes'][0]) => {
    switch (change.operation) {
      case 'create':
        return `Created ${change.field}`;
      case 'update':
        return `Updated ${change.field}`;
      case 'delete':
        return `Deleted ${change.field}`;
      default:
        return `Modified ${change.field}`;
    }
  };

  const getEntryIcon = (entry: VersionHistoryEntry) => {
    return entry.type === 'master' ? (
      <User className="w-4 h-4" />
    ) : (
      <GitCommit className="w-4 h-4" />
    );
  };

  const getEntryColor = (entry: VersionHistoryEntry) => {
    return entry.type === 'master' ? 'bg-primary/10' : 'bg-accent/10';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Version History</h4>
          <p className="text-sm text-muted-foreground">
            Track changes to your resume and variants over time
          </p>
        </div>
        <Badge variant="secondary">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Badge>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <Card key={entry.id} className="relative">
              {/* Timeline connector */}
              {index < entries.length - 1 && (
                <div className="absolute left-6 top-16 w-px h-8 bg-border" />
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEntryColor(entry)}`}>
                      {getEntryIcon(entry)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">
                          {entry.type === 'master' ? 'Master Resume' : entry.targetName || 'Variant'}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {entry.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      
                      {entry.message && (
                        <p className="text-sm text-muted-foreground">{entry.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {onRestore && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restore Version</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to restore to this version? This will overwrite the current state and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onRestore(entry.id)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              Restore
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <h6 className="text-sm font-medium">Changes ({entry.changes.length})</h6>
                  <div className="space-y-1">
                    {entry.changes.slice(0, 3).map((change, changeIndex) => (
                      <div key={changeIndex} className="text-sm text-muted-foreground">
                        • {getChangeDescription(change)}
                      </div>
                    ))}
                    {entry.changes.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        ... and {entry.changes.length - 3} more changes
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Detailed View Dialog */}
      {selectedEntry && (
        <AlertDialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {getEntryIcon(selectedEntry)}
                Version Details
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedEntry.type === 'master' ? 'Master Resume' : selectedEntry.targetName} • {format(new Date(selectedEntry.timestamp), 'MMMM d, yyyy h:mm a')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4">
              {selectedEntry.message && (
                <div>
                  <h5 className="font-medium mb-2">Message</h5>
                  <p className="text-sm text-muted-foreground">{selectedEntry.message}</p>
                </div>
              )}
              
              <div>
                <h5 className="font-medium mb-2">All Changes</h5>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {selectedEntry.changes.map((change, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h6 className="text-sm font-medium">{getChangeDescription(change)}</h6>
                        {change.oldValue !== undefined && (
                          <div className="mt-2 text-xs">
                            <span className="text-red-600">- {JSON.stringify(change.oldValue)}</span>
                          </div>
                        )}
                        {change.newValue !== undefined && (
                          <div className="text-xs">
                            <span className="text-green-600">+ {JSON.stringify(change.newValue)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {entries.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No History Available</h4>
          <p className="text-sm text-muted-foreground">
            Changes will appear here as you edit your resume and variants
          </p>
        </div>
      )}
    </div>
  );
};
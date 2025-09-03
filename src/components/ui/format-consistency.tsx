import React from 'react';
import { format } from 'date-fns';

interface StandardDateDisplayProps {
  date: string | Date;
  formatString?: string;
}

export function StandardDateDisplay({ date, formatString = 'MMM d, yyyy' }: StandardDateDisplayProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return <span>{format(dateObj, formatString)}</span>;
}

interface StandardFilenameProps {
  baseName: string;
  extension: 'docx' | 'json' | 'csv' | 'xlsx';
  includeDate?: boolean;
  customSuffix?: string;
}

export function generateStandardFilename({ 
  baseName, 
  extension, 
  includeDate = true, 
  customSuffix 
}: StandardFilenameProps): string {
  const cleanBaseName = baseName.replace(/\s+/g, '-').toLowerCase();
  const dateSuffix = includeDate ? `_${format(new Date(), 'yyyy-MM-dd')}` : '';
  const customSuffixString = customSuffix ? `_${customSuffix}` : '';
  
  return `${cleanBaseName}${customSuffixString}${dateSuffix}.${extension}`;
}

interface StandardPreviewProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
  className?: string;
}

export function StandardPreview({ 
  title, 
  subtitle, 
  lastUpdated, 
  children, 
  className = '' 
}: StandardPreviewProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-b pb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: <StandardDateDisplay date={lastUpdated} />
          </p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
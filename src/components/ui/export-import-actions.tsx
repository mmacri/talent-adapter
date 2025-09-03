import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet,
  MoreVertical
} from 'lucide-react';

interface ExportImportActionsProps {
  onExportJSON?: () => void;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onImport?: () => void;
  showJSON?: boolean;
  showCSV?: boolean;
  showExcel?: boolean;
  showImport?: boolean;
  variant?: 'dropdown' | 'buttons';
}

export function ExportImportActions({
  onExportJSON,
  onExportCSV,
  onExportExcel,
  onImport,
  showJSON = true,
  showCSV = true,
  showExcel = true,
  showImport = true,
  variant = 'dropdown'
}: ExportImportActionsProps) {
  if (variant === 'buttons') {
    return (
      <div className="flex gap-2">
        {showJSON && onExportJSON && (
          <Button variant="outline" size="sm" onClick={onExportJSON}>
            <FileText className="w-4 h-4 mr-2" />
            JSON
          </Button>
        )}
        {showCSV && onExportCSV && (
          <Button variant="outline" size="sm" onClick={onExportCSV}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV
          </Button>
        )}
        {showExcel && onExportExcel && (
          <Button variant="outline" size="sm" onClick={onExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        )}
        {showImport && onImport && (
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        {showJSON && onExportJSON && (
          <DropdownMenuItem onClick={onExportJSON}>
            <FileText className="w-4 h-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        )}
        {showCSV && onExportCSV && (
          <DropdownMenuItem onClick={onExportCSV}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        )}
        {showExcel && onExportExcel && (
          <DropdownMenuItem onClick={onExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export as Excel
          </DropdownMenuItem>
        )}
        {showImport && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
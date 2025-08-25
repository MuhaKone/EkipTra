import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { toCSV, exportToPDF } from '@/lib/export';

const ExportActions = ({ 
  data, 
  columns, 
  filename = 'export', 
  title = 'Rapport EkipTra',
  onExportStart,
  onExportComplete 
}) => {
  const handleCSVExport = () => {
    try {
      onExportStart?.('CSV');
      
      const csvContent = toCSV(data, columns);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      onExportComplete?.('CSV', true);
    } catch (error) {
      console.error('Erreur export CSV:', error);
      onExportComplete?.('CSV', false, error.message);
    }
  };

  const handlePDFExport = () => {
    try {
      onExportStart?.('PDF');
      
      exportToPDF(data, columns, filename, title);
      
      onExportComplete?.('PDF', true);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      onExportComplete?.('PDF', false, error.message);
    }
  };

  if (!data || data.length === 0) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Download className="w-4 h-4" />
        Exporter
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter ({data.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCSVExport} className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePDFExport} className="gap-2">
          <FileText className="w-4 h-4" />
          Exporter en PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
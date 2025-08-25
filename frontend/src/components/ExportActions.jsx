// src/components/ExportActions.jsx
import React from 'react';
import { toCSV, downloadBlob, downloadPDF, generateReportPDF } from '../lib/export';
import Icon from './AppIcon';
import Button from './ui/Button';

/**
 * Generic export action buttons
 * @param {Array<Object>} data
 * @param {Array<{key,label}>|Array<string>} columns
 * @param {string} filenameBase
 * @param {Object} meta optional metadata to print on PDF
 * @param {Object} reportSections optional sections for comprehensive PDF report
 */
const ExportActions = ({ 
  data = [], 
  columns = [], 
  filenameBase = 'export', 
  meta = null,
  reportSections = null,
  showReportPDF = false
}) => {
  const onExportCSV = () => {
    const blob = toCSV(data, columns);
    downloadBlob(blob, `${filenameBase}.csv`);
  };

  const onExportPDF = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadPDF(data, columns, `${filenameBase}_${timestamp}.pdf`, meta);
  };

  const onExportReportPDF = () => {
    if (reportSections) {
      const timestamp = new Date().toISOString().split('T')[0];
      const blob = generateReportPDF(reportSections, `Rapport ${filenameBase}`);
      downloadBlob(blob, `rapport_${filenameBase}_${timestamp}.pdf`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExportCSV}
        iconName="FileSpreadsheet"
        iconPosition="left"
        disabled={data.length === 0}
      >
        CSV
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportPDF}
        iconName="FileText"
        iconPosition="left"
        disabled={data.length === 0}
      >
        PDF Simple
      </Button>
      
      {showReportPDF && reportSections && (
        <Button
          variant="default"
          size="sm"
          onClick={onExportReportPDF}
          iconName="FileDown"
          iconPosition="left"
        >
          Rapport PDF
        </Button>
      )}
    </div>
  );
};

export default ExportActions;
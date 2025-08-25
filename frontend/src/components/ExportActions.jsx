// src/components/ExportActions.jsx
import React from 'react';
import { toCSV, downloadBlob, downloadPDF } from '../lib/export';

/**
 * Generic export action buttons
 * @param {Array<Object>} data
 * @param {Array<{key,label}>|Array<string>} columns
 * @param {string} filenameBase
 * @param {Object} meta optional metadata to print on PDF
 */
const ExportActions = ({ data = [], columns = [], filenameBase = 'export', meta = null }) => {
  const onExportCSV = () => {
    const blob = toCSV(data, columns);
    downloadBlob(blob, `${filenameBase}.csv`);
  };

  const onExportPDF = () => {
    downloadPDF(data, columns, `${filenameBase}.pdf`, meta);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onExportCSV}
        className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={onExportPDF}
        className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportActions;
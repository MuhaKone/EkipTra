import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsPanel = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Sélectionner une action' },
    { value: 'export-pdf', label: 'Exporter en PDF' },
    { value: 'export-excel', label: 'Exporter en Excel' },
    { value: 'print-labels', label: 'Imprimer les étiquettes' },
    { value: 'schedule-maintenance', label: 'Programmer maintenance' },
    { value: 'transfer-location', label: 'Transférer emplacement' },
    { value: 'update-status', label: 'Mettre à jour statut' },
    { value: 'generate-qr-codes', label: 'Générer codes QR' }
  ];

  const handleExecuteAction = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-industrial-lg p-4 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="CheckSquare" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedCount} équipement{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-muted-foreground">Choisissez une action à effectuer</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Sélectionner une action"
            />
          </div>
          <Button
            variant="default"
            onClick={handleExecuteAction}
            disabled={!selectedAction}
            className="whitespace-nowrap"
          >
            <Icon name="Play" size={16} className="mr-2" />
            Exécuter
          </Button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('export-pdf')}
            className="flex-1 min-w-0"
          >
            <Icon name="FileText" size={16} className="mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('export-excel')}
            className="flex-1 min-w-0"
          >
            <Icon name="FileSpreadsheet" size={16} className="mr-2" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('print-labels')}
            className="flex-1 min-w-0"
          >
            <Icon name="Printer" size={16} className="mr-2" />
            Étiquettes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('schedule-maintenance')}
            className="flex-1 min-w-0"
          >
            <Icon name="Calendar" size={16} className="mr-2" />
            Maintenance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsPanel;
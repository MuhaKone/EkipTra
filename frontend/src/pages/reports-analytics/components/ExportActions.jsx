import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportActions = ({ onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    includeCharts: true,
    includeData: true,
    dateRange: 'current',
    sections: {
      kpis: true,
      utilization: true,
      maintenance: true,
      lifecycle: true,
      costs: true
    }
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'json', label: 'JSON Data' }
  ];

  const dateRangeOptions = [
    { value: 'current', label: 'Période actuelle' },
    { value: 'last30days', label: '30 derniers jours' },
    { value: 'last3months', label: '3 derniers mois' },
    { value: 'lastyear', label: 'Année dernière' },
    { value: 'all', label: 'Toutes les données' }
  ];

  const handleSectionChange = (section, checked) => {
    setExportConfig(prev => ({
      ...prev,
      sections: {
        ...prev?.sections,
        [section]: checked
      }
    }));
  };

  const handleExport = () => {
    onExport?.(exportConfig);
    
    // Simulate export process
    const fileName = `rapport-equipements-${new Date()?.toISOString()?.split('T')?.[0]}.${exportConfig?.format}`;
    console.log(`Exporting ${fileName} with config:`, exportConfig);
    
    // In a real application, this would trigger the actual export
    alert(`Export initié: ${fileName}`);
  };

  const handleScheduledReport = () => {
    alert('Configuration des rapports programmés - Fonctionnalité à venir');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Exporter les rapports</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Générer et télécharger des rapports personnalisés
          </p>
        </div>
        <Icon name="Download" size={24} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Configuration d'export</h4>
            
            <div className="space-y-3">
              <Select
                label="Format de fichier"
                options={formatOptions}
                value={exportConfig?.format}
                onChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
              />
              
              <Select
                label="Période des données"
                options={dateRangeOptions}
                value={exportConfig?.dateRange}
                onChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Options d'inclusion</h4>
            
            <Checkbox
              label="Inclure les graphiques"
              checked={exportConfig?.includeCharts}
              onChange={(e) => setExportConfig(prev => ({ 
                ...prev, 
                includeCharts: e?.target?.checked 
              }))}
            />
            
            <Checkbox
              label="Inclure les données détaillées"
              checked={exportConfig?.includeData}
              onChange={(e) => setExportConfig(prev => ({ 
                ...prev, 
                includeData: e?.target?.checked 
              }))}
            />
          </div>
        </div>

        {/* Sections Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Sections à inclure</h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Indicateurs clés de performance"
              description="Métriques de haut niveau et tendances"
              checked={exportConfig?.sections?.kpis}
              onChange={(e) => handleSectionChange('kpis', e?.target?.checked)}
            />
            
            <Checkbox
              label="Analyse d'utilisation"
              description="Taux d'utilisation et disponibilité"
              checked={exportConfig?.sections?.utilization}
              onChange={(e) => handleSectionChange('utilization', e?.target?.checked)}
            />
            
            <Checkbox
              label="Coûts de maintenance"
              description="Analyse des coûts préventifs et correctifs"
              checked={exportConfig?.sections?.maintenance}
              onChange={(e) => handleSectionChange('maintenance', e?.target?.checked)}
            />
            
            <Checkbox
              label="Cycle de vie des équipements"
              description="Dépréciation et valeur actuelle"
              checked={exportConfig?.sections?.lifecycle}
              onChange={(e) => handleSectionChange('lifecycle', e?.target?.checked)}
            />
            
            <Checkbox
              label="Analyse des coûts"
              description="Répartition détaillée des coûts"
              checked={exportConfig?.sections?.costs}
              onChange={(e) => handleSectionChange('costs', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Dernière génération: 24/08/2024 à 14:32
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleScheduledReport}
          >
            <Icon name="Clock" size={16} className="mr-2" />
            Programmer
          </Button>
          
          <Button
            onClick={handleExport}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="Download" size={16} className="mr-2" />
            Exporter maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportActions;
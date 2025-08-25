import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { generateReportPDF, downloadBlob } from '../../../lib/export';

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
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'comprehensive-pdf', label: 'PDF Rapport Complet' },
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

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportConfig.format === 'comprehensive-pdf') {
        await generateComprehensiveReport();
      } else {
        onExport?.(exportConfig);
      }
      
      setStatus('✅ Export terminé avec succès');
    } catch (error) {
      setStatus('❌ Erreur lors de l\'export');
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateComprehensiveReport = async () => {
    const sections = {};
    
    // Mock data for demonstration
    if (exportConfig.sections.kpis) {
      sections.kpis = {
        title: 'Indicateurs Clés de Performance',
        description: 'Métriques principales du système',
        data: [
          { metric: 'Taux d\'utilisation moyen', valeur: '87.2%', tendance: '+2.4%' },
          { metric: 'Coût maintenance mensuel', valeur: '24,000€', tendance: '-5.2%' },
          { metric: 'Équipements en service', valeur: '403/425', tendance: '+12' },
          { metric: 'Temps d\'arrêt moyen', valeur: '2.8h/mois', tendance: '-0.5h' }
        ],
        columns: ['metric', 'valeur', 'tendance']
      };
    }
    
    if (exportConfig.sections.utilization) {
      sections.utilization = {
        title: 'Analyse d\'Utilisation',
        description: 'Taux d\'utilisation par catégorie et période',
        data: [
          { categorie: 'Construction', utilisation: '85%', disponible: '88%', maintenance: '12%' },
          { categorie: 'Exploitation minière', utilisation: '92%', disponible: '82%', maintenance: '18%' },
          { categorie: 'HSE', utilisation: '78%', disponible: '92%', maintenance: '8%' },
          { categorie: 'Outils', utilisation: '88%', disponible: '85%', maintenance: '15%' }
        ],
        columns: ['categorie', 'utilisation', 'disponible', 'maintenance']
      };
    }
    
    if (exportConfig.sections.maintenance) {
      sections.maintenance = {
        title: 'Coûts de Maintenance',
        description: 'Analyse des coûts préventifs et correctifs',
        data: [
          { mois: 'Janvier', preventif: '12,500€', correctif: '8,200€', total: '20,700€' },
          { mois: 'Février', preventif: '11,800€', correctif: '9,500€', total: '21,300€' },
          { mois: 'Mars', preventif: '13,200€', correctif: '7,800€', total: '21,000€' },
          { mois: 'Avril', preventif: '12,900€', correctif: '11,200€', total: '24,100€' }
        ],
        columns: ['mois', 'preventif', 'correctif', 'total']
      };
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const blob = generateReportPDF(sections, 'Rapport Complet EquipTracker');
    downloadBlob(blob, `rapport_complet_${timestamp}.pdf`);
  };

  const oldHandleExport = () => {
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
                loading={isExporting}
                disabled={isExporting}
                label="Période des données"
                options={dateRangeOptions}
                value={exportConfig?.dateRange}
                {isExporting ? 'Export en cours...' : 'Exporter maintenant'}
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
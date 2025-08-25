import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'add-equipment',
      title: 'Ajouter Équipement',
      description: 'Enregistrer un nouvel équipement',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      action: () => navigate('/equipment-inventory?action=add')
    },
    {
      id: 'process-loan',
      title: 'Traiter Prêt',
      description: 'Gérer les emprunts d\'équipements',
      icon: 'ArrowRight',
      color: 'bg-success text-success-foreground',
      action: () => navigate('/equipment-inventory?action=loan')
    },
    {
      id: 'schedule-maintenance',
      title: 'Programmer Maintenance',
      description: 'Planifier une intervention',
      icon: 'Calendar',
      color: 'bg-warning text-warning-foreground',
      action: () => navigate('/equipment-inventory?action=maintenance')
    },
    {
      id: 'generate-report',
      title: 'Générer Rapport',
      description: 'Créer un rapport d\'activité',
      icon: 'FileText',
      color: 'bg-secondary text-secondary-foreground',
      action: () => navigate('/reports-analytics')
    }
  ];

  const recentSearches = [
    { term: 'Perceuse Bosch', count: 12 },
    { term: 'Casque sécurité', count: 8 },
    { term: 'Échafaudage', count: 5 },
    { term: 'Détecteur gaz', count: 3 }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Actions Rapides</h3>
        <Icon name="Zap" size={20} className="text-muted-foreground" />
      </div>
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant="ghost"
            className="h-auto p-4 justify-start hover:bg-muted/50 transition-industrial"
            onClick={action?.action}
          >
            <div className={`w-10 h-10 rounded-lg ${action?.color} flex items-center justify-center mr-3 flex-shrink-0`}>
              <Icon name={action?.icon} size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{action?.title}</p>
              <p className="text-xs text-muted-foreground">{action?.description}</p>
            </div>
          </Button>
        ))}
      </div>
      {/* Recent Searches */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Recherches Récentes</h4>
        <div className="space-y-2">
          {recentSearches?.map((search, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-industrial text-left"
              onClick={() => navigate(`/equipment-inventory?search=${encodeURIComponent(search?.term)}`)}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Search" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{search?.term}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {search?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Statistiques Rapides</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-foreground">89</p>
            <p className="text-xs text-muted-foreground">Prêts actifs</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-foreground">23</p>
            <p className="text-xs text-muted-foreground">En maintenance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
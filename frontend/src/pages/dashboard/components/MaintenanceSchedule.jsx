import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MaintenanceSchedule = () => {
  const maintenanceItems = [
    {
      id: 1,
      equipment: 'Grue mobile Liebherr',
      code: 'EQ-2024-089',
      type: 'Inspection annuelle',
      scheduledDate: '26/08/2025',
      technician: 'Marc Dubois',
      priority: 'high',
      estimatedDuration: '4h',
      status: 'scheduled',
      category: 'Construction'
    },
    {
      id: 2,
      equipment: 'Détecteur de gaz H2S',
      code: 'EQ-2024-156',
      type: 'Calibrage',
      scheduledDate: '27/08/2025',
      technician: 'Sophie Martin',
      priority: 'high',
      estimatedDuration: '1h',
      status: 'scheduled',
      category: 'HSE'
    },
    {
      id: 3,
      equipment: 'Compresseur Atlas Copco',
      code: 'EQ-2024-034',
      type: 'Maintenance préventive',
      scheduledDate: '28/08/2025',
      technician: 'Pierre Leroy',
      priority: 'medium',
      estimatedDuration: '2h',
      status: 'scheduled',
      category: 'Construction'
    },
    {
      id: 4,
      equipment: 'Harnais de sécurité',
      code: 'EQ-2024-201',
      type: 'Inspection semestrielle',
      scheduledDate: '29/08/2025',
      technician: 'Marie Bernard',
      priority: 'medium',
      estimatedDuration: '30min',
      status: 'scheduled',
      category: 'HSE'
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error bg-error/10',
      medium: 'text-warning bg-warning/10',
      low: 'text-success bg-success/10'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Construction': 'HardHat',
      'HSE': 'Shield',
      'Minier': 'Mountain',
      'Électrique': 'Zap'
    };
    return icons?.[category] || 'Wrench';
  };

  const handleMaintenanceAction = (itemId, action) => {
    console.log(`Action ${action} for maintenance item ${itemId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Maintenance Programmée</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Cette semaine</span>
        </div>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {maintenanceItems?.map((item) => (
          <div key={item?.id} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-industrial">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon name={getCategoryIcon(item?.category)} size={20} className="text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">{item?.equipment}</h4>
                  <p className="text-xs text-muted-foreground font-mono mb-1">{item?.code}</p>
                  <p className="text-sm text-muted-foreground">{item?.type}</p>
                </div>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item?.priority)}`}>
                {item?.priority === 'high' ? 'Urgent' : item?.priority === 'medium' ? 'Moyen' : 'Faible'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} />
                <span>{item?.scheduledDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} />
                <span>{item?.estimatedDuration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="User" size={14} />
                <span>{item?.technician}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Tag" size={14} />
                <span>{item?.category}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleMaintenanceAction(item?.id, 'reschedule')}
              >
                Reprogrammer
              </Button>
              <Button
                variant="default"
                size="xs"
                onClick={() => handleMaintenanceAction(item?.id, 'start')}
              >
                Commencer
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth>
          Voir le calendrier complet
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
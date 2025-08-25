import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'loan',
      user: 'Marie Dubois',
      equipment: 'Perceuse Bosch GSB 13 RE',
      equipmentCode: 'EQ-2024-001',
      action: 'a emprunté',
      timestamp: new Date(Date.now() - 300000),
      icon: 'ArrowRight',
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'return',
      user: 'Jean Martin',
      equipment: 'Casque de sécurité 3M',
      equipmentCode: 'EQ-2024-045',
      action: 'a retourné',
      timestamp: new Date(Date.now() - 900000),
      icon: 'ArrowLeft',
      color: 'text-success'
    },
    {
      id: 3,
      type: 'maintenance',
      user: 'Pierre Leroy',
      equipment: 'Échafaudage mobile',
      equipmentCode: 'EQ-2024-012',
      action: 'maintenance terminée',
      timestamp: new Date(Date.now() - 1800000),
      icon: 'Wrench',
      color: 'text-warning'
    },
    {
      id: 4,
      type: 'loan',
      user: 'Sophie Bernard',
      equipment: 'Détecteur de gaz portable',
      equipmentCode: 'EQ-2024-078',
      action: 'a emprunté',
      timestamp: new Date(Date.now() - 3600000),
      icon: 'ArrowRight',
      color: 'text-primary'
    },
    {
      id: 5,
      type: 'return',
      user: 'Michel Rousseau',
      equipment: 'Niveau laser Dewalt',
      equipmentCode: 'EQ-2024-023',
      action: 'a retourné',
      timestamp: new Date(Date.now() - 5400000),
      icon: 'ArrowLeft',
      color: 'text-success'
    }
  ];

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `il y a ${minutes} min`;
    } else if (hours < 24) {
      return `il y a ${hours}h`;
    } else {
      return timestamp?.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Activité Récente</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-industrial">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
              <Icon name={activity?.icon} size={16} className={activity?.color} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity?.user}
                </p>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatTime(activity?.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {activity?.action} <span className="font-medium text-foreground">{activity?.equipment}</span>
              </p>
              
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {activity?.equipmentCode}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-industrial">
          Voir toute l'activité →
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
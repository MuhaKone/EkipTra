import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: 'overdue',
      title: 'Retour en retard',
      message: 'Perceuse Makita HP2050 - 3 jours de retard',
      user: 'Antoine Moreau',
      dueDate: '22/08/2025',
      severity: 'high',
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance programmée',
      message: 'Échafaudage mobile - Inspection annuelle',
      dueDate: '26/08/2025',
      severity: 'medium',
      icon: 'Calendar',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 3,
      type: 'overdue',
      title: 'Retour en retard',
      message: 'Casque de sécurité MSA - 1 jour de retard',
      user: 'Claire Petit',
      dueDate: '24/08/2025',
      severity: 'medium',
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Maintenance urgente',
      message: 'Détecteur de gaz - Calibrage requis',
      dueDate: '25/08/2025',
      severity: 'high',
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  const getSeverityBadge = (severity) => {
    const badges = {
      high: 'bg-error text-error-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return badges?.[severity] || badges?.low;
  };

  const handleAlertAction = (alertId, action) => {
    console.log(`Action ${action} for alert ${alertId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Alertes Urgentes</h3>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-error rounded-full pulse-status"></span>
          <span className="text-sm font-medium text-error">{alerts?.filter(a => a?.severity === 'high')?.length}</span>
        </div>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts?.map((alert) => (
          <div key={alert?.id} className={`p-4 rounded-lg border ${alert?.bgColor} border-border`}>
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0`}>
                <Icon name={alert?.icon} size={16} className={alert?.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">{alert?.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge(alert?.severity)}`}>
                    {alert?.severity === 'high' ? 'Urgent' : alert?.severity === 'medium' ? 'Moyen' : 'Faible'}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{alert?.message}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {alert?.user ? `Utilisateur: ${alert?.user}` : `Échéance: ${alert?.dueDate}`}
                  </span>
                  <span>{alert?.dueDate}</span>
                </div>
                
                <div className="flex space-x-2 mt-3">
                  {alert?.type === 'overdue' ? (
                    <>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleAlertAction(alert?.id, 'contact')}
                      >
                        Contacter
                      </Button>
                      <Button
                        variant="default"
                        size="xs"
                        onClick={() => handleAlertAction(alert?.id, 'extend')}
                      >
                        Prolonger
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleAlertAction(alert?.id, 'schedule')}
                      >
                        Programmer
                      </Button>
                      <Button
                        variant="default"
                        size="xs"
                        onClick={() => handleAlertAction(alert?.id, 'complete')}
                      >
                        Terminer
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth>
          Voir toutes les alertes ({alerts?.length})
        </Button>
      </div>
    </div>
  );
};

export default AlertsPanel;
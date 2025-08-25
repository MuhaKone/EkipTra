import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StatusCard = ({ equipment, onStatusChange }) => {
  const getStatusConfig = (status) => {
    const statusConfigs = {
      available: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'CheckCircle',
        label: 'Disponible',
        description: 'Prêt à être utilisé'
      },
      maintenance: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: 'Wrench',
        label: 'En Maintenance',
        description: 'Maintenance en cours'
      },
      loaned: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'User',
        label: 'Prêté',
        description: 'Actuellement utilisé'
      },
      'out-of-service': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: 'XCircle',
        label: 'Hors Service',
        description: 'Non utilisable'
      }
    };

    return statusConfigs?.[status] || statusConfigs?.available;
  };

  const statusConfig = getStatusConfig(equipment?.status);

  const getConditionColor = (condition) => {
    const conditionColors = {
      'Excellent': 'text-green-600',
      'Bon': 'text-blue-600',
      'Moyen': 'text-yellow-600',
      'Mauvais': 'text-red-600'
    };
    return conditionColors?.[condition] || 'text-muted-foreground';
  };

  const calculateUtilization = () => {
    // Mock calculation based on loan history
    return 78; // 78% utilization rate
  };

  const getNextMaintenanceDate = () => {
    // Mock next maintenance date
    return '15/09/2025';
  };

  const isMaintenanceDue = () => {
    const nextMaintenance = new Date('2025-09-15');
    const today = new Date();
    const daysUntil = Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-industrial-sm">
      {/* Status Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-lg border ${statusConfig?.color}`}>
            <Icon name={statusConfig?.icon} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{statusConfig?.label}</h3>
            <p className="text-sm text-muted-foreground">{statusConfig?.description}</p>
          </div>
        </div>

        {/* Current Status Details */}
        {equipment?.status === 'loaned' && equipment?.currentLoan && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">
                Prêté à: {equipment?.currentLoan?.borrower}
              </div>
              <div className="text-muted-foreground">
                Depuis le {equipment?.currentLoan?.loanDate}
              </div>
              <div className="text-muted-foreground">
                Retour prévu: {equipment?.currentLoan?.expectedReturn}
              </div>
            </div>
          </div>
        )}

        {equipment?.status === 'maintenance' && equipment?.currentMaintenance && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">
                {equipment?.currentMaintenance?.type}
              </div>
              <div className="text-muted-foreground">
                Technicien: {equipment?.currentMaintenance?.technician}
              </div>
              <div className="text-muted-foreground">
                Fin prévue: {equipment?.currentMaintenance?.expectedEnd}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Equipment Details */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Condition</div>
            <div className={`text-sm font-medium mt-1 ${getConditionColor(equipment?.condition)}`}>
              {equipment?.condition}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Localisation</div>
            <div className="text-sm font-medium text-foreground mt-1">
              {equipment?.location}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Utilisation</div>
            <div className="text-sm font-medium text-foreground mt-1">
              {calculateUtilization()}%
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Valeur</div>
            <div className="text-sm font-medium text-foreground mt-1">
              {equipment?.purchasePrice?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
          </div>
        </div>

        {/* Maintenance Alert */}
        {isMaintenanceDue() && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-orange-600" />
              <div className="text-sm">
                <div className="font-medium text-orange-800">Maintenance Due</div>
                <div className="text-orange-700">
                  Prochaine maintenance: {getNextMaintenanceDate()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Utilization Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Taux d'Utilisation
            </span>
            <span className="text-sm font-medium text-foreground">
              {calculateUtilization()}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateUtilization()}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">24</div>
            <div className="text-xs text-muted-foreground">Prêts Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">156</div>
            <div className="text-xs text-muted-foreground">Jours Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">3</div>
            <div className="text-xs text-muted-foreground">Maintenances</div>
          </div>
        </div>
      </div>
      {/* Status Change Actions */}
      <div className="p-6 border-t border-border">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
          Changer le Statut
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {equipment?.status !== 'available' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange('available')}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Disponible
            </Button>
          )}
          
          {equipment?.status !== 'maintenance' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange('maintenance')}
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            >
              <Icon name="Wrench" size={16} className="mr-2" />
              Maintenance
            </Button>
          )}
          
          {equipment?.status !== 'out-of-service' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange('out-of-service')}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Icon name="XCircle" size={16} className="mr-2" />
              Hors Service
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
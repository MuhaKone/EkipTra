import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const EquipmentDetailsModal = ({ equipment, isOpen, onClose, onEdit, onGenerateQR }) => {
  if (!isOpen || !equipment) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'available': { 
        color: 'bg-success/10 text-success border-success/20', 
        icon: 'CheckCircle',
        label: 'Disponible'
      },
      'maintenance': { 
        color: 'bg-warning/10 text-warning border-warning/20', 
        icon: 'Wrench',
        label: 'En maintenance'
      },
      'loaned': { 
        color: 'bg-accent/10 text-accent border-accent/20', 
        icon: 'UserCheck',
        label: 'Emprunté'
      },
      'out-of-service': { 
        color: 'bg-error/10 text-error border-error/20', 
        icon: 'XCircle',
        label: 'Hors service'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.['available'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config?.color}`}>
        <Icon name={config?.icon} size={16} className="mr-2" />
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-1000 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-industrial-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Package" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{equipment?.name}</h2>
              <p className="text-muted-foreground font-mono">{equipment?.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(equipment)}
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateQR(equipment)}
            >
              <Icon name="QrCode" size={16} className="mr-2" />
              QR Code
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={equipment?.image || `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop`}
                  alt={equipment?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Statut</span>
                  {getStatusBadge(equipment?.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Catégorie</span>
                  <span className="text-sm text-foreground capitalize">{equipment?.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Emplacement</span>
                  <span className="text-sm text-foreground">{equipment?.location}</span>
                </div>
              </div>
            </div>

            {/* Equipment Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Info" size={20} className="mr-2" />
                  Informations générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Numéro de série</label>
                      <p className="text-foreground font-mono">{equipment?.serialNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Modèle</label>
                      <p className="text-foreground">{equipment?.model || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fabricant</label>
                      <p className="text-foreground">{equipment?.manufacturer || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date d'achat</label>
                      <p className="text-foreground">{formatDate(equipment?.purchaseDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Prix d'achat</label>
                      <p className="text-foreground">{formatCurrency(equipment?.purchasePrice || 0)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fournisseur</label>
                      <p className="text-foreground">{equipment?.supplier || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Wrench" size={20} className="mr-2" />
                  Maintenance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dernière maintenance</label>
                      <p className="text-foreground">{formatDate(equipment?.lastMaintenance)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Prochaine maintenance</label>
                      <p className="text-foreground">{formatDate(equipment?.nextMaintenance)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Coût maintenance total</label>
                      <p className="text-foreground">{formatCurrency(equipment?.maintenanceCost || 0)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Technicien responsable</label>
                      <p className="text-foreground">{equipment?.maintenanceTechnician || 'Non assigné'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Information */}
              {equipment?.assignedUser && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="UserCheck" size={20} className="mr-2" />
                    Attribution
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{equipment?.assignedUser}</p>
                        <p className="text-sm text-muted-foreground">
                          Emprunté le {formatDate(equipment?.loanDate)}
                        </p>
                        {equipment?.returnDate && (
                          <p className="text-sm text-muted-foreground">
                            Retour prévu le {formatDate(equipment?.returnDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {equipment?.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="FileText" size={20} className="mr-2" />
                    Notes
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{equipment?.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsModal;
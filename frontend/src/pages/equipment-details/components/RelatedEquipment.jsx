import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const RelatedEquipment = ({ currentEquipmentId }) => {
  const navigate = useNavigate();

  // Mock related equipment data
  const relatedEquipment = [
    {
      id: 'EQ-2024-002',
      name: 'Perceuse Hydraulique HD-200',
      category: 'construction',
      status: 'available',
      location: 'Entrepôt A',
      similarity: 95,
      reason: 'Même catégorie et fabricant',
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100'
    },
    {
      id: 'EQ-2024-003',
      name: 'Compresseur Portable CP-150',
      category: 'construction',
      status: 'loaned',
      location: 'Site B',
      similarity: 87,
      reason: 'Souvent utilisé ensemble',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100'
    },
    {
      id: 'EQ-2024-004',
      name: 'Générateur Diesel GD-300',
      category: 'electrical',
      status: 'maintenance',
      location: 'Atelier',
      similarity: 82,
      reason: 'Équipement complémentaire',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100'
    },
    {
      id: 'EQ-2024-005',
      name: 'Marteau Pneumatique MP-80',
      category: 'construction',
      status: 'available',
      location: 'Entrepôt B',
      similarity: 78,
      reason: 'Même type d\'usage',
      image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=100'
    }
  ];

  const getStatusConfig = (status) => {
    const statusConfigs = {
      available: {
        color: 'bg-green-100 text-green-800',
        icon: 'CheckCircle',
        label: 'Disponible'
      },
      maintenance: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: 'Wrench',
        label: 'Maintenance'
      },
      loaned: {
        color: 'bg-blue-100 text-blue-800',
        icon: 'User',
        label: 'Prêté'
      },
      'out-of-service': {
        color: 'bg-red-100 text-red-800',
        icon: 'XCircle',
        label: 'Hors Service'
      }
    };

    return statusConfigs?.[status] || statusConfigs?.available;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      construction: 'Hammer',
      mining: 'Mountain',
      hse: 'Shield',
      electrical: 'Zap',
      mechanical: 'Cog',
      other: 'Package'
    };

    return categoryIcons?.[category] || 'Package';
  };

  const handleViewEquipment = (equipmentId) => {
    navigate(`/equipment-details?id=${equipmentId}`);
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 90) return 'text-green-600';
    if (similarity >= 80) return 'text-blue-600';
    if (similarity >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-industrial-sm">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-foreground">Équipements Similaires</h3>
        <p className="text-sm text-muted-foreground">Équipements recommandés et complémentaires</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {relatedEquipment?.map(equipment => {
            const statusConfig = getStatusConfig(equipment?.status);
            
            return (
              <div key={equipment?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start space-x-3">
                  {/* Equipment Image/Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <Icon name={getCategoryIcon(equipment?.category)} size={20} className="text-muted-foreground" />
                    </div>
                  </div>

                  {/* Equipment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm line-clamp-1">
                          {equipment?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {equipment?.id}
                        </p>
                      </div>

                      {/* Similarity Score */}
                      <div className="flex-shrink-0 ml-2">
                        <div className={`text-xs font-medium ${getSimilarityColor(equipment?.similarity)}`}>
                          {equipment?.similarity}% similaire
                        </div>
                      </div>
                    </div>

                    {/* Status and Location */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                        <Icon name={statusConfig?.icon} size={12} className="mr-1" />
                        {statusConfig?.label}
                      </span>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        {equipment?.location}
                      </div>
                    </div>

                    {/* Similarity Reason */}
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        <Icon name="Info" size={12} className="inline mr-1" />
                        {equipment?.reason}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEquipment(equipment?.id)}
                        className="text-xs"
                      >
                        <Icon name="Eye" size={14} className="mr-1" />
                        Voir
                      </Button>
                      
                      {equipment?.status === 'available' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Icon name="UserPlus" size={14} className="mr-1" />
                          Prêter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/equipment-inventory')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Voir Tous les Équipements
          </Button>
        </div>

        {/* Recommendation Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <div className="font-medium text-foreground mb-1">Recommandations</div>
              <div>Les équipements similaires sont suggérés selon la catégorie, l'usage et l'historique des prêts.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedEquipment;
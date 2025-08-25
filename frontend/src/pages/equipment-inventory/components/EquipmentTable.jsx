import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const EquipmentTable = ({ 
  equipment, 
  selectedItems, 
  onSelectionChange, 
  onSelectAll, 
  onSort, 
  sortConfig,
  onViewDetails,
  onEditEquipment,
  onGenerateQR 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

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
        label: 'Maintenance'
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {config?.label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'construction': 'HardHat',
      'mining': 'Pickaxe',
      'hse': 'Shield',
      'others': 'Package'
    };
    return categoryIcons?.[category] || 'Package';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('fr-FR');
  };

  const handleSort = (column) => {
    const direction = sortConfig?.key === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key: column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = equipment?.length > 0 && selectedItems?.length === equipment?.length;
  const isPartiallySelected = selectedItems?.length > 0 && selectedItems?.length < equipment?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-industrial-sm overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted/30 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Inventaire des équipements ({equipment?.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Printer" size={16} className="mr-2" />
              Imprimer
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="w-12 px-6 py-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={onSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('code')}
                  className="font-semibold text-foreground hover:text-primary"
                >
                  Code
                  <Icon name={getSortIcon('code')} size={16} className="ml-2" />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="font-semibold text-foreground hover:text-primary"
                >
                  Nom de l'équipement
                  <Icon name={getSortIcon('name')} size={16} className="ml-2" />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">Catégorie</th>
              <th className="px-6 py-4 text-left">Statut</th>
              <th className="px-6 py-4 text-left">Emplacement</th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('lastMaintenance')}
                  className="font-semibold text-foreground hover:text-primary"
                >
                  Dernière maintenance
                  <Icon name={getSortIcon('lastMaintenance')} size={16} className="ml-2" />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">Utilisateur assigné</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {equipment?.map((item) => (
              <tr
                key={item?.id}
                className={`hover:bg-muted/30 transition-industrial ${
                  selectedItems?.includes(item?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(item?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedItems?.includes(item?.id)}
                    onChange={(e) => onSelectionChange(item?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm font-medium text-primary">
                    {item?.code}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={getCategoryIcon(item?.category)} size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item?.name}</div>
                      <div className="text-sm text-muted-foreground">S/N: {item?.serialNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground capitalize">
                    {item?.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(item?.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{item?.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item?.lastMaintenance)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item?.assignedUser ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} color="white" />
                      </div>
                      <span className="text-sm text-foreground">{item?.assignedUser}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Non assigné</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(item)}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEquipment(item)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onGenerateQR(item)}
                      className="h-8 w-8"
                    >
                      <Icon name="QrCode" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden divide-y divide-border">
        {equipment?.map((item) => (
          <div key={item?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedItems?.includes(item?.id)}
                  onChange={(e) => onSelectionChange(item?.id, e?.target?.checked)}
                />
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={getCategoryIcon(item?.category)} size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{item?.name}</div>
                  <div className="text-sm text-primary font-mono">{item?.code}</div>
                </div>
              </div>
              {getStatusBadge(item?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">S/N:</span>
                <span className="ml-2 text-foreground">{item?.serialNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Emplacement:</span>
                <span className="ml-2 text-foreground">{item?.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Maintenance:</span>
                <span className="ml-2 text-foreground">{formatDate(item?.lastMaintenance)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Assigné à:</span>
                <span className="ml-2 text-foreground">{item?.assignedUser || 'Non assigné'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(item)}
              >
                <Icon name="Eye" size={16} className="mr-2" />
                Voir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditEquipment(item)}
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGenerateQR(item)}
              >
                <Icon name="QrCode" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {equipment?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun équipement trouvé</h3>
          <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentTable;
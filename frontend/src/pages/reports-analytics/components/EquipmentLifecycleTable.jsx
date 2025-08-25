import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EquipmentLifecycleTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const equipmentData = [
    {
      id: 'EQ-001',
      name: 'Excavatrice CAT 320',
      category: 'Construction',
      purchaseDate: '15/03/2020',
      purchasePrice: 185000,
      currentValue: 142000,
      depreciation: 23.2,
      maintenanceCost: 12500,
      utilizationRate: 87,
      status: 'Actif',
      nextMaintenance: '10/09/2024'
    },
    {
      id: 'EQ-002',
      name: 'Foreuse pneumatique Atlas',
      category: 'Exploitation minière',
      purchaseDate: '22/07/2019',
      purchasePrice: 45000,
      currentValue: 28000,
      depreciation: 37.8,
      maintenanceCost: 8200,
      utilizationRate: 92,
      status: 'Actif',
      nextMaintenance: '05/09/2024'
    },
    {
      id: 'EQ-003',
      name: 'Détecteur de gaz portable',
      category: 'HSE',
      purchaseDate: '10/01/2022',
      purchasePrice: 2500,
      currentValue: 1800,
      depreciation: 28.0,
      maintenanceCost: 450,
      utilizationRate: 78,
      status: 'Actif',
      nextMaintenance: '15/09/2024'
    },
    {
      id: 'EQ-004',
      name: 'Grue mobile Liebherr',
      category: 'Construction',
      purchaseDate: '05/11/2018',
      purchasePrice: 320000,
      currentValue: 198000,
      depreciation: 38.1,
      maintenanceCost: 18500,
      utilizationRate: 85,
      status: 'Maintenance',
      nextMaintenance: '28/08/2024'
    },
    {
      id: 'EQ-005',
      name: 'Compresseur d\'air industriel',
      category: 'Outils',
      purchaseDate: '18/06/2021',
      purchasePrice: 8500,
      currentValue: 6200,
      depreciation: 27.1,
      maintenanceCost: 1200,
      utilizationRate: 94,
      status: 'Actif',
      nextMaintenance: '12/09/2024'
    }
  ];

  const filteredData = equipmentData?.filter(item =>
    item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig?.key !== null) {
      sortableItems?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig?.key === columnName) {
      return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
    }
    return 'ChevronsUpDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Actif': { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      'Maintenance': { color: 'bg-warning/10 text-warning', icon: 'AlertCircle' },
      'Hors service': { color: 'bg-error/10 text-error', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Actif'];

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Rechercher par nom, ID ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Filter" size={16} className="mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('id')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    ID Équipement
                    <Icon name={getSortIcon('id')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('name')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    Nom
                    <Icon name={getSortIcon('name')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('category')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    Catégorie
                    <Icon name={getSortIcon('category')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('purchasePrice')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    Prix d'achat
                    <Icon name={getSortIcon('purchasePrice')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('currentValue')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    Valeur actuelle
                    <Icon name={getSortIcon('currentValue')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('depreciation')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    Dépréciation
                    <Icon name={getSortIcon('depreciation')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requestSort('utilizationRate')}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    Utilisation
                    <Icon name={getSortIcon('utilizationRate')} size={14} className="ml-1" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedData?.map((item) => (
                <tr key={item?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-primary">{item?.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{item?.name}</p>
                      <p className="text-xs text-muted-foreground">Acheté le {item?.purchaseDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{item?.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {item?.purchasePrice?.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {item?.currentValue?.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-error font-medium">-{item?.depreciation}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${item?.utilizationRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item?.utilizationRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(item?.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de {sortedData?.length} équipements sur {equipmentData?.length} au total
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentLifecycleTable;
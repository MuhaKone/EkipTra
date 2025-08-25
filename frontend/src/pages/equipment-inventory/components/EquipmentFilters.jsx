import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const EquipmentFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    location: ''
  });

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'construction', label: 'Construction' },
    { value: 'mining', label: 'Exploitation minière' },
    { value: 'hse', label: 'HSE' },
    { value: 'others', label: 'Autres' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'available', label: 'Disponible' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'loaned', label: 'Emprunté' },
    { value: 'out-of-service', label: 'Hors service' }
  ];

  const locationOptions = [
    { value: '', label: 'Tous les emplacements' },
    { value: 'warehouse-a', label: 'Entrepôt A' },
    { value: 'warehouse-b', label: 'Entrepôt B' },
    { value: 'site-1', label: 'Site 1' },
    { value: 'site-2', label: 'Site 2' },
    { value: 'maintenance-shop', label: 'Atelier de maintenance' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      location: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filtres de recherche
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} className="mr-2" />
            Effacer les filtres
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="xl:col-span-2">
          <Input
            type="search"
            placeholder="Rechercher par code ou nom..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <Select
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Catégorie"
        />

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Statut"
        />

        {/* Location Filter */}
        <Select
          options={locationOptions}
          value={filters?.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Emplacement"
        />

        {/* Date Range */}
        <div className="flex space-x-2">
          <Input
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            placeholder="Date début"
            className="flex-1"
          />
          <Input
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            placeholder="Date fin"
            className="flex-1"
          />
        </div>
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'available')}
          className={filters?.status === 'available' ? 'bg-success/10 border-success text-success' : ''}
        >
          <Icon name="CheckCircle" size={16} className="mr-2" />
          Disponibles
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'maintenance')}
          className={filters?.status === 'maintenance' ? 'bg-warning/10 border-warning text-warning' : ''}
        >
          <Icon name="Wrench" size={16} className="mr-2" />
          En maintenance
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'loaned')}
          className={filters?.status === 'loaned' ? 'bg-accent/10 border-accent text-accent' : ''}
        >
          <Icon name="UserCheck" size={16} className="mr-2" />
          Empruntés
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('category', 'hse')}
          className={filters?.category === 'hse' ? 'bg-primary/10 border-primary text-primary' : ''}
        >
          <Icon name="Shield" size={16} className="mr-2" />
          HSE
        </Button>
      </div>
    </div>
  );
};

export default EquipmentFilters;
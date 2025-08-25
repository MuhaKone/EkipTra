import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportFilters = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    categories: [],
    departments: [],
    status: 'all',
    costRange: { min: '', max: '' }
  });

  const dateRangeOptions = [
    { value: 'today', label: "Aujourd\'hui" },
    { value: 'last7days', label: '7 derniers jours' },
    { value: 'last30days', label: '30 derniers jours' },
    { value: 'last3months', label: '3 derniers mois' },
    { value: 'last6months', label: '6 derniers mois' },
    { value: 'lastyear', label: 'Année dernière' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  const categoryOptions = [
    { value: 'construction', label: 'Construction' },
    { value: 'mining', label: 'Exploitation minière' },
    { value: 'hse', label: 'HSE' },
    { value: 'tools', label: 'Outils' },
    { value: 'vehicles', label: 'Véhicules' },
    { value: 'electronics', label: 'Électronique' }
  ];

  const departmentOptions = [
    { value: 'operations', label: 'Opérations' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'safety', label: 'Sécurité' },
    { value: 'logistics', label: 'Logistique' },
    { value: 'administration', label: 'Administration' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'available', label: 'Disponible' },
    { value: 'loaned', label: 'Emprunté' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'out-of-service', label: 'Hors service' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleCategoryChange = (category, checked) => {
    const newCategories = checked 
      ? [...filters?.categories, category]
      : filters?.categories?.filter(c => c !== category);
    handleFilterChange('categories', newCategories);
  };

  const handleDepartmentChange = (department, checked) => {
    const newDepartments = checked 
      ? [...filters?.departments, department]
      : filters?.departments?.filter(d => d !== department);
    handleFilterChange('departments', newDepartments);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'last30days',
      startDate: '',
      endDate: '',
      categories: [],
      departments: [],
      status: 'all',
      costRange: { min: '', max: '' }
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-card border-r border-border p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="w-full"
        >
          <Icon name="Filter" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Date Range */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Période</h4>
          <Select
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Sélectionner une période"
          />
          
          {filters?.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Date début"
                value={filters?.startDate}
                onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
              />
              <Input
                type="date"
                label="Date fin"
                value={filters?.endDate}
                onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
              />
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Catégories</h4>
          <div className="space-y-2">
            {categoryOptions?.map((category) => (
              <Checkbox
                key={category?.value}
                label={category?.label}
                checked={filters?.categories?.includes(category?.value)}
                onChange={(e) => handleCategoryChange(category?.value, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Départements</h4>
          <div className="space-y-2">
            {departmentOptions?.map((department) => (
              <Checkbox
                key={department?.value}
                label={department?.label}
                checked={filters?.departments?.includes(department?.value)}
                onChange={(e) => handleDepartmentChange(department?.value, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Statut</h4>
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </div>

        {/* Cost Range */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Plage de coûts (€)</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={filters?.costRange?.min}
              onChange={(e) => handleFilterChange('costRange', { 
                ...filters?.costRange, 
                min: e?.target?.value 
              })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters?.costRange?.max}
              onChange={(e) => handleFilterChange('costRange', { 
                ...filters?.costRange, 
                max: e?.target?.value 
              })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border space-y-3">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full"
          >
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
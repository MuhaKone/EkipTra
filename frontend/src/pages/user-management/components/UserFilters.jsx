import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedRole, 
  onRoleChange, 
  selectedDepartment, 
  onDepartmentChange, 
  selectedStatus, 
  onStatusChange,
  onClearFilters 
}) => {
  const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    { value: 'Administrateur', label: 'Administrateur' },
    { value: 'Gestionnaire HSE', label: 'Gestionnaire HSE' },
    { value: 'Technicien', label: 'Technicien' },
    { value: 'Employé', label: 'Employé' }
  ];

  const departmentOptions = [
    { value: '', label: 'Tous les départements' },
    { value: 'Administration', label: 'Administration' },
    { value: 'HSE', label: 'HSE' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Production', label: 'Production' },
    { value: 'Logistique', label: 'Logistique' },
    { value: 'Qualité', label: 'Qualité' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
    { value: 'Suspendu', label: 'Suspendu' }
  ];

  const hasActiveFilters = searchTerm || selectedRole || selectedDepartment || selectedStatus;

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filtres
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} className="mr-1" />
            Effacer
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        <div>
          <Select
            placeholder="Filtrer par rôle"
            options={roleOptions}
            value={selectedRole}
            onChange={onRoleChange}
          />
        </div>

        <div>
          <Select
            placeholder="Filtrer par département"
            options={departmentOptions}
            value={selectedDepartment}
            onChange={onDepartmentChange}
          />
        </div>

        <div>
          <Select
            placeholder="Filtrer par statut"
            options={statusOptions}
            value={selectedStatus}
            onChange={onStatusChange}
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Recherche: "{searchTerm}"
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange('')}
                  className="h-4 w-4 ml-1 hover:bg-primary/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </span>
            )}
            {selectedRole && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                Rôle: {selectedRole}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRoleChange('')}
                  className="h-4 w-4 ml-1 hover:bg-accent/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                Département: {selectedDepartment}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDepartmentChange('')}
                  className="h-4 w-4 ml-1 hover:bg-secondary/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                Statut: {selectedStatus}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStatusChange('')}
                  className="h-4 w-4 ml-1 hover:bg-success/20"
                >
                  <Icon name="X" size={12} />
                </Button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
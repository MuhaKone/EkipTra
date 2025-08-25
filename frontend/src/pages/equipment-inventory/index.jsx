import { api } from '../../lib/api';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import EquipmentFilters from './components/EquipmentFilters';
import EquipmentTable from './components/EquipmentTable';
import BulkActionsPanel from './components/BulkActionsPanel';
import EquipmentDetailsModal from './components/EquipmentDetailsModal';
import EquipmentPagination from './components/EquipmentPagination';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EquipmentInventory = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('Technicien');
  
  // Equipment data state
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Modal state
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Mock equipment data
  const mockEquipment = [];

  // Initialize data
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'Technicien';
    setUserRole(savedRole);
    setEquipment(mockEquipment);
    setFilteredEquipment(mockEquipment);
  }, []);

  // Filter and sort equipment
  const processedEquipment = useMemo(() => {
    let result = [...equipment];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      result = result?.filter(item => 
        item?.code?.toLowerCase()?.includes(searchTerm) ||
        item?.name?.toLowerCase()?.includes(searchTerm) ||
        item?.serialNumber?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.category) {
      result = result?.filter(item => item?.category === filters?.category);
    }

    if (filters?.status) {
      result = result?.filter(item => item?.status === filters?.status);
    }

    if (filters?.location) {
      result = result?.filter(item => item?.location === filters?.location);
    }

    if (filters?.dateFrom) {
      result = result?.filter(item => 
        new Date(item.purchaseDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      result = result?.filter(item => 
        new Date(item.purchaseDate) <= new Date(filters.dateTo)
      );
    }

    // Apply sorting
    if (sortConfig?.key) {
      result?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        // Handle date sorting
        if (sortConfig?.key?.includes('Date') || sortConfig?.key === 'lastMaintenance') {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }

        // Handle string sorting
        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [equipment, filters, sortConfig]);

  // Paginated equipment
  const paginatedEquipment = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedEquipment?.slice(startIndex, startIndex + itemsPerPage);
  }, [processedEquipment, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedEquipment?.length / itemsPerPage);

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (sortConfig) => {
    setSortConfig(sortConfig);
  };

  const handleSelectionChange = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems?.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedItems(paginatedEquipment?.map(item => item?.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkAction = (action) => {
    console.log(`Executing bulk action: ${action} on items:`, selectedItems);
    // Implement bulk action logic here
    setSelectedItems([]);
  };

  const handleViewDetails = (equipment) => {
    setSelectedEquipment(equipment);
    setIsDetailsModalOpen(true);
  };

  const handleEditEquipment = (equipment) => {
    navigate('/equipment-details', { state: { equipment, mode: 'edit' } });
  };

  const handleGenerateQR = (equipment) => {
    console.log('Generating QR code for:', equipment?.code);
    // Implement QR code generation logic
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedItems([]);
  };

  const handleAddEquipment = () => {
    navigate('/equipment-details', { state: { mode: 'create' } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        userRole={userRole}
      />
      {/* Primary Navigation */}
      <PrimaryNavigation
        isCollapsed={isMenuCollapsed}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userRole={userRole}
      />
      {/* Main Content */}
      <div className={`transition-smooth ${isMenuCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        {/* Page Content */}
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Inventaire des équipements</h1>
              <p className="text-muted-foreground">
                Gérez et suivez tous vos équipements industriels en temps réel
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => window.location?.reload()}
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Actualiser
              </Button>
              <Button
                variant="default"
                onClick={handleAddEquipment}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Ajouter équipement
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total équipements</p>
                  <p className="text-2xl font-bold text-foreground">{equipment?.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Package" size={20} className="text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                  <p className="text-2xl font-bold text-success">
                    {equipment?.filter(e => e?.status === 'available')?.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En maintenance</p>
                  <p className="text-2xl font-bold text-warning">
                    {equipment?.filter(e => e?.status === 'maintenance')?.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Wrench" size={20} className="text-warning" />
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Empruntés</p>
                  <p className="text-2xl font-bold text-accent">
                    {equipment?.filter(e => e?.status === 'loaned')?.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <EquipmentFilters
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Equipment Table */}
          <EquipmentTable
            equipment={paginatedEquipment}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onViewDetails={handleViewDetails}
            onEditEquipment={handleEditEquipment}
            onGenerateQR={handleGenerateQR}
          />

          {/* Pagination */}
          <EquipmentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={processedEquipment?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
      {/* Bulk Actions Panel */}
      <BulkActionsPanel
        selectedCount={selectedItems?.length}
        onBulkAction={handleBulkAction}
        onClearSelection={handleClearSelection}
      />
      {/* Equipment Details Modal */}
      <EquipmentDetailsModal
        equipment={selectedEquipment}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEditEquipment}
        onGenerateQR={handleGenerateQR}
      />
    </div>
  );
};

export default EquipmentInventory;
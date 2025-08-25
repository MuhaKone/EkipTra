import { api } from '../../lib/api';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import { RoleProvider } from '../../components/ui/RoleBasedMenuFilter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import GeneralInformation from './components/GeneralInformation';
import MaintenanceHistory from './components/MaintenanceHistory';
import LoanHistory from './components/LoanHistory';
import PhotosDocuments from './components/PhotosDocuments';
import StatusCard from './components/StatusCard';
import QuickActions from './components/QuickActions';
import QRCodeSection from './components/QRCodeSection';
import RelatedEquipment from './components/RelatedEquipment';

const EquipmentDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [userRole, setUserRole] = useState('Technicien');

  // Get equipment ID from URL params
  const equipmentId = searchParams?.get('id') || 'EQ-2024-001';

  // Mock equipment data
  const [equipment, setEquipment] = useState({
    id: 'EQ-2024-001',
    name: 'Perceuse Hydraulique HD-150',
    category: 'construction',
    serialNumber: 'HD150-2024-001',
    model: 'HD-150 Pro',
    manufacturer: 'HydraTech Industries',
    purchaseDate: '15/06/2024',
    purchasePrice: 15750.00,
    supplier: 'Équipements Industriels SA',
    warranty: 24,
    location: 'Entrepôt A - Zone 3',
    status: 'available',
    condition: 'Excellent',
    description: `Perceuse hydraulique haute performance conçue pour les travaux de construction lourds.\n\nCaractéristiques principales:\n• Puissance hydraulique: 150 kW\n• Profondeur de perçage: jusqu'à 50m\n• Système de refroidissement intégré\n• Contrôle automatique de la pression\n• Certification CE et ISO 9001`,
    weight: '2,850 kg',dimensions: '4.2m x 2.1m x 2.8m',power: '150 kW',
    currentLoan: null,
    currentMaintenance: null
  });

  useEffect(() => {
    // Get user role from localStorage
    const savedRole = localStorage.getItem('userRole') || 'Technicien';
    setUserRole(savedRole);

    // In a real app, fetch equipment data based on ID
    // fetchEquipmentData(equipmentId);
  }, [equipmentId]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleEquipmentUpdate = (updatedData) => {
    setEquipment(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const handleStatusChange = (newStatus) => {
    setEquipment(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const customBreadcrumbs = [
    { label: 'Accueil', path: '/dashboard', icon: 'Home' },
    { label: 'Inventaire', path: '/equipment-inventory', icon: 'Package' },
    { label: equipment?.name, path: null, icon: 'Wrench' }
  ];

  const tabs = [
    { id: 'general', label: 'Informations Générales', icon: 'Info' },
    { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
    { id: 'loans', label: 'Historique Prêts', icon: 'History' },
    { id: 'photos', label: 'Photos & Documents', icon: 'Image' }
  ];

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="text-muted-foreground animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-medium text-foreground">Chargement des détails...</h2>
        </div>
      </div>
    );
  }

  return (
    <RoleProvider>
      <div className="min-h-screen bg-background">
        <NavigationHeader 
          onMenuToggle={handleMenuToggle}
          isMenuOpen={isMenuOpen}
          userRole={userRole}
        />
        
        <PrimaryNavigation 
          isCollapsed={isMenuCollapsed}
          isOpen={isMenuOpen}
          onClose={handleMenuClose}
          userRole={userRole}
        />

        <div className={`transition-all duration-300 ${isMenuCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
          <main className="pt-16">
            <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />
            
            <div className="p-6">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Wrench" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{equipment?.name}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>ID: {equipment?.id}</span>
                      <span>•</span>
                      <span>N° Série: {equipment?.serialNumber}</span>
                      <span>•</span>
                      <span>Modèle: {equipment?.model}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/equipment-inventory')}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Retour à l'Inventaire
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Share"
                    iconPosition="left"
                  >
                    Partager
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-8">
                  {/* Tabs */}
                  <div className="bg-card border border-border rounded-lg shadow-industrial-sm mb-6">
                    <div className="border-b border-border">
                      <div className="flex overflow-x-auto">
                        {tabs?.map(tab => (
                          <button
                            key={tab?.id}
                            onClick={() => setActiveTab(tab?.id)}
                            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                              activeTab === tab?.id
                                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            }`}
                          >
                            <Icon name={tab?.icon} size={16} />
                            <span>{tab?.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {activeTab === 'general' && (
                        <GeneralInformation
                          equipment={equipment}
                          onUpdate={handleEquipmentUpdate}
                          isEditing={isEditingGeneral}
                          onToggleEdit={() => setIsEditingGeneral(!isEditingGeneral)}
                        />
                      )}

                      {activeTab === 'maintenance' && (
                        <MaintenanceHistory equipmentId={equipment?.id} />
                      )}

                      {activeTab === 'loans' && (
                        <LoanHistory equipmentId={equipment?.id} />
                      )}

                      {activeTab === 'photos' && (
                        <PhotosDocuments equipmentId={equipment?.id} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Status Card */}
                  <StatusCard
                    equipment={equipment}
                    onStatusChange={handleStatusChange}
                  />

                  {/* Quick Actions */}
                  <QuickActions
                    equipment={equipment}
                    userRole={userRole}
                  />

                  {/* QR Code Section */}
                  <QRCodeSection equipment={equipment} />

                  {/* Related Equipment */}
                  <RelatedEquipment currentEquipmentId={equipment?.id} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
};

export default EquipmentDetails;
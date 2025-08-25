import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationHeader = ({ onMenuToggle, isMenuOpen = false, userRole = 'Technicien' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getPageTitle = () => {
    const pathTitles = {
      '/dashboard': 'Tableau de Bord',
      '/equipment-inventory': 'Inventaire Équipements',
      '/equipment-details': 'Détails Équipement',
      '/user-management': 'Gestion Utilisateurs',
      '/reports-analytics': 'Rapports & Analyses'
    };
    return pathTitles?.[location?.pathname] || 'EquipTracker Local';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-industrial-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Logo and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Wrench" size={18} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">EquipTracker Local</h1>
              <p className="text-xs text-muted-foreground">{getPageTitle()}</p>
            </div>
          </div>
        </div>

        {/* Right Section - Status and User Actions */}
        <div className="flex items-center space-x-4">
          {/* Offline Status Indicator */}
          {isOffline && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-full">
              <Icon name="WifiOff" size={16} />
              <span className="text-sm font-medium hidden sm:inline">Hors ligne</span>
            </div>
          )}

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Utilisateur</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PrimaryNavigation = ({ isCollapsed = false, isOpen = false, onClose, userRole = 'Technicien' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    setActiveItem(location?.pathname);
  }, [location?.pathname]);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['Administrateur', 'Gestionnaire HSE', 'Technicien', 'Employé']
    },
    {
      id: 'equipment',
      label: 'Inventaire',
      path: '/equipment-inventory',
      icon: 'Package',
      roles: ['Administrateur', 'Gestionnaire HSE', 'Technicien', 'Employé']
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      path: '/user-management',
      icon: 'Users',
      roles: ['Administrateur', 'Gestionnaire HSE']
    },
    {
      id: 'reports',
      label: 'Rapports',
      path: '/reports-analytics',
      icon: 'BarChart3',
      roles: ['Administrateur', 'Gestionnaire HSE', 'Technicien']
    }
  ];

  const filteredItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const sidebarClasses = `
    fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border z-900 transition-smooth
    ${isCollapsed ? 'w-16' : 'w-60'}
    lg:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    shadow-industrial-md lg:shadow-none
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-900 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <nav className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 px-3 py-4 space-y-2">
            {filteredItems?.map((item) => {
              const isActive = activeItem === item?.path;
              
              return (
                <Button
                  key={item?.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start h-11 px-3
                    ${isActive ? 'bg-primary text-primary-foreground shadow-industrial-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                    ${isCollapsed ? 'px-3' : 'px-4'}
                    transition-industrial
                  `}
                  onClick={() => handleNavigation(item?.path)}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={isCollapsed ? '' : 'mr-3'} 
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item?.label}</span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Footer Section */}
          <div className="p-3 border-t border-border">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-2 h-2 bg-success rounded-full pulse-status" />
              {!isCollapsed && (
                <div>
                  <p className="text-xs font-medium text-foreground">Système Actif</p>
                  <p className="text-xs text-muted-foreground">Dernière sync: 09:24</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default PrimaryNavigation;
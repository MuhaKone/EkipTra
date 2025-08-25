import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbNavigation = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard': { label: 'Tableau de Bord', icon: 'LayoutDashboard' },
    '/equipment-inventory': { label: 'Inventaire Équipements', icon: 'Package' },
    '/equipment-details': { label: 'Détails Équipement', icon: 'Wrench' },
    '/user-management': { label: 'Gestion Utilisateurs', icon: 'Users' },
    '/reports-analytics': { label: 'Rapports & Analyses', icon: 'BarChart3' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) return customBreadcrumbs;

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Accueil', path: '/dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const pathInfo = pathMap?.[currentPath];
      
      if (pathInfo) {
        breadcrumbs?.push({
          label: pathInfo?.label,
          path: currentPath,
          icon: pathInfo?.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) return null;

  const handleNavigation = (path) => {
    if (path) navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 px-4 py-3 bg-muted/30 border-b border-border" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => {
          const isLast = index === breadcrumbs?.length - 1;
          const isClickable = !isLast && crumb?.path;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              {isClickable ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(crumb?.path)}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground transition-industrial"
                >
                  <Icon name={crumb?.icon} size={16} className="mr-2" />
                  <span className="text-sm font-medium">{crumb?.label}</span>
                </Button>
              ) : (
                <div className="flex items-center">
                  <Icon 
                    name={crumb?.icon} 
                    size={16} 
                    className={`mr-2 ${isLast ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                  <span 
                    className={`text-sm font-medium ${
                      isLast ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {crumb?.label}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
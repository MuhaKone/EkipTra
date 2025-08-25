import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('Employé');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Get user role from localStorage or authentication context
    const savedRole = localStorage.getItem('userRole') || 'Employé';
    setUserRole(savedRole);
    updatePermissions(savedRole);
  }, []);

  const updatePermissions = (role) => {
    const rolePermissions = {
      'Administrateur': [
        'dashboard.view',
        'equipment.view',
        'equipment.create',
        'equipment.edit',
        'equipment.delete',
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'reports.view',
        'reports.export',
        'system.admin'
      ],
      'Gestionnaire HSE': [
        'dashboard.view',
        'equipment.view',
        'equipment.edit',
        'equipment.safety',
        'users.view',
        'users.edit',
        'reports.view',
        'reports.export',
        'compliance.manage'
      ],
      'Technicien': [
        'dashboard.view',
        'equipment.view',
        'equipment.edit',
        'equipment.maintenance',
        'reports.view'
      ],
      'Employé': [
        'dashboard.view',
        'equipment.view',
        'equipment.borrow',
        'equipment.return'
      ]
    };

    setPermissions(rolePermissions?.[role] || []);
  };

  const hasPermission = (permission) => {
    return permissions?.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList?.some(permission => permissions?.includes(permission));
  };

  const canAccessRoute = (route) => {
    const routePermissions = {
      '/dashboard': ['dashboard.view'],
      '/equipment-inventory': ['equipment.view'],
      '/equipment-details': ['equipment.view'],
      '/user-management': ['users.view'],
      '/reports-analytics': ['reports.view']
    };

    const requiredPermissions = routePermissions?.[route] || [];
    return hasAnyPermission(requiredPermissions);
  };

  const filterMenuItems = (menuItems) => {
    return menuItems?.filter(item => {
      if (item?.roles) {
        return item?.roles?.includes(userRole);
      }
      if (item?.permissions) {
        return hasAnyPermission(item?.permissions);
      }
      return true;
    });
  };

  const value = {
    userRole,
    setUserRole: (role) => {
      setUserRole(role);
      localStorage.setItem('userRole', role);
      updatePermissions(role);
    },
    permissions,
    hasPermission,
    hasAnyPermission,
    canAccessRoute,
    filterMenuItems
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

// Higher-order component for role-based rendering
export const withRoleCheck = (WrappedComponent, requiredRoles = [], requiredPermissions = []) => {
  return (props) => {
    const { userRole, hasAnyPermission } = useRole();

    const hasRoleAccess = requiredRoles?.length === 0 || requiredRoles?.includes(userRole);
    let hasPermissionAccess = requiredPermissions?.length === 0 || hasAnyPermission(requiredPermissions);

    if (!hasRoleAccess || !hasPermissionAccess) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

// Component for conditional rendering based on roles/permissions
export const RoleGuard = ({ 
  children, 
  roles = [], 
  permissions = [], 
  fallback = null,
  requireAll = false 
}) => {
  const { userRole, hasPermission, hasAnyPermission } = useRole();

  const hasRoleAccess = roles?.length === 0 || roles?.includes(userRole);
  
  let hasPermissionAccess = true;
  if (permissions?.length > 0) {
    hasPermissionAccess = requireAll 
      ? permissions?.every(permission => hasPermission(permission))
      : hasAnyPermission(permissions);
  }

  if (!hasRoleAccess || !hasPermissionAccess) {
    return fallback;
  }

  return children;
};

// Main RoleBasedMenuFilter component
const RoleBasedMenuFilter = ({ 
  menuItems = [], 
  children, 
  className = "",
  renderItem = null 
}) => {
  const { filterMenuItems } = useRole();
  
  const filteredItems = filterMenuItems(menuItems);
  
  if (children && typeof children === 'function') {
    return children(filteredItems);
  }
  
  if (renderItem && typeof renderItem === 'function') {
    return (
      <div className={className}>
        {filteredItems?.map((item, index) => renderItem(item, index))}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {filteredItems?.map((item, index) => (
        <div key={item?.id || index} className="menu-item">
          {item?.label || item?.name || item}
        </div>
      ))}
    </div>
  );
};

export default RoleBasedMenuFilter;
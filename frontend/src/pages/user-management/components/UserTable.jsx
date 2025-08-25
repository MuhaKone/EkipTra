import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserTable = ({ users, onEditUser, onViewActivity, onResetPassword, onToggleStatus }) => {
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users]?.sort((a, b) => {
    const aValue = a?.[sortField] || '';
    const bValue = b?.[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue?.localeCompare(bValue);
    }
    return bValue?.localeCompare(aValue);
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Actif': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'Inactif': { color: 'bg-error text-error-foreground', icon: 'XCircle' },
      'Suspendu': { color: 'bg-warning text-warning-foreground', icon: 'AlertCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Inactif'];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Administrateur': 'bg-primary text-primary-foreground',
      'Gestionnaire HSE': 'bg-accent text-accent-foreground',
      'Technicien': 'bg-secondary text-secondary-foreground',
      'Employé': 'bg-muted text-muted-foreground'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${roleColors?.[role] || 'bg-muted text-muted-foreground'}`}>
        {role}
      </span>
    );
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Jamais connecté';
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-industrial-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('username')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary"
                >
                  Nom d'utilisateur
                  <Icon 
                    name={sortField === 'username' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('fullName')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary"
                >
                  Nom complet
                  <Icon 
                    name={sortField === 'fullName' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('email')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary"
                >
                  Email
                  <Icon 
                    name={sortField === 'email' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('role')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary"
                >
                  Rôle
                  <Icon 
                    name={sortField === 'role' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('department')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary"
                >
                  Département
                  <Icon 
                    name={sortField === 'department' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('lastLogin')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary"
                >
                  Dernière connexion
                  <Icon 
                    name={sortField === 'lastLogin' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-foreground">Statut</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-semibold text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedUsers?.map((user) => (
              <tr key={user?.id} className="hover:bg-muted/30 transition-industrial">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary-foreground">
                        {user?.fullName?.split(' ')?.map(n => n?.[0])?.join('')?.substring(0, 2)}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">{user?.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-foreground">{user?.fullName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground">{user?.email}</span>
                </td>
                <td className="px-4 py-3">
                  {getRoleBadge(user?.role)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-foreground">{user?.department}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {formatLastLogin(user?.lastLogin)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(user?.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(user)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewActivity(user)}
                      className="h-8 w-8 text-muted-foreground hover:text-accent"
                    >
                      <Icon name="Activity" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onResetPassword(user)}
                      className="h-8 w-8 text-muted-foreground hover:text-warning"
                    >
                      <Icon name="Key" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(user)}
                      className={`h-8 w-8 ${user?.status === 'Actif' ? 'text-error hover:text-error' : 'text-success hover:text-success'}`}
                    >
                      <Icon name={user?.status === 'Actif' ? 'UserX' : 'UserCheck'} size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
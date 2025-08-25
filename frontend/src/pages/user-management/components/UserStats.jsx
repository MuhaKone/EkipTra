import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStats = ({ users }) => {
  const stats = {
    total: users?.length,
    active: users?.filter(u => u?.status === 'Actif')?.length,
    inactive: users?.filter(u => u?.status === 'Inactif')?.length,
    suspended: users?.filter(u => u?.status === 'Suspendu')?.length,
    administrators: users?.filter(u => u?.role === 'Administrateur')?.length,
    hseManagers: users?.filter(u => u?.role === 'Gestionnaire HSE')?.length,
    technicians: users?.filter(u => u?.role === 'Technicien')?.length,
    employees: users?.filter(u => u?.role === 'Employé')?.length
  };

  const statCards = [
    {
      title: 'Total utilisateurs',
      value: stats?.total,
      icon: 'Users',
      color: 'bg-primary text-primary-foreground',
      description: 'Tous les comptes'
    },
    {
      title: 'Utilisateurs actifs',
      value: stats?.active,
      icon: 'UserCheck',
      color: 'bg-success text-success-foreground',
      description: 'Comptes activés'
    },
    {
      title: 'Utilisateurs inactifs',
      value: stats?.inactive,
      icon: 'UserX',
      color: 'bg-error text-error-foreground',
      description: 'Comptes désactivés'
    },
    {
      title: 'Utilisateurs suspendus',
      value: stats?.suspended,
      icon: 'UserMinus',
      color: 'bg-warning text-warning-foreground',
      description: 'Comptes suspendus'
    }
  ];

  const roleStats = [
    {
      role: 'Administrateurs',
      count: stats?.administrators,
      percentage: stats?.total > 0 ? Math.round((stats?.administrators / stats?.total) * 100) : 0,
      color: 'bg-primary'
    },
    {
      role: 'Gestionnaires HSE',
      count: stats?.hseManagers,
      percentage: stats?.total > 0 ? Math.round((stats?.hseManagers / stats?.total) * 100) : 0,
      color: 'bg-accent'
    },
    {
      role: 'Techniciens',
      count: stats?.technicians,
      percentage: stats?.total > 0 ? Math.round((stats?.technicians / stats?.total) * 100) : 0,
      color: 'bg-secondary'
    },
    {
      role: 'Employés',
      count: stats?.employees,
      percentage: stats?.total > 0 ? Math.round((stats?.employees / stats?.total) * 100) : 0,
      color: 'bg-muted'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4 shadow-industrial-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat?.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat?.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat?.color} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Role Distribution */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="PieChart" size={20} className="mr-2" />
          Répartition par rôle
        </h3>
        
        <div className="space-y-4">
          {roleStats?.map((role, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${role?.color}`} />
                <span className="text-sm font-medium text-foreground">{role?.role}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${role?.color}`}
                    style={{ width: `${role?.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                  {role?.count} ({role?.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2" />
          Actions rapides
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="UserPlus" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">Nouvel utilisateur</p>
                <p className="text-xs text-muted-foreground">Créer un compte</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Download" size={20} className="text-accent" />
              <div>
                <p className="font-medium text-foreground">Exporter données</p>
                <p className="text-xs text-muted-foreground">Liste des utilisateurs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={20} className="text-warning" />
              <div>
                <p className="font-medium text-foreground">Audit sécurité</p>
                <p className="text-xs text-muted-foreground">Vérifier les permissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
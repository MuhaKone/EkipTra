import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserActivityModal = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('recent');

  if (!isOpen || !user) return null;

  const mockActivities = [
    {
      id: 1,
      type: 'login',
      action: 'Connexion au système',
      timestamp: '2025-01-25 09:15:32',
      details: 'Connexion depuis 192.168.1.45',
      icon: 'LogIn',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'equipment',
      action: 'Emprunt équipement',
      timestamp: '2025-01-25 08:45:12',
      details: 'Perceuse électrique - REF: PE-2024-001',
      icon: 'Package',
      color: 'text-primary'
    },
    {
      id: 3,
      type: 'equipment',
      action: 'Retour équipement',
      timestamp: '2025-01-24 17:30:45',
      details: 'Casque de sécurité - REF: CS-2024-015',
      icon: 'PackageCheck',
      color: 'text-accent'
    },
    {
      id: 4,
      type: 'system',
      action: 'Modification profil',
      timestamp: '2025-01-24 14:20:18',
      details: 'Mise à jour numéro de téléphone',
      icon: 'Settings',
      color: 'text-secondary'
    },
    {
      id: 5,
      type: 'logout',
      action: 'Déconnexion',
      timestamp: '2025-01-24 18:00:00',
      details: 'Déconnexion normale',
      icon: 'LogOut',
      color: 'text-muted-foreground'
    }
  ];

  const mockLoginHistory = [
    {
      id: 1,
      timestamp: '2025-01-25 09:15:32',
      ipAddress: '192.168.1.45',
      device: 'Windows 10 - Chrome 120',
      location: 'Bureau principal',
      status: 'Succès'
    },
    {
      id: 2,
      timestamp: '2025-01-24 08:30:15',
      ipAddress: '192.168.1.45',
      device: 'Windows 10 - Chrome 120',
      location: 'Bureau principal',
      status: 'Succès'
    },
    {
      id: 3,
      timestamp: '2025-01-23 09:45:22',
      ipAddress: '192.168.1.67',
      device: 'Android - Chrome Mobile',
      location: 'Atelier maintenance',
      status: 'Succès'
    },
    {
      id: 4,
      timestamp: '2025-01-23 07:12:08',
      ipAddress: '192.168.1.89',
      device: 'Windows 10 - Edge 119',
      location: 'Poste de contrôle',
      status: 'Échec'
    }
  ];

  const tabs = [
    { id: 'recent', label: 'Activité récente', icon: 'Activity' },
    { id: 'logins', label: 'Historique connexions', icon: 'Shield' },
    { id: 'equipment', label: 'Équipements', icon: 'Package' }
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Succès': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'Échec': { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Succès'];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card rounded-lg border border-border shadow-industrial-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">
                {user?.fullName?.split(' ')?.map(n => n?.[0])?.join('')?.substring(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Activité de {user?.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user?.role} - {user?.department}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-0">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant="ghost"
                onClick={() => setActiveTab(tab?.id)}
                className={`rounded-none border-b-2 px-6 py-3 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} className="mr-2" />
                {tab?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground mb-4">Dernières activités</h4>
              {mockActivities?.map((activity) => (
                <div key={activity?.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                  <div className={`p-2 rounded-full bg-card ${activity?.color}`}>
                    <Icon name={activity?.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{activity?.action}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity?.details}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTimestamp(activity?.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logins' && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground mb-4">Historique des connexions</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Date/Heure</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Adresse IP</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Appareil</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Localisation</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockLoginHistory?.map((login) => (
                      <tr key={login?.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm text-foreground">
                          {formatTimestamp(login?.timestamp)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {login?.ipAddress}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {login?.device}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {login?.location}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(login?.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground mb-4">Historique des équipements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h5 className="font-medium text-foreground mb-2 flex items-center">
                    <Icon name="Package" size={16} className="mr-2 text-primary" />
                    Équipements empruntés
                  </h5>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Perceuse électrique</span>
                      <p className="text-muted-foreground">REF: PE-2024-001 • Emprunté le 25/01/2025</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Multimètre digital</span>
                      <p className="text-muted-foreground">REF: MD-2024-008 • Emprunté le 23/01/2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h5 className="font-medium text-foreground mb-2 flex items-center">
                    <Icon name="PackageCheck" size={16} className="mr-2 text-success" />
                    Équipements retournés
                  </h5>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Casque de sécurité</span>
                      <p className="text-muted-foreground">REF: CS-2024-015 • Retourné le 24/01/2025</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Gants de protection</span>
                      <p className="text-muted-foreground">REF: GP-2024-032 • Retourné le 22/01/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserActivityModal;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoanHistory = ({ equipmentId }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock loan history data
  const loanHistory = [
    {
      id: 1,
      borrower: {
        name: 'Marc Dubois',
        role: 'Technicien',
        department: 'Maintenance',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      loanDate: '20/08/2025',
      returnDate: '23/08/2025',
      expectedReturnDate: '22/08/2025',
      status: 'returned',
      purpose: 'Maintenance préventive sur site A',
      location: 'Site A - Bâtiment 3',
      condition: {
        out: 'Excellent',
        in: 'Bon'
      },
      notes: 'Équipement utilisé pour maintenance hydraulique. Légère usure normale constatée au retour.',
      approvedBy: 'Sophie Martin',
      duration: '3 jours'
    },
    {
      id: 2,
      borrower: {
        name: 'Julie Leroy',
        role: 'Ingénieur HSE',
        department: 'Sécurité',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      loanDate: '15/08/2025',
      returnDate: '18/08/2025',
      expectedReturnDate: '17/08/2025',
      status: 'returned',
      purpose: 'Inspection sécurité trimestrielle',
      location: 'Site B - Zone industrielle',
      condition: {
        out: 'Bon',
        in: 'Bon'
      },
      notes: 'Inspection réalisée avec succès. Aucun problème signalé.',
      approvedBy: 'Pierre Durand',
      duration: '3 jours'
    },
    {
      id: 3,
      borrower: {
        name: 'Thomas Bernard',
        role: 'Employé',
        department: 'Production',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
      },
      loanDate: '22/08/2025',
      returnDate: null,
      expectedReturnDate: '26/08/2025',
      status: 'active',
      purpose: 'Travaux de construction - Phase 2',
      location: 'Chantier Nord',
      condition: {
        out: 'Excellent',
        in: null
      },
      notes: 'Équipement assigné pour travaux de construction. Retour prévu fin de semaine.',
      approvedBy: 'Marie Rousseau',
      duration: '4 jours (en cours)'
    },
    {
      id: 4,
      borrower: {
        name: 'Antoine Moreau',
        role: 'Technicien',
        department: 'Maintenance',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
      },
      loanDate: '10/08/2025',
      returnDate: '14/08/2025',
      expectedReturnDate: '13/08/2025',
      status: 'overdue_returned',
      purpose: 'Réparation urgente équipement minier',
      location: 'Mine - Secteur C',
      condition: {
        out: 'Bon',
        in: 'Moyen'
      },
      notes: 'Retour avec 1 jour de retard. Équipement nécessite maintenance mineure.',
      approvedBy: 'Jean Dupont',
      duration: '4 jours'
    }
  ];

  const filteredHistory = loanHistory?.filter(loan => {
    const matchesFilter = activeFilter === 'all' || loan?.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      loan?.borrower?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      loan?.purpose?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      loan?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-blue-100 text-blue-800', label: 'En Cours', icon: 'Clock' },
      returned: { color: 'bg-green-100 text-green-800', label: 'Retourné', icon: 'CheckCircle' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'En Retard', icon: 'AlertCircle' },
      overdue_returned: { color: 'bg-orange-100 text-orange-800', label: 'Retard Retourné', icon: 'AlertTriangle' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config?.label}</span>
      </div>
    );
  };

  const getConditionColor = (condition) => {
    const conditionColors = {
      'Excellent': 'text-green-600',
      'Bon': 'text-blue-600',
      'Moyen': 'text-yellow-600',
      'Mauvais': 'text-red-600'
    };
    return conditionColors?.[condition] || 'text-muted-foreground';
  };

  const isOverdue = (expectedDate, status) => {
    if (status !== 'active') return false;
    const expected = new Date(expectedDate.split('/').reverse().join('-'));
    const today = new Date();
    return today > expected;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Historique des Prêts</h3>
          <p className="text-sm text-muted-foreground">
            {loanHistory?.length} mouvements enregistrés
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="search"
            placeholder="Rechercher par utilisateur, usage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="sm:w-64"
          />
          <Button variant="outline" iconName="Download">
            Exporter
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Tout' },
          { key: 'active', label: 'En Cours' },
          { key: 'returned', label: 'Retourné' },
          { key: 'overdue', label: 'En Retard' },
          { key: 'overdue_returned', label: 'Retard Retourné' }
        ]?.map(filter => (
          <Button
            key={filter?.key}
            variant={activeFilter === filter?.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter?.key)}
          >
            {filter?.label}
          </Button>
        ))}
      </div>
      {/* Loan History List */}
      <div className="space-y-4">
        {filteredHistory?.map(loan => (
          <div key={loan?.id} className="bg-card border border-border rounded-lg p-6 shadow-industrial-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                      <Icon name="User" size={20} color="white" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-foreground">{loan?.borrower?.name}</h4>
                      {getStatusBadge(loan?.status)}
                      {isOverdue(loan?.expectedReturnDate, loan?.status) && (
                        <span className="text-red-600 text-xs font-medium">RETARD</span>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">{loan?.borrower?.role}</span> • {loan?.borrower?.department}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Date de prêt:</span>
                        <div className="font-medium text-foreground">{loan?.loanDate}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Retour prévu:</span>
                        <div className="font-medium text-foreground">{loan?.expectedReturnDate}</div>
                      </div>
                      
                      {loan?.returnDate && (
                        <div>
                          <span className="text-muted-foreground">Retour effectif:</span>
                          <div className="font-medium text-foreground">{loan?.returnDate}</div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-muted-foreground">Durée:</span>
                        <div className="font-medium text-foreground">{loan?.duration}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Localisation:</span>
                        <div className="font-medium text-foreground">{loan?.location}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Approuvé par:</span>
                        <div className="font-medium text-foreground">{loan?.approvedBy}</div>
                      </div>
                    </div>

                    {/* Purpose */}
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Usage:</span>
                      <div className="text-sm font-medium text-foreground">{loan?.purpose}</div>
                    </div>

                    {/* Condition */}
                    <div className="flex items-center space-x-6 mb-3">
                      <div>
                        <span className="text-sm text-muted-foreground">État sortie:</span>
                        <div className={`text-sm font-medium ${getConditionColor(loan?.condition?.out)}`}>
                          {loan?.condition?.out}
                        </div>
                      </div>
                      
                      {loan?.condition?.in && (
                        <div>
                          <span className="text-sm text-muted-foreground">État retour:</span>
                          <div className={`text-sm font-medium ${getConditionColor(loan?.condition?.in)}`}>
                            {loan?.condition?.in}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {loan?.notes && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <span className="text-sm text-muted-foreground">Notes:</span>
                        <div className="text-sm text-foreground mt-1">{loan?.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Eye" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="FileText" size={16} />
                </Button>
                {loan?.status === 'active' && (
                  <Button variant="outline" size="sm">
                    <Icon name="RotateCcw" size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredHistory?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Aucun historique trouvé</h4>
            <p className="text-muted-foreground">
              {searchTerm 
                ? `Aucun résultat pour "${searchTerm}"`
                : 'Aucun mouvement enregistré pour cet équipement.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanHistory;
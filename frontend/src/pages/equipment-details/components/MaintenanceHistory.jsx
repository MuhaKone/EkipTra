import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MaintenanceHistory = ({ equipmentId }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    type: '',
    description: '',
    cost: '',
    scheduledDate: '',
    completedDate: '',
    technician: '',
    status: 'scheduled'
  });

  // Mock maintenance data
  const maintenanceRecords = [
    {
      id: 1,
      type: 'preventive',
      title: 'Maintenance Préventive Trimestrielle',
      description: 'Vérification générale, lubrification et calibrage des composants principaux.',
      scheduledDate: '15/03/2025',
      completedDate: '16/03/2025',
      cost: 245.50,
      technician: 'Jean Dupont',
      status: 'completed',
      priority: 'medium',
      duration: '2h 30min',
      parts: ['Filtre hydraulique', 'Huile moteur', 'Joint d\'étanchéité']
    },
    {
      id: 2,
      type: 'corrective',
      title: 'Réparation Système Hydraulique',
      description: 'Remplacement de la pompe hydraulique défaillante et réparation des conduites.',
      scheduledDate: '08/02/2025',
      completedDate: '10/02/2025',
      cost: 1250.00,
      technician: 'Marie Martin',
      status: 'completed',
      priority: 'high',
      duration: '6h 15min',
      parts: ['Pompe hydraulique', 'Conduites hydrauliques', 'Joints']
    },
    {
      id: 3,
      type: 'preventive',
      title: 'Inspection Sécurité Mensuelle',
      description: 'Contrôle des dispositifs de sécurité et vérification des systèmes d\'arrêt d\'urgence.',
      scheduledDate: '25/08/2025',
      completedDate: null,
      cost: 0,
      technician: 'Pierre Leroy',
      status: 'scheduled',
      priority: 'high',
      duration: '1h 30min',
      parts: []
    },
    {
      id: 4,
      type: 'corrective',
      title: 'Réparation Capteur de Température',
      description: 'Remplacement du capteur de température défectueux.',
      scheduledDate: '30/08/2025',
      completedDate: null,
      cost: 180.00,
      technician: 'Jean Dupont',
      status: 'in-progress',
      priority: 'medium',
      duration: '1h 00min',
      parts: ['Capteur température', 'Câblage']
    }
  ];

  const typeOptions = [
    { value: 'preventive', label: 'Maintenance Préventive' },
    { value: 'corrective', label: 'Maintenance Corrective' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'calibration', label: 'Calibrage' }
  ];

  const technicianOptions = [
    { value: 'jean-dupont', label: 'Jean Dupont' },
    { value: 'marie-martin', label: 'Marie Martin' },
    { value: 'pierre-leroy', label: 'Pierre Leroy' },
    { value: 'sophie-bernard', label: 'Sophie Bernard' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Programmé' },
    { value: 'in-progress', label: 'En Cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const filteredRecords = maintenanceRecords?.filter(record => {
    if (activeFilter === 'all') return true;
    return record?.type === activeFilter || record?.status === activeFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Programmé' },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', label: 'En Cours' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Terminé' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé' }
    };

    const config = statusConfig?.[status] || statusConfig?.scheduled;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = {
      low: { icon: 'ArrowDown', color: 'text-green-600' },
      medium: { icon: 'Minus', color: 'text-yellow-600' },
      high: { icon: 'ArrowUp', color: 'text-red-600' }
    };

    const config = priorityConfig?.[priority] || priorityConfig?.medium;
    return <Icon name={config?.icon} size={16} className={config?.color} />;
  };

  const handleAddMaintenance = () => {
    // Add maintenance logic here
    console.log('Adding maintenance:', newMaintenance);
    setShowAddForm(false);
    setNewMaintenance({
      type: '',
      description: '',
      cost: '',
      scheduledDate: '',
      completedDate: '',
      technician: '',
      status: 'scheduled'
    });
  };

  const totalCost = maintenanceRecords?.filter(record => record?.status === 'completed')?.reduce((sum, record) => sum + record?.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Historique de Maintenance</h3>
          <p className="text-sm text-muted-foreground">
            {maintenanceRecords?.length} interventions • Coût total: {totalCost?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        
        <Button
          variant="default"
          onClick={() => setShowAddForm(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Programmer Maintenance
        </Button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Tout' },
          { key: 'preventive', label: 'Préventive' },
          { key: 'corrective', label: 'Corrective' },
          { key: 'scheduled', label: 'Programmé' },
          { key: 'completed', label: 'Terminé' }
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
      {/* Add Maintenance Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-industrial-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Programmer une Maintenance</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddForm(false)}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Type de Maintenance"
              options={typeOptions}
              value={newMaintenance?.type}
              onChange={(value) => setNewMaintenance(prev => ({ ...prev, type: value }))}
              required
            />

            <Select
              label="Technicien Assigné"
              options={technicianOptions}
              value={newMaintenance?.technician}
              onChange={(value) => setNewMaintenance(prev => ({ ...prev, technician: value }))}
              required
            />

            <Input
              label="Date Programmée"
              type="date"
              value={newMaintenance?.scheduledDate}
              onChange={(e) => setNewMaintenance(prev => ({ ...prev, scheduledDate: e?.target?.value }))}
              required
            />

            <Input
              label="Coût Estimé (€)"
              type="number"
              value={newMaintenance?.cost}
              onChange={(e) => setNewMaintenance(prev => ({ ...prev, cost: e?.target?.value }))}
              placeholder="0,00"
            />

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground block mb-2">
                Description des Travaux
              </label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md text-sm resize-vertical bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                value={newMaintenance?.description}
                onChange={(e) => setNewMaintenance(prev => ({ ...prev, description: e?.target?.value }))}
                placeholder="Décrivez les travaux de maintenance à effectuer..."
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              onClick={handleAddMaintenance}
            >
              Programmer
            </Button>
          </div>
        </div>
      )}
      {/* Maintenance Records */}
      <div className="space-y-4">
        {filteredRecords?.map(record => (
          <div key={record?.id} className="bg-card border border-border rounded-lg p-6 shadow-industrial-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(record?.priority)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-foreground">{record?.title}</h4>
                      {getStatusBadge(record?.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {record?.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Programmé:</span>
                        <div className="font-medium text-foreground">{record?.scheduledDate}</div>
                      </div>
                      
                      {record?.completedDate && (
                        <div>
                          <span className="text-muted-foreground">Terminé:</span>
                          <div className="font-medium text-foreground">{record?.completedDate}</div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-muted-foreground">Technicien:</span>
                        <div className="font-medium text-foreground">{record?.technician}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Durée:</span>
                        <div className="font-medium text-foreground">{record?.duration}</div>
                      </div>
                    </div>

                    {record?.parts?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-muted-foreground">Pièces utilisées:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record?.parts?.map((part, index) => (
                            <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {record?.cost > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {record?.cost?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Eye" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Edit" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRecords?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Wrench" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Aucune maintenance trouvée</h4>
            <p className="text-muted-foreground">
              {activeFilter === 'all' ?'Aucun historique de maintenance pour cet équipement.'
                : `Aucune maintenance ${activeFilter} trouvée.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceHistory;
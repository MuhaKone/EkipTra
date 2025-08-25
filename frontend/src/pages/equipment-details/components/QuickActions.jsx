import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActions = ({ equipment, userRole }) => {
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [loanForm, setLoanForm] = useState({
    borrower: '',
    purpose: '',
    expectedReturn: '',
    location: ''
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: '',
    description: '',
    scheduledDate: '',
    technician: '',
    priority: 'medium'
  });

  const borrowerOptions = [
    { value: 'jean-dupont', label: 'Jean Dupont - Technicien' },
    { value: 'marie-martin', label: 'Marie Martin - Ingénieur' },
    { value: 'pierre-leroy', label: 'Pierre Leroy - Employé' },
    { value: 'sophie-bernard', label: 'Sophie Bernard - HSE' }
  ];

  const technicianOptions = [
    { value: 'jean-dupont', label: 'Jean Dupont' },
    { value: 'marie-martin', label: 'Marie Martin' },
    { value: 'pierre-leroy', label: 'Pierre Leroy' },
    { value: 'antoine-moreau', label: 'Antoine Moreau' }
  ];

  const maintenanceTypeOptions = [
    { value: 'preventive', label: 'Maintenance Préventive' },
    { value: 'corrective', label: 'Maintenance Corrective' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'calibration', label: 'Calibrage' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Élevée' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const locationOptions = [
    { value: 'site-a', label: 'Site A' },
    { value: 'site-b', label: 'Site B' },
    { value: 'warehouse', label: 'Entrepôt' },
    { value: 'office', label: 'Bureau' },
    { value: 'external', label: 'Externe' }
  ];

  const canLoanEquipment = () => {
    return equipment?.status === 'available' && ['Administrateur', 'Gestionnaire HSE', 'Technicien']?.includes(userRole);
  };

  const canReturnEquipment = () => {
    return equipment?.status === 'loaned' && ['Administrateur', 'Gestionnaire HSE', 'Technicien']?.includes(userRole);
  };

  const canScheduleMaintenance = () => {
    return ['Administrateur', 'Gestionnaire HSE', 'Technicien']?.includes(userRole);
  };

  const canUpdateStatus = () => {
    return ['Administrateur', 'Gestionnaire HSE']?.includes(userRole);
  };

  const handleLoanSubmit = () => {
    console.log('Loan equipment:', loanForm);
    setShowLoanForm(false);
    setLoanForm({ borrower: '', purpose: '', expectedReturn: '', location: '' });
  };

  const handleMaintenanceSubmit = () => {
    console.log('Schedule maintenance:', maintenanceForm);
    setShowMaintenanceForm(false);
    setMaintenanceForm({ type: '', description: '', scheduledDate: '', technician: '', priority: 'medium' });
  };

  const handleReturnEquipment = () => {
    console.log('Return equipment');
  };

  const handleGenerateQR = () => {
    console.log('Generate QR code');
  };

  const handlePrintLabel = () => {
    console.log('Print equipment label');
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-industrial-sm">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-foreground">Actions Rapides</h3>
        <p className="text-sm text-muted-foreground">Opérations courantes sur l'équipement</p>
      </div>
      <div className="p-6 space-y-4">
        {/* Primary Actions */}
        <div className="space-y-3">
          {canLoanEquipment() && (
            <Button
              variant="default"
              fullWidth
              onClick={() => setShowLoanForm(true)}
              iconName="UserPlus"
              iconPosition="left"
            >
              Prêter l'Équipement
            </Button>
          )}

          {canReturnEquipment() && (
            <Button
              variant="success"
              fullWidth
              onClick={handleReturnEquipment}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Retourner l'Équipement
            </Button>
          )}

          {canScheduleMaintenance() && (
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowMaintenanceForm(true)}
              iconName="Wrench"
              iconPosition="left"
            >
              Programmer Maintenance
            </Button>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateQR}
              iconName="QrCode"
              iconPosition="left"
            >
              QR Code
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrintLabel}
              iconName="Printer"
              iconPosition="left"
            >
              Étiquette
            </Button>
          </div>

          <Button
            variant="ghost"
            fullWidth
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Exporter Données
          </Button>

          <Button
            variant="ghost"
            fullWidth
            size="sm"
            iconName="Share"
            iconPosition="left"
          >
            Partager
          </Button>
        </div>

        {/* Emergency Actions */}
        {canUpdateStatus() && (
          <div className="pt-4 border-t border-border">
            <Button
              variant="destructive"
              fullWidth
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Signaler un Problème
            </Button>
          </div>
        )}
      </div>
      {/* Loan Form Modal */}
      {showLoanForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Prêter l'Équipement</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLoanForm(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <Select
                label="Emprunteur"
                options={borrowerOptions}
                value={loanForm?.borrower}
                onChange={(value) => setLoanForm(prev => ({ ...prev, borrower: value }))}
                required
                searchable
              />

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Usage Prévu
                </label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md text-sm resize-vertical bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={loanForm?.purpose}
                  onChange={(e) => setLoanForm(prev => ({ ...prev, purpose: e?.target?.value }))}
                  placeholder="Décrivez l'usage prévu de l'équipement..."
                  required
                />
              </div>

              <Input
                label="Date de Retour Prévue"
                type="date"
                value={loanForm?.expectedReturn}
                onChange={(e) => setLoanForm(prev => ({ ...prev, expectedReturn: e?.target?.value }))}
                required
              />

              <Select
                label="Lieu d'Utilisation"
                options={locationOptions}
                value={loanForm?.location}
                onChange={(value) => setLoanForm(prev => ({ ...prev, location: value }))}
                required
              />
            </div>

            <div className="p-6 border-t border-border flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowLoanForm(false)}
              >
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={handleLoanSubmit}
              >
                Confirmer le Prêt
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Maintenance Form Modal */}
      {showMaintenanceForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Programmer Maintenance</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMaintenanceForm(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <Select
                label="Type de Maintenance"
                options={maintenanceTypeOptions}
                value={maintenanceForm?.type}
                onChange={(value) => setMaintenanceForm(prev => ({ ...prev, type: value }))}
                required
              />

              <Select
                label="Technicien Assigné"
                options={technicianOptions}
                value={maintenanceForm?.technician}
                onChange={(value) => setMaintenanceForm(prev => ({ ...prev, technician: value }))}
                required
              />

              <Input
                label="Date Programmée"
                type="date"
                value={maintenanceForm?.scheduledDate}
                onChange={(e) => setMaintenanceForm(prev => ({ ...prev, scheduledDate: e?.target?.value }))}
                required
              />

              <Select
                label="Priorité"
                options={priorityOptions}
                value={maintenanceForm?.priority}
                onChange={(value) => setMaintenanceForm(prev => ({ ...prev, priority: value }))}
                required
              />

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Description des Travaux
                </label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md text-sm resize-vertical bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={maintenanceForm?.description}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, description: e?.target?.value }))}
                  placeholder="Décrivez les travaux de maintenance à effectuer..."
                  required
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowMaintenanceForm(false)}
              >
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={handleMaintenanceSubmit}
              >
                Programmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
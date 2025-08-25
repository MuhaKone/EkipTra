import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedUsers, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (selectedUsers?.length === 0) return null;

  const actionOptions = [
    { value: '', label: 'Choisir une action...' },
    { value: 'activate', label: 'Activer les utilisateurs' },
    { value: 'deactivate', label: 'Désactiver les utilisateurs' },
    { value: 'suspend', label: 'Suspendre les utilisateurs' },
    { value: 'reset-password', label: 'Réinitialiser les mots de passe' },
    { value: 'change-department', label: 'Changer de département' },
    { value: 'export', label: 'Exporter la sélection' }
  ];

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    if (action && ['activate', 'deactivate', 'suspend', 'reset-password']?.includes(action)) {
      setShowConfirmation(true);
    } else if (action) {
      handleExecuteAction(action);
    }
  };

  const handleExecuteAction = (action) => {
    onBulkAction(action, selectedUsers);
    setSelectedAction('');
    setShowConfirmation(false);
  };

  const getActionDescription = () => {
    const actionDescriptions = {
      'activate': `Activer ${selectedUsers?.length} utilisateur(s) sélectionné(s)`,
      'deactivate': `Désactiver ${selectedUsers?.length} utilisateur(s) sélectionné(s)`,
      'suspend': `Suspendre ${selectedUsers?.length} utilisateur(s) sélectionné(s)`,
      'reset-password': `Réinitialiser les mots de passe de ${selectedUsers?.length} utilisateur(s)`
    };
    return actionDescriptions?.[selectedAction] || '';
  };

  const getActionIcon = () => {
    const actionIcons = {
      'activate': 'UserCheck',
      'deactivate': 'UserX',
      'suspend': 'UserMinus',
      'reset-password': 'Key'
    };
    return actionIcons?.[selectedAction] || 'AlertTriangle';
  };

  return (
    <>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={20} className="text-primary" />
              <span className="font-medium text-primary">
                {selectedUsers?.length} utilisateur(s) sélectionné(s)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                placeholder="Actions groupées"
                options={actionOptions}
                value={selectedAction}
                onChange={handleActionSelect}
                className="min-w-48"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} className="mr-1" />
              Désélectionner tout
            </Button>
          </div>
        </div>

        {/* Selected Users Preview */}
        <div className="mt-3 pt-3 border-t border-primary/20">
          <div className="flex flex-wrap gap-2">
            {selectedUsers?.slice(0, 5)?.map((user) => (
              <span
                key={user?.id}
                className="inline-flex items-center px-2 py-1 bg-primary/20 text-primary rounded-md text-xs"
              >
                {user?.fullName}
              </span>
            ))}
            {selectedUsers?.length > 5 && (
              <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                +{selectedUsers?.length - 5} autres
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
          <div className="bg-card rounded-lg border border-border shadow-industrial-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                  <Icon name={getActionIcon()} size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Confirmer l'action
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cette action ne peut pas être annulée
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-foreground font-medium mb-2">
                  {getActionDescription()}
                </p>
                <div className="space-y-1">
                  {selectedUsers?.slice(0, 3)?.map((user) => (
                    <p key={user?.id} className="text-xs text-muted-foreground">
                      • {user?.fullName} ({user?.email})
                    </p>
                  ))}
                  {selectedUsers?.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      • Et {selectedUsers?.length - 3} autres utilisateurs
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedAction('');
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleExecuteAction(selectedAction)}
                  iconName={getActionIcon()}
                  iconPosition="left"
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;
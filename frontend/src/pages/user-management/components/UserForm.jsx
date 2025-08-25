import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const UserForm = ({ user, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'Employé',
    department: '',
    status: 'Actif',
    permissions: []
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        username: user?.username || '',
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'Employé',
        department: user?.department || '',
        status: user?.status || 'Actif',
        permissions: user?.permissions || []
      });
    }
  }, [user, isEditing]);

  const roleOptions = [
    { value: 'Administrateur', label: 'Administrateur' },
    { value: 'Gestionnaire HSE', label: 'Gestionnaire HSE' },
    { value: 'Technicien', label: 'Technicien' },
    { value: 'Employé', label: 'Employé' }
  ];

  const departmentOptions = [
    { value: 'Administration', label: 'Administration' },
    { value: 'HSE', label: 'HSE' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Production', label: 'Production' },
    { value: 'Logistique', label: 'Logistique' },
    { value: 'Qualité', label: 'Qualité' }
  ];

  const statusOptions = [
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
    { value: 'Suspendu', label: 'Suspendu' }
  ];

  const permissionsByRole = {
    'Administrateur': [
      'dashboard.view', 'equipment.create', 'equipment.edit', 'equipment.delete',
      'users.create', 'users.edit', 'users.delete', 'reports.export', 'system.admin'
    ],
    'Gestionnaire HSE': [
      'dashboard.view', 'equipment.view', 'equipment.edit', 'equipment.safety',
      'users.view', 'users.edit', 'reports.view', 'reports.export', 'compliance.manage'
    ],
    'Technicien': [
      'dashboard.view', 'equipment.view', 'equipment.edit', 'equipment.maintenance', 'reports.view'
    ],
    'Employé': [
      'dashboard.view', 'equipment.view', 'equipment.borrow', 'equipment.return'
    ]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Update permissions when role changes
    if (field === 'role') {
      setFormData(prev => ({
        ...prev,
        permissions: permissionsByRole?.[value] || []
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.username?.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData?.username?.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData?.department) {
      newErrors.department = 'Le département est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: user?.id || Date.now(),
        createdAt: user?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      });
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return 'bg-error';
    if (passwordStrength < 4) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-industrial-sm">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name={isEditing ? "UserCog" : "UserPlus"} size={20} className="mr-2" />
          {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Informations personnelles
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom d'utilisateur"
              type="text"
              value={formData?.username}
              onChange={(e) => handleInputChange('username', e?.target?.value)}
              error={errors?.username}
              required
              placeholder="ex: jdupont"
            />

            <Input
              label="Nom complet"
              type="text"
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
              placeholder="ex: Jean Dupont"
            />

            <Input
              label="Email"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
              placeholder="ex: jean.dupont@entreprise.fr"
            />

            <Input
              label="Téléphone"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              placeholder="ex: +33 1 23 45 67 89"
            />
          </div>
        </div>

        {/* Role and Department */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Affectation et rôle
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Rôle"
              options={roleOptions}
              value={formData?.role}
              onChange={(value) => handleInputChange('role', value)}
              required
            />

            <Select
              label="Département"
              options={departmentOptions}
              value={formData?.department}
              onChange={(value) => handleInputChange('department', value)}
              error={errors?.department}
              required
            />

            <Select
              label="Statut"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              required
            />
          </div>
        </div>

        {/* Password Section (only for new users) */}
        {!isEditing && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
              Mot de passe
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  description="Le mot de passe doit contenir au moins 8 caractères avec majuscules, minuscules et chiffres"
                />
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {passwordStrength < 2 ? 'Faible' : passwordStrength < 4 ? 'Moyen' : 'Fort'}
                    </span>
                  </div>
                </div>
              </div>

              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="Répéter le mot de passe"
              />
            </div>
          </div>
        )}

        {/* Permissions */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Permissions ({formData?.permissions?.length} sélectionnées)
          </h4>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Les permissions sont automatiquement assignées selon le rôle sélectionné.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {formData?.permissions?.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Icon name="Check" size={14} className="text-success" />
                  <span className="text-sm text-foreground">
                    {permission?.replace('.', ' - ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="default"
            iconName={isEditing ? "Save" : "UserPlus"}
            iconPosition="left"
          >
            {isEditing ? 'Enregistrer' : 'Créer l\'utilisateur'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GeneralInformation = ({ equipment, onUpdate, isEditing, onToggleEdit }) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    category: equipment?.category || '',
    serialNumber: equipment?.serialNumber || '',
    model: equipment?.model || '',
    manufacturer: equipment?.manufacturer || '',
    purchaseDate: equipment?.purchaseDate || '',
    purchasePrice: equipment?.purchasePrice || '',
    supplier: equipment?.supplier || '',
    warranty: equipment?.warranty || '',
    location: equipment?.location || '',
    description: equipment?.description || ''
  });

  const categoryOptions = [
    { value: 'construction', label: 'Construction' },
    { value: 'mining', label: 'Exploitation Minière' },
    { value: 'hse', label: 'HSE (Sécurité)' },
    { value: 'electrical', label: 'Électrique' },
    { value: 'mechanical', label: 'Mécanique' },
    { value: 'other', label: 'Autre' }
  ];

  const locationOptions = [
    { value: 'warehouse-a', label: 'Entrepôt A' },
    { value: 'warehouse-b', label: 'Entrepôt B' },
    { value: 'site-1', label: 'Site 1' },
    { value: 'site-2', label: 'Site 2' },
    { value: 'maintenance', label: 'Atelier Maintenance' },
    { value: 'office', label: 'Bureau' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    onToggleEdit();
  };

  const handleCancel = () => {
    setFormData({
      name: equipment?.name || '',
      category: equipment?.category || '',
      serialNumber: equipment?.serialNumber || '',
      model: equipment?.model || '',
      manufacturer: equipment?.manufacturer || '',
      purchaseDate: equipment?.purchaseDate || '',
      purchasePrice: equipment?.purchasePrice || '',
      supplier: equipment?.supplier || '',
      warranty: equipment?.warranty || '',
      location: equipment?.location || '',
      description: equipment?.description || ''
    });
    onToggleEdit();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Informations Générales</h3>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Modifier
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
            >
              Enregistrer
            </Button>
          </div>
        )}
      </div>
      {/* Form Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground border-b border-border pb-2">
            Informations de Base
          </h4>
          
          <Input
            label="Nom de l'Équipement"
            type="text"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Select
            label="Catégorie"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Numéro de Série"
            type="text"
            value={formData?.serialNumber}
            onChange={(e) => handleInputChange('serialNumber', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Modèle"
            type="text"
            value={formData?.model}
            onChange={(e) => handleInputChange('model', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Fabricant"
            type="text"
            value={formData?.manufacturer}
            onChange={(e) => handleInputChange('manufacturer', e?.target?.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Purchase & Location Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground border-b border-border pb-2">
            Achat & Localisation
          </h4>

          <Input
            label="Date d'Achat"
            type="date"
            value={formData?.purchaseDate}
            onChange={(e) => handleInputChange('purchaseDate', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Prix d'Achat (€)"
            type="number"
            value={formData?.purchasePrice}
            onChange={(e) => handleInputChange('purchasePrice', e?.target?.value)}
            disabled={!isEditing}
            placeholder="0,00"
          />

          <Input
            label="Fournisseur"
            type="text"
            value={formData?.supplier}
            onChange={(e) => handleInputChange('supplier', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Garantie (mois)"
            type="number"
            value={formData?.warranty}
            onChange={(e) => handleInputChange('warranty', e?.target?.value)}
            disabled={!isEditing}
            placeholder="12"
          />

          <Select
            label="Localisation Actuelle"
            options={locationOptions}
            value={formData?.location}
            onChange={(value) => handleInputChange('location', value)}
            disabled={!isEditing}
            required
          />
        </div>
      </div>
      {/* Description */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground border-b border-border pb-2">
          Description
        </h4>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Description Détaillée
          </label>
          <textarea
            className={`w-full min-h-[100px] px-3 py-2 border border-border rounded-md text-sm resize-vertical
              ${!isEditing ? 'bg-muted cursor-not-allowed' : 'bg-input'}
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Décrivez les caractéristiques et spécifications de l'équipement..."
          />
        </div>
      </div>
      {/* Specifications Grid */}
      {!isEditing && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground border-b border-border pb-2">
            Spécifications Techniques
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Poids</div>
              <div className="text-sm font-medium text-foreground mt-1">
                {equipment?.weight || 'Non spécifié'}
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Dimensions</div>
              <div className="text-sm font-medium text-foreground mt-1">
                {equipment?.dimensions || 'Non spécifié'}
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Puissance</div>
              <div className="text-sm font-medium text-foreground mt-1">
                {equipment?.power || 'Non spécifié'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInformation;
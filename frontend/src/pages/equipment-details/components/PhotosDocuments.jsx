import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PhotosDocuments = ({ equipmentId }) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Mock photos data
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      title: 'Vue générale de l\'équipement',
      uploadDate: '15/08/2025',
      uploadedBy: 'Jean Dupont',
      size: '2.4 MB',
      type: 'equipment'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
      title: 'Panneau de contrôle',
      uploadDate: '15/08/2025',
      uploadedBy: 'Jean Dupont',
      size: '1.8 MB',
      type: 'detail'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400',
      title: 'Plaque signalétique',
      uploadDate: '10/08/2025',
      uploadedBy: 'Marie Martin',
      size: '1.2 MB',
      type: 'identification'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      title: 'État après maintenance',
      uploadDate: '08/08/2025',
      uploadedBy: 'Pierre Leroy',
      size: '3.1 MB',
      type: 'maintenance'
    }
  ];

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: 'Manuel d\'utilisation.pdf',
      type: 'manual',
      size: '5.2 MB',
      uploadDate: '01/08/2025',
      uploadedBy: 'Sophie Martin',
      icon: 'FileText'
    },
    {
      id: 2,
      name: 'Certificat de conformité.pdf',
      type: 'certificate',
      size: '1.8 MB',
      uploadDate: '01/08/2025',
      uploadedBy: 'Sophie Martin',
      icon: 'Award'
    },
    {
      id: 3,
      name: 'Rapport maintenance Q2.xlsx',
      type: 'report',
      size: '890 KB',
      uploadDate: '15/07/2025',
      uploadedBy: 'Jean Dupont',
      icon: 'BarChart3'
    },
    {
      id: 4,
      name: 'Facture d\'achat.pdf',
      type: 'invoice',
      size: '245 KB',
      uploadDate: '20/06/2025',
      uploadedBy: 'Marie Rousseau',
      icon: 'Receipt'
    },
    {
      id: 5,
      name: 'Schéma technique.dwg',
      type: 'technical',
      size: '12.5 MB',
      uploadDate: '15/06/2025',
      uploadedBy: 'Antoine Moreau',
      icon: 'Layers'
    }
  ];

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    // Handle file upload logic here
    console.log('Uploading files:', files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e?.target?.files);
    handleFileUpload(files);
  };

  const getDocumentTypeColor = (type) => {
    const typeColors = {
      manual: 'bg-blue-100 text-blue-800',
      certificate: 'bg-green-100 text-green-800',
      report: 'bg-purple-100 text-purple-800',
      invoice: 'bg-yellow-100 text-yellow-800',
      technical: 'bg-red-100 text-red-800'
    };
    return typeColors?.[type] || 'bg-gray-100 text-gray-800';
  };

  const getPhotoTypeColor = (type) => {
    const typeColors = {
      equipment: 'bg-blue-100 text-blue-800',
      detail: 'bg-green-100 text-green-800',
      identification: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-orange-100 text-orange-800'
    };
    return typeColors?.[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Photos & Documents</h3>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef?.current?.click()}
            iconName="Upload"
            iconPosition="left"
          >
            Ajouter
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.dwg"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'photos' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('photos')}
          className="flex-1"
        >
          <Icon name="Image" size={16} className="mr-2" />
          Photos ({photos?.length})
        </Button>
        <Button
          variant={activeTab === 'documents' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('documents')}
          className="flex-1"
        >
          <Icon name="FileText" size={16} className="mr-2" />
          Documents ({documents?.length})
        </Button>
      </div>
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h4 className="text-lg font-medium text-foreground mb-2">
          Glissez vos fichiers ici
        </h4>
        <p className="text-muted-foreground mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef?.current?.click()}
        >
          Parcourir les fichiers
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Formats acceptés: JPG, PNG, PDF, DOC, XLS, DWG (max 10MB)
        </p>
      </div>
      {/* Content */}
      {activeTab === 'photos' ? (
        <div className="space-y-4">
          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos?.map(photo => (
              <div key={photo?.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-industrial-sm">
                <div className="aspect-video relative group cursor-pointer" onClick={() => setSelectedImage(photo)}>
                  <Image
                    src={photo?.url}
                    alt={photo?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Icon name="Eye" size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPhotoTypeColor(photo?.type)}`}>
                      {photo?.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium text-foreground mb-2 line-clamp-2">{photo?.title}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Ajouté le {photo?.uploadDate}</div>
                    <div>Par {photo?.uploadedBy}</div>
                    <div>{photo?.size}</div>
                  </div>
                  
                  <div className="flex justify-end space-x-1 mt-3">
                    <Button variant="ghost" size="sm">
                      <Icon name="Download" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {photos?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Image" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">Aucune photo</h4>
              <p className="text-muted-foreground">
                Ajoutez des photos de l'équipement pour documenter son état.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Documents List */}
          {documents?.map(doc => (
            <div key={doc?.id} className="bg-card border border-border rounded-lg p-4 shadow-industrial-sm">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name={doc?.icon} size={20} className="text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground">{doc?.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDocumentTypeColor(doc?.type)}`}>
                      {doc?.type}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {doc?.size} • Ajouté le {doc?.uploadDate} par {doc?.uploadedBy}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Icon name="Eye" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Download" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {documents?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">Aucun document</h4>
              <p className="text-muted-foreground">
                Ajoutez des documents relatifs à cet équipement.
              </p>
            </div>
          )}
        </div>
      )}
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl max-h-full bg-card rounded-lg overflow-hidden" onClick={e => e?.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-medium text-foreground">{selectedImage?.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="p-4">
              <Image
                src={selectedImage?.url}
                alt={selectedImage?.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            
            <div className="p-4 border-t border-border bg-muted/50">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Ajouté le {selectedImage?.uploadDate} par {selectedImage?.uploadedBy}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Download" size={16} className="mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosDocuments;
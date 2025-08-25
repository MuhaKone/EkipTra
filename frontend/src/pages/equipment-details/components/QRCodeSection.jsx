import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeSection = ({ equipment }) => {
  const [qrGenerated, setQrGenerated] = useState(false);

  // Mock QR code URL - in real app, this would be generated based on equipment ID
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({
      id: equipment?.id,
      name: equipment?.name,
      serialNumber: equipment?.serialNumber,
      url: `${window.location?.origin}/equipment-details?id=${equipment?.id}`
    })
  )}`;

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${equipment?.serialNumber}.png`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document?.write(`
      <html>
        <head>
          <title>QR Code - ${equipment?.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              border: 2px solid #000; 
              padding: 20px; 
              display: inline-block; 
              margin: 20px;
            }
            .equipment-info { 
              margin-top: 15px; 
              font-size: 14px; 
            }
            .equipment-name { 
              font-weight: bold; 
              font-size: 16px; 
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="equipment-info">
              <div class="equipment-name">${equipment?.name}</div>
              <div>N° Série: ${equipment?.serialNumber}</div>
              <div>ID: ${equipment?.id}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow?.document?.close();
    printWindow?.print();
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-industrial-sm">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-foreground">Code QR</h3>
        <p className="text-sm text-muted-foreground">Accès rapide aux informations</p>
      </div>
      <div className="p-6">
        {!qrGenerated ? (
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <Icon name="QrCode" size={48} className="text-muted-foreground" />
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Générer un Code QR</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Créez un code QR pour accéder rapidement aux informations de cet équipement
              </p>
              
              <Button
                variant="default"
                onClick={handleGenerateQR}
                iconName="QrCode"
                iconPosition="left"
              >
                Générer QR Code
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-white rounded-lg border-2 border-border">
              <img 
                src={qrCodeUrl} 
                alt="QR Code Equipment" 
                className="w-32 h-32"
              />
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Code QR Généré</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Scannez ce code pour accéder aux détails de l'équipement
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                fullWidth
                onClick={handleDownloadQR}
                iconName="Download"
                iconPosition="left"
              >
                Télécharger
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={handlePrintQR}
                iconName="Printer"
                iconPosition="left"
              >
                Imprimer
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setQrGenerated(false)}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Régénérer
              </Button>
            </div>
          </div>
        )}

        {/* QR Code Information */}
        <div className="mt-6 pt-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground mb-3">Informations Incluses</h5>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={14} />
              <span>ID Équipement: {equipment?.id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Tag" size={14} />
              <span>N° Série: {equipment?.serialNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={14} />
              <span>Nom: {equipment?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Link" size={14} />
              <span>Lien Direct</span>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <div className="font-medium text-foreground mb-1">Comment utiliser</div>
              <div>Scannez ce code QR avec votre smartphone ou tablette pour accéder instantanément aux détails de l'équipement, même hors ligne.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;
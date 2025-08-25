import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export existant CSV (garder)
export const toCSV = (data, columns) => {
  const headers = columns.map(col => col.label).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value || '';
    }).join(',')
  );
  return [headers, ...rows].join('\n');
};

// Nouvelle fonction Export PDF
export const toPDF = (data, columns, title = 'Rapport EkipTra') => {
  const doc = new jsPDF();
  
  // En-tête du document
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Date de génération
  const now = new Date();
  doc.setFontSize(10);
  doc.text(`Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`, 14, 30);
  
  // Préparer les données pour le tableau
  const headers = columns.map(col => col.label);
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
      if (value instanceof Date) return value.toLocaleDateString('fr-FR');
      return String(value);
    })
  );
  
  // Créer le tableau
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40, right: 14, bottom: 20, left: 14 },
  });
  
  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  return doc;
};

// Export PDF avec sauvegarde automatique
export const exportToPDF = (data, columns, filename, title) => {
  const doc = toPDF(data, columns, title);
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export rapport de maintenance en PDF
export const exportMaintenanceReportToPDF = (maintenanceData) => {
  const columns = [
    { key: 'equipmentName', label: 'Équipement' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'date', label: 'Date' },
    { key: 'technician', label: 'Technicien' },
    { key: 'status', label: 'Statut' },
  ];
  
  exportToPDF(
    maintenanceData, 
    columns, 
    'rapport_maintenance', 
    'Rapport de Maintenance - EkipTra'
  );
};

// Export inventaire en PDF
export const exportInventoryToPDF = (inventoryData) => {
  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'category', label: 'Catégorie' },
    { key: 'serialNumber', label: 'N° Série' },
    { key: 'location', label: 'Emplacement' },
    { key: 'status', label: 'Statut' },
    { key: 'lastMaintenance', label: 'Dernière maintenance' },
  ];
  
  exportToPDF(
    inventoryData, 
    columns, 
    'inventaire_equipements', 
    'Inventaire des Équipements - EkipTra'
  );
};

// Export rapport d'utilisation en PDF
export const exportUsageReportToPDF = (usageData) => {
  const columns = [
    { key: 'equipmentName', label: 'Équipement' },
    { key: 'borrower', label: 'Emprunteur' },
    { key: 'checkoutDate', label: 'Date sortie' },
    { key: 'returnDate', label: 'Date retour' },
    { key: 'duration', label: 'Durée' },
    { key: 'condition', label: 'État' },
  ];
  
  exportToPDF(
    usageData, 
    columns, 
    'rapport_utilisation', 
    'Rapport d\'Utilisation - EkipTra'
  );
};
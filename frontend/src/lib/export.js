// src/lib/export.js
// Utilities for exporting data (CSV, JSON, PDF)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Normalize columns input
 * columns: array of { key, label } or strings (keys)
 */
function normalizeColumns(columns, sampleRow = {}) {
  if (!columns || columns.length === 0) {
    return Object.keys(sampleRow).map((k) => ({ key: k, label: k }));
  }
  return columns.map((c) =>
    typeof c === "string" ? { key: c, label: c } : c
  );
}

export function toCSV(rows, columns) {
  const cols = normalizeColumns(columns, rows?.[0] || {});
  const header = cols.map((c) => JSON.stringify(c.label || c.key)).join(",");
  const lines = (rows || []).map((r) =>
    cols.map((c) => JSON.stringify(r?.[c.key] ?? "")).join(",")
  );
  const csv = [header, ...lines].join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8" });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

/**
 * Generate a PDF with optional title and table of data.
 * @param {Array<Object>} rows
 * @param {Array<{key:string,label:string}>|Array<string>} columns
 * @param {string} filename
 * @param {Object} meta Optional metadata (e.g., filters, date range)
 */
export function toPDF(rows = [], columns = [], filename = "Export PDF", meta = null) {
  const doc = new jsPDF({ unit: "pt" }); // pt for predictable sizes
  const marginX = 40;
  const lineHeight = 20;
  let y = 40;

  // Add company header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text("EquipTracker Local", marginX, y);
  y += lineHeight + 10;
  
  // Header
  doc.setFontSize(16);
  doc.setFont(undefined, 'normal');
  doc.text(filename, marginX, y);
  y += lineHeight;
  
  // Date
  doc.setFontSize(10);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, marginX, y);
  y += lineHeight;

  // Meta info
  if (meta && typeof meta === "object") {
    doc.setFontSize(10);
    Object.entries(meta).forEach(([k, v]) => {
      const line = `${k}: ${String(v)}`;
      doc.text(line, marginX, y);
      y += 14;
    });
    y += 4;
  }

  // Table
  const cols = normalizeColumns(columns, rows?.[0] || {});

  const head = [cols.map((c) => c.label || c.key)];
  const body = (rows || []).map((r) => cols.map((c) => String(r?.[c.key] ?? "")));
  
  doc.autoTable({
    startY: y,
    head,
    body,
    styles: { 
      fontSize: 9, 
      cellPadding: 4, 
      overflow: "linebreak",
      font: "helvetica"
    },
    headStyles: { 
      fillColor: [30, 58, 138], // Primary blue
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Light gray
    },
    margin: { left: marginX, right: marginX },
    theme: 'grid'
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount} - EquipTracker Local`,
      marginX,
      doc.internal.pageSize.height - 20
    );
  }

  const blob = doc.output("blob");
  return blob;
}

/**
 * Helper to trigger a file download for PDF.
 */
export function downloadPDF(rows, columns, filename = "export.pdf", meta = null) {
  const blob = toPDF(rows, columns, filename, meta);
  const finalFilename = typeof filename === "string" && filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  downloadBlob(blob, finalFilename);
}

/**
 * Generate a comprehensive report PDF with multiple sections
 */
export function generateReportPDF(sections = {}, title = "Rapport EquipTracker") {
  const doc = new jsPDF({ unit: "pt" });
  const marginX = 40;
  let y = 40;
  
  // Title page
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text("EquipTracker Local", marginX, y);
  y += 40;
  
  doc.setFontSize(18);
  doc.text(title, marginX, y);
  y += 30;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, marginX, y);
  y += 60;
  
  // Table of contents
  if (Object.keys(sections).length > 1) {
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Table des matières", marginX, y);
    y += 30;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    Object.keys(sections).forEach((sectionKey, index) => {
      doc.text(`${index + 1}. ${sections[sectionKey].title}`, marginX + 20, y);
      y += 20;
    });
    
    doc.addPage();
    y = 40;
  }
  
  // Generate sections
  Object.entries(sections).forEach(([key, section], index) => {
    if (index > 0) {
      doc.addPage();
      y = 40;
    }
    
    // Section title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(section.title, marginX, y);
    y += 30;
    
    // Section description
    if (section.description) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(section.description, marginX, y);
      y += 20;
    }
    
    // Section data
    if (section.data && section.columns) {
      const cols = normalizeColumns(section.columns, section.data[0] || {});
      const head = [cols.map((c) => c.label || c.key)];
      const body = section.data.map((r) => cols.map((c) => String(r?.[c.key] ?? "")));
      
      doc.autoTable({
        startY: y,
        head,
        body,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
        margin: { left: marginX, right: marginX },
        theme: 'grid'
      });
      
      y = doc.lastAutoTable.finalY + 20;
    }
  });
  
  return doc.output("blob");
}

// Backwards compatibility named export
const exportApi = { toCSV, toPDF, downloadCSV: downloadBlob, downloadPDF, downloadBlob, generateReportPDF };
export default exportApi;
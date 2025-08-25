// src/lib/export.js
// Utilities for exporting data (CSV, JSON, PDF)
import { jsPDF } from "jspdf";
// Lazy require if available; if not, we fall back to a minimal table
let autoTable;
try {
  // eslint-disable-next-line global-require
  autoTable = require("jspdf-autotable");
} catch (e) {
  autoTable = null;
}

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
 * @param {string} title
 * @param {Object} meta Optional metadata (e.g., filters, date range)
 * @returns {Blob}
 */
export function toPDF(rows = [], columns = [], title = "Export PDF", meta = null) {
  const doc = new jsPDF({ unit: "pt" }); // pt for predictable sizes
  const marginX = 40;
  const lineHeight = 20;
  let y = 40;

  // Header
  doc.setFontSize(16);
  doc.text(title, marginX, y);
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

  if (autoTable) {
    const head = [cols.map((c) => c.label || c.key)];
    const body = (rows || []).map((r) => cols.map((c) => String(r?.[c.key] ?? "")));
    autoTable.default(doc, {
      startY: y,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
      headStyles: { fillColor: [245, 245, 245] },
      margin: { left: marginX, right: marginX },
    });
  } else {
    // Minimal fallback table without autotable plugin
    doc.setFontSize(10);
    const colWidth = 520 / Math.max(1, cols.length);
    // header
    cols.forEach((c, i) => {
      doc.text(String(c.label || c.key), marginX + i * colWidth, y);
    });
    y += 14;
    (rows || []).forEach((r, idx) => {
      cols.forEach((c, i) => {
        const val = String(r?.[c.key] ?? "");
        doc.text(val, marginX + i * colWidth, y);
      });
      y += 12;
      if (y > 760) {
        doc.addPage();
        y = 40;
      }
    });
  }

  const blob = doc.output("blob");
  return blob;
}

/**
 * Helper to trigger a file download for PDF.
 */
export function downloadPDF(rows, columns, title = "export.pdf", meta = null) {
  const blob = toPDF(rows, columns, title, meta);
  downloadBlob(blob, typeof title === "string" && title.endsWith(".pdf") ? title : "export.pdf");
}

// Backwards compatibility named export
const exportApi = { toCSV, toPDF, downloadCSV: downloadBlob, downloadPDF, downloadBlob };
export default exportApi;
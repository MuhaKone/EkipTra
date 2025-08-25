
// src/lib/export.js
export function toCSV(rows, columns) {
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const head = columns.map(c => esc(c.header)).join(',');
  const body = rows.map(r => columns.map(c => esc(typeof c.accessor === 'function' ? c.accessor(r) : r[c.accessor])).join(',')).join('\n');
  return head + '\n' + body;
}

export function download(filename, content, type='text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

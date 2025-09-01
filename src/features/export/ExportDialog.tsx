import React, { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import { useTheme } from '@mui/material/styles';

export interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  /** data to export as array of records */
  data: Record<string, unknown>[];
  /** metadata about the export source */
  metadata?: {
    source: string;
    generated?: string;
  };
}

type Format = 'csv' | 'markdown' | 'pdf';

/**
 * ExportDialog provides a modal dialog allowing users to export data in
 * CSV, Markdown, or PDF format. A preview pane shows the generated content
 * before export. Generated files include source metadata and respect the
 * current theme colours.
 */
const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  data,
  metadata = { source: 'unknown', generated: new Date().toISOString() },
}) => {
  const theme = useTheme();
  const [format, setFormat] = useState<Format>('csv');

  const serializeCSV = (): string => {
    const headers = Object.keys(data[0] || {});
    const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
    const body = [headers.join(','), ...rows].join('\n');
    return `${body}\n\nSource: ${metadata.source}\nGenerated: ${metadata.generated}`;
  };

  const serializeMarkdown = (): string => {
    const headers = Object.keys(data[0] || {});
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const rows = data.map((row) => `| ${headers.map((h) => String(row[h] ?? '')).join(' | ')} |`);
    return [
      headerRow,
      separatorRow,
      ...rows,
      '',
      `Source: ${metadata.source}`,
      `Generated: ${metadata.generated}`,
    ].join('\n');
  };

  const serializePDF = (): jsPDF => {
    const doc = new jsPDF();
    doc.setTextColor(theme.palette.text.primary);
    doc.setFillColor(theme.palette.background.paper);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    const text = serializeMarkdown();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    doc.setFontSize(10);
    doc.text(`Source: ${metadata.source}`, 10, doc.internal.pageSize.getHeight() - 20);
    doc.text(`Generated: ${metadata.generated}`, 10, doc.internal.pageSize.getHeight() - 10);
    return doc;
  };

  const preview = useMemo(() => {
    switch (format) {
      case 'csv':
        return serializeCSV();
      case 'markdown':
        return serializeMarkdown();
      case 'pdf':
        return 'PDF preview not available. Export will include the following:\n\n' + serializeMarkdown();
      default:
        return '';
    }
  }, [format, data, metadata]);

  const handleExport = () => {
    if (format === 'pdf') {
      const doc = serializePDF();
      doc.save('export.pdf');
      return;
    }
    const content = format === 'csv' ? serializeCSV() : serializeMarkdown();
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export.${format === 'csv' ? 'csv' : format === 'markdown' ? 'md' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <div
        style={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: 20,
          width: '80%',
          maxWidth: 600,
          borderRadius: 8,
        }}
      >
        <h2>Export</h2>
        <div style={{ marginBottom: 10 }}>
          <label>
            Format:&nbsp;
            <select value={format} onChange={(e) => setFormat(e.target.value as Format)}>
              <option value="csv">CSV</option>
              <option value="markdown">Markdown</option>
              <option value="pdf">PDF</option>
            </select>
          </label>
        </div>
        <div
          style={{
            border: `1px solid ${theme.palette.divider}`,
            padding: 10,
            height: 200,
            overflow: 'auto',
            background: theme.palette.background.default,
            whiteSpace: 'pre-wrap',
            marginBottom: 10,
          }}
        >
          {preview}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleExport}>Export</button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;


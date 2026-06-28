'use client';

import { useState } from 'react';
import { exportToPDF, exportToHTML } from '@/lib/export-utils';

interface ExportButtonProps {
  elementId: string;
  title?: string;
}

export default function ExportButton({ elementId, title = 'ClimaTwin Report' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handlePDF = async () => {
    setExporting(true);
    setIsOpen(false);
    await exportToPDF(elementId, title.toLowerCase().replace(/\s+/g, '-'));
    setExporting(false);
  };

  const handleHTML = () => {
    setIsOpen(false);
    exportToHTML(elementId, title);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
      >
        {exporting ? (
          <span className="loading-spinner" style={{ width: 14, height: 14 }} />
        ) : (
          '📄'
        )}
        Export
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.25rem',
          backdropFilter: 'var(--card-blur)',
          zIndex: 100,
          minWidth: '140px',
        }}>
          <button
            onClick={handlePDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              borderRadius: '4px',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            📄 PDF (Professional)
          </button>
          <button
            onClick={handleHTML}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              borderRadius: '4px',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            🌐 HTML (Interactive)
          </button>
        </div>
      )}
    </div>
  );
}

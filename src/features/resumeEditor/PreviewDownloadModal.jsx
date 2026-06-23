import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import FullResumeDocument from './FullResumeDocument';
import { exportNodeToPdf } from '../../utils/pdfExport';

const PreviewDownloadModal = ({ isOpen, onClose, data, templateValue, title }) => {
  const documentRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = `${(title || 'resume').trim().replace(/\s+/g, '_').toLowerCase()}.pdf`;
      await exportNodeToPdf(documentRef.current, filename);
      toast.success('Resume downloaded');
    } catch (err) {
      toast.error('Failed to generate PDF. Try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Preview &amp; Download</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable A4 preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 px-6 py-6">
          <div className="origin-top scale-[0.85] sm:scale-100" style={{ transformOrigin: 'top center' }}>
            <div ref={documentRef} className="shadow-md">
              <FullResumeDocument data={data} templateValue={templateValue} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button onClick={handleDownload} disabled={downloading} className="btn-primary">
            {downloading ? 'Generating PDF...' : '⬇ Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewDownloadModal;

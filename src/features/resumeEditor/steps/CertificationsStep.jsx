const emptyItem = { title: '', issuer: '', year: '' };

const CertificationsStep = ({ items, onAdd, onUpdate, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Certifications</h2>
          <p className="mt-1 text-sm text-gray-500">Courses, exams, or credentials worth mentioning.</p>
        </div>
        <button onClick={() => onAdd(emptyItem)} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((cert, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-3">
            <input
              className="input-field flex-1"
              placeholder="Title"
              value={cert.title}
              onChange={(e) => onUpdate(i, 'title', e.target.value)}
            />
            <input
              className="input-field flex-1"
              placeholder="Issuer"
              value={cert.issuer}
              onChange={(e) => onUpdate(i, 'issuer', e.target.value)}
            />
            <input
              className="input-field w-24"
              placeholder="Year"
              value={cert.year}
              onChange={(e) => onUpdate(i, 'year', e.target.value)}
            />
            <button
              onClick={() => onRemove(i)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
            No certifications added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CertificationsStep;

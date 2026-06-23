const emptyItem = { degree: '', institution: '', startDate: '', endDate: '' };

const EducationStep = ({ items, onAdd, onUpdate, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Education</h2>
          <p className="mt-1 text-sm text-gray-500">Degrees, diplomas, and certifications in progress.</p>
        </div>
        <button onClick={() => onAdd(emptyItem)} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((edu, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="input-field"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => onUpdate(i, 'degree', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => onUpdate(i, 'institution', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="Start date"
                value={edu.startDate}
                onChange={(e) => onUpdate(i, 'startDate', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="End date"
                value={edu.endDate}
                onChange={(e) => onUpdate(i, 'endDate', e.target.value)}
              />
            </div>
            <button
              onClick={() => onRemove(i)}
              className="mt-3 text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
            No education added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default EducationStep;

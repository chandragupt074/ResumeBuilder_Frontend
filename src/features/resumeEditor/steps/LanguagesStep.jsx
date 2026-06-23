const emptyItem = { name: '', progress: '' };

const LanguagesStep = ({ items, onAdd, onUpdate, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Languages</h2>
          <p className="mt-1 text-sm text-gray-500">Languages you can work or communicate in.</p>
        </div>
        <button onClick={() => onAdd(emptyItem)} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((lang, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
            <input
              className="input-field flex-1"
              placeholder="Language"
              value={lang.name}
              onChange={(e) => onUpdate(i, 'name', e.target.value)}
            />
            <input
              className="input-field flex-1"
              placeholder="Proficiency (e.g. Fluent)"
              value={lang.progress}
              onChange={(e) => onUpdate(i, 'progress', e.target.value)}
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
            No languages added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default LanguagesStep;

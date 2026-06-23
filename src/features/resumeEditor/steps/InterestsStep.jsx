const InterestsStep = ({ items, onAdd, onUpdateValue, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Interests</h2>
          <p className="mt-1 text-sm text-gray-500">Hobbies or interests that round out your profile.</p>
        </div>
        <button onClick={() => onAdd('')} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((interest, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              className="input-field flex-1"
              placeholder="e.g. Photography"
              value={interest}
              onChange={(e) => onUpdateValue(i, e.target.value)}
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
            No interests added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default InterestsStep;

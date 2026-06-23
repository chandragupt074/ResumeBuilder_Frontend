const emptyItem = { company: '', role: '', startDate: '', endDate: '', description: '' };

const WorkExperienceStep = ({ items, onAdd, onUpdate, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Work Experience</h2>
          <p className="mt-1 text-sm text-gray-500">Add roles, most recent first.</p>
        </div>
        <button onClick={() => onAdd(emptyItem)} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((exp, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="input-field"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => onUpdate(i, 'company', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => onUpdate(i, 'role', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="Start date (e.g. Jan 2022)"
                value={exp.startDate}
                onChange={(e) => onUpdate(i, 'startDate', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="End date (or Present)"
                value={exp.endDate}
                onChange={(e) => onUpdate(i, 'endDate', e.target.value)}
              />
              <textarea
                className="input-field sm:col-span-2"
                rows={3}
                placeholder="What did you work on?"
                value={exp.description}
                onChange={(e) => onUpdate(i, 'description', e.target.value)}
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
            No work experience added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceStep;

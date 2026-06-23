const emptyItem = { name: '', progress: 50 };

const SkillsStep = ({ items, onAdd, onUpdate, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Skills</h2>
          <p className="mt-1 text-sm text-gray-500">Rate your proficiency for each skill.</p>
        </div>
        <button onClick={() => onAdd(emptyItem)} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((skill, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
            <input
              className="input-field flex-1"
              placeholder="Skill name"
              value={skill.name}
              onChange={(e) => onUpdate(i, 'name', e.target.value)}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={skill.progress}
              onChange={(e) => onUpdate(i, 'progress', Number(e.target.value))}
              className="w-28 accent-primary-600"
            />
            <span className="w-10 text-right text-xs font-medium text-gray-500">
              {skill.progress}%
            </span>
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
            No skills added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillsStep;

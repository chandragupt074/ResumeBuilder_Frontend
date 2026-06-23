const emptyItem = { title: '', description: '', github: '', liveDemo: '' };

const ProjectsStep = ({ items, onAdd, onUpdate, onRemove }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Projects</h2>
          <p className="mt-1 text-sm text-gray-500">Showcase work that demonstrates your skills.</p>
        </div>
        <button onClick={() => onAdd(emptyItem)} className="btn-secondary !py-2 text-xs">
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((proj, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="input-field sm:col-span-2"
                placeholder="Project title"
                value={proj.title}
                onChange={(e) => onUpdate(i, 'title', e.target.value)}
              />
              <textarea
                className="input-field sm:col-span-2"
                rows={3}
                placeholder="What does it do?"
                value={proj.description}
                onChange={(e) => onUpdate(i, 'description', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="GitHub link"
                value={proj.github}
                onChange={(e) => onUpdate(i, 'github', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="Live demo link"
                value={proj.liveDemo}
                onChange={(e) => onUpdate(i, 'liveDemo', e.target.value)}
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
            No projects added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectsStep;

const PersonalInfoStep = ({ data, onChange, onImageSelect }) => {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-gray-900">Personal Information</h2>
      <p className="mt-1 text-sm text-gray-500">
        This appears at the top of your resume, make it count.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-50 text-primary-300">
            {data.profilePreviewUrl ? (
              <img src={data.profilePreviewUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-700">
            <span className="text-sm">⬆</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onImageSelect(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Full name</label>
          <input
            type="text"
            className="input-field"
            placeholder="John"
            value={data.fullname || ''}
            onChange={(e) => onChange('fullname', e.target.value)}
          />
        </div>
        <div>
          <label className="label-field">Designation</label>
          <input
            type="text"
            className="input-field"
            placeholder="UI Designer"
            value={data.designation || ''}
            onChange={(e) => onChange('designation', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="label-field">Summary</label>
        <textarea
          rows={5}
          className="input-field"
          placeholder="Short introduction"
          value={data.summary || ''}
          onChange={(e) => onChange('summary', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;

const fields = [
  { key: 'email', label: 'Email', placeholder: 'you@example.com' },
  { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
  { key: 'location', label: 'Location', placeholder: 'Bangalore, India' },
  { key: 'linkedIn', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/you' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/you' },
  { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
];

const ContactStep = ({ data, onChange }) => {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-gray-900">Contact</h2>
      <p className="mt-1 text-sm text-gray-500">
        How should recruiters reach you?
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="label-field">{field.label}</label>
            <input
              type="text"
              className="input-field"
              placeholder={field.placeholder}
              value={data[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactStep;

const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default Loader;

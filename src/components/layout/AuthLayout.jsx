const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left panel - branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary-700 to-primary-900 p-12 text-white lg:flex">
        <div className="font-display text-2xl font-bold tracking-tight">
          ResumeForge
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Craft a resume that gets you hired.
          </h2>
          <p className="mt-4 max-w-md text-primary-100">
            Pick a template, fill in your details, and export a polished
            resume in minutes — built for fresher and experienced developers
            alike.
          </p>
        </div>
        <p className="text-sm text-primary-200">
          © {new Date().getFullYear()} ResumeForge. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="font-display text-2xl font-bold tracking-tight text-primary-700">
              ResumeForge
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import { Link } from 'react-router-dom';

const features = [
  {
    icon: '01',
    title: 'Pick a template',
    description:
      'Choose from clean, recruiter-friendly layouts designed for tech and non-tech roles alike.',
  },
  {
    icon: '02',
    title: 'Fill in your details',
    description:
      'Add your experience, education, skills and projects with a structured, guided editor.',
  },
  {
    icon: '03',
    title: 'Export & apply',
    description:
      'Download a polished resume and send it straight to recruiters from inside the app.',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="font-display text-xl font-bold text-primary-700">
            ResumeForge
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary !py-2 text-sm">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary !py-2 text-sm">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
              Built for fresher &amp; experienced developers
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Build a resume that actually gets you{' '}
              <span className="text-primary-600">interviews.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-gray-500">
              Structured editor, recruiter-tested templates, and one-click
              email delivery — everything you need to go from blank page to
              job-ready resume.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/register" className="btn-primary px-6 py-3 text-sm">
                Create your resume — it's free
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-sm">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="card mx-auto max-w-sm overflow-hidden p-0 shadow-lg">
              <div className="border-b border-gray-100 bg-primary-50 px-6 py-4">
                <div className="h-3 w-24 rounded-full bg-primary-200" />
                <div className="mt-2 h-2 w-32 rounded-full bg-primary-100" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-gray-200" />
                    <div className="h-2 w-1/2 rounded-full bg-gray-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-gray-100" />
                  <div className="h-2 w-5/6 rounded-full bg-gray-100" />
                  <div className="h-2 w-2/3 rounded-full bg-gray-100" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-gray-50 border border-gray-100" />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-2xl bg-primary-600 px-5 py-3 text-white shadow-lg sm:block">
              <p className="text-xs font-medium text-primary-100">Status</p>
              <p className="font-display text-sm font-bold">Ready to send ✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.icon}>
                <span className="font-display text-3xl font-bold text-primary-200">
                  {feature.icon}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to build your resume?
          </h2>
          <p className="mt-2 text-primary-100">
            Free to start. Upgrade anytime for premium templates.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            Create your account
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ResumeForge. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
